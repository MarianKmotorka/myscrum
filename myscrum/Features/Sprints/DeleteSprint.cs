using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Sprints
{
    public class DeleteSprint
    {
        public class Command : IRequest
        {
            public string SprintId { get; set; }
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
                var sprint = await _db.Sprints.SingleOrNotFoundAsync(x => x.Id == request.SprintId, cancellationToken);
                _db.Remove(sprint);

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }

        public class AuthCheck : IAuthorizationCheck<Command>
        {
            public async Task<bool> IsAuthorized(Command request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var sprint = await db.Sprints.Include(x => x.Project).ThenInclude(x => x.Contributors).SingleOrNotFoundAsync(x => x.Id == request.SprintId, cancellationToken);
                return sprint.Project.OwnerId == currentUserService.UserId || sprint.Project.Contributors.Any(x => x.UserId == currentUserService.UserId);
            }
        }
    }
}
