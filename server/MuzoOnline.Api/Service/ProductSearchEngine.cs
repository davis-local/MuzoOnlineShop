namespace MuzoOnline.Api.Service;

public sealed class SearchField<T>
{
    public required Func<T, string?> Selector { get; init; }

    public required int Weight { get; init; }
}

public sealed record SearchResult<T>(T Item, int Score);

public sealed class ProductSearchEngine<T>
{
    private const int ExactFieldMatchScore = 160;
    private const int PrefixFieldMatchScore = 120;
    private const int ContainsFieldMatchScore = 90;
    private const int ExactTokenMatchScore = 130;
    private const int PrefixTokenMatchScore = 95;
    private const int ContainsTokenMatchScore = 70;
    private readonly SearchField<T>[] _fields;

    public ProductSearchEngine(IEnumerable<SearchField<T>> fields)
    {
        ArgumentNullException.ThrowIfNull(fields);

        _fields = fields
            .Where(field => field.Weight > 0)
            .ToArray();
    }

    public IReadOnlyList<SearchResult<T>> Search(IEnumerable<T> items, string query)
    {
        ArgumentNullException.ThrowIfNull(items);

        if (string.IsNullOrWhiteSpace(query))
        {
            return items
                .Select(item => new SearchResult<T>(item, 0))
                .ToList();
        }

        var normalizedQuery = Normalize(query);
        var queryTokens = Tokenize(normalizedQuery);

        if (queryTokens.Length == 0)
        {
            return [];
        }

        return items
            .Select(item => new SearchResult<T>(
                item,
                ScoreItem(item, normalizedQuery, queryTokens)))
            .Where(result => result.Score > 0)
            .OrderByDescending(result => result.Score)
            .ToList();
    }

    private int ScoreItem(T item, string normalizedQuery, string[] queryTokens)
    {
        var phraseScore = 0;
        var bestTokenScores = new int[queryTokens.Length];

        foreach (var field in _fields)
        {
            var normalizedValue = Normalize(field.Selector(item));

            if (normalizedValue.Length == 0)
            {
                continue;
            }

            var tokens = Tokenize(normalizedValue);

            phraseScore += ScoreFieldPhrase(normalizedValue, normalizedQuery) * field.Weight;

            for (var queryTokenIndex = 0; queryTokenIndex < queryTokens.Length; queryTokenIndex++)
            {
                var tokenScore = ScoreTokenAgainstField(queryTokens[queryTokenIndex], tokens);

                if (tokenScore == 0)
                {
                    continue;
                }

                var weightedTokenScore = tokenScore * field.Weight;

                if (weightedTokenScore > bestTokenScores[queryTokenIndex])
                {
                    bestTokenScores[queryTokenIndex] = weightedTokenScore;
                }
            }
        }

        var matchedTokens = 0;
        var totalTokenScore = 0;

        foreach (var bestTokenScore in bestTokenScores)
        {
            if (bestTokenScore <= 0)
            {
                continue;
            }

            matchedTokens++;
            totalTokenScore += bestTokenScore;
        }

        if (matchedTokens == 0 && phraseScore == 0)
        {
            return 0;
        }

        var coverageRatio = (double)matchedTokens / queryTokens.Length;
        var coverageBonus = (int)Math.Round(coverageRatio * 120);
        var totalScore = phraseScore + totalTokenScore + coverageBonus;

        if (matchedTokens < queryTokens.Length)
        {
            totalScore = (int)Math.Round(totalScore * (0.45 + (coverageRatio * 0.55)));
        }

        return totalScore;
    }

    private static int ScoreFieldPhrase(string normalizedValue, string normalizedQuery)
    {
        if (normalizedValue.Equals(normalizedQuery, StringComparison.Ordinal))
        {
            return ExactFieldMatchScore;
        }

        if (normalizedValue.StartsWith(normalizedQuery, StringComparison.Ordinal))
        {
            return PrefixFieldMatchScore;
        }

        return normalizedValue.Contains(normalizedQuery, StringComparison.Ordinal)
            ? ContainsFieldMatchScore
            : 0;
    }

    private static int ScoreTokenAgainstField(string queryToken, IReadOnlyList<string> fieldTokens)
    {
        var bestScore = 0;

        foreach (var fieldToken in fieldTokens)
        {
            var score = ScoreTokenMatch(fieldToken, queryToken);

            if (score > bestScore)
            {
                bestScore = score;
            }
        }

        return bestScore;
    }

