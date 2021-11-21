using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Common.Constants;
using myscrum.Features.Projects.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Projects
{
    public class EditProject
    {
        public class Command : IRequest<ProjectDto>
        {
            [JsonIgnore]
            public string ProjectId { get; set; }

            public string Name { get; set; }
        }

        public class Handler : IRequestHandler<Command, ProjectDto>
        {
            private readonly MyScrumContext _db;

            public Handler(MyScrumContext db)
            {
                _db = db;
            }

            public async Task<ProjectDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var project = await _db.Projects.SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                project.Name = request.Name;

                await _db.SaveChangesAsync(cancellationToken);

                return new ProjectDto
                {
                    Id = project.Id,
                    Name = project.Name,
                    CreatedAtUtc = project.CreatedAtUtc,
                    AmIOwner = true
                };
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            public Validator()
            {
                RuleFor(x => x.Name).NotEmpty().WithErrorCode(ErrorCodes.Required).WithMessage("Required");
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
