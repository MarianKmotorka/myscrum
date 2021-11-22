using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Persistence;

namespace myscrum.Features.Projects
{
    public class AcceptOrRejectInvitation
    {
        public class Command : IRequest
        {
            [JsonIgnore]
            public string ProjectId { get; set; }

            public bool Accepted { get; set; }

            [JsonIgnore]
            public string UserId { get; set; }
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
                var invitation = await _db.ProjectInvitations
                    .Include(x => x.Project)
                    .Include(x => x.User)
                    .SingleOrNotFoundAsync(x => x.ProjectId == request.ProjectId && x.UserId == request.UserId, cancellationToken);

                var user = invitation.User;
                var project = invitation.Project;

                if (request.Accepted)
                    project.AddContributtor(user);

                _db.Remove(invitation);
                await _db.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
