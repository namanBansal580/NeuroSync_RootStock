"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Clock, ArrowRight, RefreshCw, AlertTriangle, Loader2, CreditCard, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import StripePaymentModal from "./StripeConnect"
import Web3Service from "../../web3-service"
import { useChainId } from "wagmi"
import { getAccount } from "@wagmi/core"
import { config } from "@/app/components/config"
import Image from "next/image"


// Update the interface to match the new API response format


export default function WaitingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const chainId=useChainId();
  const acc=getAccount(config)
  
  const rec_address = searchParams.get("rec_address") || acc.address
  const sender_address = searchParams.get("seller_address") || searchParams.get("sender_address") || ""
  const tradeId = searchParams.get("tradeId") || ""
  const userName = searchParams.get("userName") || ""
  
  // Update the state to include both reqData and tradeData
  const [tradeStatus, setTradeStatus] = useState(null)
  const [tradeData, setTradeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expired, setExpired] = useState(false)
  const [accountId, setaccountId] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
           
  // Update the fetchTradeStatus function to handle the new response format

  const fetchUserData= async () => {
    try {
      const web3Service=new Web3Service(chainId);
      const account=await web3Service.getAccount();
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/fetchUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rec_address: account,
        }),
      })

      const result = await response.json()
      console.log("My Result Fetched is::::", result)
      
      if (result.success) {
        setaccountId(result.daa.account_id);
      } 
    } catch (err) {
      console.error("Error fetching trade status:", err)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }
  const fetchTradeStatus = async () => {
    try {
      const web3Service=new Web3Service(chainId);
      const account=await web3Service.getAccount();
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/listParticularReq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rec_address: account,
          sender_address,
          tradeId,
        }),
      })

      const result = await response.json()
      console.log("My Result Fetched is::::", result)
      
      if (result.success) {
        setTradeStatus(result.reqData)
        setTradeData(result.tradeData)
        setExpired(false)
      } else {
        setExpired(true)
       // setError(result.msg || "Request expired or not found")
      }
    } catch (err) {
      console.error("Error fetching trade status:", err)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!sender_address || !tradeId) {
      setError("Missing required parameters")
      setLoading(false)
      return
    }
    fetchUserData();
    fetchTradeStatus()

    // Poll for updates every 3 seconds
    const intervalId = setInterval(fetchTradeStatus, 3000)

    return () => clearInterval(intervalId)
  }, [rec_address, sender_address, tradeId])

  const handleProcess = () => {
    console.log("handle Process");
    
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    // Here you would update the trade status or redirect
    alert("Payment processed successfully! Trade completed.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-blue-950 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Trade Status</h2>
          <p className="text-blue-300">Please wait while we fetch your trade request...</p>
        </div>
      </div>
    )
  }

  if (error || expired) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-6">
      
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/50 border border-red-500/30 rounded-xl p-8 max-w-md w-full"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-900/30 p-4 rounded-full mb-6">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {expired ? "Request Expired" : "Error Loading Trade"}
            </h2>
            <p className="text-gray-300 mb-6">{error || "This trade request has expired or is no longer valid."}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <span>Go Back</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Calculate payment amount from trade data
  const paymentAmount = tradeData ? Number.parseFloat(tradeData.expPrice) * Number.parseFloat(tradeData.tokens) : 0

  // Seller's Stripe account ID (in a real app, this would come from your database)
  const sellerAccountId = "acct_1REQyZI63fbocn3a" // Using the dummy account ID provided

  return (
    <div className="min-h-screen  p-6 flex items-center justify-center pt-20 overflow-x-hidden z-50">
      <div className="absolute top-0 scale-[160%] left-[10.5vw]  h-[1200px] opacity-70 -z-50 ">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10001-wJDNvR3BxRjKDUMGqePNheyCNprAJr.svg"
                  alt="Background pattern"
                  width={920}
                  height={800}
                  className="object-contain -z-50"
                />
        </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 border border-blue-700/30 rounded-xl p-8  w-full"
      >
        {/* Trade Status Header */}
  

       
        <div className="flex justify-between items-center mb-8 ">
          <h1 className="text-2xl font-bold text-white">Trade Request Status</h1>
          <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-full">
            <RefreshCw className="h-4 w-4 text-blue-400 animate-spin-slow" />
            <span className="text-blue-300 text-sm">Auto-updating</span>
          </div>
        </div>
    <div>
    <div className="flex gap-12">
    
        {/* Trade Details */}
        {tradeData && (
          <div className="bg-blue-900/20 rounded-xl  p-6 w-[45vw] mb-8">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-400" />
              Trade Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatusCard title="Token ID" value={tradeData.tokenId} />
              <StatusCard title="Token Amount" value={tradeData.tokens} />
              <StatusCard title="Expected Price" value={`$${tradeData.expPrice}`} />
              <StatusCard title="Total Value" value={`$${paymentAmount.toFixed(2)}`} highlight={true} />
              <StatusCard title="Seller Username" value={tradeData.userName} />
            </div>
          </div>
        )}
    {/* right cards */}
    <div className=" bg-blue-900/10 w-[40vw] h-fit">

        {/* Trade Identifiers */}
          <div className=" rounded-xl p-6   mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatusCard title="Trade ID" value={tradeId} truncate={true} />
            <StatusCard title="Your Username" value={userName} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatusCard title="Your Address" value={sender_address} truncate={true} />
            <StatusCard title="Receiver Address" value={rec_address} truncate={true} />
          </div>
        </div>
        </div>
        {/* Acceptance Status */}
        <div className="bg-blue-900/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Acceptance Status
          </h3>

    </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AcceptanceStatus title="Seller Acceptance" isAccepted={tradeStatus?.isSellerAccepted || false} />
            <AcceptanceStatus title="Buyer Acceptance" isAccepted={tradeStatus?.isBuyerAccepted || false} />
            <AcceptanceStatus title="Seller Paid" isAccepted={tradeStatus?.paybySeller || false} />
            <AcceptanceStatus title="Buyer Paid" isAccepted={tradeStatus?.paybyBuyer || false} />
          </div>
        </div>

        {/* Payment Notice */}
        <div className="bg-gradient-to-r from-blue-900/30 to-black/30 rounded-xl p-6 mb-8 border border-blue-700/30">
          <div className="flex items-start gap-4">
            <div className="bg-blue-900/50 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Payment Required</h3>
              <p className="text-gray-300 mb-4">
                The seller has locked the tokens for this trade. To complete the transaction and receive your tokens,
                please process the payment of{" "}
                <span className="text-white font-medium">${paymentAmount.toFixed(2)}</span>.
              </p>
              <p className="text-sm text-blue-300">
                Payments are processed securely through Stripe. Your tokens will be released immediately after payment.
              </p>
            </div>
          </div>
        </div>
       
        {/* Process Button */}
        <button  onClick={handleProcess}>dsdsdsdsds</button>
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProcess}
            
            className={`px-8 py-4 rounded-lg flex items-center gap-3 text-lg font-medium transition-all duration-300 ${
              tradeStatus?.isSellerAccepted && tradeStatus?.isBuyerAccepted
                ? "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-600/20"
                : "bg-blue-900/30 text-blue-300/50 cursor-not-allowed"
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Process Payment</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stripe Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <StripePaymentModal
            amount={paymentAmount}
            sender_address={sender_address}
            trade_Id={tradeData._id}
            rec_address={rec_address}
            sellerAccountId={accountId}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
            tokenId={tradeData?.tokenId || ""}
            tokenAmount={tradeData?.tokens || ""}
            trade_id={tradeId}
          />
        )}
      </AnimatePresence>
    </div>
  )
}



function StatusCard({ title, value, truncate = false, highlight = false }) {
  const displayValue =
    truncate && value.length > 12 ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}` : value

  return (
    <div
      className={`${
        highlight ? "bg-blue-800/30 border-blue-600/30" : "bg-blue-950/30 border-blue-800/20"
      } border rounded-lg p-4`}
    >
      <p className="text-sm text-blue-400 mb-1">{title}</p>
      <p className={`${highlight ? "text-white font-bold text-lg" : "text-white font-medium"} truncate`} title={value}>
        {displayValue}
      </p>
    </div>
  )
}



function AcceptanceStatus({ title, isAccepted }) {
  return (
    <div className="flex items-center justify-between bg-black/30 rounded-lg p-4">
      <div>
        <p className="text-gray-300">{title}</p>
      </div>
      <div className="flex items-center gap-2">
        {isAccepted ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-medium">Accepted</span>
          </>
        ) : (
          <>
            <Clock className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-medium">Waiting</span>
          </>
        )}
      </div>
    </div>
  )
}
