using System.Diagnostics;

namespace MuzoOnline.Api.Middleware;

public sealed class CustomRequestTimingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CustomRequestTimingMiddleware> _logger;

    public CustomRequestTimingMiddleware(
        RequestDelegate next,
        ILogger<CustomRequestTimingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        await _next(context);

        stopwatch.Stop();

        context.Response.Headers["X-Request-Duration-ms"] =
            stopwatch.ElapsedMilliseconds.ToString();

        _logger.LogInformation(
            "Request {Method} {Path} completed in {Elapsed}ms",
            context.Request.Method,
            context.Request.Path,
            stopwatch.ElapsedMilliseconds);
    }
}