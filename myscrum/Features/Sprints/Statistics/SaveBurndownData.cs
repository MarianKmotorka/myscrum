using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Persistence;

namespace myscrum.Features.Sprints.Statistics
{
    public class SaveBurndownData
    {
        public class Command : IRequest
        {
        }

        /// <summary>
        /// Saves remaining hours for yesterday
        /// </summary>
        public class Handler : IRequestHandler<Command>
        {
            private readonly MyScrumContext _db;

            public Handler(MyScrumContext db)
            {
                _db = db;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var now = DateTime.UtcNow;

                // TODO: This should be batched for performance
                var sprints = await _db.Sprints
                    .Include(x => x.WorkItems)
                    .Include(x => x.BurndownData)
                    .Where(x => x.StartDate < now && x.EndDate > now)
                    .ToListAsync(cancellationToken);

                foreach (var sprint in sprints)
                {
                    sprint.TrackBurndownData(now);
                }

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}