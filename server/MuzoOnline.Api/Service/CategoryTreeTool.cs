using MuzoOnline.Api.DataTransferObjects;
using MuzoOnline.Api.Models;

namespace MuzoOnline.Api.Service;

public sealed class CategoryTreeTool
{
    public IReadOnlyList<CategoryNodeDto> BuildTree(IEnumerable<Category> categories)
    {
        var categoryList = categories.ToList();

        return categoryList
            .Where(category => category.ParentCategoryId is null)
            .Select(category => BuildNode(category, categoryList))
            .ToList();
    }

    private static CategoryNodeDto BuildNode(
        Category category,
        IReadOnlyList<Category> allCategories)
    {
        var children = allCategories
            .Where(child => child.ParentCategoryId == category.Id)
            .Select(child => BuildNode(child, allCategories))
            .ToList();

        return new CategoryNodeDto(
            category.Id,
            category.Name,
            category.Description,
            category.ParentCategoryId,
            children);
    }
}