using System;
using System.Collections.Generic;
using myscrum.Domain.Common;
using myscrum.Domain.Projects;

namespace myscrum.Domain.Users
{
    public class User : Entity<string>
    {
        private List<ProjectInvitation> _projectInvitations;

        public User(string email, string givenName, string surname)
        {
            Id = Guid.NewGuid().ToString();
            Email = email;
            GivenName = givenName;
            Surname = surname;
            _projectInvitations = new();
        }

        public string Email { get; private set; }

        public string GivenName { get; private set; }

        public string Surname { get; private set; }

        public string RefreshToken { get; private set; }

        public DateTime? LastLogin { get; private set; }

        public SystemRole Role { get; private set; }

        public IReadOnlyCollection<ProjectInvitation> ProjectInvitations => _projectInvitations;

        public void Login(string refreshToken)
        {
            LastLogin = DateTime.UtcNow;
            RefreshToken = refreshToken;
        }

        public void Logout() => RefreshToken = null;

        public void InviteToProject(Project project)
        {
            if (_projectInvitations is null)
                _projectInvitations = new();

            _projectInvitations.Add(new ProjectInvitation(this, project));
        }
    }

    public enum SystemRole
    {
        User = 0,
        Admin = 1
    }
}
