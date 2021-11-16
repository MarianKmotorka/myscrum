using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using myscrum.Common.Constants;
using myscrum.Common.Exceptions;
using myscrum.Common.Options;
using myscrum.Services.Interfaces;
using Newtonsoft.Json;

namespace myscrum.Features.Auth.GoogleLogin
{
    public class GoogleLogin
    {
        public class Command : IRequest<AuthResponse>
        {
            public string Code { get; set; }
        }

        public class Handler : IRequestHandler<Command, AuthResponse>
        {
            private readonly GoogleOAuthOptions _authOptions;
            private readonly IAuthService _authService;
            private readonly HttpClient _client;

            public Handler(GoogleOAuthOptions authOptions, IHttpClientFactory clientFactory, IAuthService authService)
            {
                _authOptions = authOptions;
                _authService = authService;
                _client = clientFactory.CreateClient();
            }

            public async Task<AuthResponse> Handle(Command request, CancellationToken cancellationToken)
            {
                var googleUser = await GetUserModel(request.Code, cancellationToken);

                var loginResult = await _authService.LoginOrRegister(googleUser, cancellationToken);
                if (loginResult.Failed)
                    throw new BadRequestException(loginResult.Errors);

                return new AuthResponse
                {
                    AccessToken = loginResult.Data.accessToken,
                    RefreshToken = loginResult.Data.refreshToken
                };
            }

            private async Task<GoogleUserInfo> GetUserModel(string code, CancellationToken cancellationToken)
            {
                var request = new
                {
                    code,
                    client_id = _authOptions.GoogleClientId,
                    client_secret = _authOptions.GoogleClientSecret,
                    grant_type = "authorization_code",
                    redirect_uri = _authOptions.ClientRedirectUri
                };

                var response = await _client.PostAsJsonAsync(_authOptions.TokenEndpoint, request, cancellationToken);
                if (!response.IsSuccessStatusCode)
                    throw new BadRequestException(ErrorCodes.InvalidCode);

                var authResponse = await response.Content.ReadAsAsync<GoogleAuthResponse>(cancellationToken);

                var userInfoRequest = new HttpRequestMessage()
                {
                    Method = new HttpMethod("GET"),
                    Headers = { { HttpRequestHeader.Authorization.ToString(), $"{authResponse.TokenType} {authResponse.AccessToken}" } },
                    RequestUri = new Uri(_authOptions.UserInfoEndpoint)
                };

                response = await _client.SendAsync(userInfoRequest, cancellationToken);

                if (!response.IsSuccessStatusCode)
                    throw new BadRequestException("Google service is unavailable");

                var model = await response.Content.ReadAsAsync<GoogleUserInfo>(cancellationToken);
                return model;
            }
        }

        public class GoogleAuthResponse
        {
            [JsonProperty("access_token")]
            public string AccessToken { get; set; }

            [JsonProperty("token_type")]
            public string TokenType { get; set; }
        }
    }
}
