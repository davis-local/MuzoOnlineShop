using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using MuzoOnline.Api.DataTransferObjects;
using MuzoOnline.Api.Extensions;
using MuzoOnline.Api.Models;
using MuzoOnline.Api.Repository;
using MuzoOnline.Api.Service;

namespace MuzoOnline.Api.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController : ControllerBase
{
    private readonly IRepository<Product> _productRepository;
    private readonly ProductSearchEngine<Product> _searchEngine;
    private readonly ProductSearchCache _cache;

    public ProductsController(
        IRepository<Product> productRepository,
        ProductSearchEngine<Product> searchEngine,
        ProductSearchCache cache)
    {
        _productRepository = productRepository;
        _searchEngine = searchEngine;
        _cache = cache;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetProducts(
        [FromQuery] ProductQuery query,
        CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);

        IEnumerable<Product> filteredProducts;

        var cacheKey = $"{query.Search}-{query.CategoryId}-{query.Page}-{query.PageSize}";

        if (!string.IsNullOrWhiteSpace(query.Search) &&
            _cache.TryGet(cacheKey, out var cachedProducts))
        {
            filteredProducts = cachedProducts;
        }
        else if (!string.IsNullOrWhiteSpace(query.Search))
        {
            filteredProducts = _searchEngine
                .Search(products, query.Search)
                .Select(result => result.Item);

            var materialized = filteredProducts.ToList();
            _cache.Set(cacheKey, materialized);
            filteredProducts = materialized;
        }
        else
        {
            filteredProducts = products;
        }

        var result = filteredProducts
            .WhereCategory(query.CategoryId)
            .OrderBy(product => product)
            .ApplyPaging(query.Page, query.PageSize)
            .Select(ToDto)
            .ToList();

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> GetProduct(
        Guid id,
        CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(ToDto(product));
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(
        CreateProductRequest request,
        CancellationToken cancellationToken)
    {
        var validationError = ProductRequestValidator.Validate(request);

        if (validationError is not null)
        {
            return BadRequest(new { message = validationError });
        }

        var now = DateTimeOffset.UtcNow;

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            SKU = request.SKU,
            Price = request.Price,
            Quantity = request.Quantity,
            CategoryId = request.CategoryId,
            CreatedAt = now,
            UpdatedAt = now
        };

        var createdProduct = await _productRepository.AddAsync(product, cancellationToken);

        _cache.Clear();

        return CreatedAtAction(
            nameof(GetProduct),
            new { id = createdProduct.Id },
            ToDto(createdProduct));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(
        Guid id,
        UpdateProductRequest request,
        CancellationToken cancellationToken)
    {
        var validationError = ProductRequestValidator.Validate(request);

        if (validationError is not null)
        {
            return BadRequest(new { message = validationError });
        }

        var existingProduct = await _productRepository.GetByIdAsync(id, cancellationToken);

        if (existingProduct is null)
        {
            return NotFound();
        }

        var updatedProduct = new Product
        {
            Id = id,
            Name = request.Name,
            Description = request.Description,
            SKU = request.SKU,
            Price = request.Price,
            Quantity = request.Quantity,
            CategoryId = request.CategoryId,
            CreatedAt = existingProduct.CreatedAt,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        var result = await _productRepository.UpdateAsync(
            id,
            updatedProduct,
            cancellationToken);

        _cache.Clear();

        return result is null ? NotFound() : Ok(ToDto(result));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProduct(
        Guid id,
        CancellationToken cancellationToken)
    {
        var deleted = await _productRepository.DeleteAsync(id, cancellationToken);

        if (!deleted)
        {
            return NotFound();
        }

        _cache.Clear();

        return NoContent();
    }

    [HttpGet("manual-search")]
    public async Task<IActionResult> ManualSearch(CancellationToken cancellationToken)
    {
        var query = HttpContext.Request.Query;

        var search = query.TryGetValue("search", out var searchValue)
            ? searchValue.ToString()
            : null;

        var page = query.TryGetValue("page", out var pageValue) &&
                   int.TryParse(pageValue, out var parsedPage)
            ? parsedPage
            : 1;

        var pageSize = query.TryGetValue("pageSize", out var pageSizeValue) &&
                       int.TryParse(pageSizeValue, out var parsedPageSize)
            ? parsedPageSize
            : 10;

        var products = await _productRepository.GetAllAsync(cancellationToken);

        var result = products
            .WhereNameContains(search)
            .OrderBy(product => product)
            .ApplyPaging(page, pageSize)
            .Select(ToDto)
            .ToList();

        return Ok(result);
    }

    [HttpGet("{id:guid}/summary-json")]
    public async Task GetProductSummaryJson(
        Guid id,
        CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);

        if (product is null)
        {
            Response.StatusCode = StatusCodes.Status404NotFound;
            return;
        }

        Response.ContentType = "application/json";

        await using var writer = new Utf8JsonWriter(Response.Body);

        writer.WriteStartObject();
        writer.WriteString("id", product.Id);
        writer.WriteString("name", product.Name);
        writer.WriteString("sku", product.SKU);
        writer.WriteNumber("price", product.Price);
        writer.WriteBoolean("inStock", product.Quantity > 0);
        writer.WriteEndObject();

        await writer.FlushAsync(cancellationToken);
    }

    private static ProductDto ToDto(Product product)
    {
        return new ProductDto(
            product.Id,
            product.Name,
            product.Description,
            product.SKU,
            product.Price,
            product.Quantity,
            product.CategoryId,
            product.CreatedAt,
            product.UpdatedAt);
    }
}