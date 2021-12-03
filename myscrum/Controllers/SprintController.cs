using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myscrum.Features.Sprints;
using myscrum.Features.Sprints.Dto;

namespace myscrum.Controllers
{
    [Authorize]
    [Route("api/sprints")]
    public class SprintController : BaseController
    {
        [HttpPost]
        public async Task<SprintDto> Create(CreateSprint.Command request, CancellationToken cancellationToken)
            => await Mediator.Send(request, cancellationToken);

        [HttpGet]
        public async Task<List<SprintDto>> Get([FromQuery] GetSprints.Query request, CancellationToken cancellationToken)
           => await Mediator.Send(request, cancellationToken);

        [HttpGet("{id}")]
        public async Task<SprintDetailDto> Get(string id, string projectId, CancellationToken cancellationToken)
           => await Mediator.Send(new GetSprintDetail.Query { Id = id, ProjectId = projectId }, cancellationToken);

        [HttpPatch("{id}")]
        public async Task<SprintDetailDto> Patch(string id, EditSprint.Command command, CancellationToken cancellationToken)
        {
            command.Id = id;
            return await Mediator.Send(command, cancellationToken);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id, CancellationToken cancellationToken)
        {
            await Mediator.Send(new DeleteSprint.Command { SprintId = id }, cancellationToken);
            return NoContent();
        }
    }
}
