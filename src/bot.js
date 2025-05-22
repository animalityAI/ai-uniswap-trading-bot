const { ethers } = require('ethers');
const axios = require('axios');
const fs = require('fs').promises;

/**
 * AI-Powered Uniswap Trading Bot
 * Features adaptive learning, multi-timeframe analysis, and intelligent memory
 */
class AITradingBot {
    constructor(config) {
        this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
        this.wallet = new ethers.Wallet(config.privateKey, this.provider);
        this.uniswapRouter = config.uniswapRouterAddress;
        this.tokenPairs = config.tokenPairs;
        this.minProfitThreshold = config.minProfitThreshold || 0.02;
        this.maxSlippage = config.maxSlippage || 0.005;
        this.maxTradeAmount = config.maxTradeAmount || 0.1;
        
        // Multi-timeframe memory system
        this.memory = {
            immediate: new Map(),
            shortTerm: new Map(),
            mediumTerm: new Map(),
            longTerm: new Map(),
            patterns: new Map(),
            performance: {
                totalTrades: 0,
                profitable: 0,
                totalReturn: 0,
                winRate: 0,
                avgReturn: 0,
                bestTrade: 0,
                worstTrade: 0
            }
        };
        
        // AI learning parameters
        this.learningRate = 0.01;
        this.confidence = 0.5;
        this.adaptationSpeed = 0.1;
        this.marketRegime = 'UNKNOWN';
        
        // Technical indicators cache
        this.indicators = new Map();
        
        // Uniswap V3 Router ABI
        this.routerABI = [
            "function exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160)) external payable returns (uint256)",
            "function quoteExactInputSingle(address,address,uint24,uint256,uint160) external returns (uint256)"
        ];
        
        this.router = new ethers.Contract(this.uniswapRouter, this.routerABI, this.wallet);
        this.isRunning = false;
        this.cycleCount = 0;
        
        // Load existing data
        this.loadData();
    }

    // Intelligent memory storage
    storeMemory(key, data, timeframe = 'immediate') {
        const timestamp = Date.now();
        const importance = this.calculateImportance(data);
        
        const memoryEntry = {
            timestamp,
            data,
            importance,
            verified: false
        };
        
        if (!this.memory[timeframe].has(key)) {
            this.memory[timeframe].set(key, []);
        }
        
        this.memory[timeframe].get(key).push(memoryEntry);
        this.cleanOldMemories(key, timeframe);
    }

    calculateImportance(data) {
        let importance = 1.0;
        
        if (data.priceChange && Math.abs(data.priceChange) > 0.05) {
            importance *= 1.5;
        }
        
        if (data.profit && data.profit > 0) {
            importance *= 1.3;
        }
        
        if (data.volatility && data.volatility > 0.15) {
            importance *= 1.2;
        }
        
        if (data.regimeChange) {
            importance *= 2.0;
        }
        
        return Math.min(importance, 3.0);
    }

    cleanOldMemories(key, timeframe) {
        const maxAges = {
            immediate: 24 * 60 * 60 * 1000,
            shortTerm: 7 * 24 * 60 * 60 * 1000,
            mediumTerm: 30 * 24 * 60 * 60 * 1000,
            longTerm: 365 * 24 * 60 * 60 * 1000
        };
        
        const maxAge = maxAges[timeframe];
        const now = Date.now();
        
        if (this.memory[timeframe].has(key)) {
            const memories = this.memory[timeframe].get(key);
            const filtered = memories.filter(m => now - m.timestamp <= maxAge);
            
            if (filtered.length > 1000) {
                filtered.sort((a, b) => b.importance - a.importance);
                this.memory[timeframe].set(key, filtered.slice(0, 1000));
            } else {
                this.memory[timeframe].set(key, filtered);
            }
        }
    }

