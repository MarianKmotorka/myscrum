using System.Threading;
using System.Threading.Tasks;
using MediatR;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Projects
{
    public class RemoveProjectContributor
    {
        public class Command : IRequest
        {
            public string ProjectId { get; set; }

            public string ContributorId { get; set; }
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
                var projectContributor = await _db.ProjectContributors
                    .SingleOrNotFoundAsync(x => x.ProjectId == request.ProjectId && x.UserId == request.ContributorId, cancellationToken);

                _db.Remove(projectContributor);
                await _db.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }

        public class AuthCheck : IAuthorizationCheck<Command>
        {
            public async Task<bool> IsAuthorized(Command request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var project = await db.Projects.SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                return project.OwnerId == currentUserService.UserId || request.ContributorId == currentUserService.UserId;
            }
        }
    }
}
