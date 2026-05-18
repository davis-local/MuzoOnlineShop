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

        context.Response.OnStarting(state =>
        {
            var (httpContext, sw) = ((HttpContext, Stopwatch))state!;

            if (!httpContext.Response.HasStarted)
            {
                httpContext.Response.Headers["X-Request-Duration-ms"] =
                    sw.ElapsedMilliseconds.ToString();
            }

            return Task.CompletedTask;
        }, (context, stopwatch));

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            _logger.LogInformation(
                "Request {Method} {Path} completed in {Elapsed}ms",
                context.Request.Method,
                context.Request.Path,
                stopwatch.ElapsedMilliseconds);
        }
    }
}