"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import Web3Service from "../../web3-service"
import { useChainId } from "wagmi"

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  "pk_test_51RDvU7I1A72xH8GumOahbV7zflW6p8K3vdAdC4bhXaRZwSV6zTQu21V8jyjzv23J8iae8On3a9g4HNNzfmCNp5fa00AEBHs2p7",
)

// Card element styling
const cardStyle = {
  style: {
    base: {
      color: "#fff",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
}

// Payment form component
const CheckoutForm = ({ amount, sellerAccountId, onSuccess, tokenId, tokenAmount ,sender_address,rec_address,trade_id,web3Service}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.")
      setLoading(false)
      return
    }
    
    try {
      // Call backend to create PaymentIntent
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/stripeP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents for Stripe
          accountId: sellerAccountId,
        }),
      })
      
      const data = await res.json()
      
      if (!data.clientSecret) {
        throw new Error(data.message || "Failed to create payment intent")
      }
      
      const { clientSecret } = data
      
      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Naman Bansal", // In a real app, get this from a form
          },
        },
      })
      console.log("My Result from payment is :::::::::",result);
      console.log("sender_address::::::",sender_address);
      console.log("rec_address::::::",rec_address);
      console.log("sender_address::::::",trade_id);
  
      const payment_result = await 
      fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/setPaymentDone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_address,
          rec_address,
          paymentId:result.paymentIntent.id,
          trade_id:trade_id
        }),
      })
      const Pay_data=await payment_result.json();
      await web3Service.releaseFunds(sender_address,trade_id)
      
      if (result.error) {
        setError(result.error.message)
      } else if (result.paymentIntent.status === "succeeded" && Pay_data.success==true) {
        
        console.log("Payment successful!")
        setSuccess(true)
        
        
        // Wait a moment to show success message before closing
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-900/30 rounded-lg p-4">
          <label className="block text-sm text-blue-300 mb-2">Card Details</label>
          <CardElement options={cardStyle} className="p-3 bg-black/50 rounded-lg border border-blue-700/30" />
        </div>

        <div className="bg-blue-900/30 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-blue-300">Token</span>
            <span className="text-sm text-white">{tokenId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-blue-300">Amount</span>
            <span className="text-sm text-white">{tokenAmount} tokens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-blue-300">Total Payment</span>
            <span className="text-sm font-bold text-white">${amount}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <p className="text-green-300">Payment successful! Your tokens will be released shortly.</p>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!stripe || loading || success}
        className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
          loading || success
            ? "bg-blue-700/50 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 shadow-lg shadow-blue-600/20"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle className="h-5 w-5" />
            <span>Payment Complete</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Pay ${amount.toFixed(2)}</span>
          </>
        )}
      </motion.button>
    </form>
  )
}

// Modal wrapper component
const StripePaymentModal = ({ amount, sellerAccountId, onClose, onSuccess, tokenId, tokenAmount,sender_address,rec_address,trade_id }) => {
  // Prevent scrolling when modal is open
      const web3Service=new Web3Service(useChainId())
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-black/90 border border-blue-700/50 rounded-xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-400" />
            Complete Payment
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={amount}
            sellerAccountId={sellerAccountId}
            onSuccess={onSuccess}
            tokenId={tokenId}
            sender_address={sender_address}
            rec_address={rec_address}
            tokenAmount={tokenAmount}
            trade_id={trade_id}
            web3Service={web3Service}
          />
        </Elements>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Secure payment processed by Stripe. Your payment information is encrypted and secure.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default StripePaymentModal
