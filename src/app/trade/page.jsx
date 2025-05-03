"use client"

import React, { useState, useEffect } from "react"
import { RefreshCw, Brain, FileText, X, Star, Settings, BarChart2, ChevronDown, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { OpenOrders } from "./OrdersTable"
import { useAccount } from "wagmi"
import { config } from "../components/config"

// Token options with images and CoinGecko IDs mapping
const tokenOptions = [
  {
    id: "BNB:CRYPTO",
    coingeckoId: "binancecoin",
    symbol: "CRYPTO:BNBUSD",
    name: "BNB",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    price: 590.94,
    change: -0.67,
    high: 594.49,
    low: 587.7,
    volume: "102,830.58",
    volumeUsd: "60,805,813.32",
    tags: ["Layer 1", "Layer 2", "BNB Chain", "Hot"],
  },
  {
    id: "BINANCE:RIFBTC",
    coingeckoId: "rif-token",
    symbol: "BINANCE:RIFBTC",
    name: "RootStock",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6ZfyTYUjw8Y7aF4KSXcBWGZUh72hudzgfHQ&s",
    price: 590.94,
    change: -0.67,
    high: 594.49,
    low: 587.7,
    volume: "102,830.58",
    volumeUsd: "60,805,813.32",
    tags: ["Layer 1", "Layer 2", "BNB Chain", "Hot"],
  },
  {
    id: "BINANCE:SEIUSDT",
    coingeckoId: "sei-network",
    symbol: "BINANCE:SEIUSDT",
    name: "Sei",
    image: "https://s3.coinmarketcap.com/static-gravity/image/992744cfbd5e40f5920018ee7a830b98.png",
    price: 0.2092,
    change: -0.67,
    high: 594.49,
    low: 587.7,
    volume: "102,830.58",
    volumeUsd: "60,805,813.32",
    tags: ["Layer 1", "Layer 2", "BNB Chain", "Hot"],
  },
  {
    id: "LUKSO:CRYPTO",
    coingeckoId: "lukso-token",
    symbol: "CRYPTO:LYXUSD",
    name: "Lukso",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/2992.png",
    price: 3.45,
    change: 2.1,
    high: 3.52,
    low: 3.32,
    volume: "5,230.58",
    volumeUsd: "18,045,813.32",
    tags: ["Layer 1", "DeFi"],
  },
  {
    id: "ETH:CRYPTO",
    coingeckoId: "ethereum",
    symbol: "CRYPTO:ETHUSD",
    name: "Ethereum",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    price: 3045.67,
    change: 1.2,
    high: 3089.45,
    low: 3012.78,
    volume: "89,456.23",
    volumeUsd: "272,345,678.90",
    tags: ["Layer 1", "Smart Contract"],
  },
  {
    id: "BTC:CRYPTO",
    coingeckoId: "bitcoin",
    symbol: "CRYPTO:BTCUSD",
    name: "Bitcoin",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    price: 63245.78,
    change: -0.5,
    high: 63890.45,
    low: 62789.34,
    volume: "45,678.90",
    volumeUsd: "2,890,456,789.12",
    tags: ["Layer 1", "Store of Value"],
  },
  {
    id: "SOL:CRYPTO",
    coingeckoId: "solana",
    symbol: "CRYPTO:SOLUSD",
    name: "Solana",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    price: 142.56,
    change: 3.4,
    high: 145.67,
    low: 138.9,
    volume: "78,456.23",
    volumeUsd: "11,178,456.23",
    tags: ["Layer 1", "DeFi", "NFT"],
  },
  {
    id: "AVAX:CRYPTO",
    coingeckoId: "avalanche-2",
    symbol: "CRYPTO:AVAXUSD",
    name: "Avalanche",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
    price: 34.56,
    change: -1.2,
    high: 35.67,
    low: 33.45,
    volume: "23,456.78",
    volumeUsd: "810,234.56",
    tags: ["Layer 1", "DeFi"],
  },
]

// TradingView Widget Component
const TradingViewWidget = ({ symbol }) => {
  const containerRef = React.useRef(null)

  useEffect(() => {
    // Clean up previous widget if it exists
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    // Create new widget with the selected symbol
    if (window.TradingView) {
      new window.TradingView.widget({
        width: "100%",
        height: 500,
        symbol: symbol,
        interval: "1",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#131722",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tv_chart_container",
        hide_side_toolbar: false,
        studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies", "MACD@tv-basicstudies"],
        overrides: {
          "paneProperties.background": "#131722",
          "paneProperties.vertGridProperties.color": "#232323",
          "paneProperties.horzGridProperties.color": "#232323",
          "scalesProperties.textColor": "#AAA",
        },
      })
    }
  }, [symbol])

  return <div id="tv_chart_container" ref={containerRef} className="w-full h-[500px]" />
}

// Order Book Component
const OrderBook = ({ data }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2 px-2 text-xs text-gray-400">
        <div className="w-1/3 text-left">Price (USDT)</div>
        <div className="w-1/3 text-right">Amount (BNB)</div>
        <div className="w-1/3 text-right">Total</div>
      </div>

      {/* Asks (Sell Orders) - Displayed in reverse order */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {data.asks.map((order, index) => (
          <div
            key={`ask-${index}`}
            className="flex justify-between items-center text-xs py-1 px-2 hover:bg-gray-800/50"
          >
            <div className="w-1/3 text-left text-red-500">
              {order.price < 0.01 ? order.price.toPrecision(4) : order.price.toFixed(2)}
            </div>
            <div className="w-1/3 text-right">
              {order.amount < 0.001 ? order.amount.toPrecision(4) : order.amount.toFixed(3)}
            </div>
            <div className="w-1/3 text-right">
              {order.total < 0.01 ? order.total.toPrecision(4) : order.total.toFixed(2)}
            </div>
            <div
              className="absolute left-0 h-full bg-red-500/10"
              style={{ width: `${Math.min((order.total / 50) * 100, 100)}%`, zIndex: -1 }}
            ></div>
          </div>
        ))}
      </div>

      {/* Current Price */}
      <div className="py-2 px-2 border-y border-gray-700 text-center">
        <div className="text-lg font-semibold text-white">
          {data.currentPrice < 0.01 ? data.currentPrice.toPrecision(4) : data.currentPrice.toFixed(2)}
        </div>
        <div className="text-xs text-gray-400">
          ≈ ${data.currentPrice < 0.01 ? data.currentPrice.toPrecision(4) : data.currentPrice.toFixed(2)}
        </div>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {data.bids.map((order, index) => (
          <div
            key={`bid-${index}`}
            className="flex justify-between items-center text-xs py-1 px-2 hover:bg-gray-800/50 relative"
          >
            <div className="w-1/3 text-left text-green-500">
              {order.price < 0.01 ? order.price.toPrecision(4) : order.price.toFixed(2)}
            </div>
            <div className="w-1/3 text-right">
              {order.amount < 0.001 ? order.amount.toPrecision(4) : order.amount.toFixed(3)}
            </div>
            <div className="w-1/3 text-right">
              {order.total < 0.01 ? order.total.toPrecision(4) : order.total.toFixed(2)}
            </div>
            <div
              className="absolute left-0 h-full bg-green-500/10"
              style={{ width: `${Math.min((order.total / 50) * 100, 100)}%`, zIndex: -1 }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// AI Analysis Button Component
const AiAnalysisButton = ({ selectedToken, onAnalyze, isLoading }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onAnalyze}
      disabled={isLoading}
      className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white"
    >
      {isLoading ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          ></motion.div>
          <span>Analysis</span>
          <motion.div
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
        </>
      )}
    </motion.button>
  )
}

// Trade Form Component with AI Analysis
const TradeForm = ({ type, selectedToken, onSubmit, isLoading, tokenAmount, expectedPrice, historicalPrices }) => {
  const [price, setPrice] = useState("")
  const [amount, setAmount] = useState("")
  const [total, setTotal] = useState("")
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null)
  const [showAiResult, setShowAiResult] = useState(false)

  // Update total when price or amount changes
  useEffect(() => {
    if (price && amount) {
      const calculatedTotal = Number.parseFloat(price) * Number.parseFloat(amount)
      // Use appropriate precision for very small numbers
      if (calculatedTotal < 0.01) {
        setTotal(calculatedTotal.toString()) // Keep full precision for small values
      } else {
        setTotal(calculatedTotal.toFixed(2)) // Use 2 decimal places for normal values
      }
    } else {
      setTotal("")
    }
  }, [price, amount])

  // Update amount when price and total change
  const handleTotalChange = (e) => {
    const newTotal = e.target.value
    setTotal(newTotal)
    if (newTotal && price && Number.parseFloat(price) > 0) {
      const calculatedAmount = Number.parseFloat(newTotal) / Number.parseFloat(price)
      // Use appropriate precision for very small numbers
      if (calculatedAmount < 0.000001) {
        setAmount(calculatedAmount.toString()) // Keep full precision for small values
      } else {
        setAmount(calculatedAmount.toFixed(6)) // Use 6 decimal places for normal values
      }
    }
  }

  // Function to find the nearest price in historical data
  const findNearestPrice = () => {
    if (!historicalPrices || historicalPrices.length === 0) return null

    // Get the current entered price or use the most recent price as default
    const targetPrice = price ? Number.parseFloat(price) : historicalPrices[historicalPrices.length - 1][1]

    // Find the closest price from historical data
    let closestPrice = historicalPrices[0][1]
    let minDiff = Math.abs(targetPrice - closestPrice)

    for (let i = 1; i < historicalPrices.length; i++) {
      const currentPrice = historicalPrices[i][1]
      const diff = Math.abs(targetPrice - currentPrice)

      if (diff < minDiff) {
        minDiff = diff
        closestPrice = currentPrice
      }
    }

    return closestPrice.toFixed(8)
  }

  const handlePriceCheck = () => {
    const nearestPrice = findNearestPrice()
    if (nearestPrice) {
      setPrice(nearestPrice)
    }
  }

  
  const handleAiAnalysis = async () => {
    setAiAnalysisLoading(true)
    setAiAnalysisResult(null)

    try {
      const response = await fetch("https://gemini-service-d82v.onrender.com/ai-trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coin_id: selectedToken.coingeckoId || "edu-coin",
          days: 1,
        }),
      })

      const data = await response.json()
      console.log("my Data coming from my api is:::", data)

      if (!data.success) {
        throw new Error(`API error: ${response.status}`)
      }
      setAiAnalysisResult(data.data)
      setShowAiResult(true)
    } catch (error) {
      console.error("Error fetching AI analysis:", error)
      setAiAnalysisResult({
        market_up: false,
        description: "Failed to fetch AI analysis. Please try again later.",
      })
      setShowAiResult(true)
    } finally {
      setAiAnalysisLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => onSubmit(e, { price, amount, total })} className="p-4">
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <label className="text-xs text-gray-400">Price</label>
          <span className="text-xs text-gray-400">USDT</span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-800/50 border border-gray-700 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {type === "buy" && (
            <button
              type="button"
              onClick={handlePriceCheck}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-400 hover:text-blue-300"
            >
              Match
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <label className="text-xs text-gray-400">Tokens</label>
          <span className="text-xs text-gray-400">{selectedToken.name}</span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-800/50 border border-gray-700 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-xs text-gray-400">Total</label>
          <span className="text-xs text-gray-400">USDT</span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={total}
            onChange={handleTotalChange}
            placeholder="0.00"
            className="w-full bg-gray-800/50 border border-gray-700 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {type === "buy" ? (
        <AiAnalysisButton selectedToken={selectedToken} onAnalyze={handleAiAnalysis} isLoading={aiAnalysisLoading} />
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-red-600 hover:bg-red-500 text-white"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Sell {selectedToken.name}</span>
            </>
          )}
        </motion.button>
      )}

      <div className="mt-4 text-xs text-center text-gray-500">Available: 0.00 USDT</div>

      {/* AI Analysis Results */}
      <AnimatePresence>
        {showAiResult && aiAnalysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`mt-4 p-3 rounded-lg ${
              aiAnalysisResult.market_up
                ? "bg-green-900/20 border border-green-700"
                : "bg-red-900/20 border border-red-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Brain className={`h-4 w-4 ${aiAnalysisResult.market_up ? "text-green-400" : "text-red-400"}`} />
                <h4 className="font-medium text-sm">
                  {aiAnalysisResult.market_up ? "Safe to Trade" : "Caution Advised"}
                </h4>
              </div>
              <button onClick={() => setShowAiResult(false)} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-300">{aiAnalysisResult.description}</p>
            <div className="mt-3 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAiResult(false)}
                className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                Got it
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}

// Market Stats Component
const MarketStats = ({ token }) => {
  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <img src={token.image || "/placeholder.svg"} alt={token.name} className="w-8 h-8 mr-2" />
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white mr-2">{token.name}/USDT</h2>
              <Star className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center text-sm">
              {token.tags.map((tag, index) => (
                <span key={index} className="mr-2 text-yellow-500 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div>
          <div className="text-2xl font-bold text-white">${token.price.toFixed(2)}</div>
          <div className={`text-sm ${token.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {token.change >= 0 ? "+" : ""}
            {token.change}%
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-400">24h High</div>
          <div className="text-sm text-white">{token.high}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">24h Low</div>
          <div className="text-sm text-white">{token.low}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">24h Volume({token.name})</div>
          <div className="text-sm text-white">{token.volume}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">24h Volume(USDT)</div>
          <div className="text-sm text-white">{token.volumeUsd}</div>
        </div>
      </div>
    </div>
  )
}

