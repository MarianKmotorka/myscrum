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
    public class EditWorkItem
    {
        public class Command : IRequest<WorkItemDetailDto>
        {
            public string Id { get; set; }

            public string Title { get; set; }

            public string AssignedToId { get; set; }

            public string SprintId { get; set; }

            public string ProjectId { get; set; }

            public string ParentId { get; set; }

            public string Description { get; set; }

            public WorkItemState State { get; set; }

            public double? RemainingHours { get; set; }

            public DateTime? StartDate { get; set; }

            public DateTime? FinishDate { get; set; }

            public string ImplementationDetails { get; set; }

            public string AcceptationCriteria { get; set; }
        }

        public class Handler : IRequestHandler<Command, WorkItemDetailDto>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<WorkItemDetailDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var item = await _db.WorkItems
                    .Include(x => x.AssignedTo)
                    .Include(x => x.Sprint)
                    .Include(x => x.Parent)
                    .Include(x => x.Children)
                    .SingleOrNotFoundAsync(x => x.Id == request.Id && x.ProjectId == request.ProjectId, cancellationToken);

                var parent = request.ParentId is null ? null : await _db.WorkItems.SingleOrNotFoundAsync(x => x.Id == request.ParentId, cancellationToken);
                var sprint = request.SprintId is null ? null : await _db.Sprints.SingleOrNotFoundAsync(x => x.Id == request.SprintId, cancellationToken);
                var assignedTo = request.AssignedToId is null ? null : await _db.Users.SingleOrNotFoundAsync(x => x.Id == request.AssignedToId, cancellationToken);

                item.SetParent(parent);
                item.SetSprint(sprint);
                item.SetAssignedTo(assignedTo);

                item.SetAcceptanceCriteria(request.AcceptationCriteria);
                item.SetImplementationDetails(request.ImplementationDetails);
                item.SetDescription(request.Description);
                item.SetStartDate(request.StartDate);
                item.SetFinishDate(request.FinishDate);
                item.SetRemainingHours(request.RemainingHours);
                item.SetTitle(request.Title);
                item.SetState(request.State);

                await _db.SaveChangesAsync(cancellationToken);
                return _mapper.Map<WorkItemDetailDto>(item);
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

                // TODO: add validation for ParentId, SprintId, AssignedToId if they are part of the project
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
