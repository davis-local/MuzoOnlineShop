using Microsoft.EntityFrameworkCore;
using MuzoOnline.Api.Context;

namespace MuzoOnline.Api.Repository;

public abstract class Repository<T> : IRepository<T> where T : class
{
    protected readonly MuzoDbContext DbContext;
    protected readonly DbSet<T> DbSet;

    protected Repository(MuzoDbContext dbContext)
    {
        DbContext = dbContext;
        DbSet = dbContext.Set<T>();
    }

    public virtual async Task<IReadOnlyList<T>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public virtual async Task<T?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await DbSet.FindAsync(new object[] { id }, cancellationToken);
    }

    public virtual async Task<T> AddAsync(
        T entity,
        CancellationToken cancellationToken = default)
    {
        await DbSet.AddAsync(entity, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);

        return entity;
    }

    public virtual async Task<T?> UpdateAsync(
        Guid id,
        T entity,
        CancellationToken cancellationToken = default)
    {
        var existingEntity = await GetByIdAsync(id, cancellationToken);

        if (existingEntity is null)
        {
            return null;
        }

        DbContext.Entry(existingEntity).CurrentValues.SetValues(entity);
        await DbContext.SaveChangesAsync(cancellationToken);

        return existingEntity;
    }

    public virtual async Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var entity = await GetByIdAsync(id, cancellationToken);

        if (entity is null)
        {
            return false;
        }

        DbSet.Remove(entity);
        await DbContext.SaveChangesAsync(cancellationToken);

        return true;
    }
}