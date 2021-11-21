using System;
using myscrum.Domain.Common;

namespace myscrum.Domain.Project
{
    public class Project : Entity<string>
    {
        public Project(string name, User.User owner)
        {
            Name = name;
            Owner = owner;
            OwnerId = owner.Id;
            CreatedAtUtc = DateTime.UtcNow;
        }

        private Project()
        {
        }

        public string Name { get; private set; }

        public User.User Owner { get; private set; }

        public string OwnerId { get; private set; }

        public DateTime CreatedAtUtc { get; private set; }
    }
}
