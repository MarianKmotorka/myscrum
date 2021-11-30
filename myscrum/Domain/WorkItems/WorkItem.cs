using System;
using System.Collections.Generic;
using myscrum.Domain.Common;
using myscrum.Domain.Sprints;
using myscrum.Domain.Users;

namespace myscrum.Domain.WorkItems
{
    public class WorkItem : Entity<string>
    {
        public static readonly IReadOnlyDictionary<WorkItemType, WorkItemType[]> AllowedParentsMap = new Dictionary<WorkItemType, WorkItemType[]>
        {
            [WorkItemType.Bug] = new[] { WorkItemType.Pbi },
            [WorkItemType.Task] = new[] { WorkItemType.Pbi },
            [WorkItemType.Pbi] = new[] { WorkItemType.Feature },
            [WorkItemType.Feature] = new[] { WorkItemType.Epic },
            [WorkItemType.Epic] = Array.Empty<WorkItemType>(),
            [WorkItemType.TestCase] = Array.Empty<WorkItemType>(),
        };

        public WorkItem(string title, WorkItemType type, WorkItem parent = null)
        {
            Title = title;
            Parent = parent;
            Type = type;
        }

        private WorkItem()
        {
        }

        public string Title { get; private set; }

        public User AssignedTo { get; private set; }

        public string AssignedToId { get; private set; }

        public Sprint Sprint { get; private set; }

        public string SprintId { get; private set; }

        public WorkItem Parent { get; private set; }

        public string ParentId { get; private set; }

        public WorkItemType Type { get; private set; }

        public int Priority { get; private set; }

        public string Description { get; private set; }

        public WorkItemState State { get; private set; }

        public double? RemainingHours { get; private set; }

        public DateTime? StartDate { get; private set; }

        public DateTime? FinishDate { get; private set; }

        public string ImplementationDetails { get; private set; }

        public string AcceptationCriteria { get; private set; }
    }

    public enum WorkItemState
    {
        New,
        Approved,
        InProgress,
        ReadyForTest,
        Done
    }

    public enum WorkItemType
    {
        Task,
        Bug,
        Pbi,
        Feature,
        Epic,
        TestCase
    }
}
