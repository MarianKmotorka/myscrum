using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Persistence;

namespace myscrum.Features.Projects
{
    public class GetMyProjects
    {
        public class Query : IRequest<List<ResponseDto>>
        {
            public string UserId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<ResponseDto>>
        {
            private readonly MyScrumContext _db;

            public Handler(MyScrumContext db)
            {
                _db = db;
            }

            public async Task<List<ResponseDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.Projects.Where(x => x.OwnerId == request.UserId)
                    .Select(x => new ResponseDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        CreatedAtUtc = x.CreatedAtUtc
                    })
                    .OrderByDescending(x => x.CreatedAtUtc)
                    .ToListAsync(cancellationToken);
            }
        }

        public class ResponseDto
        {
            public string Id { get; set; }

            public string Name { get; set; }

            public DateTime CreatedAtUtc { get; set; }
        }
    }
}
