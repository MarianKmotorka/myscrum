using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using myscrum.Domain.User;
using myscrum.Persistence;

namespace myscrum.Features.Auth
{
    public class GetMe
    {
        public class Query : IRequest<Response>
        {
            public string CurrentUserId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Response>
        {
            private readonly MyScrumContext _db;

            public Handler(MyScrumContext db)
            {
                _db = db;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _db.Users.SingleOrNotFoundAsync(x => x.Id == request.CurrentUserId, cancellationToken);
                return new Response
                {
                    Id = user.Id,
                    Email = user.Email,
                    GivenName = user.GivenName,
                    Surname = user.Surname,
                    LastLogin = user.LastLogin,
                    Role = user.Role
                };
            }
        }

        public class Response
        {
            public string Id { get; set; }

            public string Email { get; set; }

            public string GivenName { get; set; }

            public string Surname { get; set; }

            public DateTime? LastLogin { get; set; }

            public SystemRole Role { get; set; }
        }
    }
}
