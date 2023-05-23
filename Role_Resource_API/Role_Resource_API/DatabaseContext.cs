using Microsoft.EntityFrameworkCore;

namespace Role_Resource_API
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options) { }

        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserResource> UserResources { get; set; }
    }
}
