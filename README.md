# 📈 Market Tracker

A beautiful, real-time stock and cryptocurrency price tracker with integrated news feeds.

![Market Tracker](https://img.shields.io/badge/React-18.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Features

- 📊 **Live Price Tracking** - Real-time prices for stocks and cryptocurrencies
- 📈 **Price Changes** - View percentage gains/losses with color-coded indicators
- 📰 **News Feed** - AI-powered news aggregation for each asset
- ➕ **Customizable Watchlist** - Add/remove stocks and crypto easily
- 🔄 **Auto-Refresh** - Prices update every 60 seconds
- 💎 **Beautiful UI** - Modern, responsive design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm installed
- Git installed

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/market-tracker.git
   cd market-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📦 Deploy to Vercel (Recommended)

### Option 1: Deploy from GitHub

1. Push this code to your GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the settings
6. Click "Deploy"
7. Done! Your app is live 🎉

### Option 2: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts and your app will be deployed!

## 🌐 Deploy to Netlify

### Option 1: Drag & Drop

1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to Netlify
4. Done!

### Option 2: GitHub Integration

1. Push to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

## 📝 Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   "homepage": "https://YOUR-USERNAME.github.io/market-tracker",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Update `vite.config.js`:
   ```javascript
   base: '/market-tracker/'
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Yahoo Finance API** - Price data
- **Anthropic Claude API** - News aggregation

## 📖 Usage

1. **View Prices** - The app loads with popular stocks and crypto
2. **Add Assets** - Click "Add Asset" to add more stocks/crypto
3. **Remove Assets** - Hover over any card and click the X button
4. **View News** - Click any asset card to see related news
5. **Refresh** - Click "Refresh" or wait for auto-update

### Popular Symbols

**Stocks:** AAPL, GOOGL, MSFT, AMZN, META, TSLA, NVDA, NFLX  
**Crypto:** BTC, ETH, SOL, ADA, DOGE, XRP, MATIC, AVAX

## 🔧 Configuration

### Change Default Watchlist

Edit `src/App.jsx` and modify the `defaultWatchlist` array:

```javascript
const defaultWatchlist = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  // Add your favorites here
];
```

### Adjust Refresh Rate

Change the interval in `src/App.jsx`:

```javascript
// Default: 60000ms (60 seconds)
const interval = setInterval(fetchPrices, 60000);
```

## 🐛 Troubleshooting

**Prices showing "Demo Data":**
- Yahoo Finance API may be blocked
- Check browser console for errors
- Try refreshing the page

**News not loading:**
- Ensure you have internet connection
- Check browser console for API errors

## 📄 License

MIT License - feel free to use this project however you'd like!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 💡 Future Enhancements

- [ ] Price charts and historical data
- [ ] Portfolio tracking with holdings
- [ ] Price alerts and notifications
- [ ] Dark/light theme toggle
- [ ] Export watchlist data
- [ ] Mobile app version

---

Built with ❤️ using React and Claude AI
