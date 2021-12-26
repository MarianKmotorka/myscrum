using myscrum.Domain.Common;
using myscrum.Domain.Users;
using System;
using System.Collections.Generic;

namespace myscrum.Domain.Sprints.Retrospectives
{
    public class RetrospectiveComment : Entity<string>
    {
        private List<RetrospectiveCommentVote> _votes;

        public RetrospectiveComment(User author, Sprint sprint, string text, bool isPositive)
        {
            Id = Guid.NewGuid().ToString();
            Author = author;
            AuthorId = author.Id;
            Sprint = sprint;
            SprintId = sprint.Id;
            Text = text;
            IsPositive = isPositive;
            CreatedAt = DateTime.UtcNow;
            _votes = new();
        }

        private RetrospectiveComment()
        {
        }

        public User Author { get; private set; }

        public string AuthorId { get; private set; }

        public Sprint Sprint { get; private set; }

        public string SprintId { get; private set; }

        public string Text { get; private set; }

        public bool IsPositive { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public IReadOnlyList<RetrospectiveCommentVote> Votes => _votes;

        public void SetText(string text) => Text = text;
    }
}
