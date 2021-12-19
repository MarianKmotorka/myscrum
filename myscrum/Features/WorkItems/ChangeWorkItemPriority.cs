using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Exceptions;
using myscrum.Persistence;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.WorkItems
{
    public class ChangeWorkItemPriority
    {
        public class Command : IRequest
        {
            public string Id { get; set; }

            public int Priority { get; set; }

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
                var allItems = await _db.WorkItems.Where(x => x.ProjectId == request.ProjectId).ToListAsync(cancellationToken);

                var targetItem = allItems.SingleOrDefault(x => x.Id == request.Id);
                if (targetItem is null)
                    throw new NotFoundException("Work item not found.");

                targetItem.SetPriority(request.Priority);

                foreach (var item in allItems)
                {
                    if (item.Id == request.Id)
                        continue;

                    if (item.Priority < request.Priority)
                        continue;

                    item.SetPriority(item.Priority + 1); // When implementing auditing, this should be change made by system
                }

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }

        // TODO: AuthCheck
    }
}
