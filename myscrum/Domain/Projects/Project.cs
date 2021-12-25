using myscrum.Domain.Common;
using myscrum.Domain.Sprints;
using myscrum.Domain.Users;
using System;
using System.Collections.Generic;

namespace myscrum.Domain.Projects
{
    public class Project : Entity<string>
    {
        private List<ProjectContributor> _contributors;
        private List<Sprint> _sprints;

        public Project(string name, User owner)
        {
            Id = Guid.NewGuid().ToString();
            Name = name;
            Owner = owner;
            OwnerId = owner.Id;
            CreatedAtUtc = DateTime.UtcNow;
            _contributors = new List<ProjectContributor>();
            _sprints = new List<Sprint>();
        }

        private Project()
        {
        }

        public string Name { get; set; }

        public IReadOnlyCollection<ProjectContributor> Contributors => _contributors;

        public IReadOnlyCollection<Sprint> Sprints => _sprints;

        public User Owner { get; private set; }

        public string OwnerId { get; private set; }

        public DateTime CreatedAtUtc { get; private set; }

        public void AddContributtor(User user)
        {
            if (_contributors is null)
                _contributors = new List<ProjectContributor>();

            _contributors.Add(new ProjectContributor(user, this));

            foreach (var sprint in _sprints)
                sprint.AddSetting(user);
        }
    }
}
