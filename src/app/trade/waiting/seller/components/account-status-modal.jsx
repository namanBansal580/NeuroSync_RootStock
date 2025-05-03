"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, RefreshCw } from "lucide-react"


export default function AccountStatusModal({
  isOpen,
  onClose,
  onCreateNew,
  onContinue,
  accountData,
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateNew = () => {
    setIsLoading(true)
    onCreateNew()
  }

  const handleContinue = () => {
    if (accountData?.account_id) {
      setIsLoading(true)
      onContinue(accountData.account_id)
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
              <h2 className="text-2xl font-bold text-white">Stripe Account Found</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-blue-900/30 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <RefreshCw className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-medium text-white">Account Information</h3>
                </div>
                <p className="text-gray-300 mb-2">We found an existing Stripe account associated with your address:</p>
                <div className="bg-blue-950/40 rounded-lg p-3 mb-2">
                  <p className="text-sm text-blue-400 mb-1">Email</p>
                  <p className="text-white font-medium">{accountData?.email || "N/A"}</p>
                </div>
                <div className="bg-blue-950/40 rounded-lg p-3">
                  <p className="text-sm text-blue-400 mb-1">Account ID</p>
                  <p className="text-white font-medium">
                    {accountData?.account_id
                      ? `${accountData.account_id.substring(0, 8)}...${accountData.account_id.substring(accountData.account_id.length - 4)}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-4">Would you like to continue with this account or create a new one?</p>
            </div>

            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNew}
                disabled={isLoading}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                <span>Create New</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                <span>Continue</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
