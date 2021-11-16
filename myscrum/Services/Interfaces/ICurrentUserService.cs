using Microsoft.AspNetCore.Http;
using myscrum.Domain.User;

namespace myscrum.Services.Interfaces
{
    public interface ICurrentUserService
    {
        string UserId { get; }

        SystemRole Role { get; }

        HttpContext HttpContext { get; }
    }
}
