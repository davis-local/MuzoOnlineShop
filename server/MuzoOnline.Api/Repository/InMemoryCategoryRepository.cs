using MuzoOnline.Api.Models;

namespace MuzoOnline.Api.Repository;

public sealed class InMemoryCategoryRepository : IRepository<Category>
{
    private readonly Dictionary<Guid, Category> _categories = new();

    public Task<IReadOnlyList<Category>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult<IReadOnlyList<Category>>(
            _categories.Values.ToList());
    }

    public Task<Category?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        _categories.TryGetValue(id, out var category);
        return Task.FromResult(category);
    }

    public Task<Category> AddAsync(
        Category entity,
        CancellationToken cancellationToken = default)
    {
        entity.Id = entity.Id == Guid.Empty ? Guid.NewGuid() : entity.Id;

        _categories[entity.Id] = entity;

        return Task.FromResult(entity);
    }

    public Task<Category?> UpdateAsync(
        Guid id,
        Category entity,
        CancellationToken cancellationToken = default)
    {
        if (!_categories.ContainsKey(id))
        {
            return Task.FromResult<Category?>(null);
        }

        entity.Id = id;
        _categories[id] = entity;

        return Task.FromResult<Category?>(entity);
    }

    public Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_categories.Remove(id));
    }
}