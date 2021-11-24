using System;

namespace myscrum.Features.Sprints.Dto
{
    public class SprintDto
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Goal { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string ProjectId { get; set; }

    }
}
