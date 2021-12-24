using myscrum.Domain.Common;
using myscrum.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;

namespace myscrum.Domain.WorkItems.Discussion
{
    public class DiscussionMessage : Entity<string>
    {
        private List<DiscussionMessageLike> _likes;

        public DiscussionMessage(string text, User author, WorkItem workItem)
        {
            Text = text ?? throw new ArgumentNullException(nameof(text));
            Author = author;
            AuthorId = author.Id;
            WorkItem = workItem;
            WorkItemId = workItem.Id;
            CreatedAt = DateTime.UtcNow;
            _likes = new();
        }

        private DiscussionMessage()
        {
        }

        public string Text { get; private set; }

        public User Author { get; private set; }

        public string AuthorId { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public WorkItem WorkItem { get; private set; }

        public string WorkItemId { get; private set; }

        public bool IsEdited { get; private set; }

        public IReadOnlyList<DiscussionMessageLike> Likes => _likes;

        public void ToggleLike(User user)
        {
            if (_likes is null)
                _likes = new();

            if (_likes.Any(x => x.UserId == user.Id))
            {
                var toRemove = _likes.Single(x => x.UserId == user.Id);
                _likes.Remove(toRemove);
                return;
            }

            _likes.Add(new DiscussionMessageLike(user, this));
        }

        public void Edit(string text)
        {
            Text = text ?? throw new ArgumentNullException(nameof(text));
            IsEdited = true;
        }
    }
}
