using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Domain.Sprints;
using myscrum.Features.Sprints.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Sprints
{
    public class CreateSprint
    {
        public class Command : IRequest<SprintDto>
        {
            public string ProjectId { get; set; }

            public string Name { get; set; }

            public string Goal { get; set; }

            public DateTime StartDate { get; set; }

            public DateTime EndDate { get; set; }
        }

        public class Handler : IRequestHandler<Command, SprintDto>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<SprintDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var project = await _db.Projects.SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                var newSprint = new Sprint(request.Name, request.StartDate, request.EndDate, project) { Goal = request.Goal };

                _db.Add(newSprint);
                await _db.SaveChangesAsync(cancellationToken);

                return _mapper.Map<SprintDto>(newSprint);
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            private MyScrumContext _db;
            private string _overlappingSprintName;

            public Validator(MyScrumContext db)
            {
                _db = db;

                RuleFor(x => x.Name).NotEmpty().WithMessage("Required");

                RuleFor(x => x.StartDate).Cascade(CascadeMode.Stop)
                    .Must((req, _) => req.StartDate < req.EndDate).WithMessage("Start date must be before start date")
                    .MustAsync(NotOverlapOtherSprint).WithMessage((_) => $"Provided date range overlaps with existing sprint: {_overlappingSprintName}");
            }

            private async Task<bool> NotOverlapOtherSprint(Command command, DateTime _, CancellationToken cancellationToken)
            {
                var projectSprints = await _db.Sprints.Where(x => x.ProjectId == command.ProjectId).ToListAsync(cancellationToken);
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
                var project = await db.Projects.SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                return project.OwnerId == currentUserService.UserId;
            }
        }
    }
}
