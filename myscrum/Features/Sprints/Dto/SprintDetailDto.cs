using System;
using myscrum.Common.Mappings;
using myscrum.Domain.Sprints;

namespace myscrum.Features.Sprints.Dto
{
    public class SprintDetailDto : IMapFrom<Sprint>
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Goal { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}
