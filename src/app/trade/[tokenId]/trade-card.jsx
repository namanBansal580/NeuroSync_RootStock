"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Wallet, CreditCard, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Web3Service from "../web3-service"
import { useChainId } from "wagmi"



export default function TradeCard({ trade }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const chainId=useChainId();
  const router = useRouter()

  const handleBuy = async () => {
    const web3Service=new Web3Service(chainId);
    const account=await web3Service.getAccount();
    console.log("Handle buy function running");
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
          sender_address:trade.address,
          userName,
          tradeId: trade._id,
        }),
      })

      const result = await response.json()
      console.log("my Result is ::::::::::",result);
      if (result.success) {
       // Redirect to waiting page with necessary params
        router.push(
          `/trade/waiting/buyer?seller_address=${trade.address}&tradeId=${trade._id}`,
         )
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

  // Truncate address for display
  const truncatedAddress = `${trade.address.substring(0, 6)}...${trade.address.substring(trade.address.length - 4)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-purple-950 to-black rounded-xl overflow-hidden shadow-lg border border-purple-800/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-800/30 p-2 rounded-lg">
              <CreditCard className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">{trade.tokenId}</h3>
          </div>
          <div className="bg-purple-900/50 px-3 py-1 rounded-full">
            <p className="text-purple-300 text-sm font-medium">{trade.tokens}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-purple-400" />
            <p className="text-gray-300">{trade.userName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-purple-400" />
            <p className="text-gray-300">{truncatedAddress}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Expected Price</p>
            <p className="text-2xl font-bold text-white">{trade.expPrice}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBuy}
            disabled={isBuying}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
              isBuying ? "bg-purple-800/50 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"
            }`}
          >
            {isBuying ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing</span>
              </>
            ) : (
              <>
                <span>Buy Now</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ height: "4px" }}
        animate={{ width: isHovered ? "100%" : "30%" }}
        className="bg-gradient-to-r from-purple-600 to-purple-400 h-1"
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
