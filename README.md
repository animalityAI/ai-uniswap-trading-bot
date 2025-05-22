# 🤖 AI-Powered Uniswap Trading Bot

An intelligent, adaptive trading bot for Uniswap that learns from market patterns and improves over time using advanced technical analysis and memory-based decision making.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

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

## 🚀 Complete Setup Guide

### Step 1: Prerequisites

Before starting, ensure you have:

#### Required Software
- **Node.js v16 or higher** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

#### Required Accounts & Keys
- **Ethereum wallet** with some ETH for gas fees (minimum 0.1 ETH recommended)
- **Infura account** for Ethereum RPC access - [Sign up here](https://infura.io/)
- **CoinGecko API key** (optional, for higher rate limits) - [Get here](https://www.coingecko.com/en/api)

### Step 2: Installation

#### 2.1 Clone the Repository
```bash
# Clone the repository
git clone https://github.com/animalityAI/ai-uniswap-trading-bot.git

# Navigate to the project directory
cd ai-uniswap-trading-bot

# Verify you're in the right directory
ls -la
# You should see: README.md, package.json, src/, etc.
```

#### 2.2 Install Dependencies
```bash
# Install all required packages
npm install

# Verify installation
npm list --depth=0
# You should see: ethers, axios, dotenv, etc.
```

### Step 3: Configuration

#### 3.1 Create Environment File
```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file (use your preferred editor)
nano .env
# or
code .env
```

#### 3.2 Configure Your Environment Variables

Open `.env` and fill in your details:

```env
# 🌐 ETHEREUM RPC CONFIGURATION
RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
# Alternative: https://eth-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_KEY

# 🔐 WALLET CONFIGURATION (⚠️ KEEP SECURE!)
PRIVATE_KEY=your_private_key_here_without_0x_prefix

# 💰 TRADING PARAMETERS
MIN_PROFIT_THRESHOLD=0.015  # 1.5% minimum expected profit
MAX_SLIPPAGE=0.005          # 0.5% maximum slippage tolerance
MAX_TRADE_AMOUNT=0.1        # Maximum amount per trade (in ETH)

# 🤖 BOT CONFIGURATION
CYCLE_INTERVAL=300000       # 5 minutes between analysis cycles (ms)
CONFIDENCE_THRESHOLD=0.65   # Minimum confidence for trade execution
LEARNING_RATE=0.01         # AI learning rate

# 📊 API CONFIGURATION
COINGECKO_API_KEY=your_coingecko_api_key_here  # Optional: for higher rate limits

# 🛡️ RISK MANAGEMENT
STOP_LOSS_PERCENTAGE=0.05   # 5% stop loss
TAKE_PROFIT_PERCENTAGE=0.1  # 10% take profit
MAX_DAILY_TRADES=20         # Maximum trades per day

# 🔍 LOGGING
LOG_LEVEL=info              # debug, info, warn, error
SAVE_MEMORY_INTERVAL=5      # Save bot memory every N cycles

# 🧪 TESTING (for development)
USE_TESTNET=false           # Set to true for testing on testnets
TESTNET_RPC_URL=https://goerli.infura.io/v3/YOUR_PROJECT_ID
```

#### 3.3 How to Get Required Keys

**🔗 Infura Project ID:**
1. Go to [infura.io](https://infura.io/) and create account
2. Create new project → Choose "Ethereum"
3. Copy the Project ID from your dashboard
4. Replace `YOUR_INFURA_PROJECT_ID` with your actual project ID

**🔑 Private Key:**
1. Open MetaMask or your wallet
2. Go to Account Details → Export Private Key
3. Copy the private key (without the 0x prefix)
4. ⚠️ **NEVER share this key or commit it to version control!**

**📊 CoinGecko API Key (Optional):**
1. Go to [coingecko.com/en/api](https://www.coingecko.com/en/api)
2. Sign up for free account
3. Get your API key from dashboard
4. This increases rate limits but is optional

### Step 4: First Time Setup

#### 4.1 Verify Configuration
```bash
# Check if your configuration is valid
node -e "require('dotenv').config(); console.log('RPC URL:', process.env.RPC_URL?.substring(0, 30) + '...'); console.log('Private Key:', process.env.PRIVATE_KEY ? '✅ Set' : '❌ Missing');"
```

#### 4.2 Test Connection
```bash
# Test your Ethereum connection
node -e "
const { ethers } = require('ethers');
require('dotenv').config();
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
provider.getBlockNumber().then(block => console.log('✅ Connected! Latest block:', block)).catch(err => console.error('❌ Connection failed:', err.message));
"
```

### Step 5: Running the Bot

#### 5.1 Start on Testnet (Recommended First)
```bash
# Edit .env and set USE_TESTNET=true
# Then start the bot
npm start
```

#### 5.2 Start on Mainnet (After Testing)
```bash
# Edit .env and set USE_TESTNET=false
# Make sure you have ETH for gas fees
npm start
```

#### 5.3 What You'll See
When the bot starts successfully, you should see:
```
🤖 AI-Powered Uniswap Trading Bot
==================================
🔧 Initializing trading bot...
📚 Data loaded successfully
🧠 Bot Confidence: 50.0%
📈 Total Trades: 0
🎯 Win Rate: 0.0%

⚙️  Configuration:
   Trading Pairs: ETH/USDC, UNI/ETH
   Min Profit: 1.5%
   Max Slippage: 0.50%
   Max Trade: 0.1 ETH
   Cycle Interval: 300s

🚀 Start trading? (yes/no):
```

## 📊 Understanding the Bot Output

### Typical Analysis Cycle
```
🔄 Analysis Cycle #1
🧠 System Confidence: 50.0%

📊 Analyzing ETH/USDC...
💰 Price: $2,645.23
📈 Signal: BUY (72.5%)
🎯 Expected Return: 2.3%
📊 RSI: 42.1
⚡ Volatility: 18.5%

🚀 Executing BUY: 0.08 ETH
   Expected Return: 2.30%
   Confidence: 72.5%
✅ Transaction submitted: 0x1234...
✅ Trade executed in block 18756432
🧠 Adapted: Confidence=52.1%
```

### Performance Reports
```
📊 PERFORMANCE REPORT
========================================
Total Trades: 45
Profitable Trades: 28
Win Rate: 62.2%
Total Return: 8.45%
Average Return: 0.19%
Best Trade: 4.2%
Worst Trade: -1.8%
Bot Confidence: 68.3%
```

## 🛠️ Customization

### Adjusting Trading Parameters

**Conservative Settings (Lower Risk):**
```env
MIN_PROFIT_THRESHOLD=0.025  # 2.5%
MAX_TRADE_AMOUNT=0.05       # 0.05 ETH max
CONFIDENCE_THRESHOLD=0.75   # 75% confidence required
```

**Aggressive Settings (Higher Risk):**
```env
MIN_PROFIT_THRESHOLD=0.01   # 1.0%
MAX_TRADE_AMOUNT=0.2        # 0.2 ETH max
CONFIDENCE_THRESHOLD=0.60   # 60% confidence required
```

### Adding New Trading Pairs

Edit `index.js` and add to the `tokenPairs` array:
```javascript
{
    pair: 'LINK/ETH',
    token0: {
        symbol: 'LINK',
        address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        decimals: 18
    },
    token1: {
        symbol: 'WETH',
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        decimals: 18
    },
    coingeckoId: 'chainlink',
    feeRate: 3000
}
```

## 🚨 Troubleshooting

### Common Issues and Solutions

**❌ "RPC_URL not configured properly"**
- Check your Infura project ID is correct
- Ensure no extra spaces in `.env` file
- Verify the URL format: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`

**❌ "PRIVATE_KEY not set"**
- Ensure private key is in `.env` file
- Remove any `0x` prefix from the private key
- Check for extra spaces or characters

**❌ "Insufficient data"**
- CoinGecko API might be rate limited
- Wait a few minutes and try again
- Consider adding CoinGecko API key

**❌ "Trade failed: insufficient funds"**
- Ensure wallet has enough ETH for gas fees
- Reduce `MAX_TRADE_AMOUNT` in `.env`
- Check current gas prices on etherscan.io

**❌ Bot stops unexpectedly**
- Check the console for error messages
- Verify internet connection is stable
- Ensure Infura API key hasn't expired

### Getting Help

1. **Check the Issues**: [GitHub Issues](https://github.com/animalityAI/ai-uniswap-trading-bot/issues)
2. **Create New Issue**: Include error messages, configuration (without private keys), and steps to reproduce
3. **Join Community**: Follow updates and discussions

## 📋 How It Works

### 1. **Data Collection**
- Fetches historical price data from CoinGecko API
- Calculates technical indicators (MACD, RSI, Bollinger Bands, etc.)
- Stores market patterns in intelligent memory system

### 2. **AI Analysis**
- Combines technical indicators with weighted scoring
- Uses memory-based signals from historical performance
- Detects market regimes (bull, bear, sideways, volatile)

### 3. **Signal Generation**
- Generates BUY/SELL/HOLD signals with confidence scores
- Requires minimum 65% confidence for trade execution
- Adapts thresholds based on market conditions

### 4. **Risk Management**
- Dynamic position sizing using Kelly Criterion
- Stop-loss and take-profit mechanisms
- Maximum daily trade limits

### 5. **Trade Execution**
- Smart gas estimation and optimization
- Slippage protection (default 0.5%)
- Comprehensive error handling and retry logic

### 6. **Learning & Adaptation**
- Adjusts system confidence based on prediction accuracy
- Learns from successful and failed trades
- Saves progress and resumes from memory

## ⚠️ Important Safety Guidelines

### 🔴 **Critical Warnings**
- **Educational Purpose**: This bot is for learning and experimentation
- **Financial Risk**: Cryptocurrency trading involves significant risk of loss
- **No Guarantees**: Past performance doesn't guarantee future results
- **Test First**: Always test on testnets before using real funds
- **Monitor Activity**: Regularly check bot performance and adjust as needed

### 🟡 **Best Practices**
- **Start Small**: Use tiny amounts (0.01-0.05 ETH) initially
- **Monitor Closely**: Check every few hours, especially first 24 hours
- **Set Limits**: Never risk more than 5% of your total portfolio
- **Have Exit Plan**: Be prepared to stop the bot manually
- **Backup Data**: Regularly save your `bot_data.json` file
- **Stay Updated**: Keep the bot software updated

### 🟢 **Recommended Approach**
1. **Week 1**: Test on testnet with fake ETH
2. **Week 2**: Run on mainnet with 0.01 ETH max
3. **Week 3**: Increase to 0.05 ETH if performance is good
4. **Week 4+**: Gradually increase based on confidence and results

## 📊 Performance Expectations

### Realistic Expectations
- **Win Rate**: 55-70% (varies by market conditions)
- **Average Trade**: 0.5-2.5% profit when successful
- **Monthly Return**: 5-15% (highly variable)
- **Learning Period**: 50-100 trades to see stable patterns

### Factors Affecting Performance
- **Market Volatility**: Higher volatility = more opportunities but higher risk
- **Gas Costs**: High gas fees can eat into small profits
- **Market Trends**: Strong trends easier to predict than choppy markets
- **Bot Confidence**: Higher confidence = better trade selection

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Add features, fix bugs, improve documentation
4. **Test thoroughly**: Ensure your changes work on testnet
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes and why they're useful

### Areas Where We Need Help
- 📚 **Documentation**: Setup guides, trading strategies, tutorials
- 🐛 **Bug Fixes**: Error handling, edge cases, performance improvements
- ⚡ **Features**: New indicators, better UI, mobile app
- 🧪 **Testing**: More test cases, integration tests, stress testing
- 🌍 **Translations**: README in other languages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Uniswap Protocol** for decentralized trading infrastructure
- **CoinGecko** for reliable price data APIs
- **Ethereum Ecosystem** for making DeFi possible
- **Open Source Community** for the amazing tools and libraries

## 📞 Support & Community

### Get Help
- 🐛 **Bug Reports**: [Create an issue](https://github.com/animalityAI/ai-uniswap-trading-bot/issues/new)
- 💡 **Feature Requests**: [Create an issue](https://github.com/animalityAI/ai-uniswap-trading-bot/issues/new)
- 📚 **Documentation**: Check the [Wiki](https://github.com/animalityAI/ai-uniswap-trading-bot/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/animalityAI/ai-uniswap-trading-bot/discussions)

### Stay Updated
- ⭐ **Star this repo** to get notified of updates
- 👀 **Watch releases** for new versions
- 🐦 **Follow us** for announcements and tips

---

**⚠️ Disclaimer**: This software is for educational purposes only. Cryptocurrency trading involves substantial risk of loss. Never invest more than you can afford to lose. The authors are not responsible for any financial losses incurred through the use of this software.