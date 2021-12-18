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
                var task = request.SprintId is null ? GetItemsForBacklog(request, cancellationToken) : GetItemsForSprint(request, cancellationToken);
                return await task;
            }

            private async Task<List<WorkItemDto>> GetItemsForSprint(Query request, CancellationToken cancellationToken)
            {
                var sprintItemTypes = new[] { WorkItemType.Bug, WorkItemType.Pbi, WorkItemType.TestCase };

                var workItems = await _db.WorkItems
                    .Where(x => x.ProjectId == request.ProjectId)
                    .Where(x => x.SprintId == request.SprintId)
                    .ProjectTo<WorkItemDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                GetItemsWithChildren(workItems);

                return workItems
                    .Where(x => sprintItemTypes.Contains(x.Type))
                    .Where(x => x.Type != WorkItemType.Bug || x.ParentId == null)
                    .Where(x => x.Type != WorkItemType.TestCase || x.ParentId == null)
                    .OrderBy(x => x.Priority).ToList();
            }

            private async Task<List<WorkItemDto>> GetItemsForBacklog(Query request, CancellationToken cancellationToken)
            {
                var workItems = await _db.WorkItems
                    .Where(x => x.ProjectId == request.ProjectId)
                    .ProjectTo<WorkItemDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                GetItemsWithChildren(workItems);

                return workItems.Where(x => x.ParentId == null && x.SprintId == null).OrderBy(x => x.Priority).ToList();
            }

            private void GetItemsWithChildren(List<WorkItemDto> items)
            {
                foreach (var item in items)
                {
                    if (item.ParentId is null)
                        continue;

                    var parent = items.SingleOrDefault(x => x.Id == item.ParentId);
                    if (parent is null)
                        continue;

                    parent.Children.Add(item);
                    parent.Children = parent.Children.OrderBy(x => x.Priority).ToList();
                }
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
