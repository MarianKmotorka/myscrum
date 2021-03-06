using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using myscrum.Domain.Common;
using myscrum.Domain.Projects;
using myscrum.Domain.Sprints;
using myscrum.Domain.Sprints.Retrospectives;
using myscrum.Domain.Sprints.Statistics;
using myscrum.Domain.Users;
using myscrum.Domain.WorkItems;
using myscrum.Domain.WorkItems.Discussion;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace myscrum.Persistence
{
    public class MyScrumContext : DbContext
    {
        private readonly IMediator _mediator;

        public MyScrumContext(DbContextOptions options, IMediator mediator) : base(options)
        {
            _mediator = mediator;
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Project> Projects { get; set; }

        public DbSet<Sprint> Sprints { get; set; }

        public DbSet<RetrospectiveComment> RetrospectiveComments { get; set; }

        public DbSet<RetrospectiveCommentVote> RetrospectiveCommentVotes { get; set; }

        public DbSet<UserSprintSetting> SprintSettings { get; set; }

        public DbSet<WorkItem> WorkItems { get; set; }

        public DbSet<DiscussionMessage> DiscussionMessages { get; set; }

        public DbSet<ProjectInvitation> ProjectInvitations { get; set; }

        public DbSet<ProjectContributor> ProjectContributors { get; set; }

        public DbSet<BurndownData> BurndownData { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            for (var i = 0; i < 3; i++) // To prevent infinite loop, number of iteration is capped to 3.
            {
                var events = ChangeTracker.Entries<BaseEntity>().SelectMany(po => po.Entity.ConsumeEvents()).ToList();
                if (events.Count == 0)
                    break;

                foreach (var @event in events)
                    await _mediator.Publish(@event, cancellationToken);
            }

            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.RemovePluralizingTableNameConvention();
            base.OnModelCreating(builder);

            builder.Entity<User>().HasIndex(x => x.Email).IsUnique();

            builder.Entity<Project>(project =>
            {
                project.Property(x => x.OwnerId).IsRequired();
                project.Property(x => x.Name).IsRequired();
            });

            builder.Entity<ProjectContributor>(pc =>
            {
                pc.HasKey(x => new { x.UserId, x.ProjectId });
                pc.HasOne(x => x.Project).WithMany(x => x.Contributors);
                pc.HasOne(x => x.User).WithMany(x => x.Projects).OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<ProjectInvitation>(pi =>
            {
                pi.HasKey(x => new { x.UserId, x.ProjectId });
                pi.HasOne(x => x.Project).WithMany();
                pi.HasOne(x => x.User).WithMany(x => x.ProjectInvitations).OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<Sprint>(s =>
            {
                s.HasOne(x => x.Project).WithMany(x => x.Sprints).IsRequired();
            });

            builder.Entity<WorkItem>(wit =>
            {
                wit.HasOne(x => x.Parent).WithMany(x => x.Children);
                wit.Property(x => x.Title).IsRequired();
                wit.HasOne(x => x.Project).WithMany().IsRequired();
            });

            builder.Entity<DiscussionMessage>(dm =>
            {
                dm.Property(x => x.Text).IsRequired();
                dm.HasOne(x => x.Author).WithMany().IsRequired();
                dm.HasOne(x => x.WorkItem).WithMany().IsRequired().OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<DiscussionMessageLike>(pi =>
            {
                pi.HasKey(x => new { x.UserId, x.MessageId });
                pi.HasOne(x => x.Message).WithMany(x => x.Likes).IsRequired();
                pi.HasOne(x => x.User).WithMany().IsRequired().OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<UserSprintSetting>(s =>
            {
                s.HasKey(x => new { x.UserId, x.SprintId });
                s.HasOne(x => x.Sprint).WithMany(x => x.Settings).IsRequired();
                s.HasOne(x => x.User).WithMany().IsRequired().OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<RetrospectiveCommentVote>(s =>
            {
                s.HasKey(x => new { x.UserId, x.RetrospectiveCommentId });
                s.HasOne(x => x.RetrospectiveComment).WithMany(x => x.Votes).IsRequired();
                s.HasOne(x => x.User).WithMany().IsRequired().OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<BurndownData>(s =>
            {
                s.HasOne(x => x.Sprint).WithMany(x => x.BurndownData).IsRequired();
            });
        }
    }

    internal static class PersistenceExtensions
    {
        public static void RemovePluralizingTableNameConvention(this ModelBuilder modelBuilder)
        {
            foreach (IMutableEntityType entity in modelBuilder.Model.GetEntityTypes())
                entity.SetTableName(entity.DisplayName());
        }
    }
}