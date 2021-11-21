using System.Threading;
using System.Threading.Tasks;
using MediatR;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Projects
{
    public class DeleteProject
    {
        public class Command : IRequest
        {
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
                var project = await _db.Projects.SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                _db.Remove(project);

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
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
