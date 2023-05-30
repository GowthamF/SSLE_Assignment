
namespace SSLE.Auth.Data.Contract
{
    using Microsoft.EntityFrameworkCore;
    public interface IStorageContext
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken));

        DbSet<TEntity> Set<TEntity>() where TEntity : class;
    }
}
