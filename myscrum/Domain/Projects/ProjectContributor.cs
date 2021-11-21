using myscrum.Domain.Users;

namespace myscrum.Domain.Projects
{
    public class ProjectContributor
    {
        public ProjectContributor(User user, Project project)
        {
            User = user;
            UserId = user.Id;
            Project = project;
            ProjectId = project.Id;
        }

        private ProjectContributor()
        {
        }

        public string UserId { get; private set; }

        public string ProjectId { get; private set; }

        public User User { get; private set; }

        public Project Project { get; private set; }
    }
}
