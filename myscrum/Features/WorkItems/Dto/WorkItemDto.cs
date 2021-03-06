using AutoMapper;
using myscrum.Common.Mappings;
using myscrum.Domain.WorkItems;
using myscrum.Features.Common;
using System;
using System.Collections.Generic;

namespace myscrum.Features.WorkItems.Dto
{
    public class WorkItemDto : IMapFrom<WorkItem>
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public UserDto AssignedTo { get; set; }

        public string SprintId { get; set; }

        public string SprintName { get; set; }

        public string ProjectId { get; set; }

        public string ParentId { get; set; }

        public List<WorkItemDto> Children { get; set; } = new();

        public WorkItemType Type { get; set; }

        public int Priority { get; set; }

        public string Description { get; set; }

        public WorkItemState State { get; set; }

        public double? RemainingHours { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? FinishDate { get; set; }

        public string ImplementationDetails { get; set; }

        public string AcceptationCriteria { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<WorkItem, WorkItemDto>()
                .ForMember(x => x.Children, act => act.Ignore())
                .ForMember(x => x.SprintName, act => act.MapFrom(src => src.Sprint.Name));
        }
    }
}
