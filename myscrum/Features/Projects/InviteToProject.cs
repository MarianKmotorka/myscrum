using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Common.Constants;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Projects
{
    public class InviteToProject
    {
        public class Command : IRequest
        {
            [JsonIgnore]
            public string ProjectId { get; set; }

            public string InvitedId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly MyScrumContext _db;

            public Handler(MyScrumContext db)
            {
                _db = db;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var project = await _db.Projects.SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                var user = await _db.Users.SingleOrNotFoundAsync(x => x.Id == request.InvitedId, cancellationToken);

                user.InviteToProject(project);
                await _db.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            private MyScrumContext _db;

            public Validator(MyScrumContext db)
            {
                _db = db;

                RuleFor(x => x.InvitedId).MustAsync(NotBeInvited).WithErrorCode(ErrorCodes.UserAlreadyInvited).WithMessage("User is already invited.");
            }

            private async Task<bool> NotBeInvited(Command request, string invitedId, CancellationToken ct)
            {
                var user = await _db.Users.Include(x => x.ProjectInvitations).SingleOrNotFoundAsync(x => x.Id == invitedId, ct);
                if (user.ProjectInvitations.Any(x => x.UserId == invitedId && x.ProjectId == request.ProjectId))
                    return false;

                return true;
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
