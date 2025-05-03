"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, RefreshCw, AlertCircle, Clock, CheckCircle2, Wallet, User, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import Web3Service from "../trade/web3-service"
import { useAccount, useChainId } from "wagmi"
import notify from "../../../public/10043.svg";

export default  function NotificationsPage() {
 
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [account, setAccount] = useState("abc");
  const router = useRouter()
  const chainId=useChainId();
  // Hardcoded address for demo - in a real app, you would get this from a wallet connection
  
  
  
  const fetchNotifications = async (add) => {
    try {
      const web3Service=new Web3Service(chainId);
      const userAccount = await web3Service.getAccount()
      console.log("Fetch Notifications Running :::::::::::",userAccount);
      setIsRefreshing(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/listNotifys`, {
        method: "POST",
        headers: {  
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_address:userAccount,
        }),
      })

      const result = await response.json()
      console.log("my Result in notifcation page is::::",result);
      
      if (result.success) {
        // Handle both single notification and array of notifications
        const notificationsData = Array.isArray(result.data) ? result.data : [result.data]
        setNotifications(notificationsData)
        setError(null)
      } else {
        setError(result.msg || "Failed to fetch notifications")
      }
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }
  

  useEffect(() => {
    fetchNotifications("")

    // Poll for updates every 3 seconds
    const intervalId = setInterval(fetchNotifications, 4000)

    return () => clearInterval(intervalId)
  }, [])

  const handleRefresh = () => {
    fetchNotifications()
  }

  const handleViewTrade = (notification) => {
    router.push(
      `/trade/waiting/seller/?rec_address=${notification.rec_address}&tradeId=${notification.tradeId}`,
    )
  }

  return (
    <div className="min-h-screen  p-6 pt-12 overflow-x-hidden">
          <div className="absolute top-14 -left-20 rotate-6 overflow-x-hidden  scale-[280%] opacity-70 -z-50">
          <img src={notify.src} />
          </div>
      <div className="max-w-4xl mx-auto pt-8">
  
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-800/30 p-3 rounded-full">
              <Bell className="h-6 w-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-blue-800/50 hover:bg-blue-700/60 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 text-blue-300 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="text-blue-200">Refresh</span>
          </motion.button>
        </div>

        <div className="bg-black/30 border border-blue-800/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="bg-blue-900/40 p-2 rounded-lg">
            <Wallet className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-blue-400">Connected Wallet</p>
            {/* <p className="text-white font-medium">{`${sender_address.substring(0, 6)}...${sender_address.substring(
              sender_address.length - 4,
            )}`}</p> */}
          </div>
          <div className="ml-auto flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-full">
            <RefreshCw className="h-4 w-4 text-blue-400 animate-spin-slow" />
            <span className="text-blue-300 text-sm">Auto-updating</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-blue-300">Loading notifications...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-12 text-center">
            <Bell className="h-12 w-12 text-blue-400/50 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2 ">No Notifications</h3>
            <p className="text-blue-300">You don't have any trade notifications at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-blue-950/50 to-black/70 border border-blue-800/30 z-50 text-white z-50 rounded-xl overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-800/30 p-2 rounded-lg">
                          <CreditCard className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">Trade Request</h3>
                          <p className="text-sm text-blue-300">ID: {notification.tradeId.substring(0, 8)}...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.isSellerAccepted ? (
                          <div className="bg-green-900/30 px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 text-sm">Seller Accepted</span>
                          </div>
                        ) : (
                          <div className="bg-yellow-900/30 px-3 py-1 rounded-full flex items-center gap-1">
                            <Clock className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm">Latest</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-400" />
                        <p className="text-gray-300">{notification.userName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-blue-400" />
                        <p className="text-gray-300">{`${notification.rec_address.substring(
                          0,
                          6,
                        )}...${notification.rec_address.substring(notification.rec_address.length - 4)}`}</p>
                      </div>
                    </div>

                    <div className="flex justify-end  gap-2">
                    
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewTrade(notification)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 transition-all duration-300"
                      >
                        <span>View  Request</span>
                        <RefreshCw className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  <motion.div
                    initial={{ width: "30%" }}
                    whileHover={{ width: "100%" }}
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-1"
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
