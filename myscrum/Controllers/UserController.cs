using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myscrum.Domain.Users;
using myscrum.Features.Users;

namespace myscrum.Controllers
{
    [Authorize]
    [Route("api/users")]
    public class UserController : BaseController
    {
        [HttpGet("me/recieved-project-invitations")]
        public async Task<List<GetMyProjectInvitations.ResponseDto>> GetRecievedInvitations(CancellationToken ct)
            => await Mediator.Send(new GetMyProjectInvitations.Query { UserId = CurrentUserService.UserId }, ct);

        [HttpGet]
        [Authorize(nameof(SystemRole.Admin))]
        public async Task<IEnumerable<GetAllUsers.ResponseDto>> GetAll(CancellationToken ct)
            => await Mediator.Send(new GetAllUsers.Query(), ct);
    }
}