using myscrum.Domain.Common;
using myscrum.Domain.Projects;
using myscrum.Domain.Sprints.Statistics;
using myscrum.Domain.Users;
using myscrum.Domain.WorkItems;
using System;
using System.Collections.Generic;
using System.Linq;

namespace myscrum.Domain.Sprints
{
    public class Sprint : Entity<string>
    {
        private List<UserSprintSetting> _settings;
        private List<WorkItem> _workItems;
        private List<BurndownData> _burndownData;

        public Sprint(string name, DateTime startDate, DateTime endDate, Project project)
        {
            Id = Guid.NewGuid().ToString();
            Name = name;
            StartDate = startDate;
            EndDate = endDate;
            Project = project;
            ProjectId = project.Id;

            _settings = new();

            foreach (var contributor in project.Contributors)
                _settings.Add(new UserSprintSetting(contributor.User, this));

            _settings.Add(new UserSprintSetting(project.Owner, this));
        }

        private Sprint()
        {
        }

        public string Name { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Goal { get; set; }

        public string ProjectId { get; private set; }

        public Project Project { get; private set; }

        public IReadOnlyList<UserSprintSetting> Settings => _settings;

        public IReadOnlyList<WorkItem> WorkItems => _workItems;

        public IReadOnlyList<BurndownData> BurndownData => _burndownData;

        public void SetSetting(string userId, int capacityPerDay, int daysOff)
        {
            var setting = _settings.Single(x => x.UserId == userId);
            setting.SetDaysOff(daysOff);
            setting.SetCapacityPerDay(capacityPerDay);
        }

        public void AddSetting(User user, int capacityPerDay = 0, int daysOff = 0)
        {
            if (_settings is null)
                _settings = new();

            var newSetting = new UserSprintSetting(user, this);
            newSetting.SetCapacityPerDay(capacityPerDay);
            newSetting.SetDaysOff(daysOff);
            _settings.Add(newSetting);
        }

        public void TrackBurndownData(DateTime trackedDate)
        {
            if (BurndownData.Any(x => x.Id == Statistics.BurndownData.CreateId(trackedDate, Id)))
                return;

            var remainingHours = WorkItems.Sum(x => x.RemainingHours ?? 0);
            _burndownData.Add(new BurndownData(trackedDate, remainingHours, this));
        }
    }
}