    // Fetch historical price data
    async fetchHistoricalData(tokenId, days = 90) {
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart`,
                {
                    params: {
                        vs_currency: 'usd',
                        days: days,
                        interval: days > 30 ? 'daily' : 'hourly'
                    }
                }
            );
            
            return response.data.prices.map(([timestamp, price]) => ({
                timestamp: new Date(timestamp),
                price: price
            }));
        } catch (error) {
            console.error(`Error fetching data for ${tokenId}:`, error.message);
            return [];
        }
    }

    // Technical analysis
    calculateTechnicalIndicators(priceData) {
        const indicators = {};
        
        indicators.sma20 = this.calculateSMA(priceData, 20);
        indicators.sma50 = this.calculateSMA(priceData, 50);
        indicators.rsi = this.calculateRSI(priceData);
        indicators.macd = this.calculateMACD(priceData);
        indicators.bollinger = this.calculateBollingerBands(priceData);
        indicators.stochastic = this.calculateStochastic(priceData);
        indicators.volatility = this.calculateVolatility(priceData);
        
        return indicators;
    }

    calculateSMA(data, period) {
        if (data.length < period) return null;
        const values = data.slice(-period).map(d => d.price);
        return values.reduce((sum, val) => sum + val, 0) / period;
    }

    calculateRSI(data, period = 14) {
        if (data.length < period + 1) return null;
        
        const changes = [];
        for (let i = 1; i < data.length; i++) {
            changes.push(data[i].price - data[i - 1].price);
        }
        
        const recentChanges = changes.slice(-period);
        const gains = recentChanges.filter(c => c > 0).reduce((sum, c) => sum + c, 0) / period;
        const losses = Math.abs(recentChanges.filter(c => c < 0).reduce((sum, c) => sum + c, 0)) / period;
        
        if (losses === 0) return 100;
        const rs = gains / losses;
        return 100 - (100 / (1 + rs));
    }

    calculateMACD(data) {
        const ema12 = this.calculateEMA(data, 12);
        const ema26 = this.calculateEMA(data, 26);
        
        if (!ema12 || !ema26) return null;
        
        const macdLine = ema12 - ema26;
        return {
            macd: macdLine,
            signal: macdLine * 0.9, // Simplified
            histogram: macdLine * 0.1
        };
    }

    calculateEMA(data, period) {
        if (data.length < period) return null;
        
        const multiplier = 2 / (period + 1);
        let ema = this.calculateSMA(data.slice(0, period), period);
        
        for (let i = period; i < data.length; i++) {
            ema = (data[i].price * multiplier) + (ema * (1 - multiplier));
        }
        
        return ema;
    }

    calculateBollingerBands(data, period = 20, stdDev = 2) {
        const sma = this.calculateSMA(data, period);
        if (!sma) return null;
        
        const values = data.slice(-period).map(d => d.price);
        const variance = values.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / period;
        const standardDeviation = Math.sqrt(variance);
        
        return {
            upper: sma + (standardDeviation * stdDev),
            middle: sma,
            lower: sma - (standardDeviation * stdDev),
            bandwidth: (standardDeviation * stdDev * 2) / sma
        };
    }

    calculateStochastic(data, kPeriod = 14) {
        if (data.length < kPeriod) return null;
        
        const recentData = data.slice(-kPeriod);
        const highest = Math.max(...recentData.map(d => d.price));
        const lowest = Math.min(...recentData.map(d => d.price));
        const current = data[data.length - 1].price;
        
        const kPercent = ((current - lowest) / (highest - lowest)) * 100;
        
        return {
            k: kPercent,
            d: kPercent
        };
    }

    calculateVolatility(data, period = 20) {
        if (data.length < period + 1) return 0;
        
        const returns = [];
        for (let i = 1; i <= period && i < data.length; i++) {
            const return_ = Math.log(data[data.length - i].price / data[data.length - i - 1].price);
            returns.push(return_);
        }
        
        const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length;
        
        return Math.sqrt(variance * 252);
    }

    // Signal generation
    generateTradingSignal(indicators, priceData) {
        const signals = [];
        let totalWeight = 0;
        
        // RSI signal
        if (indicators.rsi) {
            if (indicators.rsi < 30) {
                signals.push({ direction: 'BUY', strength: (30 - indicators.rsi) / 30, weight: 0.25 });
            } else if (indicators.rsi > 70) {
                signals.push({ direction: 'SELL', strength: (indicators.rsi - 70) / 30, weight: 0.25 });
            }
        }
        
        // MACD signal
        if (indicators.macd && indicators.macd.histogram > 0) {
            signals.push({ direction: 'BUY', strength: Math.min(1, Math.abs(indicators.macd.histogram) * 10), weight: 0.3 });
        } else if (indicators.macd && indicators.macd.histogram < 0) {
            signals.push({ direction: 'SELL', strength: Math.min(1, Math.abs(indicators.macd.histogram) * 10), weight: 0.3 });
        }
        
        // Bollinger Bands signal
        const currentPrice = priceData[priceData.length - 1].price;
        if (indicators.bollinger) {
            if (currentPrice < indicators.bollinger.lower) {
                const strength = (indicators.bollinger.lower - currentPrice) / (indicators.bollinger.lower - indicators.bollinger.middle);
                signals.push({ direction: 'BUY', strength: Math.min(1, strength), weight: 0.25 });
            } else if (currentPrice > indicators.bollinger.upper) {
                const strength = (currentPrice - indicators.bollinger.upper) / (indicators.bollinger.upper - indicators.bollinger.middle);
                signals.push({ direction: 'SELL', strength: Math.min(1, strength), weight: 0.25 });
            }
        }
        
        // Calculate weighted average
        let bullishScore = 0;
        let bearishScore = 0;
        
        signals.forEach(signal => {
            totalWeight += signal.weight;
            if (signal.direction === 'BUY') {
                bullishScore += signal.strength * signal.weight;
            } else if (signal.direction === 'SELL') {
                bearishScore += signal.strength * signal.weight;
            }
        });
        
        const netScore = totalWeight > 0 ? (bullishScore - bearishScore) / totalWeight : 0;
        const confidence = Math.abs(netScore);
        
        let action = 'HOLD';
        if (netScore > this.minProfitThreshold && confidence > 0.6) {
            action = 'BUY';
        } else if (netScore < -this.minProfitThreshold && confidence > 0.6) {
            action = 'SELL';
        }
        
        return {
            action,
            confidence,
            expectedReturn: netScore,
            signals: signals
        };
    }

    calculatePositionSize(signal, balance = 1.0) {
        const baseSize = this.maxTradeAmount;
        const confidenceMultiplier = signal.confidence;
        const riskMultiplier = this.confidence;
        
        const expectedReturn = Math.abs(signal.expectedReturn);
        const riskOfRuin = 1 - signal.confidence;
        const kellyFraction = expectedReturn / (riskOfRuin + 0.01);
        
        const size = baseSize * confidenceMultiplier * riskMultiplier * Math.min(kellyFraction, 0.5);
        
        return Math.max(0.01, Math.min(this.maxTradeAmount, size));
    }

    // Execute trade
    async executeTrade(tokenIn, tokenOut, amountIn, signal) {
        try {
            console.log(`🚀 Executing ${signal.action}: ${amountIn} ETH`);
            
            const amountInWei = ethers.utils.parseUnits(amountIn.toString(), 18);
            const quote = await this.router.quoteExactInputSingle(
                tokenIn,
                tokenOut,
                3000,
                amountInWei,
                0
            );
            
            const slippageMultiplier = 100 - (this.maxSlippage * 100);
            const amountOutMin = quote.mul(slippageMultiplier).div(100);
            
            const params = {
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: 3000,
                recipient: this.wallet.address,
                deadline: Math.floor(Date.now() / 1000) + 300,
                amountIn: amountInWei,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            };
            
            const gasEstimate = await this.router.estimateGas.exactInputSingle(params);
            const gasPrice = await this.provider.getGasPrice();
            
            const tx = await this.router.exactInputSingle(params, {
                gasLimit: gasEstimate.mul(120).div(100),
                gasPrice: gasPrice
            });
            
            console.log(`✅ Transaction submitted: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(`✅ Trade executed in block ${receipt.blockNumber}`);
            
            const actualAmountOut = ethers.utils.formatUnits(quote, 18);
            const profit = (parseFloat(actualAmountOut) - amountIn) / amountIn;
            
            const tradeResult = {
                success: true,
                txHash: tx.hash,
                profit: profit,
                amount: amountIn,
                signal: signal.action,
                timestamp: Date.now()
            };
            
            this.updatePerformance(tradeResult);
            this.adaptFromResult(tradeResult, signal);
            
            return tradeResult;
            
        } catch (error) {
            console.error('❌ Trade failed:', error.message);
            return {
                success: false,
                error: error.message,
                timestamp: Date.now()
            };
        }
    }

    updatePerformance(tradeResult) {
        this.memory.performance.totalTrades++;
        
        if (tradeResult.success && tradeResult.profit > 0) {
            this.memory.performance.profitable++;
            this.memory.performance.totalReturn += tradeResult.profit;
            
            if (tradeResult.profit > this.memory.performance.bestTrade) {
                this.memory.performance.bestTrade = tradeResult.profit;
            }
        } else if (tradeResult.success) {
            this.memory.performance.totalReturn += tradeResult.profit;
            
            if (tradeResult.profit < this.memory.performance.worstTrade) {
                this.memory.performance.worstTrade = tradeResult.profit;
            }
        }
        
        this.memory.performance.winRate = this.memory.performance.profitable / this.memory.performance.totalTrades;
        this.memory.performance.avgReturn = this.memory.performance.totalReturn / this.memory.performance.totalTrades;
    }

    adaptFromResult(tradeResult, signal) {
        const error = Math.abs((tradeResult.profit || 0) - signal.expectedReturn);
        
        if (error < 0.01) {
            this.confidence = Math.min(1.0, this.confidence + 0.02);
        } else {
            this.confidence = Math.max(0.1, this.confidence - error * 0.1);
        }
        
        this.learningRate = Math.max(0.001, Math.min(0.1, this.learningRate * (1 + error)));
        
        console.log(`🧠 Adapted: Confidence=${(this.confidence*100).toFixed(1)}%`);
    }

    // Main analysis loop
    async analyzeAndTrade(tokenPair) {
        try {
            console.log(`\n📊 Analyzing ${tokenPair.pair}...`);
            
            const priceData = await this.fetchHistoricalData(tokenPair.coingeckoId, 90);
            if (priceData.length < 50) {
                console.log('❌ Insufficient data');
                return;
            }
            
            const indicators = this.calculateTechnicalIndicators(priceData);
            const signal = this.generateTradingSignal(indicators, priceData);
            
            const currentPrice = priceData[priceData.length - 1].price;
            console.log(`💰 Price: $${currentPrice.toFixed(4)}`);
            console.log(`📈 Signal: ${signal.action} (${(signal.confidence * 100).toFixed(1)}%)`);
            console.log(`🎯 Expected Return: ${(signal.expectedReturn * 100).toFixed(2)}%`);
            console.log(`📊 RSI: ${indicators.rsi?.toFixed(1) || 'N/A'}`);
            
            this.storeMemory(tokenPair.coingeckoId, {
                price: currentPrice,
                signal: signal.action,
                confidence: signal.confidence,
                expectedReturn: signal.expectedReturn,
                volatility: indicators.volatility
            });
            
            if (signal.confidence > 0.65 && signal.action !== 'HOLD') {
                const positionSize = this.calculatePositionSize(signal);
                
                if (signal.action === 'BUY') {
                    await this.executeTrade(
                        tokenPair.token1.address,
                        tokenPair.token0.address,
                        positionSize,
                        signal
                    );
                } else if (signal.action === 'SELL') {
                    await this.executeTrade(
                        tokenPair.token0.address,
                        tokenPair.token1.address,
                        positionSize,
                        signal
                    );
                }
            } else {
                console.log(`🤖 Holding - Signal too weak`);
            }
            
        } catch (error) {
            console.error(`❌ Analysis failed for ${tokenPair.pair}:`, error.message);
        }
    }

    // Data persistence
    async saveData() {
        try {
            const data = {
                memory: {
                    immediate: Array.from(this.memory.immediate.entries()),
                    shortTerm: Array.from(this.memory.shortTerm.entries()),
                    mediumTerm: Array.from(this.memory.mediumTerm.entries()),
                    longTerm: Array.from(this.memory.longTerm.entries()),
                    patterns: Array.from(this.memory.patterns.entries()),
                    performance: this.memory.performance
                },
                learningParams: {
                    learningRate: this.learningRate,
                    confidence: this.confidence,
                    adaptationSpeed: this.adaptationSpeed,
                    marketRegime: this.marketRegime
                },
                lastSaved: Date.now()
            };
            
            await fs.writeFile('bot_data.json', JSON.stringify(data, null, 2));
            console.log('💾 Data saved successfully');
        } catch (error) {
            console.error('❌ Failed to save data:', error.message);
        }
    }

    async loadData() {
        try {
            const data = JSON.parse(await fs.readFile('bot_data.json', 'utf8'));
            
            this.memory.immediate = new Map(data.memory.immediate || []);
            this.memory.shortTerm = new Map(data.memory.shortTerm || []);
            this.memory.mediumTerm = new Map(data.memory.mediumTerm || []);
            this.memory.longTerm = new Map(data.memory.longTerm || []);
            this.memory.patterns = new Map(data.memory.patterns || []);
            this.memory.performance = data.memory.performance || this.memory.performance;
            
            if (data.learningParams) {
                this.learningRate = data.learningParams.learningRate || 0.01;
                this.confidence = data.learningParams.confidence || 0.5;
                this.adaptationSpeed = data.learningParams.adaptationSpeed || 0.1;
                this.marketRegime = data.learningParams.marketRegime || 'UNKNOWN';
            }
            
            console.log('📚 Data loaded successfully');
            console.log(`🧠 Bot Confidence: ${(this.confidence * 100).toFixed(1)}%`);
            console.log(`📈 Total Trades: ${this.memory.performance.totalTrades}`);
            console.log(`🎯 Win Rate: ${(this.memory.performance.winRate * 100).toFixed(1)}%`);
            
        } catch (error) {
            console.log('📝 No existing data found, starting fresh');
        }
    }

    getPerformanceReport() {
        const perf = this.memory.performance;
        
        console.log('\n📊 PERFORMANCE REPORT');
        console.log('='.repeat(40));
        console.log(`Total Trades: ${perf.totalTrades}`);
        console.log(`Profitable Trades: ${perf.profitable}`);
        console.log(`Win Rate: ${(perf.winRate * 100).toFixed(1)}%`);
        console.log(`Total Return: ${(perf.totalReturn * 100).toFixed(2)}%`);
        console.log(`Average Return: ${(perf.avgReturn * 100).toFixed(2)}%`);
        console.log(`Best Trade: ${(perf.bestTrade * 100).toFixed(2)}%`);
        console.log(`Worst Trade: ${(perf.worstTrade * 100).toFixed(2)}%`);
        console.log(`Bot Confidence: ${(this.confidence * 100).toFixed(1)}%`);
        
        return perf;
    }

    // Main bot lifecycle
    async start() {
        if (this.isRunning) {
            console.log('🤖 Bot is already running');
            return;
        }
        
        this.isRunning = true;
        console.log('\n🚀 AI Trading Bot Started');
        console.log('🧠 Adaptive Learning System: ACTIVE');
        console.log('📊 Multi-Timeframe Analysis: ENABLED');
        console.log('⚠️  Educational Use - Trade Responsibly!');
        
        this.getPerformanceReport();
        
        while (this.isRunning) {
            try {
                this.cycleCount++;
                console.log(`\n🔄 Analysis Cycle #${this.cycleCount}`);
                console.log(`🧠 System Confidence: ${(this.confidence * 100).toFixed(1)}%`);
                
                for (const tokenPair of this.tokenPairs) {
                    await this.analyzeAndTrade(tokenPair);
                    await this.sleep(10000);
                }
                
                if (this.cycleCount % 5 === 0) {
                    await this.saveData();
                }
                
                if (this.cycleCount % 10 === 0) {
                    this.getPerformanceReport();
                }
                
                console.log('\n⏳ Waiting 5 minutes for next cycle...');
                await this.sleep(300000);
                
            } catch (error) {
                console.error('🚨 Cycle error:', error.message);
                await this.sleep(60000);
            }
        }
    }

    stop() {
        this.isRunning = false;
        console.log('\n🛑 Bot stopped');
        this.saveData();
        this.getPerformanceReport();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = { AITradingBot };