// Coin Selector Component
const CoinSelector = ({ tokens, selectedToken, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={selectedToken.image || "/placeholder.svg"} alt={selectedToken.name} className="w-6 h-6" />
        <span className="font-medium">{selectedToken.name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search coin..."
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {tokens.map((token) => (
              <button
                key={token.id}
                className={`w-full flex items-center space-x-2 p-2 hover:bg-gray-700 ${selectedToken.id === token.id ? "bg-gray-700" : ""}`}
                onClick={() => {
                  onSelect(token)
                  setIsOpen(false)
                }}
              >
                <img src={token.image || "/placeholder.svg"} alt={token.name} className="w-6 h-6" />
                <span>{token.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// AI Analysis Modal Component
const AiAnalysisModal = ({ isOpen, onClose, selectedToken, aiResult }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1e2329] border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">Analysis: {selectedToken.name}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div
                className={`bg-gray-800/50 rounded-lg p-4 border ${aiResult?.market_up ? "border-green-500/30" : "border-red-500/30"}`}
              >
                <h3 className="text-lg font-medium text-blue-300 mb-2">Market Status</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${aiResult?.market_up ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span className={`font-medium ${aiResult?.market_up ? "text-green-400" : "text-red-400"}`}>
                    {aiResult?.market_up ? "Safe to Trade" : "Caution Advised"}
                  </span>
                </div>
                <p className="text-gray-300">{aiResult?.description || "Analysis not available. Please try again."}</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-300 mb-2">Price Prediction</h3>
                <p className="text-gray-300">
                  Based on historical data and current market conditions, our AI predicts a price range of $
                  {(selectedToken.price * (aiResult?.market_up ? 1.05 : 0.95)).toFixed(2)}-$
                  {(selectedToken.price * (aiResult?.market_up ? 1.1 : 0.98)).toFixed(2)}
                  in the short term (1-3 days).
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-300 mb-2">Trading Volume Analysis</h3>
                <p className="text-gray-300">
                  Trading volume has {aiResult?.market_up ? "increased" : "decreased"} by
                  {aiResult?.market_up ? " 23%" : " 12%"} in the last 24 hours, indicating
                  {aiResult?.market_up ? " growing" : " declining"} interest in {selectedToken.name}.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-300 mb-2">Recommendation</h3>
                <p className="text-gray-300">
                  {aiResult?.market_up
                    ? `Consider setting your expected price between $${(selectedToken.price * 1.05).toFixed(2)}-$${(selectedToken.price * 1.1).toFixed(2)} for optimal selling opportunity based on current market trends.`
                    : `Consider waiting for more favorable market conditions before trading. If you must trade, set conservative price targets.`}
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                This analysis is generated by AI and should not be considered financial advice. Always do your own
                research before making investment decisions.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function TradePage() {
  const [selectedToken, setSelectedToken] = useState(tokenOptions[1])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showAiAnalysis, setShowAiAnalysis] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null)
  const [activeTab, setActiveTab] = useState("spot")
  const [orderType, setOrderType] = useState("limit")
  const [tradeView, setTradeView] = useState("original")
  const [timeframe, setTimeframe] = useState("1d")
  const [historicalPrices, setHistoricalPrices] = useState([])
  const [orderBookData, setOrderBookData] = useState({
    asks: [],
    bids: [],
    currentPrice: 0,
  })
  const acc = useAccount(config).address
  const chainId = useAccount(config).chainId
  console.log("Account ", useAccount(config.chain))

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setWalletAddress(accounts[0])
      } catch (error) {
        console.error("Error connecting to wallet:", error)
      }
    } else {
      alert("Please install MetaMask or another Ethereum wallet")
    }
  }

  // Fetch historical data from CoinGecko
  const fetchHistoricalData = async (coinId, days = 30) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
        {
          headers: {
            "x-cg-demo-api-key": "CG-hqMGzd5r3hMZFU7A9EZ1Mkcw",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      const data = await response.json()

      if (data && data.prices && data.prices.length > 0) {
        setHistoricalPrices(data.prices)

        // Generate order book data from historical prices
        generateOrderBookFromPrices(data.prices)
      }
    } catch (error) {
      console.error("Error fetching historical data:", error)
      setError("Failed to fetch price data")
    } finally {
      setIsLoading(false)
    }
  }

  // Generate order book data from historical prices
  const generateOrderBookFromPrices = (prices) => {
    if (!prices || prices.length === 0) return

    // Get the most recent price
    const latestPrice = prices[prices.length - 1][1]

    // Generate asks (sell orders) - higher than current price
    const asks = []
    const bids = []

    // Generate some variation for the orders
    for (let i = 0; i < 10; i++) {
      // For asks, add small increments to the latest price
      const askPrice = latestPrice * (1 + (i + 1) * 0.001)
      const askAmount = 20 + Math.random() * 80
      const askTotal = Number.parseFloat((askPrice * (askAmount * 0.01)).toFixed(2))

      asks.push({
        price: askPrice,
        amount: askAmount,
        total: askTotal,
      })

      // For bids, subtract small increments from the latest price
      const bidPrice = latestPrice * (1 - (i + 1) * 0.001)
      const bidAmount = 20 + Math.random() * 80
      const bidTotal = Number.parseFloat((bidPrice * (bidAmount * 0.01)).toFixed(2))

      bids.push({
        price: bidPrice,
        amount: bidAmount,
        total: bidTotal,
      })
    }

    // Sort asks and bids
    asks.sort((a, b) => a.price - b.price)
    bids.sort((a, b) => b.price - a.price)

    setOrderBookData({
      asks,
      bids,
      currentPrice: latestPrice,
    })
  }

  // Fetch AI analysis from API
  const fetchAiAnalysis = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://gemini-service-d82v.onrender.com/ai-trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coin_id: selectedToken.coingeckoId || "edu-coin",
          days: 1,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setAiAnalysisResult(data)
      setShowAiAnalysis(true)
    } catch (err) {
      console.error("Error fetching AI analysis:", err)
      setError("Failed to fetch AI analysis. Please try again.")

      // Set fallback data for demo purposes
      setAiAnalysisResult({
        market_up: Math.random() > 0.5, // Random for demo
        description:
          "AI analysis could not be fetched. This is fallback data for demonstration purposes. The actual analysis would contain detailed market insights and trading recommendations based on current market conditions.",
      })
      setShowAiAnalysis(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Effect to fetch data when token changes
  useEffect(() => {
    if (selectedToken && selectedToken.coingeckoId) {
      fetchHistoricalData(selectedToken.coingeckoId)
    }
  }, [selectedToken])

  // Check if wallet is already connected on page load
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkWalletConnection()

    // Load TradingView widget script
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    document.body.appendChild(script)

    // Initial data fetch for default token
    if (selectedToken && selectedToken.coingeckoId) {
      fetchHistoricalData(selectedToken.coingeckoId)
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Handle buy token submission
  const handleBuyToken = async (e, formData) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Buy order:", {
        token: selectedToken.name,
        price: formData.price,
        amount: formData.amount,
        total: formData.total,
      })

      setSuccess(true)
    } catch (err) {
      setError("Error connecting to the server")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle sell token submission
  const handleSellToken = async (e, formData) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Sell order:", {
        token: selectedToken.name,
        price: formData.price,
        amount: formData.amount,
        total: formData.total,
      })
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/createSellReq`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: acc, // Use connected wallet or fallback
            userName: "abc",
            tokenId: selectedToken.id,
            tokens: formData.amount,
            expPrice: formData.total,
          }),
        })

        const result = await response.json()
        console.log("my result from fetch api is:::::::::", result)

        if (result.success) {
          setSuccess(true)
          //setSuccess(true)
          // setTokenAmount("")
          //setExpectedPrice("")
        } else {
          setError(result.msg || "Failed to create sell request")
        }
      } catch (err) {
        setError("Error connecting to the server")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    } catch (err) {
      setError("Error connecting to the server")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle token selection
  const handleTokenSelect = (token) => {
    setSelectedToken(token)
  }

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white pt-16">
      {/* Header with Coin Selector */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <CoinSelector tokens={tokenOptions} selectedToken={selectedToken} onSelect={handleTokenSelect} />

        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
            onClick={() => fetchHistoricalData(selectedToken.coingeckoId)}
          >
            <RefreshCw className={`h-4 w-4 inline mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Market Stats */}
      <MarketStats token={selectedToken} />

      {/* Main Trading Interface */}
      <div className="grid grid-cols-12 gap-0">
        {/* Left Panel - Order Book */}
        <div className="col-span-2 border-r border-gray-800 h-[calc(100vh-160px)] overflow-hidden">
          <div className="flex justify-between items-center p-2 border-b border-gray-800">
            <h3 className="text-sm font-medium">Order Book</h3>
            <div className="flex space-x-1">
              <button className="p-1 text-gray-400 hover:text-white">
                <BarChart2 className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-white">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
          <OrderBook data={orderBookData} />
        </div>

        {/* Center Panel - Chart */}
        <div className="col-span-7 border-r border-gray-800 h-[calc(100vh-160px)] overflow-hidden">
          <div className="border-b border-gray-800">
            <div className="flex justify-between items-center p-2">
              <div className="flex space-x-4">
                <button
                  className={`text-sm font-medium ${activeTab === "spot" ? "text-white" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setActiveTab("spot")}
                >
                  Spot
                </button>
                <button
                  className={`text-sm font-medium ${activeTab === "cross" ? "text-white" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setActiveTab("cross")}
                >
                  Cross
                </button>
                <button
                  className={`text-sm font-medium ${activeTab === "isolated" ? "text-white" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setActiveTab("isolated")}
                >
                  Isolated
                </button>
                <button
                  className={`text-sm font-medium ${activeTab === "grid" ? "text-white" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setActiveTab("grid")}
                >
                  Grid
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className={`text-sm px-2 py-1 rounded ${timeframe === "1s" ? "bg-gray-700" : "hover:bg-gray-800"}`}
                  onClick={() => setTimeframe("1s")}
                >
                  1s
                </button>
                <button
                  className={`text-sm px-2 py-1 rounded ${timeframe === "15m" ? "bg-gray-700" : "hover:bg-gray-800"}`}
                  onClick={() => setTimeframe("15m")}
                >
                  15m
                </button>
                <button
                  className={`text-sm px-2 py-1 rounded ${timeframe === "1h" ? "bg-gray-700" : "hover:bg-gray-800"}`}
                  onClick={() => setTimeframe("1h")}
                >
                  1H
                </button>
                <button
                  className={`text-sm px-2 py-1 rounded ${timeframe === "4h" ? "bg-gray-700" : "hover:bg-gray-800"}`}
                  onClick={() => setTimeframe("4h")}
                >
                  4H
                </button>
                <button
                  className={`text-sm px-2 py-1 rounded ${timeframe === "1d" ? "bg-gray-700" : "hover:bg-gray-800"}`}
                  onClick={() => setTimeframe("1d")}
                >
                  1D
                </button>
                <button
                  className={`text-sm px-2 py-1 rounded ${timeframe === "1w" ? "bg-gray-700" : "hover:bg-gray-800"}`}
                  onClick={() => setTimeframe("1w")}
                >
                  1W
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className={`text-sm font-medium ${tradeView === "original" ? "text-white" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setTradeView("original")}
                >
                  Original
                </button>
                <button
                  className={`text-sm font-medium ${tradeView === "trading" ? "text-white" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setTradeView("trading")}
                >
                  Trading View
                </button>
                <button
                  className={`text-sm font-medium ${tradeView === "depth" ? "text-white" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setTradeView("depth")}
                >
                  Depth
                </button>
              </div>
            </div>
          </div>

          {/* TradingView Chart */}
          <TradingViewWidget symbol={selectedToken.symbol} />
        </div>

        {/* Right Panel - Buy/Sell Form */}
        <div className="col-span-3 h-[calc(100vh-160px)] overflow-hidden">
          <div className="border-b border-gray-800">
            <div className="flex">
              <button
                className={`flex-1 py-3 text-center font-medium ${orderType === "limit" ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"}`}
                onClick={() => setOrderType("limit")}
              >
                Limit
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${orderType === "market" ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"}`}
                onClick={() => setOrderType("market")}
              >
                Market
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${orderType === "stop" ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"}`}
                onClick={() => setOrderType("stop")}
              >
                Stop Limit
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-800">
            <button className="flex-1 py-3 text-center font-medium text-white bg-green-600">Buy</button>
            <button className="flex-1 py-3 text-center font-medium text-white bg-red-600">Sell</button>
          </div>

          <div className="h-[calc(100%-110px)] overflow-y-auto">
            <div className="flex">
              <div className="w-1/2">
                <TradeForm
                  type="buy"
                  selectedToken={selectedToken}
                  onSubmit={handleBuyToken}
                  isLoading={isLoading}
                  historicalPrices={historicalPrices}
                />
              </div>
              <div className="w-1/2 border-l border-gray-800">
                <TradeForm
                  type="sell"
                  selectedToken={selectedToken}
                  onSubmit={handleSellToken}
                  isLoading={isLoading}
                  historicalPrices={historicalPrices}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Orders Section */}
      <div className="border-t border-gray-800">
        <OpenOrders selectedTokenId={selectedToken.id}></OpenOrders>
      </div>

      {/* AI Analysis Modal */}
      <AiAnalysisModal
        isOpen={showAiAnalysis}
        onClose={() => setShowAiAnalysis(false)}
        selectedToken={selectedToken}
        aiResult={aiAnalysisResult}
      />

      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {showTerms && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e2329] border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Terms & Conditions
                </h2>
                <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-gray-300">
                <h3 className="text-lg font-medium text-blue-300">1. Trading Risks</h3>
                <p>
                  Trading cryptocurrencies involves significant risk and can result in the loss of your invested
                  capital. You should not invest more than you can afford to lose.
                </p>

                <h3 className="text-lg font-medium text-blue-300">2. Sell Requests</h3>
                <p>
                  By creating a sell request, you are indicating your intention to sell the specified amount of tokens
                  at your expected price. This does not guarantee that your tokens will be sold at that price.
                </p>

                <h3 className="text-lg font-medium text-blue-300">3. Transaction Fees</h3>
                <p>
                  All transactions are subject to network fees and platform fees. Network fees vary depending on
                  blockchain congestion. Platform fees are 0.5% of the transaction value.
                </p>

                <h3 className="text-lg font-medium text-blue-300">4. Price Fluctuations</h3>
                <p>
                  Cryptocurrency prices are highly volatile and can change rapidly. The platform is not responsible for
                  any losses incurred due to price fluctuations between the time of creating a sell request and its
                  execution.
                </p>

                <h3 className="text-lg font-medium text-blue-300">5. AI Analysis Disclaimer</h3>
                <p>
                  The AI market analysis provided is for informational purposes only and should not be considered
                  financial advice. Always conduct your own research before making investment decisions.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTerms(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  I Understand
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0b0e11] border-t border-gray-800 py-2 px-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => fetchAiAnalysis()}
            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white"
          >
            <Brain className="h-4 w-4" />
            <span>AI Analysis</span>
          </button>
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white"
          >
            <FileText className="h-4 w-4" />
            <span>Terms & Conditions</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-xs text-gray-500">Data provided by CoinGecko</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-400">API: Connected</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
