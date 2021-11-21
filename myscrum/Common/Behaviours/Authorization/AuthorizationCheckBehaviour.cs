using System.Threading;
using System.Threading.Tasks;
using MediatR;
using myscrum.Common.Exceptions;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Common.Behaviours.Authorization
{
    public class AuthorizationCheckBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        private readonly MyScrumContext _db;
        private readonly ICurrentUserService _currentUserService;
        private readonly IAuthorizationCheck<TRequest> _authorizationCheck;

        public AuthorizationCheckBehavior(MyScrumContext db, ICurrentUserService currentUserService, IAuthorizationCheck<TRequest> authorizationCheck = null)
        {
            _db = db;
            _authorizationCheck = authorizationCheck;
            _currentUserService = currentUserService;
        }

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            if (_authorizationCheck is null || await _authorizationCheck.IsAuthorized(request, _db, _currentUserService, cancellationToken))
                return await next();

            // if authorization fails because of expired bearer, 401 should be returned
            if (string.IsNullOrEmpty(_currentUserService.UserId))
                throw new Unauthorized401Exception();

            throw new Forbidden403Exception();
        }
    }
}
