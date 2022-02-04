using System;
using myscrum.Domain.Common;

namespace myscrum.Domain.Sprints.Statistics
{
    public class BurndownData : Entity<string>
    {
        public BurndownData(DateTime date, double remainingHours, Sprint sprint)
        {
            Id = CreateId(date, sprint.Id);
            Date = date;
            RemainingHours = remainingHours;
            Sprint = sprint;
            SprintId = sprint.Id;
        }

        private BurndownData()
        {
        }

        public DateTime Date { get; private set; }

        public double RemainingHours { get; private set; }

        public Sprint Sprint { get; private set; }

        public string SprintId { get; private set; }

        public static string CreateId(DateTime date, string sprintId)
            => $"{date.Day}.{date.Month}.{date.Year}-{sprintId}";
    }
}