export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Using NewsData.io free API - returns real articles with working URLs
    const apiKey = process.env.NEWSDATA_API_KEY;

    if (!apiKey) {
      throw new Error('NEWSDATA_API_KEY not configured');
    }

    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=en&category=business,technology&size=5`,
      {
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`NewsData API responded with ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.results?.length) {
      throw new Error('No articles found');
    }

    // Format articles with real URLs
    const articles = data.results.map(article => ({
      title: article.title,
      source: article.source_id || 'News',
      time: formatTimeAgo(article.pubDate),
      summary: article.description
        ? article.description.slice(0, 120) + '...'
        : 'Click to read full article.',
      url: article.link
    }));

    return res.status(200).json(articles);

  } catch (error) {
    console.error('News fetch error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

function formatTimeAgo(dateString) {
  if (!dateString) return 'Recently';
  const now = new Date();
  const published = new Date(dateString);
  const diffMs = now - published;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
