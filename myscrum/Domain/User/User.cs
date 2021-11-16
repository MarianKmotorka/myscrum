using System;
using myscrum.Domain.Common;

namespace myscrum.Domain.User
{
    public class User : Entity<string>
    {

        public User(string email, string givenName, string surname)
        {
            Email = email;
            GivenName = givenName;
            Surname = surname;
        }

        public string Email { get; private set; }

        public string GivenName { get; private set; }

        public string Surname { get; private set; }

        public DateTime? LastLogin { get; private set; }

        public SystemRole Role { get; private set; }

        public void Login() => LastLogin = DateTime.UtcNow;
    }

    public enum SystemRole
    {
        User = 0,
        Admin = 1
    }
}
