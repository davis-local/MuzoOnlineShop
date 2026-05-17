namespace MuzoOnline.Api.Models;

public sealed class Product : IComparable<Product>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public Guid CategoryId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public int CompareTo(Product? other)
    {
        if (other is null) {
            return 1;
        }

        int compareIndex = string.Compare(Name, other.Name, StringComparison.OrdinalIgnoreCase);

        return compareIndex != 0
            ? compareIndex
            : Price.CompareTo(other.Price);
    }
}