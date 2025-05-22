#!/usr/bin/env node

/**
 * AI-Powered Uniswap Trading Bot
 * Entry point for the application
 */

require('dotenv').config();
const { AITradingBot } = require('./src/bot');

// Configuration from environment variables
const config = {
    rpcUrl: process.env.RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    privateKey: process.env.PRIVATE_KEY || '',
    uniswapRouterAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564', // Uniswap V3 Router
    
    // Trading parameters
    minProfitThreshold: parseFloat(process.env.MIN_PROFIT_THRESHOLD) || 0.015,
    maxSlippage: parseFloat(process.env.MAX_SLIPPAGE) || 0.005,
    maxTradeAmount: parseFloat(process.env.MAX_TRADE_AMOUNT) || 0.1,
    
    // Bot parameters
    cycleInterval: parseInt(process.env.CYCLE_INTERVAL) || 300000,
    confidenceThreshold: parseFloat(process.env.CONFIDENCE_THRESHOLD) || 0.65,
    learningRate: parseFloat(process.env.LEARNING_RATE) || 0.01,
    
    // Token pairs to trade
    tokenPairs: [
        {
            pair: 'ETH/USDC',
            token0: {
                symbol: 'WETH',
                address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
                decimals: 18
            },
            token1: {
                symbol: 'USDC',
                address: '0xA0b86a33E6441E6B4C6b39A9D71f6BFF8FaD9F3C', // USDC
                decimals: 6
            },
            coingeckoId: 'ethereum',
            feeRate: 3000 // 0.3%
        },
        {
            pair: 'UNI/ETH',
            token0: {
                symbol: 'UNI',
                address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
                decimals: 18
            },
            token1: {
                symbol: 'WETH',
                address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
                decimals: 18
            },
            coingeckoId: 'uniswap',
            feeRate: 3000 // 0.3%
        }
    ]
};

async function validateConfig() {
    const errors = [];
    
    if (!config.rpcUrl || config.rpcUrl.includes('YOUR_PROJECT_ID')) {
        errors.push('❌ RPC_URL not configured properly');
    }
    
    if (!config.privateKey) {
        errors.push('❌ PRIVATE_KEY not set');
    }
    
    if (config.minProfitThreshold <= 0 || config.minProfitThreshold > 0.5) {
        errors.push('❌ MIN_PROFIT_THRESHOLD should be between 0 and 0.5');
    }
    
    if (config.maxSlippage <= 0 || config.maxSlippage > 0.1) {
        errors.push('❌ MAX_SLIPPAGE should be between 0 and 0.1');
    }
    
    if (errors.length > 0) {
        console.error('Configuration errors:');
        errors.forEach(error => console.error(error));
        console.error('\n📝 Please check your .env file and fix the issues above.');
        process.exit(1);
    }
}

async function main() {
    console.log('🤖 AI-Powered Uniswap Trading Bot');
    console.log('==================================');
    
    // Validate configuration
    await validateConfig();
    
    // Initialize bot
    console.log('🔧 Initializing trading bot...');
    const bot = new AITradingBot(config);
    
    // Setup graceful shutdown
    const shutdown = () => {
        console.log('\n👋 Received shutdown signal...');
        bot.stop();
        process.exit(0);
    };
    
    process.on('SIGINT', shutdown);   // Ctrl+C
    process.on('SIGTERM', shutdown);  // Termination signal
    process.on('SIGUSR2', shutdown); // Nodemon restart
    
    // Display configuration
    console.log('\n⚙️  Configuration:');
    console.log(`   Trading Pairs: ${config.tokenPairs.map(p => p.pair).join(', ')}`);
    console.log(`   Min Profit: ${(config.minProfitThreshold * 100).toFixed(1)}%`);
    console.log(`   Max Slippage: ${(config.maxSlippage * 100).toFixed(2)}%`);
    console.log(`   Max Trade: ${config.maxTradeAmount} ETH`);
    console.log(`   Cycle Interval: ${config.cycleInterval / 1000}s`);
    
    console.log('\n⚠️  Important Warnings:');
    console.log('   • This is experimental software for educational purposes');
    console.log('   • Cryptocurrency trading involves significant financial risk');
    console.log('   • Never invest more than you can afford to lose');
    console.log('   • Monitor the bot regularly and be prepared to stop it');
    
    // Ask for confirmation in interactive mode
    if (process.stdin.isTTY) {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        const answer = await new Promise(resolve => {
            rl.question('\n🚀 Start trading? (yes/no): ', resolve);
        });
        
        rl.close();
        
        if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
            console.log('👋 Bot startup cancelled');
            process.exit(0);
        }
    }
    
    try {
        // Start the bot
        console.log('\n🚀 Starting AI trading bot...');
        await bot.start();
        
    } catch (error) {
        console.error('💥 Fatal error:', error.message);
        
        if (error.code === 'NETWORK_ERROR') {
            console.error('🌐 Check your internet connection and RPC URL');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            console.error('💰 Insufficient balance for trading and gas fees');
        } else if (error.code === 'INVALID_PRIVATE_KEY') {
            console.error('🔑 Invalid private key format');
        }
        
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

// Run the main function
if (require.main === module) {
    main().catch(error => {
        console.error('💥 Startup error:', error.message);
        process.exit(1);
    });
}

module.exports = { config };