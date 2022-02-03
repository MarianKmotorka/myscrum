using System;
using myscrum.Domain.Common;

namespace myscrum.Domain.Sprints.Statistics
{
    public class BurndownData : Entity<string>
    {
        public BurndownData(DateTime date, Sprint sprint, double? remainingHours = null)
        {
            Date = date;
            RemainingHours = remainingHours;
            Sprint = sprint;
            SprintId = sprint.Id;
        }

        private BurndownData()
        {
        }

        public DateTime Date { get; private set; }

        public double? RemainingHours { get; private set; }

        public Sprint Sprint { get; private set; }

        public string SprintId { get; private set; }
    }
}