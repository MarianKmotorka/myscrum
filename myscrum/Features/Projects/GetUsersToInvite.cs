using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Features.Common;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Projects
{
    public class GetUsersToInvite
    {
        public class Query : IRequest<List<UserDto>>
        {
            public string ProjectId { get; set; }

            public string Search { get; set; }

            public string CurrentUserId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserDto>>
        {
            private readonly MyScrumContext _db;

            public Handler(MyScrumContext db)
            {
                _db = db;
            }

            public async Task<List<UserDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                if (request.Search is null || request.Search.Length < 3)
                    return new List<UserDto>();

                return await _db.Users
                    .Where(x => x.Id != request.CurrentUserId)
                    .Where(x => !x.Projects.Any(p => p.ProjectId == request.ProjectId))
                    .Where(x => (x.GivenName + " " + x.Surname).Contains(request.Search))
                    .Select(x => new UserDto
                    {
                        Id = x.Id,
                        GivenName = x.GivenName,
                        Surname = x.Surname
                    })
                    .OrderBy(x => x.GivenName)
                    .ThenBy(x => x.Surname)
                    .Take(10)
                    .ToListAsync(cancellationToken);
            }
        }

        public class AuthCheck : IAuthorizationCheck<Query>
        {
            public async Task<bool> IsAuthorized(Query request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var project = await db.Projects.SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                return project.OwnerId == currentUserService.UserId;
            }
        }
    }
}
