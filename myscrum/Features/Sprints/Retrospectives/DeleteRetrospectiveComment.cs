using MediatR;
using myscrum.Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.Sprints.Retrospectives
{
    public class DeleteRetrospectiveComment
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
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
                var comment = await _db.RetrospectiveComments.SingleOrNotFoundAsync(x => x.Id == request.Id, cancellationToken);
                _db.Remove(comment);

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }

        // TODO: AuthCheck
    }
}
