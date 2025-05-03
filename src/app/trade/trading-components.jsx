"use client"

import React, { useRef, useEffect, useState } from "react"
import { ChevronDown, DollarSign, Wallet, Eye, RefreshCw, AlertCircle, Check, Brain, FileText, X, BarChart2, Settings } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

// TradingView Widget Component
export const TradingViewWidget = ({ symbol }) => {
  const containerRef = useRef(null)

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

// Token Selector Component
export const TokenSelector = ({ selectedToken, tokenOptions, onSelectToken }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-sm text-purple-300">Select Token</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between bg-purple-900/30 border border-purple-700/30 rounded-lg p-3 hover:bg-purple-900/50 transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <img
              src={selectedToken.image || "/placeholder.svg"}
              alt={selectedToken.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{selectedToken.name}</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-purple-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 mt-2 w-full bg-black/90 border border-purple-700/30 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden"
            >
              {tokenOptions.map((token) => (
                <div
                  key={token.id}
                  onClick={() => {
                    onSelectToken(token)
                    setIsDropdownOpen(false)
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-purple-900/30 cursor-pointer transition-all duration-200"
                >
                  <img src={token.image || "/placeholder.svg"} alt={token.name} className="w-6 h-6 rounded-full" />
                  <span>{token.name}</span>
                  {selectedToken.id === token.id && <Check className="h-4 w-4 text-green-400 ml-auto" />}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Sell Form Component
export const SellForm = ({ selectedToken, tokenOptions, onSelectToken, handleSellToken, isLoading, error, success }) => {
  const [tokenAmount, setTokenAmount] = useState("")
  const [expectedPrice, setExpectedPrice] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()
    handleSellToken(e, tokenAmount, expectedPrice)
  }

  return (
    <div className="bg-black/60 border border-purple-800/30 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-purple-400" />
        Sell Tokens
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Token Selector */}
        <TokenSelector selectedToken={selectedToken} tokenOptions={tokenOptions} onSelectToken={onSelectToken} />

        {/* Token Amount */}
        <div className="space-y-2">
          <label className="text-sm text-purple-300">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              className="w-full bg-purple-900/30 border border-purple-700/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Expected Price */}
        <div className="space-y-2">
          <label className="text-sm text-purple-300">Expected Price (USD)</label>
          <div className="relative">
            <input
              type="number"
              value={expectedPrice}
              onChange={(e) => setExpectedPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              className="w-full bg-purple-900/30 border border-purple-700/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm">Sell request created successfully!</p>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Sell Tokens</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}

// Action Buttons Component
export const ActionButtons = ({ onShowAiAnalysis, onViewRequests, onShowTerms }) => {
  return (
    <div className="mt-6 space-y-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onShowAiAnalysis}
        className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
      >
        <Brain className="h-4 w-4" />
        <span>AI Analysis</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onViewRequests}
        className="w-full bg-purple-700 hover:bg-purple-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
      >
        <Eye className="h-4 w-4" />
        <span>View Requests</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onShowTerms}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
      >
        <FileText className="h-4 w-4" />
        <span>Terms & Conditions</span>
      </motion.button>
    </div>
  )
}

// Market Stats Component
export const MarketStats = ({ token, tokenData }) => {
  return (
    <div className="bg-black/60 border border-purple-800/30 rounded-xl p-4 backdrop-blur-sm mb-6">
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <img src={token.image || "/placeholder.svg"} alt={token.name} className="w-8 h-8 mr-2 rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-white">{token.name}/USDT</h2>
            <div className="flex items-center text-sm">
              {token.tags?.map((tag, index) => (
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
          <div className="text-2xl font-bold text-white">${tokenData.price.toFixed(2)}</div>
          <div className={`text-sm ${tokenData.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {tokenData.change >= 0 ? "+" : ""}
            {tokenData.change}%
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-400">24h High</div>
          <div className="text-sm text-white">${tokenData.high}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">24h Low</div>
          <div className="text-sm text-white">${tokenData.low}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">24h Volume({token.name})</div>
          <div className="text-sm text-white">{tokenData.volume}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">24h Volume(USDT)</div>
          <div className="text-sm text-white">{tokenData.volumeUsd}</div>
        </div>
      </div>
    </div>
  )
}

// Order Book Component
export const OrderBook = ({ asks, bids, currentPrice }) => {
  return (
    <div className="h-full flex flex-col bg-black/60 border border-purple-800/30 rounded-xl overflow-hidden">
      <div className="flex justify-between items-center p-2 border-b border-gray-800">
        <h3 className="text-sm font-medium text-white">Order Book</h3>
        <div className="flex space-x-1">
          <button className="p-1 text-gray-400 hover:text-white">
            <BarChart2 className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-white">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2 px-2 text-xs text-gray-400 py-2">
        <div className="w-1/3 text-left">Price (USDT)</div>
        <div className="w-1/3 text-right">Amount</div>
        <div className="w-1/3 text-right">Total</div>
      </div>

      {/* Asks (Sell Orders) - Displayed in reverse order */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {asks.map((order, index) => (
          <div
            key={`ask-${index}`}
            className="flex justify-between items-center text-xs py-1 px-2 hover:bg-gray-800/50 relative"
          >
            <div className="w-1/3 text-left text-red-500">{order.price.toFixed(2)}</div>
            <div className="w-1/3 text-right">{order.amount.toFixed(3)}</div>
            <div className="w-1/3 text-right">{order.total.toFixed(2)}</div>
            <div
              className="absolute left-0 h-full bg-red-500/10"
              style={{ width: `${Math.min((order.total / 50) * 100, 100)}%`, zIndex: -1 }}
            ></div>
          </div>
        ))}
      </div>

      {/* Current Price */}
      <div className="py-2 px-2 border-y border-gray-700 text-center">
        <div className="text-lg font-semibold text-white">{currentPrice.toFixed(2)}</div>
        <div className="text-xs text-gray-400">≈ ${currentPrice.toFixed(2)}</div>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {bids.map((order, index) => (
          <div
            key={`bid-${index}`}
            className="flex justify-between items-center text-xs py-1 px-2 hover:bg-gray-800/50 relative"
          >
            <div className="w-1/3 text-left text-green-500">{order.price.toFixed(2)}</div>
            <div className="w-1/3 text-right">{order.amount.toFixed(3)}</div>
            <div className="w-1/3 text-right">{order.total.toFixed(2)}</div>
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

// Open Orders Component

// AI Analysis Modal Component
export const AiAnalysisModal = ({ isOpen, onClose, selectedToken, tokenPrice }) => {
  if (!isOpen) return null

  return (
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
        className="bg-black/90 border border-purple-700/50 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-400" />
            AI Market Analysis: {selectedToken.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-900/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-purple-300 mb-2">Market Sentiment</h3>
            <p className="text-gray-300">
              The current market sentiment for {selectedToken.name} is moderately bullish. Technical indicators suggest
              a potential upward trend in the next 24-48 hours.
            </p>
          </div>

          <div className="bg-purple-900/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-purple-300 mb-2">Price Prediction</h3>
            <p className="text-gray-300">
              Based on historical data and current market conditions, our AI predicts a price range of $
              {(tokenPrice * 0.95).toFixed(2)}-${(tokenPrice * 1.05).toFixed(2)} in the short term (1-3 days) and
              potentially reaching ${(tokenPrice * 1.1).toFixed(2)}-${(tokenPrice * 1.15).toFixed(2)} in the medium term
              (1-2 weeks).
            </p>
          </div>

          <div className="bg-purple-900/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-purple-300 mb-2">Trading Volume Analysis</h3>
            <p className="text-gray-300">
              Trading volume has increased by 23% in the last 24 hours, indicating growing interest in{" "}
              {selectedToken.name}. This could lead to increased price volatility in the coming days.
            </p>
          </div>

          <div className="bg-purple-900/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-purple-300 mb-2">Recommendation</h3>
            <p className="text-gray-300">
              Consider setting your expected price between ${(tokenPrice * 1.02).toFixed(2)}-$
              {(tokenPrice * 1.08).toFixed(2)} for optimal selling opportunity based on current market trends. Monitor
              market closely for any sudden changes in trading volume or sentiment.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This analysis is generated by AI and should not be considered financial advice. Always do your own research
            before making investment decisions.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Terms Modal Component
export const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
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
        className="bg-black/90 border border-purple-700/50 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            Terms & Conditions
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-gray-300">
          <h3 className="text-lg font-medium text-purple-300">1. Trading Risks</h3>
          <p>
            Trading cryptocurrencies involves significant risk and can result in the loss of your invested capital. You
            should not invest more than you can afford to lose.
          </p>

          <h3 className="text-lg font-medium text-purple-300">2. Sell Requests</h3>
          <p>
            By creating a sell request, you are indicating your intention to sell the specified amount of tokens at your
            expected price. This does not guarantee that your tokens will be sold at that price.
          </p>

          <h3 className="text-lg font-medium text-purple-300">3. Transaction Fees</h3>
          <p>
            All transactions are subject to network fees and platform fees. Network fees vary depending on blockchain
            congestion. Platform fees are 0.5% of the transaction value.
          </p>

          <h3 className="text-lg font-medium text-purple-300">4. Price Fluctuations</h3>
          <p>
            Cryptocurrency prices are highly volatile and can change rapidly. The platform is not responsible for any
            losses incurred due to price fluctuations between the time of creating a sell request and its execution.
          </p>

          <h3 className="text-lg font-medium text-purple-300">5. AI Analysis Disclaimer</h3>
          <p>
            The AI market analysis provided is for informational purposes only and should not be considered financial
            advice. Always conduct your own research before making investment decisions.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
          >
            I Understand
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// CoinGecko API service
export const coinGeckoService = {
  API_KEY: "CG-hqMGzd5r3hMZFU7A9EZ1Mkcw",
  BASE_URL: "https://api.coingecko.com/api/v3",

  async getTopCoins(limit = 10) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
        {
          headers: {
            "x-cg-demo-api-key": this.API_KEY,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching top coins:", error)
      return []
    }
  },

  async getCoinData(coinId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
        {
          headers: {
            "x-cg-demo-api-key": this.API_KEY,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching data for coin ${coinId}:`, error)
      return null
    }
  },

  async getMarketChart(coinId, days = 7) {
    try {
      const response = await fetch(`${this.BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`, {
        headers: {
          "x-cg-demo-api-key": this.API_KEY,
        },
      })

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching market chart for coin ${coinId}:`, error)
      return null
    }
  },

  async searchCoins(query) {
    try {
      const response = await fetch(`${this.BASE_URL}/search?query=${query}`, {
        headers: {
          "x-cg-demo-api-key": this.API_KEY,
        },
      })

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error searching for coins with query ${query}:`, error)
      return null
    }
  }
}
