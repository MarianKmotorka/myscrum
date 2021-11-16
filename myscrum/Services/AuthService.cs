using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using myscrum.Common;
using myscrum.Common.Constants;
using myscrum.Common.Options;
using myscrum.Domain.User;
using myscrum.Features.Auth.GoogleLogin;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Services
{
    public class AuthService : IAuthService
    {
        private readonly MyScrumContext _db;
        private readonly JwtOptions _jwtOptions;
        private readonly TokenValidationParameters _tokenValidationParameters;

        public AuthService(JwtOptions jwtOptions, MyScrumContext db, TokenValidationParameters tokenValidationParameters)
        {
            _db = db;
            _jwtOptions = jwtOptions;
            _tokenValidationParameters = tokenValidationParameters;
        }

        public async Task<Result> Logout(string refreshToken, CancellationToken cancellationToken)
        {
            var userId = GetPrincipalFromJwt(refreshToken)?.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;

            if (userId is null)
                return Result.Failure(ErrorCodes.InvalidRefreshToken);

            var user = await _db.Users.SingleAsync(x => x.Id == userId, cancellationToken);

            if (refreshToken != user.RefreshToken)
                return Result.Failure(ErrorCodes.InvalidRefreshToken);

            user.Logout();
            await _db.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }

        public async Task<Result<(string accessToken, string refreshToken)>> LoginOrRegister(GoogleUserInfo model, CancellationToken cancellationToken)
        {
            var user = await _db.Users.SingleOrDefaultAsync(x => x.Email == model.Email, cancellationToken);

            if (user is not null)
            {
                var (accessToken, refreshToken) = await Login(user, cancellationToken);
                return Result.Success((accessToken, refreshToken));
            }

            var newUser = new User(model.Email, model.GivenName, model.FamilyName);
            _db.Add(newUser);

            var loginResult = await Login(newUser, cancellationToken);
            return Result.Success((loginResult.accessToken, loginResult.refreshToken));
        }

        public async Task<Result<(string accessToken, string refreshToken)>> RefreshJwt(string refreshToken, CancellationToken cancellationToken)
        {
            var validatedRefreshToken = GetPrincipalFromJwt(refreshToken);

            if (validatedRefreshToken?.Claims.SingleOrDefault(x => x.Type == CustomClaims.IsRefreshToken) is null)
                return Result<(string, string)>.Failure(ErrorCodes.InvalidRefreshToken);

            var expiryDateUnix =
                    long.Parse(validatedRefreshToken.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Exp).Value);

            var expiryDateUtc =
                new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(expiryDateUnix);

            if (expiryDateUtc < DateTime.UtcNow)
                return Result<(string, string)>.Failure(ErrorCodes.RefreshTokenExpired);

            var appUserId = validatedRefreshToken.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var appUser = await _db.Users.SingleAsync(x => x.Id == appUserId, cancellationToken);
            var storedRefreshToken = appUser.RefreshToken;

            if (storedRefreshToken != refreshToken)
                return Result<(string, string)>.Failure(ErrorCodes.InvalidRefreshToken);

            return Result.Success(await Login(appUser, cancellationToken));
        }

        private async Task<(string accessToken, string refreshToken)> Login(User user, CancellationToken cancellationToken)
        {
            var accessToken = CreateAccessToken(user);
            var refreshToken = CreateRefreshToken(user);

            user.Login(refreshToken);
            await _db.SaveChangesAsync(cancellationToken);

            return (accessToken, refreshToken);
        }

        private string CreateRefreshToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtOptions.Secret);
            var jti = Guid.NewGuid().ToString();
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti,  jti),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Iss, _jwtOptions.Issuer),
                new Claim(CustomClaims.IsRefreshToken, "true")
            };

            var refreshTokenObject = new JwtSecurityToken(
                _jwtOptions.Issuer,
                null,
                claims,
                DateTime.UtcNow,
                DateTime.UtcNow.Add(_jwtOptions.RefreshTokenLifeTime),
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
                );

            return tokenHandler.WriteToken(refreshTokenObject);
        }

        private string CreateAccessToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtOptions.Secret);
            var jti = Guid.NewGuid().ToString();
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti,  jti),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Iss, _jwtOptions.Issuer),
                new Claim(CustomClaims.Role, user.Role.ToString()),
                new Claim(CustomClaims.IsAccessToken,"true")
            };

            var accessTokenObject = new JwtSecurityToken(
                _jwtOptions.Issuer,
                null,
                claims,
                DateTime.UtcNow,
                DateTime.UtcNow.Add(_jwtOptions.TokenLifeTime),
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
                );

            return tokenHandler.WriteToken(accessTokenObject);
        }

        private ClaimsPrincipal GetPrincipalFromJwt(string jwt)
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            var tokenValidationParameters = _tokenValidationParameters.Clone();
            tokenValidationParameters.ValidateLifetime = false;

            try
            {
                var principal = jwtHandler.ValidateToken(jwt, tokenValidationParameters, out var validatedJwt);

                var hasJwtValidSecurityAlgorithm =
                    (validatedJwt is JwtSecurityToken jwtSecurityToken) && jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);

                if (!hasJwtValidSecurityAlgorithm) return null;

                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
