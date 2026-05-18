using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
builder.Services.AddSingleton<AuthService>();

var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? "MuziOnlineJwtSecretKey1234567890ABCDEF1234567890";
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

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
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\""
    });

    options.OperationFilter<MuzoOnline.Api.Extensions.SwaggerAuthorizeCheckOperationFilter>();
});

var app = builder.Build();

app.UseMiddleware<CustomRequestTimingMiddleware>();

app.UseCors("FrontEndEnv");

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program
{
}