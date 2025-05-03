"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, Search } from "lucide-react"
import Web3Service from "./web3-service" // Update this path to match your project structure
import { useChainId } from "wagmi"

export const OpenOrders = ({ selectedTokenId }) => {
  const router = useRouter()
  const chainId = useChainId()

  // State variables
  const [activeTab, setActiveTab] = useState("open")
  const [tradeData, setTradeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [isBuying, setIsBuying] = useState(false)

  // Fetch trade data when component mounts or selectedTokenId changes
  useEffect(() => {
    if (selectedTokenId) {
      fetchTradeData()
    }
    const intervalId = setInterval(fetchTradeData, 3000)

    return () => clearInterval(intervalId)
  }, [selectedTokenId])

  const handleBuy = async (trade) => {
    const web3Service = new Web3Service(chainId)
    const account = await web3Service.getAccount()
    console.log("Handle buy function running")
    setIsBuying(true)

    try {
      // Hardcoded values for now - these would come from your auth system in a real app
      const userName = "naman33@@#99"

      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/createBuyReq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rec_address: account,
          sender_address: trade.address,
          userName,
          tradeId: trade._id,
        }),
      })

      const result = await response.json()
      console.log("my Result is ::::::::::", result)
      if (result.success) {
        // Redirect to waiting page with necessary params
        router.push(`/trade/waiting/buyer?seller_address=${trade.address}&tradeId=${trade._id}`)
      } else {
        alert("Failed to create buy request: " + (result.msg || "Unknown error"))
      }
    } catch (err) {
      console.error("Error creating buy request:", err)
      alert("Error creating buy request. Please try again.")
    } finally {
      setIsBuying(false)
    }
  }

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
          createdAt: new Date(item.createdAt).toLocaleString(),
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

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="p-4 bg-black/60 border border-purple-800/30 rounded-xl mt-6">
      <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === "open" ? "text-white border-b-2 border-yellow-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("open")}
        >
          Open Orders({tradeData.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === "history" ? "text-white border-b-2 border-yellow-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Order History
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === "trade" ? "text-white border-b-2 border-yellow-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("trade")}
        >
          Trade History
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === "funds" ? "text-white border-b-2 border-yellow-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("funds")}
        >
          Funds
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === "grid" ? "text-white border-b-2 border-yellow-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("grid")}
        >
          Grid Orders
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={fetchTradeData}
          disabled={isRefreshing}
          className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>

        <div className="flex items-center">
          <input type="checkbox" id="hideOtherPairs" className="mr-2" />
          <label htmlFor="hideOtherPairs" className="text-xs text-gray-400">
            Hide Other Pairs
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-700">
              <th className="px-2 py-2 text-left">Date</th>
              <th className="px-2 py-2 text-left">Username</th>
              <th className="px-2 py-2 text-left">Token ID</th>
              <th className="px-2 py-2 text-left">Amount</th>
              <th className="px-2 py-2 text-left">Price</th>
              <th className="px-2 py-2 text-left">Total</th>
              <th className="px-2 py-2 text-left">Address</th>
              <th className="px-2 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="px-2 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 text-blue-500">
                      <RefreshCw className="h-8 w-8 animate-spin" />
                    </div>
                    <p className="text-gray-400">Loading trade data...</p>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="px-2 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 text-red-500">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-red-400">{error}</p>
                  </div>
                </td>
              </tr>
            ) : tradeData.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-2 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 text-gray-500">
                      <Search className="h-12 w-12" />
                    </div>
                    <p className="text-gray-400">You have no open orders.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tradeData.map((trade) => {
                // Calculate total value
                const total = Number.parseFloat(trade.tokens) * Number.parseFloat(trade.expPrice)

                return (
                  <tr key={trade._id} className="border-b border-gray-800 hover:bg-gray-900/30">
                    <td className="px-2 py-3 text-sm text-gray-300">{trade.createdAt}</td>
                    <td className="px-2 py-3 text-sm text-gray-300">{trade.userName}</td>
                    <td className="px-2 py-3 text-sm text-gray-300">{trade.tokenId}</td>
                    <td className="px-2 py-3 text-sm text-gray-300">{trade.tokens}</td>
                    <td className="px-2 py-3 text-sm text-gray-300">${trade.expPrice}</td>
                    <td className="px-2 py-3 text-sm text-gray-300">${total.toFixed(2)}</td>
                    <td className="px-2 py-3 text-sm text-gray-300" title={trade.address}>
                      {formatAddress(trade.address)}
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => handleBuy(trade)}
                        disabled={isBuying}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-xs font-medium transition-colors"
                      >
                        {isBuying ? "Processing..." : "Buy"}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
