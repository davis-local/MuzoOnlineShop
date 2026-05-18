using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MuzoOnline.Api.DataTransferObjects;
using MuzoOnline.Api.Models;
using MuzoOnline.Api.Repository;
using MuzoOnline.Api.Service;

namespace MuzoOnline.Api.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public sealed class CategoriesController : ControllerBase
{
    private readonly IRepository<Category> _categoryRepository;
    private readonly CategoryTreeTool _treeBuilder;

    public CategoriesController(
        IRepository<Category> categoryRepository,
        CategoryTreeTool treeBuilder)
    {
        _categoryRepository = categoryRepository;
        _treeBuilder = treeBuilder;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetCategories(
        CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetAllAsync(cancellationToken);

        return Ok(categories.Select(ToDto).ToList());
    }

    [HttpGet("tree")]
    public async Task<ActionResult<IReadOnlyList<CategoryNodeDto>>> GetCategoryTree(
        CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetAllAsync(cancellationToken);

        var tree = _treeBuilder.BuildTree(categories);

        return Ok(tree);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory(
        CreateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Category name is required." });
        }

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            ParentCategoryId = request.ParentCategoryId
        };

        var createdCategory = await _categoryRepository.AddAsync(
            category,
            cancellationToken);

        return CreatedAtAction(
            nameof(GetCategories),
            new { id = createdCategory.Id },
            ToDto(createdCategory));
    }

    private static CategoryDto ToDto(Category category)
    {
        return new CategoryDto(
            category.Id,
            category.Name,
            category.Description,
            category.ParentCategoryId);
    }
}