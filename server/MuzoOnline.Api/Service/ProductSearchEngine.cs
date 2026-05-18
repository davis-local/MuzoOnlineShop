namespace MuzoOnline.Api.Service;

public sealed class SearchField<T>
{
    public required Func<T, string?> Selector { get; init; }

    public required int Weight { get; init; }
}

public sealed record SearchResult<T>(T Item, int Score);

public sealed class ProductSearchEngine<T>
{
    private readonly List<SearchField<T>> _fields;

    public ProductSearchEngine(IEnumerable<SearchField<T>> fields)
    {
        _fields = fields.ToList();
    }

    public IReadOnlyList<SearchResult<T>> Search(IEnumerable<T> items, string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return items
                .Select(item => new SearchResult<T>(item, 0))
                .ToList();
        }

        var normalizedQuery = Normalize(query);

        return items
            .Select(item => new SearchResult<T>(item, ScoreItem(item, normalizedQuery)))
            .Where(result => result.Score > 0)
            .OrderByDescending(result => result.Score)
            .ToList();
    }

    private int ScoreItem(T item, string query)
    {
        var totalScore = 0;

        foreach (var field in _fields)
        {
            var value = Normalize(field.Selector(item));

            if (string.IsNullOrWhiteSpace(value))
            {
                continue;
            }

            if (value == query)
            {
                totalScore += 100 * field.Weight;
            }
            else if (value.Contains(query, StringComparison.OrdinalIgnoreCase))
            {
                totalScore += 60 * field.Weight;
            }
            else
            {
                var distance = LevenshteinDistance(value, query);
                var maxLength = Math.Max(value.Length, query.Length);

                if (maxLength == 0)
                {
                    continue;
                }

                var similarity = 1.0 - (double)distance / maxLength;

                if (similarity >= 0.65)
                {
                    totalScore += (int)(similarity * 40 * field.Weight);
                }
            }
        }

        return totalScore;
    }

    private static string Normalize(string? value)
    {
        return value?.Trim().ToLowerInvariant() ?? string.Empty;
    }

    private static int LevenshteinDistance(string source, string target)
    {
        var distances = new int[source.Length + 1, target.Length + 1];

        for (var i = 0; i <= source.Length; i++)
        {
            distances[i, 0] = i;
        }

        for (var j = 0; j <= target.Length; j++)
        {
            distances[0, j] = j;
        }

        for (var i = 1; i <= source.Length; i++)
        {
            for (var j = 1; j <= target.Length; j++)
            {
                var cost = source[i - 1] == target[j - 1] ? 0 : 1;

                distances[i, j] = Math.Min(
                    Math.Min(
                        distances[i - 1, j] + 1,
                        distances[i, j - 1] + 1),
                    distances[i - 1, j - 1] + cost);
            }
        }

        return distances[source.Length, target.Length];
    }
}