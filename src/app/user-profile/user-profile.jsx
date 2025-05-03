"use client"

import { useState, useEffect, useRef } from "react"
import { User, Wallet, Copy, QrCode, Download, Share2, ArrowRight, ArrowDown, Shield, RefreshCw, ExternalLink , CheckCircle2 } from 'lucide-react'
import QRCode from "qrcode"

export default function UserProfile({ 
  account, 
  balance, 
  onRegister, 
  onOpenTerms 
}) {

  const [username, setUsername] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  const [showQrModal, setShowQrModal] = useState(false)
  const [copied, setCopied] = useState(false)


  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return "Not connected"
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Generate QR code when account changes
  useEffect(() => {
    if (account) {
      generateQrCode()
    }
  }, [account])

  // Create cosmic background animation


  // Generate QR code for the wallet address
  const generateQrCode = async () => {
    if (!account) return
    
    try {
      // Create payment URL with wallet address
      const paymentUrl = `ethereum:${account}`
      const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl, {
        color: {
          dark: '#6d28d9', // Purple color for QR
          light: '#00000000' // Transparent background
        },
        width: 300,
        margin: 1
      })
      setQrCodeUrl(qrCodeDataUrl)
    } catch (err) {
      console.error("Error generating QR code:", err)
    }
  }

  // Handle username registration
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!username.trim()) return
    
    setIsRegistering(true)
    try {
      await onRegister(username)
      localStorage.setItem("username_pay_ai",username)
      setUsername("")
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsRegistering(false)
    }
  }

  // Copy wallet address to clipboard
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      setCopied(true)
      setSuccess("Address copied to clipboard!")
      setTimeout(() => setSuccess(""), 2000)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Download QR code
  const downloadQrCode = () => {
    if (!qrCodeUrl) return
    
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `cryptosafe-${formatAddress(account)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Share QR code
  const shareQrCode = async () => {
    if (!qrCodeUrl || !account) return
    
    try {
      if (navigator.share) {
        // Use Web Share API if available
        const blob = await (await fetch(qrCodeUrl)).blob()
        const file = new File([blob], `cryptosafe-${formatAddress(account)}.png`, { type: 'image/png' })
        
        await navigator.share({
          title: 'CryptoSafe Payment QR',
          text: `Send crypto to my wallet: ${account}`,
          files: [file]
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`Send crypto to my wallet: ${account}`)
        alert('Payment info copied to clipboard! Web Share API not supported in your browser.')
      }
    } catch (error) {
      console.error('Error sharing QR code:', error)
    }
  }

  return (
<div className="relative  w-screen min-h-screen overflow-hidden bg-transparent">
    
      {/* Cosmic Background Canvas */}
   
      
      {/* Content Container with Glass Effect */}
      <div className="z-10 container  pr-12 py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center justify-center mb-10 backdrop-blur-md bg-black/30 rounded-2xl p-8 border border-purple-500/20">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-700 to-indigo-900 flex items-center justify-center mb-6 ring-4 ring-purple-500/30">
            <User size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">My Profile</h1>
          
          {/* Wallet Address with Copy Button */}
          <div className="flex items-center bg-gray-900/70 rounded-lg px-4 py-2 mb-6 border border-purple-500/30">
            <Wallet className="text-purple-400 mr-2" size={18} />
            <span className="text-gray-300">{formatAddress(account)}</span>
            <button 
              onClick={copyAddress}
              className="ml-2 p-1 hover:bg-gray-800 rounded-md transition-colors"
            >
              <Copy size={16} className="text-purple-400" />
            </button>
            {copied && (
              <span className="text-xs text-purple-400 ml-2">Copied!</span>
            )}
          </div>
          
          {/* Username Registration */}
          
          <form onSubmit={handleRegister} className="w-full max-w-md mb-8">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username to register"
                className="w-full bg-gray-900/70 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="submit"
                disabled={isRegistering || !username.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 text-white rounded-md px-4 py-1.5 transition-colors"
              >
                {isRegistering ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  "Register"
                )}
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Your Registered Username is{" "}
              <span 
                type="button"
                onClick={onOpenTerms} 
                className="text-purple-400 hover:underline"
              >
                {localStorage.getItem('username_pay_ai')==undefined?"Not Registered":localStorage.getItem('username_pay_ai')}
              </span>
            </p>
          </form>
          
          {/* QR Code Button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg px-6 py-3 transition-colors shadow-lg shadow-purple-900/30"
          >
            <QrCode size={18} className="mr-2" />
            Show Payment QR
          </button>
        </div>

   
        {/* Stats Cards */}
        

        {/* Floating Orbs (Additional Visual Elements) */}
        <div className="hidden md:block absolute top-20 right-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/10 blur-xl animate-pulse"></div>
        <div className="hidden md:block absolute bottom-40 left-[5%] w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-600/20 to-purple-600/10 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="hidden md:block absolute top-[40%] left-[20%] w-24 h-24 rounded-full bg-gradient-to-r from-purple-600/20 to-indigo-600/10 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900/90 border border-purple-500/30 rounded-xl p-6 max-w-2xl w-full mx-4 relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Payment QR</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-black rounded-xl p-4 flex items-center justify-center border border-purple-500/30">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="Payment QR Code" className="w-48 h-48" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center">
                    <RefreshCw size={32} className="text-purple-500 animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <p className="text-gray-300 text-center md:text-left mb-4">Scan to send payment to:</p>
                
                <div className="bg-gray-800/70 rounded-lg px-4 py-3 mb-4 overflow-hidden border border-purple-500/20">
                  <p className="text-gray-300 text-sm truncate">{account}</p>
                </div>
                
                <p className="text-sm text-gray-400 mb-6">
                  This QR code contains your wallet address. When scanned with a compatible wallet app, it will automatically prepare a transaction to your address.
                </p>
                
                <div className="grid grid-cols-3 gap-3">
            
                  
                  <button 
                    onClick={shareQrCode}
                    className="flex flex-col items-center justify-center bg-gray-800/70 hover:bg-gray-700/70 rounded-lg p-3 transition-colors border border-purple-500/20"
                  >
                    <Share2 size={20} className="text-purple-400 mb-1" />
                    <span className="text-xs text-gray-300">Share</span>
                  </button>
                  
                  <button 
                    onClick={downloadQrCode}
                    className="flex flex-col items-center justify-center bg-gray-800/70 hover:bg-gray-700/70 rounded-lg p-3 transition-colors border border-purple-500/20"
                  >
                    <Download size={20} className="text-purple-400 mb-1" />
                    <span className="text-xs text-gray-300">Download</span>
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg py-3 transition-colors mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
