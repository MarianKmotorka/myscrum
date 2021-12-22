using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Features.WorkItems.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.WorkItems
{
    public class GetWorkItemDetail
    {
        public class Query : IRequest<WorkItemDetailDto>
        {
            public string Id { get; set; }

            public string ProjectId { get; set; }
        }

        public class Handler : IRequestHandler<Query, WorkItemDetailDto>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<WorkItemDetailDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var item = await _db.WorkItems.ProjectTo<WorkItemDetailDto>(_mapper.ConfigurationProvider)
                     .SingleOrNotFoundAsync(x => x.Id == request.Id && x.ProjectId == request.ProjectId, cancellationToken);

                return item;
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
