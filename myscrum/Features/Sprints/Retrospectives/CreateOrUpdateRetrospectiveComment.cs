using AutoMapper;
using MediatR;
using myscrum.Domain.Sprints.Retrospectives;
using myscrum.Features.Sprints.Retrospectives.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.Sprints.Retrospectives
{
    public class CreateOrUpdateRetrospectiveComment
    {
        public class Command : IRequest<RetrospectiveCommentDto>
        {
            public string Id { get; set; }

            public string Text { get; set; }

            public bool IsPositive { get; set; }

            public string SprintId { get; set; }
        }


        public class Handler : IRequestHandler<Command, RetrospectiveCommentDto>
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

            public async Task<RetrospectiveCommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                RetrospectiveComment comment;

                if (request.Id is null)
                {
                    var author = await _db.Users.SingleOrNotFoundAsync(x => x.Id == _currentUserService.UserId, cancellationToken);
                    var sprint = await _db.Sprints.SingleOrNotFoundAsync(x => x.Id == request.SprintId, cancellationToken);
                    comment = new RetrospectiveComment(author, sprint, request.Text, request.IsPositive);
                    _db.Add(comment);
                }
                else
                {
                    comment = await _db.RetrospectiveComments.SingleOrNotFoundAsync(x => x.Id == request.Id, cancellationToken);
                    comment.SetText(request.Text);
                }

                await _db.SaveChangesAsync(cancellationToken);
                return _mapper.Map<RetrospectiveCommentDto>(comment);
            }
        }

        // TODO: AuthCheck
    }
}
