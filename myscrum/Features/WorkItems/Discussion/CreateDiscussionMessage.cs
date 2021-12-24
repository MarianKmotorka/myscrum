using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Domain.WorkItems.Discussion;
using myscrum.Features.WorkItems.Discussion.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.WorkItems.Discussion
{
    public class CreateDiscussionMessage
    {
        public class Command : IRequest<DiscussionMessageDto>
        {
            public string Text { get; set; }

            public string WorkItemId { get; set; }

            public string ProjectId { get; set; }

            [JsonIgnore]
            public string AuthorId { get; set; }
        }

        public class Handler : IRequestHandler<Command, DiscussionMessageDto>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<DiscussionMessageDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var wit = await _db.WorkItems.SingleOrNotFoundAsync(x => x.Id == request.WorkItemId && x.ProjectId == request.ProjectId, cancellationToken);
                var author = await _db.Users.FindOrNotFoundAsync(cancellationToken, request.AuthorId);
                var newMessage = new DiscussionMessage(request.Text, author, wit);

                _db.Add(newMessage);
                await _db.SaveChangesAsync(cancellationToken);
                return _mapper.Map<DiscussionMessageDto>(newMessage);
            }
        }

        public class AuthCheck : IAuthorizationCheck<Command>
        {
            public async Task<bool> IsAuthorized(Command request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var project = await db.Projects.Include(x => x.Contributors).SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                return project.OwnerId == currentUserService.UserId || project.Contributors.Any(x => x.UserId == currentUserService.UserId);
            }
        }
    }
}
