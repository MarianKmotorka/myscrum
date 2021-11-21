using System;
using myscrum.Domain.Common;
using myscrum.Domain.Users;

namespace myscrum.Domain.Projects
{
    public class Project : Entity<string>
    {
        public Project(string name, User owner)
        {
            Id = Guid.NewGuid().ToString();
            Name = name;
            Owner = owner;
            OwnerId = owner.Id;
            CreatedAtUtc = DateTime.UtcNow;
        }

        private Project()
        {
        }

        public string Name { get; set; }

        public User Owner { get; private set; }

        public string OwnerId { get; private set; }

        public DateTime CreatedAtUtc { get; private set; }
    }
}
