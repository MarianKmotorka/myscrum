using System;
using myscrum.Domain.Common;

namespace myscrum.Domain.Sprints.Statistics
{
    public class BurndownData : Entity<string>
    {
        public BurndownData(DateTime date, double remainingHours, Sprint sprint)
        {
            Date = date;
            RemainingHours = remainingHours;
            Sprint = sprint;
        }

        private BurndownData()
        {
        }

        public DateTime Date { get; private set; }

        public double RemainingHours { get; private set; }

        public Sprint Sprint { get; private set; }
    }
}