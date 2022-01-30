using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myscrum.Features.Sprints;
using myscrum.Features.Sprints.Dto;
using myscrum.Features.Sprints.Retrospectives;
using myscrum.Features.Sprints.Retrospectives.Dto;
using myscrum.Features.Sprints.Statistics;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

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

        [HttpGet("{id}/settings")]
        public async Task<List<SprintSettingsDto>> GetSettings(string id, string projectId, CancellationToken cancellationToken)
           => await Mediator.Send(new GetSprintSettings.Query { SprintId = id, ProjectId = projectId }, cancellationToken);

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

        [HttpPut("{id}/settings")]
        public async Task EditSettings(string id, EditSprintSettings.Command command, CancellationToken cancellationToken)
        {
            command.SprintId = id;
            await Mediator.Send(command, cancellationToken);
        }

        [HttpPost("{id}/retrospective-comments")]
        public async Task<RetrospectiveCommentDto> CreateComment(string id, CreateOrUpdateRetrospectiveComment.Command command, CancellationToken cancellationToken)
        {
            command.SprintId = id;
            return await Mediator.Send(command, cancellationToken);
        }

        [HttpPut("{id}/retrospective-comments/{commentId}")]
        public async Task<RetrospectiveCommentDto> EditComment(string id, string commentId, CreateOrUpdateRetrospectiveComment.Command command, CancellationToken cancellationToken)
        {
            command.SprintId = id;
            command.Id = commentId;
            return await Mediator.Send(command, cancellationToken);
        }

        [HttpGet("{id}/retrospective-comments")]
        public async Task<List<RetrospectiveCommentDto>> GetRetrospectiveComments(string id, CancellationToken cancellationToken)
          => await Mediator.Send(new GetRetrospectiveComments.Query { SprintId = id }, cancellationToken);

        [HttpDelete("{id}/retrospective-comments/{itemId}")]
        public async Task DeleteComment(string itemId, CancellationToken cancellationToken)
        => await Mediator.Send(new DeleteRetrospectiveComment.Command { Id = itemId }, cancellationToken);

        [HttpGet("{id}/statistics")]
        public async Task<GetSprintStatistics.Response> GetStats(string id, CancellationToken cancellationToken)
          => await Mediator.Send(new GetSprintStatistics.Query { SprintId = id }, cancellationToken);
    }
}