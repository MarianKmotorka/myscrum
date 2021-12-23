using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myscrum.Features.WorkItems;
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
    }
}
