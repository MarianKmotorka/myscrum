using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Persistence;
using myscrum.Services.Interfaces;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.WorkItems
{
    public class AddChildWorkItem
    {
        public class Command : IRequest
        {
            public string Id { get; set; }

            public string ChildWorkItemId { get; set; }

            public string ProjectId { get; set; }
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
                var child = await _db.WorkItems
                    .Include(x => x.Parent)
                    .SingleOrNotFoundAsync(x => x.Id == request.ChildWorkItemId && x.ProjectId == request.ProjectId, cancellationToken);

                var parent = await _db.WorkItems.SingleOrNotFoundAsync(x => x.Id == request.Id && x.ProjectId == request.ProjectId, cancellationToken);

                child.SetParent(parent);

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
