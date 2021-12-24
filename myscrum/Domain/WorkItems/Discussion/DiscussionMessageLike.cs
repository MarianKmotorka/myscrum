using myscrum.Domain.Users;
using System;

namespace myscrum.Domain.WorkItems.Discussion
{
    public class DiscussionMessageLike
    {
        public DiscussionMessageLike(User user, DiscussionMessage message)
        {
            User = user ?? throw new ArgumentNullException(nameof(user));
            UserId = user.Id;
            Message = message ?? throw new ArgumentNullException(nameof(message));
            MessageId = message.Id;
        }

        private DiscussionMessageLike()
        {
        }

        public User User { get; private set; }

        public string UserId { get; private set; }

        public DiscussionMessage Message { get; private set; }

        public string MessageId { get; private set; }
    }
}
