using System;
using System.Collections.Generic;
using myscrum.Features.Common;

namespace myscrum.Features.Projects.Dto
{
    public class ProjectDto
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public DateTime CreatedAtUtc { get; set; }

        public bool AmIOwner { get; set; }

        public UserDto Owner { get; set; }

        public IEnumerable<UserDto> Contributors { get; set; } = new List<UserDto>();
    }
}
