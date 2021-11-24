using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Features.Sprints.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Sprints
{
    public class GetSprints
    {
        public class Query : IRequest<List<SprintDto>>
        {
            public string ProjectId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<SprintDto>>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<List<SprintDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.Sprints
                    .Where(x => x.ProjectId == request.ProjectId)
                    .ProjectTo<SprintDto>(_mapper.ConfigurationProvider)
                    .OrderBy(x => x.StartDate)
                    .ToListAsync(cancellationToken);
            }
        }

        public class AuthCheck : IAuthorizationCheck<Query>
        {
            public async Task<bool> IsAuthorized(Query request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var project = await db.Projects.Include(x => x.Contributors).SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                return project.OwnerId == currentUserService.UserId || project.Contributors.Any(x => x.UserId == currentUserService.UserId);
            }
        }
    }
}
