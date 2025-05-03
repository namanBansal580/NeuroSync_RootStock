"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { RefreshCw, AlertCircle } from "lucide-react"
import TradeCard from "./trade-card"
import LoadingSpinner from "./loading-spinner"



export default function TradeRequestsPage() {
  const [tradeData, setTradeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()
  const tokenId = params.tokenId 

  const fetchTradeData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/listTradeReq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId:"LUKSO:CRYPTO" }),
      })
      
      const result = await response.json()
      console.log("My response data is::::",response);
      

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
    }
  }

  useEffect(() => {
    fetchTradeData()

    // Set up polling every 5 seconds
    const intervalId = setInterval(fetchTradeData, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [tokenId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-20  ">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Trade Requests for <span className="text-purple-400">{tokenId}</span>
          </h1>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-400 animate-spin-slow" />
            <span className="text-purple-300 text-sm">Auto-refreshing</span>
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
            <p className="text-purple-300 text-lg">No trade requests found for this token.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradeData.map((trade) => (
              <TradeCard key={trade._id} trade={trade} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
