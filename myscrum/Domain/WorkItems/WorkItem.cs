using myscrum.Domain.Common;
using myscrum.Domain.Projects;
using myscrum.Domain.Sprints;
using myscrum.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;

namespace myscrum.Domain.WorkItems
{
    public class WorkItem : Entity<string>
    {
        public static readonly IReadOnlyDictionary<WorkItemType, WorkItemType[]> AllowedParentsMap = new Dictionary<WorkItemType, WorkItemType[]>
        {
            [WorkItemType.Bug] = new[] { WorkItemType.Pbi, WorkItemType.Feature, WorkItemType.TestCase },
            [WorkItemType.Task] = new[] { WorkItemType.Pbi },
            [WorkItemType.Pbi] = new[] { WorkItemType.Feature },
            [WorkItemType.Feature] = new[] { WorkItemType.Epic },
            [WorkItemType.Epic] = Array.Empty<WorkItemType>(),
            [WorkItemType.TestCase] = new[] { WorkItemType.Pbi },
        };

        private List<WorkItem> _children;

        public WorkItem(string title, WorkItemType type, int priority, Project project)
        {
            Id = Guid.NewGuid().ToString();

            Title = string.IsNullOrEmpty(title)
                ? throw new ArgumentException("Title cannot be null or empty string")
                : title;

            if (priority < 1)
                throw new ArgumentException("Priority must be more than zero.");

            Priority = priority;
            Type = type;
            Project = project;
            ProjectId = project.Id;
            _children = new();
        }

        private WorkItem()
        {
        }

        public string ProjectId { get; private set; }

        public Project Project { get; private set; }

        public string Title { get; private set; }

        public User AssignedTo { get; private set; }

        public string AssignedToId { get; private set; }

        public Sprint Sprint { get; private set; }

        public string SprintId { get; private set; }

        public WorkItem Parent { get; private set; }

        public IReadOnlyList<WorkItem> Children => _children;

        public string ParentId { get; private set; }

        public WorkItemType Type { get; private set; }

        /// <summary>
        /// Number 1 is the highest priority
        /// </summary>
        public int Priority { get; private set; }

        public string Description { get; private set; }

        public WorkItemState State { get; private set; }

        public double? RemainingHours { get; private set; }

        public DateTime? StartDate { get; private set; }

        public DateTime? FinishDate { get; private set; }

        public string ImplementationDetails { get; private set; }

        public string AcceptationCriteria { get; private set; }

        public void SetParent(WorkItem parent)
        {
            if (parent?.Id == ParentId)
                return;

            if (parent is not null && !AllowedParentsMap[Type].Contains(parent.Type))
                throw new InvalidOperationException($"WorkItem of type {Type} cannot have parent of type {parent.Type}");

            Parent = parent;
            ParentId = parent?.Id;
        }

        public void SetTitle(string title)
        {
            if (title == Title)
                return;

            Title = string.IsNullOrEmpty(title)
                ? throw new ArgumentException("Title cannot be null or empty string")
                : title;
        }

        public void SetAssignedTo(User user)
        {
            if (user?.Id == AssignedToId)
                return;

            AssignedTo = user;
            AssignedToId = user?.Id;
        }

        public void SetSprint(Sprint sprint)
        {
            if (sprint?.Id == SprintId)
                return;

            if (Type == WorkItemType.Epic || Type == WorkItemType.Feature)
                throw new InvalidOperationException($"{Type} cannot be moved to any sprint");

            Sprint = sprint;
            SprintId = sprint?.Id;
        }

        public void SetPriority(int priority)
        {
            if (priority < 1)
                throw new ArgumentException("Priority must be more than zero.");

            if (priority == Priority)
                return;

            Priority = priority;
        }

        public void SetDescription(string description)
        {
            if (description == Description)
                return;

            Description = description;
        }

        public void SetState(WorkItemState state)
        {
            if (state == State)
                return;

            State = state;
        }

        public void SetRemainingHours(double? hours)
        {
            if (hours == RemainingHours)
                return;

            if (!new[] { WorkItemType.Bug, WorkItemType.Task, WorkItemType.TestCase }.Contains(Type))
                throw new InvalidOperationException($"Cannot set remaining hours on {Type}");

            RemainingHours = hours;
        }

        public void SetStartDate(DateTime? start)
        {
            if (StartDate == start)
                return;

            StartDate = start;
        }

        public void SetFinishDate(DateTime? finish)
        {
            if (FinishDate == finish)
                return;

            FinishDate = finish;
        }

        public void SetImplementationDetails(string details)
        {
            if (ImplementationDetails == details)
                return;

            ImplementationDetails = details;
        }

        public void SetAcceptanceCriteria(string criteria)
        {
            if (AcceptationCriteria == criteria)
                return;

            AcceptationCriteria = criteria;
        }

        public void ClearChildren()
        {
            if (_children is not null)
                _children.Clear();
        }
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