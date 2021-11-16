﻿using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using myscrum.Domain.Common;
using myscrum.Domain.User;

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
