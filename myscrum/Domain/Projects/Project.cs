using System;
using System.Collections.Generic;
using myscrum.Domain.Common;
using myscrum.Domain.Users;

namespace myscrum.Domain.Projects
{
    public class Project : Entity<string>
    {
        private List<ProjectContributor> _contributors;

        public Project(string name, User owner)
        {
            Id = Guid.NewGuid().ToString();
            Name = name;
            Owner = owner;
            OwnerId = owner.Id;
            CreatedAtUtc = DateTime.UtcNow;
            _contributors = new List<ProjectContributor>();
        }

        private Project()
        {
        }

        public string Name { get; set; }

        public IReadOnlyCollection<ProjectContributor> Contributors => _contributors;

        public User Owner { get; private set; }

        public string OwnerId { get; private set; }

        public DateTime CreatedAtUtc { get; private set; }

        public void AddContributtor(User user)
        {
            if (_contributors is null)
                _contributors = new List<ProjectContributor>();

            _contributors.Add(new ProjectContributor(user, this));
        }
    }
}