    private static int ScoreTokenMatch(string candidateToken, string queryToken)
    {
        if (candidateToken.Equals(queryToken, StringComparison.Ordinal))
        {
            return ExactTokenMatchScore;
        }

        if (candidateToken.StartsWith(queryToken, StringComparison.Ordinal))
        {
            return PrefixTokenMatchScore;
        }

        if (candidateToken.Contains(queryToken, StringComparison.Ordinal))
        {
            return ContainsTokenMatchScore;
        }

        return TryGetFuzzyScore(candidateToken, queryToken, out var fuzzyScore)
            ? fuzzyScore
            : 0;
    }

    private static bool TryGetFuzzyScore(
        string candidateToken,
        string queryToken,
        out int fuzzyScore)
    {
        fuzzyScore = 0;

        if (candidateToken.Length < 3 || queryToken.Length < 3)
        {
            return false;
        }

        var maxLength = Math.Max(candidateToken.Length, queryToken.Length);
        var maxDistance = GetMaxDistance(maxLength);

        if (Math.Abs(candidateToken.Length - queryToken.Length) > maxDistance)
        {
            return false;
        }

        var distance = ComputeOptimalStringAlignmentDistance(
            candidateToken,
            queryToken,
            maxDistance);

        if (distance > maxDistance)
        {
            return false;
        }

        var similarity = 1.0 - (double)distance / maxLength;

        if (similarity < GetMinimumSimilarity(maxLength))
        {
            return false;
        }

        fuzzyScore = (int)Math.Round((similarity * 80) + 20);
        return true;
    }

    private static int GetMaxDistance(int length)
    {
        return length switch
        {
            <= 4 => 1,
            <= 8 => 2,
            _ => 3
        };
    }

    private static double GetMinimumSimilarity(int length)
    {
        return length switch
        {
            <= 4 => 0.85,
            <= 8 => 0.72,
            _ => 0.68
        };
    }

    private static int ComputeOptimalStringAlignmentDistance(
        string source,
        string target,
        int maxDistance)
    {
        var targetLength = target.Length;
        var previousPreviousRow = new int[targetLength + 1];
        var previousRow = new int[targetLength + 1];
        var currentRow = new int[targetLength + 1];

        for (var column = 0; column <= targetLength; column++)
        {
            previousRow[column] = column;
        }

        for (var row = 1; row <= source.Length; row++)
        {
            currentRow[0] = row;
            var minimumInRow = currentRow[0];

            for (var column = 1; column <= targetLength; column++)
            {
                var substitutionCost = source[row - 1] == target[column - 1] ? 0 : 1;
                var deletion = previousRow[column] + 1;
                var insertion = currentRow[column - 1] + 1;
                var substitution = previousRow[column - 1] + substitutionCost;
                var best = Math.Min(Math.Min(deletion, insertion), substitution);

                if (row > 1 &&
                    column > 1 &&
                    source[row - 1] == target[column - 2] &&
                    source[row - 2] == target[column - 1])
                {
                    best = Math.Min(best, previousPreviousRow[column - 2] + 1);
                }

                currentRow[column] = best;

                if (best < minimumInRow)
                {
                    minimumInRow = best;
                }
            }

            if (minimumInRow > maxDistance)
            {
                return maxDistance + 1;
            }

            (previousPreviousRow, previousRow, currentRow) = (previousRow, currentRow, previousPreviousRow);
        }

        return previousRow[targetLength];
    }

    private static string Normalize(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var buffer = new char[value.Length];
        var index = 0;
        var previousWasSeparator = true;

        foreach (var character in value)
        {
            if (char.IsLetterOrDigit(character))
            {
                buffer[index++] = char.ToLowerInvariant(character);
                previousWasSeparator = false;
                continue;
            }

            if (previousWasSeparator)
            {
                continue;
            }

            buffer[index++] = ' ';
            previousWasSeparator = true;
        }

        if (index == 0)
        {
            return string.Empty;
        }

        if (buffer[index - 1] == ' ')
        {
            index--;
        }

        return new string(buffer, 0, index);
    }

    private static string[] Tokenize(string normalizedValue)
    {
        return normalizedValue.Length == 0
            ? []
            : normalizedValue.Split(' ', StringSplitOptions.RemoveEmptyEntries);
    }
}
