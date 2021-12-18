using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Domain.WorkItems;
using myscrum.Features.WorkItems.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.WorkItems
{
    public class CreateWorkItem
    {
        public class Command : IRequest<WorkItemDto>
        {
            public string Title { get; set; }

            public string AssignedToId { get; set; }

            public string SprintId { get; set; }

            public string ParentId { get; set; }

            public WorkItemType Type { get; set; }

            public string Description { get; set; }

            public double? RemainingHours { get; set; }

            public DateTime? StartDate { get; set; }

            public DateTime? FinishDate { get; set; }

            public string ImplementationDetails { get; set; }

            public string AcceptationCriteria { get; set; }

            public string ProjectId { get; set; }
        }

        public class Handler : IRequestHandler<Command, WorkItemDto>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<WorkItemDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var project = await _db.Projects.SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                var lowestPriority = await _db.WorkItems
                    .Where(x => x.ProjectId == request.ProjectId)
                    .OrderBy(x => x.Priority)
                    .Select(x => x.Priority)
                    .LastOrDefaultAsync(cancellationToken);

                var newWorkItem = new WorkItem(request.Title, request.Type, lowestPriority + 1, project);

                newWorkItem.SetAcceptanceCriteria(request.AcceptationCriteria);
                newWorkItem.SetImplementationDetails(request.ImplementationDetails);
                newWorkItem.SetDescription(request.Description);
                newWorkItem.SetStartDate(request.StartDate);
                newWorkItem.SetFinishDate(request.FinishDate);
                newWorkItem.SetRemainingHours(request.RemainingHours);

                if (request.AssignedToId is not null)
                {
                    var assignedTo = await _db.Users.FindOrNotFoundAsync(cancellationToken, request.AssignedToId);
                    newWorkItem.SetAssignedTo(assignedTo);
                }

                if (request.SprintId is not null)
                {
                    var sprint = await _db.Sprints.FindOrNotFoundAsync(cancellationToken, request.SprintId);
                    newWorkItem.SetSprint(sprint); ;
                }

                if (request.ParentId is not null)
                {
                    var parent = await _db.WorkItems.Where(x => x.ProjectId == request.ProjectId).SingleOrNotFoundAsync(x => x.Id == request.ParentId, cancellationToken);
                    newWorkItem.SetParent(parent); ;
                }

                _db.Add(newWorkItem);
                await _db.SaveChangesAsync(cancellationToken);
                return _mapper.Map<WorkItemDto>(newWorkItem);
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            private readonly MyScrumContext _db;

            public Validator(MyScrumContext db)
            {
                _db = db;

                RuleFor(x => x.SprintId).MustAsync(BeInSpecifiedProject).WithMessage("This sprint is not part of specified project");
                RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
                RuleFor(x => x.StartDate)
                    .Must((req, _) => req.StartDate < req.FinishDate)
                    .When(x => x.FinishDate.HasValue && x.StartDate.HasValue)
                    .WithMessage("Start date must be before end date");
            }

            private async Task<bool> BeInSpecifiedProject(Command command, string sprintId, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(command.SprintId))
                    return true;

                var sprint = await _db.Sprints.SingleOrNotFoundAsync(x => x.Id == sprintId, cancellationToken);
                return sprint.ProjectId == command.ProjectId;
            }
        }

        public class AuthCheck : IAuthorizationCheck<Command>
        {
            public async Task<bool> IsAuthorized(Command request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var project = await db.Projects.Include(x => x.Contributors).SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                return project.OwnerId == currentUserService.UserId || project.Contributors.Any(x => x.UserId == currentUserService.UserId);
            }
        }
    }
}
