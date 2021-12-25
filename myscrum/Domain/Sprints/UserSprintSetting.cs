using myscrum.Domain.Users;
using System;

namespace myscrum.Domain.Sprints
{
    public class UserSprintSetting
    {
        public UserSprintSetting(User user, Sprint sprint)
        {
            User = user;
            UserId = user.Id;
            Sprint = sprint;
            SprintId = sprint.Id;
        }

        private UserSprintSetting()
        {
        }

        public string UserId { get; private set; }

        public string SprintId { get; private set; }

        public User User { get; private set; }

        public Sprint Sprint { get; private set; }

        public int CapacityPerDay { get; private set; }

        public int DaysOff { get; private set; }

        public void SetCapacityPerDay(int capacity)
        {
            if (capacity < 0 || capacity > 24)
                throw new ArgumentException("Invalid capacity");

            CapacityPerDay = capacity;
        }

        public void SetDaysOff(int value)
        {
            DaysOff = value;
        }
    }
}
