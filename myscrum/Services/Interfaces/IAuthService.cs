using System.Threading;
using System.Threading.Tasks;
using myscrum.Common;
using myscrum.Features.Auth.GoogleLogin;

namespace myscrum.Services.Interfaces
{
    public interface IAuthService
    {
        Task<Result<(string accessToken, string refreshToken)>> LoginOrRegister(GoogleUserInfo model, CancellationToken cancellationToken);
        Task<Result> Logout(string refreshToken, CancellationToken cancellationToken);
        Task<Result<(string accessToken, string refreshToken)>> RefreshJwt(string refreshToken, CancellationToken cancellationToken);
    }
}
