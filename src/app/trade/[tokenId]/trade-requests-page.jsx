"use client"

import { useEffect, useState } from "react"
import { RefreshCw, AlertCircle, Filter } from "lucide-react"
import TradeCard from "./trade-card"
import LoadingSpinner from "./loading-spinner"
import { motion } from "framer-motion"

export default function TradeRequestsPage() {
  const [tradeData, setTradeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTokenId, setSelectedTokenId] = useState("LUKSO:CRYPTO")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Token options with images for filtering
  const tokenOptions = [
    {
      id: "LUKSO:CRYPTO",
      name: "Lukso",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/2992.png",
    },
    {
      id: "ETH:CRYPTO",
      name: "Ethereum",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    },
    {
      id: "BTC:CRYPTO",
      name: "Bitcoin",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    },
    {
      id: "SOL:CRYPTO",
      name: "Solana",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    },
    {
      id: "AVAX:CRYPTO",
      name: "Avalanche",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
    },
  ]

  const fetchTradeData = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/listTradeReq`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId: selectedTokenId }),
      })

      const result = await response.json()

      if (result.success) {
        // Map the data to only include the fields we want
        const formattedData = result.data.map((item) => ({
          _id: item._id,
          address: item.address,
          userName: item.userName,
          tokenId: item.tokenId,
          tokens: item.tokens,
          expPrice: item.expPrice,
        }))

        setTradeData(formattedData)
        setError(null)
      } else {
        setError(result.msg || "Failed to fetch trade data")
      }
    } catch (err) {
      setError("Error connecting to the server")
      console.error(err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTradeData()

    // Set up polling every 5 seconds
    const intervalId = setInterval(fetchTradeData, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [selectedTokenId])

  const handleRefresh = () => {
    fetchTradeData()
  }

  const handleTokenFilter = (tokenId) => {
    setSelectedTokenId(tokenId)
    setIsLoading(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="bg-black/60 border border-purple-800/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Filter className="h-5 w-5 text-purple-400" />
          Trade Requests
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Token Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {tokenOptions.map((token) => (
              <button
                key={token.id}
                onClick={() => handleTokenFilter(token.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                  selectedTokenId === token.id
                    ? "bg-purple-700 text-white"
                    : "bg-purple-900/30 text-purple-300 hover:bg-purple-900/50"
                }`}
              >
                <img src={token.image || "/placeholder.svg"} alt={token.name} className="w-5 h-5 rounded-full" />
                <span>{token.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-purple-900/30 hover:bg-purple-900/50 px-3 py-1.5 rounded-full transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 text-purple-400 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="text-purple-300">Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {tradeData.length === 0 && !error ? (
        <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-8 text-center">
          <p className="text-purple-300 text-lg">No trade requests found for {selectedTokenId}.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tradeData.map((trade) => (
            <TradeCard key={trade._id} trade={trade} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
