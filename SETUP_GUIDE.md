# 🚀 Complete Setup Guide

This guide will walk you through setting up the AI Trading Bot step-by-step, even if you're new to coding.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [First Run](#first-run)
5. [Understanding Output](#understanding-output)
6. [Troubleshooting](#troubleshooting)
7. [Safety Guidelines](#safety-guidelines)

## Prerequisites

### What You Need Before Starting

#### 💻 Software Requirements
- **Computer**: Windows, Mac, or Linux
- **Node.js v16+**: Download from [nodejs.org](https://nodejs.org/)
- **Git**: Download from [git-scm.com](https://git-scm.com/)
- **Text Editor**: VS Code recommended ([code.visualstudio.com](https://code.visualstudio.com/))

#### 🔑 Accounts & Keys Required
- **Ethereum Wallet**: MetaMask or similar with private key access
- **ETH Balance**: Minimum 0.1 ETH for gas fees and trading
- **Infura Account**: Free RPC provider ([infura.io](https://infura.io/))
- **CoinGecko API** (optional): For higher rate limits ([coingecko.com/api](https://www.coingecko.com/en/api))

### ⚠️ Important Security Note
Your private key controls your funds. NEVER share it or commit it to version control!

## Installation

### Step 1: Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS version for your operating system
3. Run the installer with default settings
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Git
1. Go to [git-scm.com](https://git-scm.com/)
2. Download for your operating system
3. Install with default settings
4. Verify installation:
   ```bash
   git --version
   ```

### Step 3: Clone the Repository
```bash
# Clone the repository
git clone https://github.com/animalityAI/ai-uniswap-trading-bot.git
cd ai-uniswap-trading-bot

# Install dependencies
npm install
```

## Configuration

### Step 1: Get Your Infura Project ID
1. Sign up at [infura.io](https://infura.io/)
2. Create new project → Choose "Web3 API"
3. Copy your Project ID from dashboard

### Step 2: Get Your Private Key
**From MetaMask:**
1. Open MetaMask → Account Details → Export Private Key
2. Enter password and copy key (WITHOUT 0x prefix)
⚠️ **NEVER share this key with anyone!**

### Step 3: Create Environment File
```bash
cp .env.example .env
```

### Step 4: Configure Settings
Edit `.env` with your details:

```env
# Replace with your actual values
RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_without_0x_prefix

# Conservative settings for beginners
MIN_PROFIT_THRESHOLD=0.02   # 2% minimum profit
MAX_TRADE_AMOUNT=0.05       # 0.05 ETH max per trade
CONFIDENCE_THRESHOLD=0.70   # 70% confidence required
```

## First Run

### Start the Bot
```bash
npm start
```

### Expected Output
```
🤖 AI-Powered Uniswap Trading Bot
==================================
🔧 Initializing trading bot...
📚 Data loaded successfully
🧠 Bot Confidence: 50.0%

⚙️  Configuration:
   Trading Pairs: ETH/USDC, UNI/ETH
   Min Profit: 2.0%
   Max Trade: 0.05 ETH

🚀 Start trading? (yes/no):
```

Type `yes` to start or `no` to cancel.

## Understanding Output

### Analysis Cycle
```
🔄 Analysis Cycle #1
🧠 System Confidence: 52.3%

📊 Analyzing ETH/USDC...
💰 Price: $2,645.23
📈 Signal: BUY (72.5%)
🎯 Expected Return: 2.3%
📊 RSI: 42.1
⚡ Volatility: 18.5%

🚀 Executing BUY: 0.04 ETH
✅ Transaction submitted: 0x1234...
✅ Trade executed in block 18756432
🧠 Adapted: Confidence=54.1%
```

### Performance Reports
```
📊 PERFORMANCE REPORT
========================================
Total Trades: 15
Profitable Trades: 9
Win Rate: 60.0%
Total Return: 3.2%
Best Trade: 4.1%
Worst Trade: -1.5%
Bot Confidence: 65.8%
```

## Troubleshooting

### Common Issues

**❌ "RPC_URL not configured properly"**
- Check Infura project ID is correct
- Ensure no extra spaces in `.env`
- Verify URL format

**❌ "PRIVATE_KEY not set"**
- Ensure private key is in `.env`
- Remove any `0x` prefix
- Check for extra spaces

**❌ "Insufficient data"**
- CoinGecko API rate limited
- Wait 5 minutes and try again
- Add CoinGecko API key for higher limits

**❌ "Trade failed: insufficient funds"**
- Need more ETH for gas fees
- Reduce `MAX_TRADE_AMOUNT`
- Check gas prices on etherscan.io

**❌ Connection timeouts**
- Check internet connection
- Verify Infura service status
- Try different RPC provider

### Getting Help
1. Check [GitHub Issues](https://github.com/animalityAI/ai-uniswap-trading-bot/issues)
2. Create new issue with error details
3. Include configuration (remove private keys!)

## Safety Guidelines

### 🔴 Critical Warnings
- **Educational Purpose**: This is for learning only
- **Financial Risk**: You can lose money trading
- **No Guarantees**: Past results don't predict future
- **Test First**: Use testnets before real money
- **Monitor Always**: Check bot regularly

### 🟢 Best Practices

**Start Small:**
- Begin with 0.01-0.05 ETH maximum
- Test for 24 hours with tiny amounts
- Only increase after proven success

**Monitor Closely:**
- Check every few hours initially
- Set phone alerts for unusual activity
- Have manual stop plan ready

**Risk Management:**
- Never risk more than 5% of portfolio
- Set realistic profit expectations (5-15% monthly)
- Use stop-losses and take-profits
- Diversify across multiple strategies

**Security:**
- Keep private keys secure
- Use dedicated trading wallet
- Regular backups of bot data
- Update software regularly

### 🟡 Warning Signs to Stop
- Consecutive losses (>5 in a row)
- Unusual high-frequency trading
- Error messages appearing repeatedly
- Confidence dropping below 30%
- Gas fees eating all profits

## Advanced Configuration

### Conservative Settings (Recommended for Beginners)
```env
MIN_PROFIT_THRESHOLD=0.025  # 2.5%
MAX_TRADE_AMOUNT=0.03       # 0.03 ETH
CONFIDENCE_THRESHOLD=0.75   # 75% confidence
MAX_DAILY_TRADES=5          # Max 5 trades/day
```

### Moderate Settings (After 1 Month Experience)
```env
MIN_PROFIT_THRESHOLD=0.02   # 2.0%
MAX_TRADE_AMOUNT=0.08       # 0.08 ETH
CONFIDENCE_THRESHOLD=0.70   # 70% confidence
MAX_DAILY_TRADES=15         # Max 15 trades/day
```

### Aggressive Settings (Experienced Users Only)
```env
MIN_PROFIT_THRESHOLD=0.015  # 1.5%
MAX_TRADE_AMOUNT=0.15       # 0.15 ETH
CONFIDENCE_THRESHOLD=0.65   # 65% confidence
MAX_DAILY_TRADES=25         # Max 25 trades/day
```

## Performance Expectations

### Realistic Timeline
- **Week 1**: Learn the system, expect small losses
- **Week 2-4**: Bot starts adapting, break-even or small gains
- **Month 2**: Should see consistent 5-10% monthly returns
- **Month 3+**: Optimized performance, 10-20% monthly possible

### Factors Affecting Performance
- **Market Conditions**: Bull markets easier than bear markets
- **Gas Costs**: High gas can eliminate small profits
- **Bot Learning**: Performance improves over time
- **Position Sizing**: Larger positions = higher risk/reward

### Success Metrics
- **Win Rate**: 55-70% is excellent
- **Profit Factor**: >1.5 is good (total profits ÷ total losses)
- **Max Drawdown**: <10% is healthy
- **Sharpe Ratio**: >1.0 is good risk-adjusted returns

## Backup and Recovery

### Important Files to Backup
- `.env` file (your configuration)
- `bot_data.json` (bot's learned memory)
- Trading logs and performance data

### Regular Backup Schedule
```bash
# Create backup folder
mkdir backups

# Backup bot data (run weekly)
cp bot_data.json backups/bot_data_$(date +%Y%m%d).json

# Backup configuration
cp .env backups/env_backup_$(date +%Y%m%d).txt
```

### Recovery Process
If bot loses memory or crashes:
1. Stop the bot immediately
2. Restore latest `bot_data.json` backup
3. Verify `.env` configuration
4. Restart with monitoring

## Upgrading the Bot

### Check for Updates
```bash
# Check current version
git log --oneline -5

# Fetch updates
git fetch origin

# See what's new
git log HEAD..origin/main --oneline

# Apply updates
git pull origin main
npm install
```

### Update Process
1. **Backup your data** first
2. **Read changelog** for breaking changes
3. **Test on small amounts** after update
4. **Monitor closely** for first 24 hours

---

## Quick Reference Commands

```bash
# Start bot
npm start

# Stop bot (Ctrl+C)
# Then confirm graceful shutdown

# Check logs
tail -f bot.log

# Test configuration
node -e "require('dotenv').config(); console.log('Config loaded:', !!process.env.RPC_URL)"

# Backup data
cp bot_data.json bot_data_backup.json

# Update bot
git pull && npm install
```

---

**Remember**: Start small, learn continuously, and never risk more than you can afford to lose! 

For support, create an issue on GitHub with detailed error information.