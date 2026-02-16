export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Yahoo Finance responded with ${response.status}`);
    }

    const data = await response.json();

    // Set CORS headers so the frontend can access this
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');

    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return res.status(500).json({ error: error.message });
  }
}
