using System;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Features.Sprints.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Sprints
{
    public class EditSprint
    {
        public class Command : IRequest<SprintDetailDto>
        {
            [JsonIgnore]
            public string Id { get; set; }

            public string Name { get; set; }

            public DateTime StartDate { get; set; }

            public DateTime EndDate { get; set; }

            public string Goal { get; set; }
        }

        public class Handler : IRequestHandler<Command, SprintDetailDto>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<SprintDetailDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var sprint = await _db.Sprints.SingleOrNotFoundAsync(x => x.Id == request.Id, cancellationToken);
                sprint.Name = request.Name;
                sprint.StartDate = request.StartDate;
                sprint.EndDate = request.EndDate;
                sprint.Goal = request.Goal;

                await _db.SaveChangesAsync(cancellationToken);
                return _mapper.Map<SprintDetailDto>(sprint);
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            private MyScrumContext _db;
            private string _overlappingSprintName;

            public Validator(MyScrumContext db)
            {
                _db = db;

                RuleFor(x => x.Name).NotEmpty().WithMessage("Sprint name cannot be empty");

                RuleFor(x => x.StartDate).Cascade(CascadeMode.Stop)
                    .Must((req, _) => req.StartDate < req.EndDate).WithMessage("Start date must be before end date")
                    .MustAsync(NotOverlapOtherSprint).WithMessage((_) => $"Provided date range overlaps with existing sprint: {_overlappingSprintName}");
            }

            private async Task<bool> NotOverlapOtherSprint(Command command, DateTime _, CancellationToken cancellationToken)
            {
                var sprint = await _db.Sprints.SingleOrNotFoundAsync(x => x.Id == command.Id, cancellationToken);
                var projectSprints = await _db.Sprints.Where(x => x.ProjectId == sprint.ProjectId && x.Id != sprint.Id).ToListAsync(cancellationToken);
                _overlappingSprintName = projectSprints.FirstOrDefault(x => IsOverlap(command.StartDate, command.EndDate, x.StartDate, x.EndDate))?.Name;
                return _overlappingSprintName is null;
            }

            private bool IsOverlap(DateTime start1, DateTime end1, DateTime start2, DateTime end2)
            {
                if (start1 >= end1) throw new ArgumentException("start1 must be less that end1");
                if (start2 >= end2) throw new ArgumentException("start2 must be less that end2");

                return end1 >= start2 && start1 <= end2;
            }
        }

        public class AuthCheck : IAuthorizationCheck<Command>
        {
            public async Task<bool> IsAuthorized(Command request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var sprint = await db.Sprints.Include(x => x.Project).SingleOrNotFoundAsync(x => x.Id == request.Id, cancellationToken);
                return sprint.Project.OwnerId == currentUserService.UserId;
            }
        }
    }
}
