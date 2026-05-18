using MuzoOnline.Api.Context;
using MuzoOnline.Api.Models;

namespace MuzoOnline.Api.Repository;

public sealed class ProductRepository : Repository<Product>
{
    public ProductRepository(MuzoDbContext dbContext)
        : base(dbContext)
    {
    }
}