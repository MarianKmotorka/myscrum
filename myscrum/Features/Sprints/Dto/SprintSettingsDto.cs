using myscrum.Common.Mappings;
using myscrum.Domain.Sprints;
using myscrum.Features.Common;

namespace myscrum.Features.Sprints.Dto
{
    public class SprintSettingsDto : IMapFrom<UserSprintSetting>
    {
        public UserDto User { get; set; }

        public string SprintId { get; set; }

        public int DaysOff { get; set; }

        public int CapacityPerDay { get; set; }
    }
}
