using MuzoOnline.Api.DataTransferObjects;

namespace MuzoOnline.Api.Extensions;

public static class ProductRequestValidator
{
    public static string? Validate(CreateProductRequest request)
    {
        return request switch
        {
            { Name: null or "" } => "Product name is required.",
            { SKU: null or "" } => "SKU is required.",
            { Price: <= 0 } => "Price must be greater than zero or positive.",
            { Quantity: < 0 } => "Quantity cannot be negative.",
            { CategoryId: var id } when id == Guid.Empty => "Category is required.",
            _ => null
        };
    }

    public static string? Validate(UpdateProductRequest request)
    {
        return request switch
        {
            { Name: null or "" } => "Product name is required.",
            { SKU: null or "" } => "SKU is required.",
            { Price: <= 0 } => "Price must be greater than zero or positive.",
            { Quantity: < 0 } => "Quantity cannot be negative.",
            { CategoryId: var id } when id == Guid.Empty => "Category is required.",
            _ => null
        };
    }
}