using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using myscrum.Common.Constants;
using myscrum.Common.Exceptions;
using myscrum.Common.Options;
using myscrum.Features.Auth;
using myscrum.Features.Auth.GoogleLogin;
using myscrum.Services.Interfaces;

namespace myscrum.Controllers
{
    [Route("api/auth")]
    public class AuthController : BaseController
    {
        private readonly JwtOptions _jwtOptions;
        private readonly IAuthService _authService;

        public AuthController(JwtOptions jwtOptions, IAuthService authService)
        {
            _jwtOptions = jwtOptions;
            _authService = authService;
        }

        [HttpPost("google-login")]
        public async Task<ActionResult<AuthResponse>> LoginWithCode(GoogleLogin.Command request, CancellationToken cancellationToken)
        {
            var response = await Mediator.Send(request, cancellationToken);
            Response.Cookies.Append(CustomCookies.RefreshToken, response.RefreshToken, GetRefreshTokenCookieOptions());
            return Ok(response);
        }

        [HttpGet("refresh-token")]
        public async Task<ActionResult<AuthResponse>> RefreshToken(CancellationToken cancellationToken)
        {
            Request.Cookies.TryGetValue(CustomCookies.RefreshToken, out string refreshToken);
            var result = await _authService.RefreshJwt(refreshToken, cancellationToken);
            if (result.Failed)
                throw new BadRequestException(result.Errors);

            var (accessToken, newRefreshToken) = result.Data;
            Response.Cookies.Append(CustomCookies.RefreshToken, newRefreshToken, GetRefreshTokenCookieOptions());
            return Ok(new AuthResponse { AccessToken = accessToken });
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout(CancellationToken cancellationToken)
        {
            Request.Cookies.TryGetValue(CustomCookies.RefreshToken, out string refreshToken);
            var result = await _authService.Logout(refreshToken, cancellationToken);
            if (result.Failed)
                throw new BadRequestException(result.Errors);

            Response.Cookies.Append(CustomCookies.RefreshToken, string.Empty, GetRefreshTokenCookieOptions(TimeSpan.FromSeconds(0)));
            return NoContent();
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<GetMe.Response>> GetMe(CancellationToken cancellationToken)
            => await Mediator.Send(new GetMe.Query { CurrentUserId = CurrentUserService.UserId }, cancellationToken);

        private CookieOptions GetRefreshTokenCookieOptions(TimeSpan? maxAge = null)
            => new CookieOptions
            {
                MaxAge = maxAge ?? _jwtOptions.RefreshTokenLifeTime,
                SameSite = SameSiteMode.Strict,
                HttpOnly = true,
                Path = "/",
            };
    }
}
