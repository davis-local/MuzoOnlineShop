using Microsoft.EntityFrameworkCore;
using MuzoOnline.Api.Context;
using MuzoOnline.Api.Middleware;
using MuzoOnline.Api.Models;
using MuzoOnline.Api.Repository;
using MuzoOnline.Api.Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<MuzoDbContext>(options =>
{
    options.UseInMemoryDatabase("MuzoOnlineDbProd");
});

builder.Services.AddScoped<IRepository<Product>, ProductRepository>();
builder.Services.AddSingleton<IRepository<Category>, InMemoryCategoryRepository>();

builder.Services.AddSingleton<ProductSearchEngine<Product>>(_ =>
    new ProductSearchEngine<Product>(new[]
    {
        new SearchField<Product> { Selector = product => product.Name, Weight = 5 },
        new SearchField<Product> { Selector = product => product.SKU, Weight = 4 },
        new SearchField<Product> { Selector = product => product.Description, Weight = 2 }
    }));

builder.Services.AddSingleton<ProductSearchCache>();
builder.Services.AddScoped<CategoryTreeTool>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontEndEnv", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<CustomRequestTimingMiddleware>();

app.UseCors("FrontEndEnv");

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();

public partial class Program
{
}