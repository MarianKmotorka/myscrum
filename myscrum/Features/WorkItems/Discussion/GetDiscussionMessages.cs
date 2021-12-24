using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Features.WorkItems.Discussion.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.WorkItems.Discussion
{
    public class GetDiscussionMessages
    {
        public class Query : IRequest<List<DiscussionMessageDto>>
        {
            public string ProjectId { get; set; }

            public string WorkItemId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<DiscussionMessageDto>>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;
            private readonly ICurrentUserService _currentUserService;

            public Handler(MyScrumContext db, IMapper mapper, ICurrentUserService currentUserService)
            {
                _db = db;
                _mapper = mapper;
                _currentUserService = currentUserService;
            }

            public async Task<List<DiscussionMessageDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var messages = await _db.DiscussionMessages
                    .Include(x => x.Likes)
                    .Include(x => x.Author)
                    .Where(x => x.WorkItem.ProjectId == request.ProjectId && x.WorkItemId == request.WorkItemId)
                    .OrderByDescending(x => x.CreatedAt)
                    .ToListAsync(cancellationToken);

                return messages.Select(x =>
                {
                    var dto = _mapper.Map<DiscussionMessageDto>(x);
                    dto.IsLikedByMe = x.Likes.Any(l => l.UserId == _currentUserService.UserId);
                    return dto;
                })
                .ToList();
            }
        }

        public class AuthCheck : IAuthorizationCheck<Query>
        {
            public async Task<bool> IsAuthorized(Query request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var project = await db.Projects.Include(x => x.Contributors).Include(x => x.Sprints).SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);

                if ((project.OwnerId == currentUserService.UserId || project.Contributors.Any(x => x.UserId == currentUserService.UserId)) == false)
                    return false;

                return true;
            }
        }
    }
}
