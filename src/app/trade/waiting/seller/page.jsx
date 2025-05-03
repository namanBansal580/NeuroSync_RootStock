"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Clock, RefreshCw, AlertTriangle, Loader2, ShieldCheck, DollarSign } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Web3Service from "../../web3-service" // Update this path to match your project structure
import { useChainId } from "wagmi"
import { getAccount } from "@wagmi/core"
import { config } from "@/app/components/config"
import Image from "next/image"

// Import the new modal components at the top of the file
import StripeAccountModal from "./components/stripe-account-status"
import AccountStatusModal from "./components/account-status-modal"

export default function WaitingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const webService = new Web3Service(useChainId())
  const rec_address = searchParams.get("rec_address") || "" // use dummy request address for this
  // config
  const acc = getAccount(config)
  const sender_address = searchParams.get("seller_address") || acc.address
  const tradeId = searchParams.get("tradeId") || ""
  const userName = searchParams.get("userName") || ""
  console.log(sender_address + ":::::::::::::::::::::::::")

  // State management
  const [tradeStatus, setTradeStatus] = useState(null)
  const [tradeData, setTradeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expired, setExpired] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [processingCreate, setProcessingCreate] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [email, setEmail] = useState("")
  
  const [dialogType, setDialogType] = useState(null) // "confirm", "success", "error"
  const [dialogMessage, setDialogMessage] = useState("")
  const [web3Service, setWeb3Service] = useState(null)
  const [showStripeModal, setShowStripeModal] = useState(false)
  const [showAccountStatusModal, setShowAccountStatusModal] = useState(false)
  const [accountData, setAccountData] = useState(null)
  const [processingStripe, setProcessingStripe] = useState(false)

  // Initialize Web3Service
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          const service = new Web3Service(Number.parseInt(chainId, 16))
          setWeb3Service(service)
        }
      } catch (error) {
        console.error("Failed to initialize Web3:", error)
      }
    }

    initWeb3()
  }, [])

  // Fetch trade status
  const fetchTradeStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/listParticularReq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rec_address,
          sender_address,
          tradeId,
        }),
      })

      const result = await response.json()
      console.log("Trade data fetched:", result)

      if (result.success) {
        setTradeStatus(result.reqData)
        setTradeData(result.tradeData)
        setExpired(false)
      } else {
        console.log("My result success is not true in this")

        //  router.push('/trade')
        setExpired(true)
        //  setError(result.msg || "Request expired or not found")
      }
    } catch (err) {
      console.error("Error fetching trade status:", err)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  // Update API after successful payment
  const updateTradeStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/acceptBuyerRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_address,
          rec_address,
          tradeId,
        }),
      })

      const result = await response.json()
      console.log("Trade status updated:", result)

      if (result.success) {
        // Refresh trade data
        await fetchTradeStatus()
        return true
      } else {
        throw new Error(result.msg || "Failed to update trade status")
      }
    } catch (error) {
      console.error("Error updating trade status:", error)
      throw error
    }
  }

  useEffect(() => {
    if (!sender_address || !tradeId) {
      setError("Missing required parameters")
      setLoading(false)
      return
    }

    fetchTradeStatus()

    // Poll for updates every 3 seconds
    const intervalId = setInterval(fetchTradeStatus, 3000)

    return () => clearInterval(intervalId)
  }, [rec_address, sender_address, tradeId])

  // Handle locking funds (pay funds)
  const handleCreateStripeAccount = async () => {
    console.log("Handle Create Stripe Account is Running ");
    
    try {
      setProcessingCreate(true)

      // Check if user already has a Stripe account
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/fetchUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerAddress: acc.address,
        }),
      })

      const result = await response.json()
      console.log("My Result Fetched is:::::"+result);
      
      if (result.success && result.data && result.data.length > 0 && result.data[0].account_id) {
        // User already has an account, show account status modal
        setAccountData(result.data[0])
        setShowAccountStatusModal(true)
      } else {
        // No account found, show create account modal
        setShowStripeModal(true)
      }
    } catch (error) {
      console.error("Error checking Stripe account:", error)
      showErrorDialog("Failed to check Stripe account status. Please try again.")
    } finally {
      setProcessingCreate(false)
    }
  }

  // Add this function to handle the email submission from the modal
  const handleStripeEmailSubmit = async (email) => {
    try {
      console.log("My Email is::::::"+email);
      console.log("my Address is:::"+acc.address);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/createStripe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerEmail: email,
          sellerAddress: acc.address,
        }),
      })

      const result = await response.json()
      console.log("My Result is::::::::",result);
      

      if (!result.success) {
        throw new Error(result.msg || "Failed to create Stripe account")
      }

      // Redirect to Stripe onboarding URL after a short delay
      setTimeout(() => {
        window.location.href = result.onboardingUrl
      }, 1500)
    } catch (error) {
      console.error("Error creating Stripe account:", error)
      throw error
    }
  }

  // Add this function to handle continuing with existing account
  const handleContinueWithAccount = async (accountId) => {
    try {
      // Generate a new account link for the existing account
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/refreshStripeLink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId,
          sellerAddress: acc.address,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.msg || "Failed to refresh onboarding link")
      }

      // Redirect to Stripe onboarding URL
      window.location.href = result.onboardingUrl
    } catch (error) {
      console.error("Error refreshing Stripe link:", error)
      showErrorDialog("Failed to refresh Stripe onboarding link. Please try again.")
      setShowAccountStatusModal(false)
    }
  }

  // Replace the existing handleCreateStripe function with the new one
  const handleCreateStripe = handleCreateStripeAccount
  const handleProcess = async () => {
    if (!web3Service) {
      showErrorDialog("Web3 service not initialized. Please refresh and try again.")
      return
    }

    setDialogType("confirm")
    setDialogMessage("Are you sure you want to lock funds for this trade?")
    setShowDialog(true)
  }

  // Execute payment after confirmation
  const executePayment = async () => {
    console.log("Executing Payment Function Running");
    
    try {
      
      setShowDialog(false)
      setLoading(true)
      setProcessing(true)

      // Make sure we have the required data
      if (!tradeData || !rec_address || !tradeId) {
        throw new Error("Missing required trade data")
      }

      // Get the amount from tradeData
      const amount = tradeData.expPrice
      console.log("Executing payment runds on that");
      
      // Call payFunds method to lock the funds in the smart contract
      const result = await web3Service.payFunds(rec_address, amount, tradeId)
      console.log("Transaction successful:", result)

      // Update API after successful payment
      await updateTradeStatus()

      // Show success dialog
      setDialogType("success")
      setDialogMessage("Funds locked successfully! Transaction hash: " + result.transactionHash)
      setShowDialog(true)
    } catch (error) {
      console.error("Error processing payment:", error)
      showErrorDialog(error.message || "Failed to process payment. Please try again.")
    } finally {
      setLoading(false)
      setProcessing(false)
    }
  }

  // Handle claiming funds
  const handleClaimFunds = async () => {
    if (!web3Service) {
      showErrorDialog("Web3 service not initialized. Please refresh and try again.")
      return
    }

    setDialogType("confirm")
    setDialogMessage("Are you sure you want to claim the funds for this trade?")
    setShowDialog(true)
  }

  // Execute claim after confirmation
  const executeClaimFunds = async () => {
    try {
      setShowDialog(false)
      setLoading(true)
      setProcessing(true)

      // Call claimFunds method from Web3Service
      const result = await web3Service.claimFunds(sender_address, tradeId)
      console.log("Claim successful:", result)

      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/setclaimFunds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_address,
          rec_address,
          tradeId,
        }),
      })

      const resultAPI = await response.json()
      if (!resultAPI.success) throw new Error("Error Creating Success")
      // Show success dialog
      setDialogType("success")
      setDialogMessage("Funds claimed successfully! Transaction hash: " + result.transactionHash)
      setShowDialog(true)
    } catch (error) {
      console.error("Error claiming funds:", error)
      showErrorDialog(error.message || "Failed to claim funds. Please try again.")
    } finally {
      setLoading(false)
      setProcessing(false)
    }
  }

  // Show error dialog
  const showErrorDialog = (message) => {
    setDialogType("error")
    setDialogMessage(message)
    setShowDialog(true)
  }

  // Handle dialog confirmation
  const handleDialogConfirm = () => {
    if (dialogType === "confirm") {
      if (!tradeStatus?.isSellerAccepted && !tradeStatus?.payBySeller) {
        executePayment()
      } else if (tradeStatus?.isSellerAccepted && !tradeStatus?.payByBuyer && tradeStatus?.paybySeller) {
        executeClaimFunds()
      }
    } else {
      setShowDialog(false)
      // Refresh data after success
      if (dialogType === "success") {
        fetchTradeStatus()
      }
    }
  }

  if (loading && !showDialog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0b2e] to-[#1a0b35] flex items-center justify-center p-6">
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
      <div className="min-h-screen bg-gradient-to-br from-[#0f0b2e] to-[#1a0b35] flex items-center justify-center p-6">
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

  // Calculate total value if available
  const totalValue =
    tradeData?.tokens && tradeData?.expPrice
      ? `$${(Number.parseFloat(tradeData.tokens) * Number.parseFloat(tradeData.expPrice)).toFixed(2)}`
      : "Calculating..."

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0b2e] to-[#1a0b35] p-6 flex items-center justify-center pt-20 overflow-hidden relative">
      <div className="absolute top-0 scale-[160%] left-[10.5vw]  h-[1200px] opacity-70 ">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10001-wJDNvR3BxRjKDUMGqePNheyCNprAJr.svg"
          alt="Background pattern"
          width={920}
          height={800}
          className="object-contain"
        />
        {/* <Image */}
      </div>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[60%] w-[300px] h-[300px] rounded-full bg-purple-700/20 blur-3xl"></div>
        <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] rounded-full bg-blue-700/20 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[30%] w-[250px] h-[250px] rounded-full bg-red-700/10 blur-3xl"></div>

        {/* Floating orbs */}
        <div className="absolute top-[20%] right-[20%] w-[100px] h-[100px] rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm"></div>
        <div className="absolute top-[40%] left-[30%] w-[150px] h-[150px] rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm"></div>
        <div className="absolute bottom-[30%] right-[40%] w-[120px] h-[120px] rounded-full bg-gradient-to-br from-blue-900/30 to-blue-600/30 backdrop-blur-sm"></div>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/30 border border-purple-700/20 rounded-xl p-8 max-w-5xl w-full backdrop-blur-sm relative z-10"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Trade Request Status</h1>
          <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-full">
            <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
            <span className="text-blue-300 text-sm">Auto-updating</span>
          </div>
        </div>

        {/* Trade Details Section */}
        {tradeData && (
          <div className="bg-blue-900/10 border border-blue-800/20 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-blue-500 rounded-sm"></div>
              <h3 className="text-lg font-medium text-white">Trade Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-950/40 rounded-lg p-4">
                <p className="text-sm text-blue-400 mb-1">Token ID</p>
                <p className="text-white font-medium text-lg">{tradeData.tokenId}</p>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-4">
                <p className="text-sm text-blue-400 mb-1">Token Amount</p>
                <p className="text-white font-medium text-lg">{tradeData.tokens}</p>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-4">
                <p className="text-sm text-blue-400 mb-1">Expected Price</p>
                <p className="text-white font-medium text-lg">${tradeData.expPrice}</p>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-4">
                <p className="text-sm text-blue-400 mb-1">Total Value</p>
                <p className="text-white font-medium text-lg">{totalValue}</p>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-4">
                <p className="text-sm text-blue-400 mb-1">Seller Username</p>
                <p className="text-white font-medium text-lg">{tradeData.userName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Trade Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-950/40 rounded-lg p-4">
            <p className="text-sm text-blue-400 mb-1">Trade ID</p>
            <p className="text-white font-medium text-lg" title={tradeId}>
              {tradeId ? `${tradeId.substring(0, 6)}...${tradeId.substring(tradeId.length - 4)}` : "N/A"}
            </p>
          </div>

          <div className="bg-blue-950/40 rounded-lg p-4">
            <p className="text-sm text-blue-400 mb-1">Your Username</p>
            <p className="text-white font-medium text-lg">{userName || "N/A"}</p>
          </div>

          <div className="bg-blue-950/40 rounded-lg p-4">
            <p className="text-sm text-blue-400 mb-1">Your Address</p>
            <p className="text-white font-medium text-lg" title={sender_address}>
              {sender_address
                ? `${sender_address.substring(0, 6)}...${sender_address.substring(sender_address.length - 4)}`
                : "N/A"}
            </p>
          </div>

          <div className="bg-blue-950/40 rounded-lg p-4 md:col-span-2 lg:col-span-3">
            <p className="text-sm text-blue-400 mb-1">Receiver Address</p>
            <p className="text-white font-medium text-lg" title={rec_address}>
              {rec_address
                ? `${rec_address.substring(0, 6)}...${rec_address.substring(rec_address.length - 4)}`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Trade Status Section */}
        <div className="bg-blue-900/10 border border-blue-800/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Trade Status</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <AcceptanceStatus title="Seller Acceptance" isAccepted={tradeStatus?.isSellerAccepted || false} />
            <AcceptanceStatus title="Buyer Acceptance" isAccepted={tradeStatus?.isBuyerAccepted || false} />
            <AcceptanceStatus title="Seller Paid" isAccepted={tradeStatus?.paybySeller || false} />
            <AcceptanceStatus title="Buyer Paid" isAccepted={tradeStatus?.paybyBuyer || false} />
          </div>

          {tradeStatus?.payByBuyer && (
            <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">
                Payment has been made and funds are locked in the contract
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="flex justify-center gap-16">
          {/* button for creating stripe account */}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateStripeAccount}
            disabled={processing}
            className="px-8 py-4 rounded-lg flex items-center gap-3 text-lg font-medium transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-600/20"
          >
            {processingCreate ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                <span>Create Account</span>
              </>
            )}
          </motion.button>

          {/* Show Lock Funds button only when both parties accepted but payment not made yet */}
          {!tradeStatus?.isSellerAccepted && !tradeStatus?.payBySeller && !tradeStatus?.payByBuyer && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProcess}
              disabled={processing}
              className="px-8 py-4 rounded-lg flex items-center gap-3 text-lg font-medium transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-600/20"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Lock The Funds (Seller)</span>
                </>
              )}
            </motion.button>
          )}

          {/* Show Claim Funds button only when payment is made and seller accepted */}
          {tradeStatus?.isSellerAccepted && tradeStatus?.paybySeller && !tradeStatus?.payByBuyer && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaimFunds}
              disabled={processing}
              className="px-8 py-4 rounded-lg flex items-center gap-3 text-lg font-medium transition-all duration-300 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white shadow-lg shadow-green-600/20"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <DollarSign className="h-5 w-5" />
                  <span>Claim Funds</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Custom Dialog Component */}
      <AnimatePresence>
        {showDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 max-w-md w-full backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                {dialogType === "confirm" && (
                  <div className="bg-yellow-900/30 p-4 rounded-full mb-6">
                    <AlertTriangle className="h-12 w-12 text-yellow-400" />
                  </div>
                )}
                {dialogType === "success" && (
                  <div className="bg-green-900/30 p-4 rounded-full mb-6">
                    <CheckCircle2 className="h-12 w-12 text-green-400" />
                  </div>
                )}
                {dialogType === "error" && (
                  <div className="bg-red-900/30 p-4 rounded-full mb-6">
                    <AlertTriangle className="h-12 w-12 text-red-400" />
                  </div>
                )}

                <h2 className="text-2xl font-bold text-white mb-4">
                  {dialogType === "confirm" && "Confirmation"}
                  {dialogType === "success" && "Success"}
                  {dialogType === "error" && "Error"}
                </h2>

                <p className="text-gray-300 mb-6">{dialogMessage}</p>

                <div className="flex gap-4">
                  {dialogType === "confirm" ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDialogConfirm}
                        className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition-all duration-300"
                      >
                        Confirm
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDialog(false)}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300"
                      >
                        Cancel
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDialog(false)}
                      className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition-all duration-300"
                    >
                      Close
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <StripeAccountModal
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        onSubmit={handleStripeEmailSubmit}
        sellerAddress={acc.address}
      />

      <AccountStatusModal
        isOpen={showAccountStatusModal}
        onClose={() => setShowAccountStatusModal(false)}
        onCreateNew={() => {
          setShowAccountStatusModal(false)
          setShowStripeModal(true)
        }}
        onContinue={handleContinueWithAccount}
        accountData={accountData}
      />
    </div>
  )
}

function StatusCard({ title, value, truncate = false }) {
  const displayValue =
    truncate && value && value.length > 12 ? `${value.substring(0, 6)}...${value.substring(value.length - 4)}` : value

  return (
    <div className="bg-blue-950/30 border border-blue-800/20 rounded-lg p-4">
      <p className="text-sm text-blue-400 mb-1">{title}</p>
      <p className="text-white font-medium truncate" title={value}>
        {displayValue || "N/A"}
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
