using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MuzoOnline.Api.DataTransferObjects;
using MuzoOnline.Api.Service;

namespace MuzoOnline.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(
        AuthService authService,
        IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public ActionResult<AuthTokenResponse> Login([FromBody] LoginRequest request)
    {
        if (!_authService.ValidateCredentials(request.Email, request.Password))
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }

        var secret = _configuration["JwtSettings:Secret"] ?? "MuziOnlineJwtSecretKey1234567890ABCDEF1234567890";
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddHours(1);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, request.Email),
            new Claim(JwtRegisteredClaimNames.Email, request.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: expiresAt,
            signingCredentials: signingCredentials);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new AuthTokenResponse(tokenString, expiresAt));
    }
}
