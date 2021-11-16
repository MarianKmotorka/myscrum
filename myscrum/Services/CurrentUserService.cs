using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using myscrum.Common.Constants;
using myscrum.Domain.User;
using myscrum.Services.Interfaces;

namespace myscrum.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            HttpContext = httpContextAccessor.HttpContext;
            var userClaims = HttpContext?.User.Claims;

            var roleString = userClaims?.SingleOrDefault(x => x.Type == CustomClaims.Role)?.Value;
            Enum.TryParse<SystemRole>(roleString, out var roleEnum);

            UserId = userClaims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            Role = roleEnum;
        }

        public string UserId { get; }

        public SystemRole Role { get; }

        public HttpContext HttpContext { get; }
    }
}
