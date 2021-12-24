using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myscrum.Features.WorkItems;
using myscrum.Features.WorkItems.Discussion;
using myscrum.Features.WorkItems.Discussion.Dto;
using myscrum.Features.WorkItems.Dto;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Controllers
{
    [Authorize]
    [Route("api/work-items")]
    public class WorkItemController : BaseController
    {
        [HttpPost]
        public async Task<WorkItemDto> CreateWorkItem(CreateWorkItem.Command request, CancellationToken cancellationToken)
            => await Mediator.Send(request, cancellationToken);

        [HttpPatch("{id}/priority")]
        public async Task ChangePriority(string id, ChangeWorkItemPriority.Command request, CancellationToken cancellationToken)
        {
            request.Id = id;
            await Mediator.Send(request, cancellationToken);
        }

        [HttpPut("{id}")]
        public async Task<WorkItemDetailDto> Edit(string id, EditWorkItem.Command request, CancellationToken cancellationToken)
        {
            request.Id = id;
            return await Mediator.Send(request, cancellationToken);
        }

        [HttpGet("{id}")]
        public async Task<WorkItemDetailDto> GetDetail(string id, string projectId, CancellationToken cancellationToken)
            => await Mediator.Send(new GetWorkItemDetail.Query { Id = id, ProjectId = projectId }, cancellationToken);

        [HttpDelete("{id}")]
        public async Task Delete(string id, string projectId, CancellationToken cancellationToken)
            => await Mediator.Send(new DeleteWorkItem.Command { Id = id, ProjectId = projectId }, cancellationToken);

        [HttpGet]
        public async Task<List<WorkItemDto>> Get([FromQuery] GetWorkItems.Query request, CancellationToken cancellationToken)
           => await Mediator.Send(request, cancellationToken);

        [HttpPost("selector")]
        public async Task<List<WorkItemDto>> Selector(GetWorkItemsSelector.Query request, CancellationToken cancellationToken)
          => await Mediator.Send(request, cancellationToken);

        [HttpPatch("{id}/child-work-item")]
        public async Task SetChildWorkItem(string id, AddChildWorkItem.Command request, CancellationToken cancellationToken)
        {
            request.Id = id;
            await Mediator.Send(request, cancellationToken);
        }

        [HttpPatch("{id}/move-to-sprint")]
        public async Task SetChildWorkItem(string id, MoveToSprint.Command request, CancellationToken cancellationToken)
        {
            request.Id = id;
            await Mediator.Send(request, cancellationToken);
        }

        [HttpPost("{id}/discussion-messages")]
        public async Task<DiscussionMessageDto> CreateDiscussionMessage(string id, CreateDiscussionMessage.Command request, CancellationToken cancellationToken)
        {
            request.WorkItemId = id;
            request.AuthorId = CurrentUserService.UserId;
            return await Mediator.Send(request, cancellationToken);
        }

        [HttpPost("{id}/discussion-messages/{messageId}/toggle-like")]
        public async Task CreateDiscussionMessage(string messageId, string projectId, CancellationToken cancellationToken)
            => await Mediator.Send(new ToggleLike.Command { CurrentUserId = CurrentUserService.UserId, MessageId = messageId, ProjectId = projectId }, cancellationToken);

        [HttpGet("{id}/discussion-messages")]
        public async Task<List<DiscussionMessageDto>> GetDiscussionMessage(string id, string projectId, CancellationToken cancellationToken)
            => await Mediator.Send(new GetDiscussionMessages.Query { WorkItemId = id, ProjectId = projectId }, cancellationToken);

        [HttpDelete("{id}/discussion-messages/{messageId}")]
        public async Task Delete(string messageId, CancellationToken cancellationToken)
            => await Mediator.Send(new DeleteDiscussionMessage.Command { Id = messageId }, cancellationToken);

        [HttpPut("{id}/discussion-messages/{messageId}")]
        public async Task EditMessage(string messageId, EditDiscussionMessage.Command request, CancellationToken cancellationToken)
        {
            request.Id = messageId;
            await Mediator.Send(request, cancellationToken);
        }
    }
}
