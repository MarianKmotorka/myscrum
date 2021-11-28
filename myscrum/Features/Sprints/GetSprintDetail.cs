using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using myscrum.Common.Behaviours.Authorization;
using myscrum.Domain.Sprints;
using myscrum.Features.Sprints.Dto;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Features.Sprints
{
    public class GetSprintDetail
    {
        public class Query : IRequest<SprintDetailDto>
        {
            public string Id { get; set; }

            public string ProjectId { get; set; }
        }

        public class Handler : IRequestHandler<Query, SprintDetailDto>
        {
            private MyScrumContext _db;
            private readonly IMapper _mapper;

            public Handler(MyScrumContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }

            public async Task<SprintDetailDto> Handle(Query request, CancellationToken cancellationToken)
            {
                Sprint sprint = null;
                if (request.Id.ToLower() == "current")
                {
                    sprint = await _db.Sprints
                        .Where(x => x.ProjectId == request.ProjectId)
                        .SingleOrNotFoundAsync(x => x.StartDate <= DateTime.UtcNow && x.EndDate.AddDays(1) > DateTime.UtcNow, cancellationToken);
                }
                else
                {
                    sprint = await _db.Sprints.Where(x => x.ProjectId == request.ProjectId).SingleOrNotFoundAsync(x => x.Id == request.Id, cancellationToken);
                }

                return _mapper.Map<SprintDetailDto>(sprint);
            }
        }

        public class AuthCheck : IAuthorizationCheck<Query>
        {
            public async Task<bool> IsAuthorized(Query request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken)
            {
                var project = await db.Projects.Include(x => x.Contributors).SingleOrNotFoundAsync(x => x.Id == request.ProjectId, cancellationToken);
                return project.OwnerId == currentUserService.UserId || project.Contributors.Any(x => x.UserId == currentUserService.UserId);
            }
        }
    }
}
