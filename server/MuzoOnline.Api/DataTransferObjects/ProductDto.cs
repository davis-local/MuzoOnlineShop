namespace MuzoOnline.Api.DataTransferObjects;

public sealed record ProductDto(
    Guid Id,
    string Name,
    string Description,
    string SKU,
    decimal Price,
    int Quantity,
    Guid CategoryId,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt
);

public sealed record CreateProductRequest(
    string Name,
    string Description,
    string SKU,
    decimal Price,
    int Quantity,
    Guid CategoryId
);

public sealed record UpdateProductRequest(
    string Name,
    string Description,
    string SKU,
    decimal Price,
    int Quantity,
    Guid CategoryId
);

public sealed record ProductQuery(
    int Page = 1,
    int PageSize = 10,
    string? Search = null,
    Guid? CategoryId = null
);