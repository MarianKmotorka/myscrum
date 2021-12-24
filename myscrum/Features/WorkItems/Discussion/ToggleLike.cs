using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Persistence;
using myscrum.Services.Interfaces;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.WorkItems.Discussion
{
    public class ToggleLike
    {
        public class Command : IRequest
        {
            public string MessageId { get; set; }

            public string ProjectId { get; set; }

            public string CurrentUserId { get; set; }
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
                var wit = await _db.DiscussionMessages
                    .Include(x => x.Likes)
                    .SingleOrNotFoundAsync(x => x.Id == request.MessageId && x.WorkItem.ProjectId == request.ProjectId, cancellationToken);

                var user = await _db.Users.FindOrNotFoundAsync(cancellationToken, request.CurrentUserId);

                wit.ToggleLike(user);
                await _db.SaveChangesAsync(cancellationToken);

                return Unit.Value;

            }
        }

        public class AuthCheck : IAuthorizationCheck<Command>
        {
            public async Task<bool> IsAuthorized(Command request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var project = await db.Projects.Include(x => x.Contributors).SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                return project.OwnerId == currentUserService.UserId || project.Contributors.Any(x => x.UserId == currentUserService.UserId);
            }
        }
    }
}
