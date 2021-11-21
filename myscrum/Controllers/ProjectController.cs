using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myscrum.Features.Projects;

namespace myscrum.Controllers
{
    [Authorize]
    [Route("api/projects")]
    public class ProjectController : BaseController
    {
        [HttpGet]
        public async Task<List<GetMyProjects.ResponseDto>> GetMyProjects(CancellationToken ct)
            => await Mediator.Send(new GetMyProjects.Query { UserId = CurrentUserService.UserId }, ct);

        [HttpPost]
        public async Task<CreateProject.ResponseDto> CreateProject(CreateProject.Command request, CancellationToken ct)
        {
            request.OwnerId = CurrentUserService.UserId;
            return await Mediator.Send(request, ct);
        }
    }
}
