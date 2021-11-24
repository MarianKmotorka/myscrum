using System;
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
                var project = await _db.Projects.AsNoTracking().SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                var newSprint = new Sprint(request.Name, request.StartDate, request.EndDate, project) { Goal = request.Goal };

                _db.Add(newSprint);
                await _db.SaveChangesAsync(cancellationToken);

                return _mapper.Map<SprintDto>(newSprint);
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            public Validator()
            {
                RuleFor(x => x.Name).NotEmpty().WithMessage("Required");
                RuleFor(x => x.StartDate).Must(x => DateTime.UtcNow < x).WithMessage("Must be in the future");
                RuleFor(x => x.EndDate).Must((req, _) => req.StartDate < req.EndDate).WithMessage("Start date must be before end date");
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
