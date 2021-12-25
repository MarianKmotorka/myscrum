using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Persistence;
using myscrum.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Features.Sprints
{
    public class EditSprintSettings
    {
        public class Command : IRequest
        {
            [JsonIgnore]
            public string SprintId { get; set; }

            public string ProjectId { get; set; }

            public List<SettingDto> Settings { get; set; }

            public class SettingDto
            {
                public string UserId { get; set; }

                public int DaysOff { get; set; }

                public int CapacityPerDay { get; set; }
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly MyScrumContext _db;

            public Handler(MyScrumContext db)
            {
                _db = db;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var sprint = await _db.Sprints
                    .Include(x => x.Settings)
                    .SingleOrDefaultAsync(x => x.Id == request.SprintId && x.ProjectId == request.ProjectId, cancellationToken);

                foreach (var setting in request.Settings)
                {
                    sprint.SetSetting(setting.UserId, setting.CapacityPerDay, setting.DaysOff);
                }

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
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
