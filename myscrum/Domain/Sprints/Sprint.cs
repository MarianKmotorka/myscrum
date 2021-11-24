using System;
using myscrum.Domain.Common;
using myscrum.Domain.Projects;

namespace myscrum.Domain.Sprints
{
    public class Sprint : Entity<string>
    {
        public Sprint(string name, DateTime startDate, DateTime endDate, Project project)
        {
            Id = Guid.NewGuid().ToString();
            Name = name;
            StartDate = startDate;
            EndDate = endDate;
            Project = project;
            ProjectId = project.Id;
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
    }
}
