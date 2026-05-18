namespace MuzoOnline.Api.DataTransferObjects;

public sealed record CategoryDto(
    Guid Id,
    string Name,
    string Description,
    Guid? ParentCategoryId
);

public sealed record CreateCategoryRequest(
    string Name,
    string Description,
    Guid? ParentCategoryId
);

public sealed record CategoryNodeDto(
    Guid Id,
    string Name,
    string Description,
    Guid? ParentCategoryId,
    List<CategoryNodeDto> Children
);