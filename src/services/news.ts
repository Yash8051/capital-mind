// ============================================================
// CapitalMind AI — News Service
// NewsAPI.org integration with caching
// ============================================================

export interface RawNewsArticle {
  title: string;
  description: string | null;
  url: string;
  source: { name: string };
  publishedAt: string;
  urlToImage: string | null;
}

// Simple in-memory cache (1 hour TTL)
const newsCache = new Map<string, { data: RawNewsArticle[]; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Fetch recent news articles for a company from NewsAPI
 */
export async function fetchCompanyNews(
  companyName: string,
  ticker: string,
  maxArticles = 10
): Promise<RawNewsArticle[]> {
  const cacheKey = `${companyName}-${ticker}`.toLowerCase();
  const cached = newsCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn("NEWS_API_KEY not set — returning empty news array");
    return [];
  }

  try {
    // Search for company name and ticker
    const query = encodeURIComponent(`"${companyName}" OR "${ticker}"`);
    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=${maxArticles}&language=en&apiKey=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`NewsAPI error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    const articles: RawNewsArticle[] = (data.articles || [])
      .filter((a: RawNewsArticle) => a.title && a.title !== "[Removed]")
      .slice(0, maxArticles);

    // Cache the results
    newsCache.set(cacheKey, { data: articles, timestamp: Date.now() });

    return articles;
  } catch (error) {
    console.error("NewsAPI fetch error:", error);
    return [];
  }
}
