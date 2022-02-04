using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Common.Mappings;
using myscrum.Domain.Sprints;
using myscrum.Domain.Sprints.Statistics;
using myscrum.Features.Common;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Sprints.Statistics
{
    public class GetSprintStatistics
    {
        public class Query : IRequest<Response>
        {
            public string SprintId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Response>
        {
            private readonly MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var sprint = await _db.Sprints
                   .Include(x => x.WorkItems)
                   .Include(x => x.BurndownData)
                   .Include(x => x.Settings)
                   .ThenInclude(x => x.User)
                   .SingleOrNotFoundAsync(x => x.Id == request.SprintId, cancellationToken);

                return new Response
                {
                    BurndownData = GetBurndownData(sprint),
                    Capacities = GetCapacities(sprint),
                };
            }

            private IEnumerable<Response.BurndownDataDto> GetBurndownData(Sprint sprint)
            {
                var dtos = sprint.BurndownData
                    .Select(_mapper.Map<Response.BurndownDataDto>)
                    .OrderBy(x => x.Date)
                    .ToList();

                var isTodayInSprint = sprint.StartDate < DateTime.UtcNow && sprint.EndDate > DateTime.UtcNow;
                if (!isTodayInSprint)
                    return dtos;

                var remainingHoursForToday = sprint.WorkItems.Sum(x => x.RemainingHours ?? 0);
                dtos.Add(new Response.BurndownDataDto
                {
                    Date = DateTime.UtcNow,
                    RemainingHours = remainingHoursForToday,
                });

                GetDatesBetween(DateTime.UtcNow.AddDays(1), sprint.EndDate.AddDays(1))
                    .ForEach(x => dtos.Add(new Response.BurndownDataDto
                    {
                        Date = x,
                        RemainingHours = null
                    }));

                return dtos;
            }

            private List<DateTime> GetDatesBetween(DateTime start, DateTime end)
            {
                return Enumerable.Range(0, 1 + end.Subtract(start).Days)
                          .Select(offset => start.AddDays(offset))
                          .ToList();
            }

            private IEnumerable<Response.Capacity> GetCapacities(Sprint sprint)
            {
                var workingDays = GetNumberOfBusinessDays(sprint.StartDate, sprint.EndDate);
                return sprint.Settings.Select(setting =>
                {
                    var workingDaysWithoutDaysOff = workingDays - setting.DaysOff;
                    var assignedWorkHours = sprint.WorkItems.Where(x => x.AssignedToId == setting.UserId).Sum(x => x.RemainingHours ?? 0);

                    return new Response.Capacity
                    {
                        AssignedWorkHours = assignedWorkHours,
                        CapacityHours = workingDaysWithoutDaysOff * setting.CapacityPerDay,
                        User = _mapper.Map<UserDto>(setting.User)
                    };
                });
            }

            private static int GetNumberOfBusinessDays(DateTime startDate, DateTime endDate)
            {
                double calcBusinessDays =
                    1 + ((endDate - startDate).TotalDays * 5 - (startDate.DayOfWeek - endDate.DayOfWeek) * 2) / 7;

                if (endDate.DayOfWeek == DayOfWeek.Saturday) calcBusinessDays--;
                if (startDate.DayOfWeek == DayOfWeek.Sunday) calcBusinessDays--;

                return (int)calcBusinessDays;
            }
        }

        public class Response
        {
            public IEnumerable<Capacity> Capacities { get; set; }

            public IEnumerable<BurndownDataDto> BurndownData { get; set; }

            public class Capacity
            {
                public UserDto User { get; set; }

                public double AssignedWorkHours { get; set; }

                public double CapacityHours { get; set; }
            }

            public class BurndownDataDto : IMapFrom<BurndownData>
            {
                public DateTime Date { get; set; }

                public double? RemainingHours { get; set; }
            }
        }

        public class AuthCheck : IAuthorizationCheck<Query>
        {
            public async Task<bool> IsAuthorized(Query request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var userId = currentUserService.UserId;
                return await db.Sprints
                    .Where(x => x.Id == request.SprintId)
                    .Where(x => x.Project.Contributors.Any(c => c.UserId == userId) || x.Project.OwnerId == userId)
                    .AnyAsync(cancellationToken);
            }
        }
    }
}