using myscrum.Common.Mappings;
using myscrum.Domain.Sprints.Retrospectives;
using myscrum.Features.Common;

namespace myscrum.Features.Sprints.Retrospectives.Dto
{
    public class RetrospectiveCommentDto : IMapFrom<RetrospectiveComment>
    {
        public string Id { get; set; }

        public string Text { get; set; }

        public UserDto Author { get; set; }

        public string SprintId { get; set; }

        public bool IsPositive { get; set; }
    }
}
