using myscrum.Domain.Users;
using System;

namespace myscrum.Domain.Sprints.Retrospectives
{
    public class RetrospectiveCommentVote
    {
        public RetrospectiveCommentVote(User user, RetrospectiveComment retrospectiveComment, bool isUpvote)
        {
            User = user ?? throw new ArgumentNullException(nameof(user));
            UserId = user.Id;
            RetrospectiveComment = retrospectiveComment ?? throw new ArgumentNullException(nameof(retrospectiveComment));
            RetrospectiveCommentId = retrospectiveComment.Id;
            IsUpvote = isUpvote;
        }

        private RetrospectiveCommentVote()
        {
        }

        public User User { get; private set; }

        public string UserId { get; private set; }

        public RetrospectiveComment RetrospectiveComment { get; private set; }

        public string RetrospectiveCommentId { get; private set; }

        public bool IsUpvote { get; private set; }
    }
}
