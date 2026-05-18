using MuzoOnline.Api.Models;

namespace MuzoOnline.Api.Service;

public sealed class ProductSearchCache
{
    private readonly Dictionary<string, IReadOnlyList<Product>> _cache = new();

    public bool TryGet(string key, out IReadOnlyList<Product> products)
    {
        return _cache.TryGetValue(key, out products!);
    }

    public void Set(string key, IReadOnlyList<Product> products)
    {
        _cache[key] = products;
    }

    public void Clear()
    {
        _cache.Clear();
    }
}