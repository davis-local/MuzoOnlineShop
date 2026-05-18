using MuzoOnline.Api.Models;

namespace MuzoOnline.Api.Service;

public sealed class AuthService
{
    private readonly User _user = new()
    {
        Email = "davis@test.com",
        Password = "davis@test"
    };

    public User GetUser() => _user;

    public bool ValidateCredentials(string? email, string? password)
    {
        return string.Equals(email?.Trim(), _user.Email, StringComparison.OrdinalIgnoreCase)
               && string.Equals(password, _user.Password, StringComparison.Ordinal);
    }
}
