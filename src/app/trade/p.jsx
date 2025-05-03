"use client"

import React, { useState, useEffect, use } from "react"
import { ChevronDown, DollarSign, Wallet, Eye, RefreshCw, AlertCircle, Check, Brain, FileText, X } from "lucide-react"
// import TradeRequestsPage from "[]"
import { motion, AnimatePresence } from "framer-motion"
import TradeRequestsPage from "./[tokenId]/page"
import Web3Service from "./web3-service"
import { useChainId } from "wagmi"
import { getAccount } from "@wagmi/core"
import { config } from "../components/config"

// Token options with images
const tokenOptions = [
  {
    id: "LUKSO:CRYPTO",
    symbol: "CRYPTO:LYXUSD",
    name: "Lukso",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/2992.png",
  },
  {
    id: "ETH:CRYPTO",
    symbol: "CRYPTO:ETHUSD",
    name: "Ethereum",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  },
  {
    id: "BTC:CRYPTO",
    symbol: "CRYPTO:BTCUSD",
    name: "Bitcoin",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
  },
  {
    id: "SOL:CRYPTO",
    symbol: "CRYPTO:SOLUSD",
    name: "Solana",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
  },
  {
    id: "AVAX:CRYPTO",
    symbol: "CRYPTO:AVAXUSD",
    name: "Avalanche",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
  },
]
// config
  const acc=getAccount(config)
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
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tv_chart_container",
      })
    }
  }, [symbol])

  return <div id="tv_chart_container" ref={containerRef} />
}

export default function TradePage() {
  const [selectedToken, setSelectedToken] = useState(tokenOptions[0])
  const [tokenAmount, setTokenAmount] = useState("")
  const [expectedPrice, setExpectedPrice] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [userName, setUserName] = useState("Naman@123") // Hardcoded for demo
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showAiAnalysis, setShowAiAnalysis] = useState(false)
  const [viewRequests, setViewRequests] = useState(false)

  // Connect wallet function
  const web3Service=new Web3Service(useChainId());
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
  }, [])

  // Handle sell token submission
  const handleSellToken = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/createSellReq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: acc.address, // Use connected wallet or fallback
          userName: userName,
          tokenId: selectedToken.id,
          tokens: tokenAmount,
          expPrice: expectedPrice,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        setSuccess(true)
        setTokenAmount("")
        setExpectedPrice("")
      } else {
        setError(result.msg || "Failed to create sell request")
      }
    } catch (err) {
      setError("Error connecting to the server")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pt-10">
      {/* Keep the existing background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-0 -left-1/4 w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute top-1/3 right-0 w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "12s" }}
        ></div>
        <div
          className="absolute -bottom-1/4 left-1/4 w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: "10s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Background SVG */}
      <div className="absolute inset-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute -top-[10vh] left-[40vw] w-[1000px] h-[1000px] object-cover mix-blend-lighten"
        >
          <source src="https://framerusercontent.com/assets/GifwF0GC6kftxDgniF6lsk9E9wc.mp4" type="video/mp4" />
        </video>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] opacity-30 blur-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full" />
        <div className="absolute top-20 left-1/2 w-[1000px] h-[1000px] opacity-30 blur-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-8">
        {/* Wallet Connection */}
        <div className="flex justify-end mb-6">
          <button
            onClick={connectWallet}
            className="flex items-center gap-2 bg-purple-900/50 hover:bg-purple-800 px-4 py-2 rounded-lg border border-purple-700/50 transition-all duration-300"
          >
            <Wallet className="h-4 w-4 text-purple-400" />
            <span>
              {walletAddress
                ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                : "Connect Wallet"}
            </span>
          </button>
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Sell Form */}
          <div className="lg:col-span-1">
            <div className="bg-black/60 border border-purple-800/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-400" />
                Sell Tokens
              </h2>

              <form onSubmit={handleSellToken} className="space-y-6">
                {/* Token Selector */}
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
                                setSelectedToken(token)
                                setIsDropdownOpen(false)
                              }}
                              className="flex items-center gap-3 p-3 hover:bg-purple-900/30 cursor-pointer transition-all duration-200"
                            >
                              <img
                                src={token.image || "/placeholder.svg"}
                                alt={token.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span>{token.name}</span>
                              {selectedToken.id === token.id && <Check className="h-4 w-4 text-green-400 ml-auto" />}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

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

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAiAnalysis(!showAiAnalysis)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <Brain className="h-4 w-4" />
                  <span>AI Analysis</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setViewRequests(!viewRequests)}
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Requests</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTerms(!showTerms)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <FileText className="h-4 w-4" />
                  <span>Terms & Conditions</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Panel - Chart */}
          <div className="lg:col-span-3">
            <div className="bg-black/60 border border-purple-800/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedToken.image || "/placeholder.svg"}
                    alt={selectedToken.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <h2 className="text-xl font-bold text-white">{selectedToken.name} Chart</h2>
                </div>
                <div className="text-sm text-purple-400">Symbol: {selectedToken.symbol}</div>
              </div>

              {/* TradingView Chart */}
              <TradingViewWidget symbol={selectedToken.symbol} />
            </div>
          </div>
        </div>

        {/* AI Analysis Modal */}
        <AnimatePresence>
          {showAiAnalysis && (
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
                  <button onClick={() => setShowAiAnalysis(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-900/20 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Market Sentiment</h3>
                    <p className="text-gray-300">
                      The current market sentiment for {selectedToken.name} is moderately bullish. Technical indicators
                      suggest a potential upward trend in the next 24-48 hours.
                    </p>
                  </div>

                  <div className="bg-purple-900/20 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Price Prediction</h3>
                    <p className="text-gray-300">
                      Based on historical data and current market conditions, our AI predicts a price range of $230-$250
                      in the short term (1-3 days) and potentially reaching $270-$290 in the medium term (1-2 weeks).
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
                      Consider setting your expected price between $240-$260 for optimal selling opportunity based on
                      current market trends. Monitor market closely for any sudden changes in trading volume or
                      sentiment.
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
                className="bg-black/90 border border-purple-700/50 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-400" />
                    Terms & Conditions
                  </h2>
                  <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4 text-gray-300">
                  <h3 className="text-lg font-medium text-purple-300">1. Trading Risks</h3>
                  <p>
                    Trading cryptocurrencies involves significant risk and can result in the loss of your invested
                    capital. You should not invest more than you can afford to lose.
                  </p>

                  <h3 className="text-lg font-medium text-purple-300">2. Sell Requests</h3>
                  <p>
                    By creating a sell request, you are indicating your intention to sell the specified amount of tokens
                    at your expected price. This does not guarantee that your tokens will be sold at that price.
                  </p>

                  <h3 className="text-lg font-medium text-purple-300">3. Transaction Fees</h3>
                  <p>
                    All transactions are subject to network fees and platform fees. Network fees vary depending on
                    blockchain congestion. Platform fees are 0.5% of the transaction value.
                  </p>

                  <h3 className="text-lg font-medium text-purple-300">4. Price Fluctuations</h3>
                  <p>
                    Cryptocurrency prices are highly volatile and can change rapidly. The platform is not responsible
                    for any losses incurred due to price fluctuations between the time of creating a sell request and
                    its execution.
                  </p>

                  <h3 className="text-lg font-medium text-purple-300">5. AI Analysis Disclaimer</h3>
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
                    className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
                  >
                    I Understand
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trade Requests Section */}
          
            <div className="mt-12 pb-36">
              <TradeRequestsPage></TradeRequestsPage>
            {/* <TradeRequestsPage /> */}
          </div>
        
      </div>
    </div>
  )
}
