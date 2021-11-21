using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myscrum.Features.Projects;
using myscrum.Features.Projects.Dto;

namespace myscrum.Controllers
{
    [Authorize]
    [Route("api/projects")]
    public class ProjectController : BaseController
    {
        [HttpGet]
        public async Task<List<ProjectDto>> GetMyProjects(CancellationToken ct)
            => await Mediator.Send(new GetMyProjects.Query { UserId = CurrentUserService.UserId }, ct);

        [HttpPost]
        public async Task<ProjectDto> CreateProject(CreateProject.Command request, CancellationToken ct)
        {
            request.OwnerId = CurrentUserService.UserId;
            return await Mediator.Send(request, ct);
        }

        [HttpPost("{id}/invite")]
        public async Task<ActionResult> CreateProject(string id, InviteToProject.Command request, CancellationToken ct)
        {
            request.ProjectId = id;
            await Mediator.Send(request, ct);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ProjectDto> CreateProject(string id, EditProject.Command request, CancellationToken ct)
        {
            request.ProjectId = id;
            return await Mediator.Send(request, ct);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProject(string id, CancellationToken ct)
        {
            await Mediator.Send(new DeleteProject.Command { ProjectId = id }, ct);
            return NoContent();
        }
    }
}
