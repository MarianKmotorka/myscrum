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
                var sprint = await _db.Sprints
                    .Include(x => x.WorkItems)
                    .SingleOrNotFoundAsync(x => x.Id == request.SprintId, cancellationToken);

                foreach (var item in sprint.WorkItems)
                {
                    item.SetSprint(null);
                }

                _db.Remove(sprint);

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }

        public class AuthCheck : IAuthorizationCheck<Command>
        {
            public async Task<bool> IsAuthorized(Command request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var sprint = await db.Sprints.Include(x => x.Project).SingleOrNotFoundAsync(x => x.Id == request.SprintId, cancellationToken);
                return sprint.Project.OwnerId == currentUserService.UserId;
            }
        }
    }
}