using System;

namespace myscrum.Features.Projects.Dto
{
    public class ProjectDto
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public DateTime CreatedAtUtc { get; set; }

        public bool AmIOwner { get; set; }
    }
}
