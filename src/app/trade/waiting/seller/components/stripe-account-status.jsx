"use client"

import  React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function StripeAccountModal({ isOpen, onClose, onSubmit, sellerAddress }) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await onSubmit(email)
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Failed to create Stripe account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 max-w-md w-full backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create Stripe Account</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <div className="bg-green-900/30 p-4 rounded-full mb-6 mx-auto w-fit">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Account Created Successfully!</h3>
                <p className="text-gray-300 mb-6">You'll be redirected to complete your Stripe onboarding process.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition-all duration-300"
                >
                  Close
                </motion.button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-2">This email will be used for your Stripe Express account</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-400">{error}</span>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center gap-2 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
