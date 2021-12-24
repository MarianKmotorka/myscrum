using MediatR;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Persistence;
using myscrum.Services.Interfaces;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.WorkItems.Discussion
{
    public class EditDiscussionMessage
    {
        public class Command : IRequest
        {
            [JsonIgnore]
            public string Id { get; set; }

            public string Text { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly MyScrumContext _db;

            public Handler(MyScrumContext db)
            {
                _db = db;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var message = await _db.DiscussionMessages.SingleOrNotFoundAsync(x => x.Id == request.Id, cancellationToken);

                message.Edit(request.Text);
                await _db.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }

        public class AuthCheck : IAuthorizationCheck<Command>
        {
            public async Task<bool> IsAuthorized(Command request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var message = await db.DiscussionMessages.SingleOrNotFoundAsync(x => x.Id == request.Id, cancellationToken);
                return message.AuthorId == currentUserService.UserId;
            }
        }
    }
}
