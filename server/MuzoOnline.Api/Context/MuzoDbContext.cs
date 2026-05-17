using Microsoft.EntityFrameworkCore;
using MuzoOnline.Api.Models;

namespace MuzoOnline.Api.Context;

public sealed class MuzoDbContext : DbContext
{
    public MuzoDbContext(DbContextOptions<MuzoDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
}