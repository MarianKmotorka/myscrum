using myscrum.Common.Mappings;
using myscrum.Domain.Users;

namespace myscrum.Features.Common
{
    public class UserDto : IMapFrom<User>
    {
        public string Id { get; set; }

        public string GivenName { get; set; }

        public string Surname { get; set; }

        public string FullName => $"{GivenName} {Surname}";
    }
}
