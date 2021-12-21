using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Domain.WorkItems;
using myscrum.Features.WorkItems.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.WorkItems
{
    public class GetWorkItemsSelector
    {
        public class Query : IRequest<List<WorkItemDto>>
        {
            public string ProjectId { get; set; }

            public string SprintId { get; set; }

            public string TitleFilter { get; set; }

            public WorkItemType[] TypeFilter { get; set; }
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
                var query = _db.WorkItems
                     .Where(x => x.ProjectId == request.ProjectId && x.SprintId == request.SprintId)
                     .ProjectTo<WorkItemDto>(_mapper.ConfigurationProvider);

                if (!string.IsNullOrEmpty(request.TitleFilter))
                    query = query.Where(x => x.Title.Contains(request.TitleFilter));

                if (request.TypeFilter is not null && request.TypeFilter.Any())
                    query = query.Where(x => request.TypeFilter.Contains(x.Type));

                return await query.OrderBy(x => x.Priority).ToListAsync(cancellationToken);
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
