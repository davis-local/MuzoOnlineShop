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

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var authorizationHeader = context.Request.Headers.Authorization.ToString().Trim();

                if (string.IsNullOrWhiteSpace(authorizationHeader))
                {
                    return Task.CompletedTask;
                }

                context.Token = authorizationHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                    ? authorizationHeader["Bearer ".Length..].Trim()
                    : authorizationHeader;

                return Task.CompletedTask;
            }
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
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.SecuritySchemeType.ApiKey,
        In = Microsoft.OpenApi.ParameterLocation.Header,
        Description = "Paste the JWT token here. 'Bearer ' is optional."
    });

    options.AddSecurityRequirement(_ => new Microsoft.OpenApi.OpenApiSecurityRequirement
    {
        [new Microsoft.OpenApi.OpenApiSecuritySchemeReference(
            "Bearer",
            new Microsoft.OpenApi.OpenApiDocument(),
            null)
        {
            Reference = new Microsoft.OpenApi.OpenApiReferenceWithDescription
            {
                Id = "Bearer",
                Type = Microsoft.OpenApi.ReferenceType.SecurityScheme
            }
        }] = []
    });
});

var app = builder.Build();

app.UseMiddleware<CustomRequestTimingMiddleware>();

app.UseCors("FrontEndEnv");

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.EnablePersistAuthorization();
    options.UseRequestInterceptor("function (request) { const authorized = window.ui?.authSelectors?.authorized?.(); const authEntries = authorized?.toJS ? Object.values(authorized.toJS()) : []; const authEntry = authEntries[0]; const tokenValue = authEntry?.value ?? authEntry; if (typeof tokenValue === 'string' && tokenValue.trim().length > 0) { request.headers = request.headers || {}; request.headers.Authorization = tokenValue.trim().startsWith('Bearer ') ? tokenValue.trim() : 'Bearer ' + tokenValue.trim(); } return request; }");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program
{
}
