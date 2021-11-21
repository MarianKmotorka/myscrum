namespace myscrum.Features.Common
{
    public class UserDto
    {
        public string Id { get; set; }

        public string GivenName { get; set; }

        public string Surname { get; set; }

        public string FullName => $"{GivenName} {Surname}";
    }
}
