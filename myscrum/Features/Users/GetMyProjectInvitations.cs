using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Features.Common;
using myscrum.Persistence;

namespace myscrum.Features.Users
{
    public class GetMyProjectInvitations
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
                return await _db.Users
                    .Where(x => x.Id == request.UserId)
                    .SelectMany(x => x.ProjectInvitations)
                    .Select(x => new ResponseDto
                    {
                        Id = x.ProjectId,
                        Name = x.Project.Name,
                        InvitedBy = new UserDto
                        {
                            Id = x.Project.OwnerId,
                            GivenName = x.Project.Owner.GivenName,
                            Surname = x.Project.Owner.Surname
                        }
                    })
                    .ToListAsync(cancellationToken);
            }
        }

        public class ResponseDto
        {
            public string Id { get; set; }

            public string Name { get; set; }

            public UserDto InvitedBy { get; set; }
        }
    }
}
