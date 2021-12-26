using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Features.Sprints.Retrospectives.Dto;
using myscrum.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.Sprints.Retrospectives
{
    public class GetRetrospectiveComments
    {
        public class Query : IRequest<List<RetrospectiveCommentDto>>
        {
            public string SprintId { get; set; }
        }


        public class Handler : IRequestHandler<Query, List<RetrospectiveCommentDto>>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<List<RetrospectiveCommentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.RetrospectiveComments
                    .OrderByDescending(x => x.CreatedAt)
                    .ProjectTo<RetrospectiveCommentDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);
            }
        }

        // TODO: AuthCheck
    }
}
