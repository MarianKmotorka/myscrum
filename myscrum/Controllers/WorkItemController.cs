using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myscrum.Features.WorkItems;
using myscrum.Features.WorkItems.Dto;

namespace myscrum.Controllers
{
    [Authorize]
    [Route("api/work-items")]
    public class WorkItemController : BaseController
    {
        [HttpPost]
        public async Task<WorkItemDto> CreateWorkItem(CreateWorkItem.Command request, CancellationToken cancellationToken)
            => await Mediator.Send(request, cancellationToken);
    }
}
