import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, Newspaper, Plus, X } from 'lucide-react';

const MarketTracker = () => {
  // Default watchlist
  const defaultWatchlist = [
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock' },
    { symbol: 'BTC-USD', name: 'Bitcoin', type: 'crypto' },
    { symbol: 'ETH-USD', name: 'Ethereum', type: 'crypto' },
    { symbol: 'SOL-USD', name: 'Solana', type: 'crypto' }
  ];

  const [watchlist, setWatchlist] = useState(defaultWatchlist);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('stock');

  // Fetch live prices
  const fetchPrices = async () => {
    setLoading(true);
    try {
      const priceData = await Promise.all(
        watchlist.map(async (asset) => {
          try {
            // Use our server-side proxy to avoid CORS issues
            const response = await fetch(`/api/proxy?symbol=${asset.symbol}`);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
              throw new Error('Invalid data structure');
            }
            
            const quote = data.chart.result[0];
            const meta = quote.meta;
            
            // Validate that we have the required data
            if (!meta.regularMarketPrice || !meta.chartPreviousClose) {
              throw new Error('Missing price data');
            }
            
            const currentPrice = meta.regularMarketPrice;
            const previousClose = meta.chartPreviousClose;
            const change = currentPrice - previousClose;
            const changePercent = (change / previousClose) * 100;

            return {
              ...asset,
              price: currentPrice,
              change: change,
              changePercent: changePercent,
              volume: meta.regularMarketVolume,
              marketCap: meta.marketCap,
              currency: meta.currency || 'USD',
              dataSource: 'live'
            };
          } catch (assetError) {
            console.warn(`Error fetching ${asset.symbol}:`, assetError.message);
            // Return null for failed assets
            return null;
          }
        })
      );
      
      // Filter out any null results from failed fetches
      const validData = priceData.filter(item => item !== null);
      
      if (validData.length > 0) {
        setAssets(validData);
        setLastUpdate(new Date());
      } else {
        throw new Error('No valid price data received');
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      // Use realistic demo data with a clear indicator
      // These are approximate prices as of Feb 2026
      const demoData = watchlist.map((asset) => {
        const demos = {
          'AAPL': { price: 225.50, change: 2.75, changePercent: 1.23 },
          'TSLA': { price: 195.80, change: -3.45, changePercent: -1.73 },
          'GOOGL': { price: 175.30, change: 1.20, changePercent: 0.69 },
          'MSFT': { price: 442.15, change: 5.80, changePercent: 1.33 },
          'NVDA': { price: 890.25, change: 12.40, changePercent: 1.41 },
          'BTC-USD': { price: 98750.00, change: -1250.50, changePercent: -1.25 },
          'ETH-USD': { price: 3685.40, change: 45.20, changePercent: 1.24 },
          'SOL-USD': { price: 195.75, change: -2.35, changePercent: -1.19 }
        };
        
        const demo = demos[asset.symbol] || { price: 100, change: 0, changePercent: 0 };
        
        return {
          ...asset,
          price: demo.price,
          change: demo.change,
          changePercent: demo.changePercent,
          volume: Math.floor(Math.random() * 50000000 + 10000000),
          marketCap: asset.type === 'crypto' ? null : Math.floor(Math.random() * 2000000000000 + 100000000000),
          currency: 'USD',
          dataSource: 'demo'
        };
      });
      
      setAssets(demoData);
      setLastUpdate(new Date());
    }
    setLoading(false);
  };

  // Fetch news for selected asset
  const fetchNews = async (asset) => {
    setNewsLoading(true);
    setSelectedAsset(asset);
    
    try {
      const searchQuery = asset.name.replace(' Inc.', '').replace(' Corp.', '');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            { 
              role: 'user', 
              content: `Search for the latest 5 news articles about ${searchQuery} (${asset.symbol}). Return ONLY a JSON array with this structure, no other text:
[{"title": "headline", "source": "source name", "time": "time ago", "summary": "brief summary"}]` 
            }
          ],
          tools: [
            {
              "type": "web_search_20250305",
              "name": "web_search"
            }
          ]
        })
      });

      const data = await response.json();
      const textContent = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('');
      
      // Extract JSON from response
      const jsonMatch = textContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const newsData = JSON.parse(jsonMatch[0]);
        setNews(newsData);
      } else {
        // Fallback mock news
        setNews([
          { title: `${asset.name} announces Q4 earnings beat expectations`, source: 'Financial Times', time: '2 hours ago', summary: 'Strong quarterly results drive investor confidence' },
          { title: `Analysts upgrade ${asset.name} stock rating`, source: 'Bloomberg', time: '5 hours ago', summary: 'Major financial institutions increase price targets' },
          { title: `${asset.name} expands market presence in Asia`, source: 'Reuters', time: '1 day ago', summary: 'Strategic partnerships announced in key markets' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback mock news
      setNews([
        { title: `${asset.name} reports strong market performance`, source: 'Financial Times', time: '2 hours ago', summary: 'Market analysts remain optimistic about growth prospects' },
        { title: `${asset.name} price analysis and forecast`, source: 'Bloomberg', time: '5 hours ago', summary: 'Technical indicators suggest continued momentum' },
        { title: `What investors need to know about ${asset.name}`, source: 'Reuters', time: '1 day ago', summary: 'Key factors driving recent price movements' }
      ]);
    }
    setNewsLoading(false);
  };

  useEffect(() => {
    fetchPrices();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const handleAddAsset = () => {
    if (!newSymbol.trim()) return;
    
    const symbolToAdd = newType === 'crypto' && !newSymbol.includes('-USD') 
      ? `${newSymbol.toUpperCase()}-USD` 
      : newSymbol.toUpperCase();
    
    // Check if already exists
    if (watchlist.some(asset => asset.symbol === symbolToAdd)) {
      alert('This asset is already in your watchlist!');
      return;
    }
    
    const newAsset = {
      symbol: symbolToAdd,
      name: newName.trim() || symbolToAdd,
      type: newType
    };
    
    setWatchlist([...watchlist, newAsset]);
    setNewSymbol('');
    setNewName('');
    setNewType('stock');
    setShowAddModal(false);
  };

  const handleRemoveAsset = (symbolToRemove) => {
    if (watchlist.length <= 1) {
      alert('You must have at least one asset in your watchlist!');
      return;
    }
    
    setWatchlist(watchlist.filter(asset => asset.symbol !== symbolToRemove));
    
    // Clear news if we're removing the selected asset
    if (selectedAsset?.symbol === symbolToRemove) {
      setSelectedAsset(null);
      setNews([]);
    }
  };

  const formatPrice = (price, type) => {
    if (type === 'crypto') {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return num?.toLocaleString() || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Market Tracker</h1>
              <p className="text-slate-400 text-sm">Live prices & news updates</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={fetchPrices}
              disabled={loading}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors text-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Asset
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-400 mb-6 flex items-center gap-3">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          {assets.length > 0 && (
            <span className={`px-2 py-1 rounded text-xs ${
              assets[0].dataSource === 'live' 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {assets[0].dataSource === 'live' ? '🟢 Live Data' : '⚠️ Demo Data (API unavailable)'}
            </span>
          )}
          <span>All prices in USD</span>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Price Cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {loading && assets.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-slate-400">
                Loading market data...
              </div>
            ) : (
              assets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="bg-slate-800 rounded-xl p-5 border border-slate-700 relative group"
                >
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAsset(asset.symbol);
                    }}
                    className="absolute top-3 right-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from watchlist"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div
                    onClick={() => fetchNews(asset)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{asset.symbol.replace('-USD', '')}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            asset.type === 'crypto' 
                              ? 'bg-purple-500/20 text-purple-300' 
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {asset.type === 'crypto' ? 'Crypto' : 'Stock'}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm">{asset.name}</p>
                      </div>
                      {asset.changePercent >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        {formatPrice(asset.price, asset.type)}
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${
                        asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span>{asset.changePercent >= 0 ? '+' : ''}{asset.change.toFixed(2)}</span>
                        <span>({asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700 text-xs">
                        <div>
                          <div className="text-slate-500">Volume</div>
                          <div className="text-slate-300">{formatNumber(asset.volume)}</div>
                        </div>
                        {asset.marketCap && (
                          <div>
                            <div className="text-slate-500">Market Cap</div>
                            <div className="text-slate-300">{formatNumber(asset.marketCap)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* News Feed */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold">Latest News</h2>
              </div>

              {!selectedAsset ? (
                <div className="text-center py-12 text-slate-400">
                  <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Click any asset to see related news</p>
                </div>
              ) : newsLoading ? (
                <div className="text-center py-12 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
                  <p>Loading news...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-slate-400 mb-4">
                    News for <span className="text-white font-semibold">{selectedAsset.name}</span>
                  </div>
                  {news.map((article, idx) => (
                    <div key={idx} className="pb-4 border-b border-slate-700 last:border-0">
                      <h3 className="font-semibold text-sm mb-1 leading-snug hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-400 mb-2">{article.summary}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span>{article.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Data updates every 60 seconds • Click any asset to view related news
        </div>

        {/* Add Asset Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add New Asset</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Asset Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNewType('stock')}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                        newType === 'stock'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      Stock
                    </button>
                    <button
                      onClick={() => setNewType('crypto')}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                        newType === 'crypto'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      Crypto
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Symbol {newType === 'crypto' && <span className="text-slate-500">(e.g., BTC, ETH, SOL)</span>}
                    {newType === 'stock' && <span className="text-slate-500">(e.g., AAPL, TSLA, MSFT)</span>}
                  </label>
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                    placeholder={newType === 'crypto' ? 'BTC' : 'AAPL'}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAsset()}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Name <span className="text-slate-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={newType === 'crypto' ? 'Bitcoin' : 'Apple Inc.'}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAsset()}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAsset}
                    disabled={!newSymbol.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Asset
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  💡 <strong>Popular stocks:</strong> AAPL, GOOGL, MSFT, AMZN, META, NFLX
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  💡 <strong>Popular crypto:</strong> BTC, ETH, SOL, ADA, DOGE, XRP
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketTracker;