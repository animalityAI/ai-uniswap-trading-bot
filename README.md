# 🤖 AI-Powered Uniswap Trading Bot

An intelligent, adaptive trading bot for Uniswap that learns from market patterns and improves over time using advanced technical analysis and memory-based decision making.

## 🌟 Features

### 🧠 **Adaptive Learning System**
- **Multi-timeframe Memory**: Stores and analyzes data across immediate (24h), short-term (1 week), medium-term (1 month), and long-term (1 year) horizons
- **Self-improving AI**: Adjusts confidence and learning parameters based on trading performance
- **Market Regime Detection**: Automatically identifies bull, bear, sideways, and volatile market conditions

### 📊 **Advanced Technical Analysis**
- **Multiple Indicators**: MACD, RSI, Bollinger Bands, Stochastic Oscillator, Moving Averages
- **Smart Signal Generation**: Combines multiple indicators with weighted scoring
- **Memory-based Signals**: Uses historical performance to enhance decision making

### ⚡ **Smart Trading Features**
- **Dynamic Position Sizing**: Kelly Criterion-inspired sizing based on confidence and risk
- **Adaptive Risk Management**: Adjusts strategy based on market volatility and historical performance
- **Gas Optimization**: Intelligent gas estimation and transaction management

### 📈 **Performance Tracking**
- **Comprehensive Metrics**: Win rate, total return, best/worst trades, average return
- **Real-time Adaptation**: System confidence adjusts based on prediction accuracy
- **Persistent Memory**: Saves learning progress and resumes from where it left off

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- An Ethereum wallet with some ETH for gas fees
- Infura or Alchemy API key
- Basic understanding of DeFi and trading risks

### Installation

```bash
# Clone the repository
git clone https://github.com/animalityAI/ai-uniswap-trading-bot.git
cd ai-uniswap-trading-bot

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your credentials
```

### Configuration

1. **Set up your environment variables** in `.env`:
```env
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here
MIN_PROFIT_THRESHOLD=0.015
MAX_SLIPPAGE=0.005
MAX_TRADE_AMOUNT=0.1
```

2. **Configure token pairs** in `config.js`:
```javascript
const config = {
    tokenPairs: [
        {
            pair: 'ETH/USDC',
            token0: { symbol: 'WETH', address: '0xC02a...' },
            token1: { symbol: 'USDC', address: '0xA0b8...' },
            coingeckoId: 'ethereum'
        }
    ]
};
```

### Running the Bot

```bash
# Start the bot
npm start

# Or run directly
node index.js
```

## 📋 How It Works

### 1. **Data Collection**
- Fetches historical price data from CoinGecko
- Calculates technical indicators (MACD, RSI, Bollinger Bands, etc.)
- Stores market patterns in memory system

### 2. **Signal Generation**
- Combines technical indicators with weighted scoring
- Uses memory-based signals from historical performance
- Generates BUY/SELL/HOLD signals with confidence scores

### 3. **Risk Management**
- Dynamic position sizing based on Kelly Criterion
- Confidence-based trade execution (minimum 65% confidence)
- Adaptive parameters that improve with experience

### 4. **Trade Execution**
- Smart gas estimation and optimization
- Slippage protection
- Comprehensive error handling and retry logic

### 5. **Learning & Adaptation**
- Adjusts system confidence based on prediction accuracy
- Learns from successful and failed trades
- Adapts to changing market conditions

## ⚠️ Risk Warnings

- **Educational Purpose**: This bot is for learning and experimentation
- **Financial Risk**: Cryptocurrency trading involves significant risk of loss
- **No Guarantees**: Past performance doesn't guarantee future results
- **Test First**: Always test on testnets before using real funds
- **Monitor Activity**: Regularly check bot performance and adjust as needed

## 📞 Support

- Create an issue for bug reports
- Check the wiki for detailed documentation

---

**⚠️ Disclaimer**: This software is for educational purposes. Cryptocurrency trading involves risk. Never invest more than you can afford to lose.