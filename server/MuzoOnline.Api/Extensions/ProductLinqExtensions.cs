using MuzoOnline.Api.Models;

namespace MuzoOnline.Api.Extensions;

public static class ProductLinqExtensions
{
    public static IEnumerable<Product> WhereNameContains(
        this IEnumerable<Product> products,
        string? search)
    {
        return string.IsNullOrWhiteSpace(search)
            ? products
            : products.Where(product =>
                product.Name.Contains(search, StringComparison.OrdinalIgnoreCase));
    }

    public static IEnumerable<Product> WhereCategory(
        this IEnumerable<Product> products,
        Guid? categoryId)
    {
        return categoryId is null
            ? products
            : products.Where(product => product.CategoryId == categoryId.Value);
    }

    public static IEnumerable<Product> ApplyPaging(
        this IEnumerable<Product> products,
        int page,
        int pageSize)
    {
        var safePage = page < 1 ? 1 : page;
        var safePageSize = pageSize is < 1 or > 100 ? 10 : pageSize;

        return products
            .Skip((safePage - 1) * safePageSize)
            .Take(safePageSize);
    }
}