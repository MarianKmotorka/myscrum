using System.Threading;
using System.Threading.Tasks;
using myscrum.Persistence;
using myscrum.Services.Interfaces;

namespace myscrum.Common.Behaviours.Authorization
{
    public interface IAuthorizationCheck<TRequest>
    {
        public Task<bool> IsAuthorized(TRequest request, MyScrumContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken);
    }
}
