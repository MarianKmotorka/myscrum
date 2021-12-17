using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Features.WorkItems.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.WorkItems
{
    public class GetWorkItems
    {
        public class Query : IRequest<List<WorkItemDto>>
        {
            public string ProjectId { get; set; }

            public string SprintId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<WorkItemDto>>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<List<WorkItemDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var workItems = await _db.WorkItems
                    .Where(x => x.ProjectId == request.ProjectId)
                    .Where(x => x.SprintId == request.SprintId)
                    .OrderBy(x => x.Priority)
                    .ProjectTo<WorkItemDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return workItems;
            }
        }

        public class AuthCheck : IAuthorizationCheck<Query>
        {
            public async Task<bool> IsAuthorized(Query request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var project = await db.Projects.Include(x => x.Contributors).Include(x => x.Sprints).SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);

                if ((project.OwnerId == currentUserService.UserId || project.Contributors.Any(x => x.UserId == currentUserService.UserId)) == false)
                    return false;

                return request.SprintId is null || project.Sprints.Any(x => x.Id == request.SprintId);
            }
        }
    }
}
