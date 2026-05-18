namespace MuzoOnline.Api.DataTransferObjects;

public sealed record LoginRequest(string Email, string Password);

public sealed record AuthTokenResponse(string Token, DateTime ExpiresAt);
