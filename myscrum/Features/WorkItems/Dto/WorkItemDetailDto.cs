using myscrum.Common.Mappings;
using myscrum.Domain.WorkItems;
using myscrum.Features.Common;
using myscrum.Features.Sprints.Dto;
using System;
using System.Collections.Generic;

namespace myscrum.Features.WorkItems.Dto
{
    public class WorkItemDetailDto : IMapFrom<WorkItem>
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public UserDto AssignedTo { get; set; }

        public SprintDto Sprint { get; set; }

        public string ProjectId { get; set; }

        public WorkItemLookup Parent { get; set; }

        public List<WorkItemLookup> Children { get; set; } = new();

        public WorkItemType Type { get; set; }

        public int Priority { get; set; }

        public string Description { get; set; }

        public WorkItemState State { get; set; }

        public double? RemainingHours { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? FinishDate { get; set; }

        public string ImplementationDetails { get; set; }

        public string AcceptationCriteria { get; set; }
    }

    public class WorkItemLookup : IMapFrom<WorkItem>
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public string SprintId { get; set; }

        public UserDto AssignedTo { get; set; }

        public WorkItemState State { get; set; }

        public WorkItemType Type { get; set; }
    }
}
