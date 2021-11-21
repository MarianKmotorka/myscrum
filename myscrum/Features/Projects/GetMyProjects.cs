using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Features.Common;
using myscrum.Features.Projects.Dto;
using myscrum.Persistence;

namespace myscrum.Features.Projects
{
    public class GetMyProjects
    {
        public class Query : IRequest<List<ProjectDto>>
        {
            public string UserId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<ProjectDto>>
        {
            private readonly MyScrumContext _db;

            public Handler(MyScrumContext db)
            {
                _db = db;
            }

            public async Task<List<ProjectDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.Projects
                    .Where(x => x.OwnerId == request.UserId || x.Contributors.Any(c => c.UserId == request.UserId))
                    .Select(x => new ProjectDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        CreatedAtUtc = x.CreatedAtUtc,
                        AmIOwner = x.OwnerId == request.UserId,
                        Contributors = x.Contributors.Select(c => new UserDto
                        {
                            Id = c.User.Id,
                            GivenName = c.User.GivenName,
                            Surname = c.User.Surname
                        }),
                        Owner = new UserDto
                        {
                            Id = x.Owner.Id,
                            GivenName = x.Owner.GivenName,
                            Surname = x.Owner.Surname
                        }
                    })
                    .OrderByDescending(x => x.CreatedAtUtc)
                    .ToListAsync(cancellationToken);
            }
        }
    }
}
