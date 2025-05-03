"use client"
import { useState, useEffect, useRef, createContext, useContext } from "react"
import { PinataSDK } from "pinata"
import { cn } from "../../lib/utils"
import Web3 from "web3"
import { CONTRACT_ABI } from "@/ContractABI"
import { motion } from "framer-motion"
import { Send, Loader2 } from "lucide-react"
import Web3Service from "@/app/trade/web3-service"
import { useChainId } from "wagmi"
// Create Web3 Context
const Web3Context = createContext(null)

// Web3 Provider Component - keeping original logic
function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null)
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const web3Service = new Web3Service(useChainId())
  const initWeb3 = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const web3Instance = new Web3(window.ethereum)
        setWeb3(web3Instance)

        // Get the connected account
        const accounts = await web3Instance.eth.getAccounts()
        setAccount(accounts[0])

        // Initialize the contract
        console.log("my Contract Address in my This is::::::", web3Service.contract_add)

        const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, web3Service.contract_add)
        setContract(contractInstance)

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts) => {
          setAccount(accounts[0])
        })

        setIsConnected(true)
        setIsLoading(false)
        return true
      } catch (error) {
        console.error("Error initializing Web3:", error)
        setIsLoading(false)
        return false
      }
    } else {
      console.error("Web3 not found. Please install MetaMask!")
      setIsLoading(false)
      return false
    }
  }

  const sendMessage = async (recipient, message, fileHash = "") => {
    if (!web3 || !contract || !account) {
      throw new Error("Web3 not initialized")
    }
  
    try {
      const block = await web3.eth.getBlock("latest")
  
      let txOptions = {
        from: account,
      }
  
      // Check if EIP-1559 is supported
      if (block.baseFeePerGas != null) {
        const feeData = await web3.eth.getGasPrice()
        txOptions.maxPriorityFeePerGas = web3.utils.toHex(web3.utils.toWei("2", "gwei")) // or use web3.eth.getFeeData() if available
        txOptions.maxFeePerGas = web3.utils.toHex(parseInt(feeData) + web3.utils.toWei("2", "gwei"))
      } else {
        txOptions.gasPrice = await web3.eth.getGasPrice()
      }
  
      // Optionally estimate gas
      txOptions.gas = await contract.methods.sendMessage(message, fileHash, recipient).estimateGas({ from: account })
  
      const tx = await contract.methods.sendMessage(message, fileHash, recipient).send(txOptions)
  
      return tx
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  const listMessages = async (recipient) => {
    if (!web3 || !contract || !account) {
      throw new Error("Web3 not initialized")
    }

    try {
      const messages = await contract.methods.listMessages(recipient).call({ from: account })

      return messages.map((msg) => ({
        recipient: msg.recipient,
        message: msg.msg,
        fileHash: msg.fileHash,
      }))
    } catch (error) {
      console.error("Error fetching messages:", error)
      throw error
    }
  }

  const listContacts = async () => {
    if (!web3 || !contract || !account) {
      throw new Error("Web3 not initialized")
    }

    try {
      const addresses = await contract.methods.listAddresses().call({ from: account })

      return addresses || []
    } catch (error) {
      console.error("Error fetching contacts:", error)
      throw error
    }
  }

  useEffect(() => {
    initWeb3()
  }, [])

  const value = {
    web3,
    contract,
    account,
    isConnected,
    isLoading,
    initWeb3,
    sendMessage,
    listMessages,
    listContacts,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

// Custom hook to use Web3 context
function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined || context === null) {
    // throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context
}

// Styled Button Component
function Button({ variant = "primary", size = "md", children, isLoading = false, className = "", ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-indigo-600 hover:to-purple-700 text-white",
    outline: "border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-white",
    ghost: "hover:bg-indigo-500/10 text-white",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
  }

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-md",
    md: "h-10 px-4 text-sm rounded-md",
    lg: "h-12 px-6 text-base rounded-md",
    icon: "h-10 w-10 rounded-full flex items-center justify-center",
  }

  return (
    <button
      className={cn(
        "font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}

// Styled Input Component
function Input({ className = "", icon = null, size = "md", ...props }) {
  const sizes = {
    sm: "h-8 text-xs px-3",
    md: "h-10 text-sm px-4",
    lg: "h-12 text-base px-5",
  }

  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">{icon}</div>}
      <input
        className={cn(
          "w-full rounded-md bg-black/20 border border-indigo-500/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-colors",
          icon ? "pl-10" : "",
          sizes[size],
          className,
        )}
        {...props}
      />
    </div>
  )
}

// Styled Dialog Component
function Dialog({ isOpen, onClose, children, className = "" }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-gradient-to-b backdrop-blur-3xl border border-indigo-500/20 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[85vh] overflow-auto animate-in fade-in zoom-in-95 duration-200",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function DialogTitle({ children, className = "" }) {
  return (
    <div className={cn("px-6 pt-6 pb-3 border-b border-indigo-500/20", className)}>
      <h2 className="text-xl font-semibold text-white">{children}</h2>
    </div>
  )
}

function DialogContent({ children, className = "" }) {
  return <div className={cn("px-6 py-4 text-white/80", className)}>{children}</div>
}

function DialogFooter({ children, className = "" }) {
  return (
    <div className={cn("px-6 py-4 flex justify-end space-x-3 border-t border-indigo-500/20", className)}>
      {children}
    </div>
  )
}

// Avatar Component
function Avatar({ address, size = "md", className = "" }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center font-medium text-white",
        sizes[size],
        className,
      )}
    >
      <span>{address?.substring(2, 4).toUpperCase() || "??"}</span>
    </div>
  )
}

// Main Chat Interface Component
function ChatInterface() {
  const { account, isConnected, isLoading } = useWeb3()
  const [selectedContact, setSelectedContact] = useState(null)

  const handleContactSelect = (address) => {
    setSelectedContact(address)
  }

  if (isLoading) {
    return (
      <div className="flex  items-center justify-center">
        <div className="text-center p-8 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 animate-pulse">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-spin"></div>
            <div
              className="absolute inset-2 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>
          </div>
          <p className="text-lg text-white font-medium">Connecting to blockchain...</p>
          <p className="text-sm text-white/60 mt-2">Please wait while we establish a secure connection</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return <ConnectWallet />
  }

  return (
    <main className="h-[100vh]  w-full overflow-hidden  border border-indigo-500/20 shadow-2xl  backdrop-blur-md">
      <div className="flex h-full overflow-hidden">
        <div className="w-full max-w-[350px] border-r border-indigo-500/20">
          <ContactsList onSelectContact={handleContactSelect} selectedContact={selectedContact} />
        </div>
        <div className="flex-1">
          {selectedContact ? (
            <MessagePanel recipientAddress={selectedContact} />
          ) : (
            <div className="flex h-full items-center justify-center text-center p-6">
              <div className="p-8 rounded-xl  border border-indigo-500/20 shadow-xl max-w-md w-full animate-in fade-in duration-300">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">Messages And Files Are Verified By AI</h2>
                <br />
             
                <p className="text-white/70">Select a contact to start chatting on the blockchain</p>
                <div className="mt-6 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full opacity-70"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// Connect Wallet Component
function ConnectWallet() {
  const { initWeb3 } = useWeb3()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const success = await initWeb3()
      if (!success) {
        setError("Failed to connect to wallet. Please make sure MetaMask is installed and unlocked.")
      }
    } catch (error) {
      console.error("Connection error:", error)
      setError("Failed to connect to wallet. Please make sure MetaMask is installed and unlocked.")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="flex h-[75vh] items-center justify-center">
      <div className="p-8 rounded-xl bg-gradient-to-r  border border-indigo-500/20 shadow-2xl max-w-md w-full animate-in fade-in duration-500">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-indigo-500/20 p-3 text-white flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-white text-center mb-2">Blockchain Chat</h3>
        <p className="text-white/70 text-center mb-6">
          Connect your wallet to start chatting securely on the blockchain
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/20 p-4 text-sm text-red-200 border border-red-500/30 animate-in fade-in duration-300">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-sm border border-indigo-500/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-white/80">
            This application requires a Web3 wallet like MetaMask to function. Your messages will be stored securely on
            the blockchain.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full transition-transform duration-300 hover:scale-[1.02]"
          onClick={handleConnect}
          isLoading={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    </div>
  )
}

// Contacts List Component
function ContactsList({ onSelectContact, selectedContact }) {
  const { listContacts, sendMessage } = useWeb3()
  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newContactAddress, setNewContactAddress] = useState("")
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [isAddingContact, setIsAddingContact] = useState(false)

  const fetchContacts = async () => {
    setIsLoading(true)
    try {
      let addresses = await listContacts()
      const set = new Set(addresses)
      addresses = [...set]
      console.log("My Address Fetched are::::", addresses)

      setContacts(addresses)
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const filteredContacts = contacts.filter((address) => address.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleNewContact = async () => {
    if (!newContactAddress || !Web3.utils.isAddress(newContactAddress)) {
      return
    }

    setIsAddingContact(true)

    try {
      // Send an initial message to establish contact
      await sendMessage(newContactAddress, "Hello! I'd like to chat with you.", "")

      setNewContactAddress("")
      setIsAddContactOpen(false)

      // Refresh contacts list
      await fetchContacts()
    } catch (error) {
      console.error("Error adding contact:", error)
    } finally {
      setIsAddingContact(false)
    }
  }

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-indigo-500/20 ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Contacts
          </h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchContacts}
              className="border border-indigo-500/20 hover:bg-indigo-500/10"
              isLoading={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsAddContactOpen(true)} isLoading={false}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="relative mb-1">
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border-indigo-500/20 focus:border-indigo-500/40"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredContacts.length > 0 ? (
          <ul className="divide-y divide-indigo-500/10">
            {filteredContacts.map((address) => (
              <li
                key={address}
                className="animate-in fade-in slide-in-from-left-5 duration-200"
                style={{ animationDelay: "0.1s" }}
              >
                <button
                  className={cn(
                    "w-full text-left p-4 transition-colors",
                    selectedContact === address
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border-l-2 border-indigo-500"
                      : "hover:bg-indigo-500/10",
                  )}
                  onClick={() => onSelectContact(address)}
                >
                  <div className="flex items-center">
                    <Avatar address={address} size="md" />
                    <div className="ml-3 overflow-hidden">
                      <p className="font-medium text-white">{formatAddress(address)}</p>
                      <p className="text-xs text-white/60 truncate max-w-[180px]">{address}</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 p-4 text-center text-white/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-3 text-indigo-500/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p>No contacts found</p>
            <p className="text-sm mt-1">Add a new contact to start chatting</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setIsAddContactOpen(true)}
              isLoading={false}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add
            </Button>
          </div>
        )}
      </div>

      <Dialog isOpen={isAddContactOpen} onClose={() => setIsAddContactOpen(false)}>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <p className="mb-4">Enter the blockchain address of the person you want to chat with.</p>
          <Input
            placeholder="0x..."
            value={newContactAddress}
            onChange={(e) => setNewContactAddress(e.target.value)}
            className="w-full"
          />
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddContactOpen(false)} isLoading={false}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleNewContact} isLoading={isAddingContact}>
            Add Contact
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

// Message Panel Component
function MessagePanel({ recipientAddress }) {
  const { account, sendMessage, listMessages } = useWeb3()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [file, setFile] = useState(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState(null)
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const messageList = await listMessages(recipientAddress)

      // Transform the contract messages into our format
      const formattedMessages = messageList.map((msg, index) => {
        // If the recipient is the selected contact, then the current user sent this message
        // Otherwise, the message was sent by the contact to the current user
        const isSentByCurrentUser = msg.recipient === recipientAddress

        return {
          id: `msg_${index}`,
          sender: isSentByCurrentUser ? account : recipientAddress,
          recipient: msg.recipient,
          content: msg.message,
          fileHash: msg.fileHash,
          timestamp: Date.now() - index * 60000, // Mock timestamps for display
        }
      })

      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (account && recipientAddress) {
      fetchMessages()
    }
  }, [account, recipientAddress])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if ((!newMessage && !file) || isSending) return

    setIsSending(true)

    try {
      let fileHash = ""

      if (file) {
        // Upload file using Pinata
        const pinata = new PinataSDK({
          pinataJwt: process.env.NEXT_PUBLIC_PINATA_KEY,
          pinataGateway: "jade-added-egret-280.mypinata.cloud",
        })
        const imageUrl = URL.createObjectURL(file)

        const uploadResult = await pinata.upload.public.file(file)
        console.log("My upload result is::::", uploadResult)

        fileHash = uploadResult.cid
      }

      // Send message to blockchain
      await sendMessage(recipientAddress, newMessage || "Sending File..", fileHash)

      // Add the new message to the UI immediately
      const newMsg = {
        id: `msg_${Date.now()}`,
        sender: account,
        recipient: recipientAddress,
        content: newMessage,
        fileHash: fileHash,
        timestamp: Date.now(),
      }

      setMessages([...messages, newMsg])

      // Clear the input
      setNewMessage("")
      setFile(null)
      setFilePreviewUrl(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  // Function to fetch file URL from Pinata
  const fetchFileUrl = async (cid) => {
    console.log("My Cid is::::::", cid)

    if (!cid) return null

    try {
      const pinata = new PinataSDK({
        pinataJwt: process.env.NEXT_PUBLIC_PINATA_KEY,
        pinataGateway: "jade-added-egret-280.mypinata.cloud",
      })

      const url = await pinata.gateways.public.convert(cid)
      console.log("My url is:::", url)

      return url
    } catch (error) {
      console.error("Error fetching file URL:", error)
      return null
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)

      // Create a preview URL for the file
      const url = URL.createObjectURL(selectedFile)
      setFilePreviewUrl(url)
    }
  }

  const removeFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl)
    }

    setFile(null)
    setFilePreviewUrl(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const getFileTypeFromName = (filename) => {
    if (!filename) return "file"

    const ext = filename.split(".").pop()?.toLowerCase() || ""

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return "image"
    } else if (ext === "pdf") {
      return "pdf"
    } else if (["doc", "docx"].includes(ext)) {
      return "doc"
    } else if (["mp4", "webm", "mov"].includes(ext)) {
      return "video"
    }

    return "file"
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const openFilePreview = async (fileHash, type) => {
    // For real files, we would fetch the URL from Pinata
    let url = null

    if (fileHash) {
      url = await fetchFileUrl(fileHash)
    }

    setPreviewFile({
      name: fileHash,
      type,
      url: url || filePreviewUrl || "/placeholder.svg",
    })

    setIsFilePreviewOpen(true)
  }

  const downloadFile = async (fileHash) => {
    if (!fileHash) return

    try {
      const url = await fetchFileUrl(fileHash)

      if (url) {
        // Create a temporary anchor element to trigger download
        const a = document.createElement("a")
        a.href = url
        a.download = fileHash
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  const renderFileAttachment = (fileHash, isSender) => {
    if (!fileHash) return null

    const fileType = getFileTypeFromName(fileHash)

    return (
      <div className={`mt-2 p-3 rounded-lg  flex flex-col`}>
        <div className="flex items-center">
          {fileType === "image" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ) : fileType === "pdf" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-white/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
          <span className="text-sm truncate flex-1 text-white/90">File attached</span>
        </div>

        <div className="flex mt-2 space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs py-1 px-2 h-auto"
            onClick={() => openFilePreview(fileHash, fileType)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="text-xs py-1 px-2 h-auto"
            onClick={() => downloadFile(fileHash)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-indigo-500/20 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar address={recipientAddress} size="md" />
            <div className="ml-3">
              <h2 className="font-bold text-white">{formatAddress(recipientAddress)}</h2>
              <p className="text-xs text-white/60 truncate max-w-[250px]">{recipientAddress}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMessages}
            className="border border-indigo-500/20 hover:bg-indigo-500/10"
            isLoading={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-transparent to-black/20 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.sender === account
              const delay = index * 0.05

              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
                  style={{ animationDelay: `${delay}s` }}
                >
                  <div
                    className={`max-w-[75%] ${isCurrentUser ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "bg-black/30 border border-indigo-500/20 text-white"} rounded-2xl px-4 py-2 ${isCurrentUser ? "rounded-tr-none" : "rounded-tl-none"}`}
                  >
                    {message.content && <p className="leading-relaxed">{message.content}</p>}
                    {message.fileHash && renderFileAttachment(message.fileHash, isCurrentUser)}
                    <div className="text-xs mt-1 text-white/70 text-right">{formatTime(message.timestamp)}</div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-white/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 mb-4 text-indigo-400/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p>No messages yet</p>
            <p className="text-sm mt-1">Send a message to start the conversation</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-indigo-500/20 bg-black/20 backdrop-blur-md">
        {file && (
          <div className="mb-3 p-2 bg-indigo-500/10 rounded-lg flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center">
              {filePreviewUrl && getFileTypeFromName(file.name) === "image" ? (
                <div className="w-10 h-10 mr-3 rounded-md overflow-hidden border border-indigo-500/20">
                  <img
                    src={filePreviewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              )}
              <span className="text-sm truncate text-white max-w-[200px]">{file.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full hover:bg-white/10"
              onClick={removeFile}
              isLoading={false}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="border border-indigo-500/20 hover:bg-indigo-500/10 h-10 w-10 flex-shrink-0"
            isLoading={false}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </Button>

          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="flex-grow bg-black/20 border-indigo-500/20 focus:border-indigo-500/50 placeholder:text-white/50 w-[60vw]"
            icon={null}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={(!newMessage && !file) || isSending}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-gradient-to-r  text-white rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </motion.button>
          {/* <Button
          variant="primary"
          onClick={handleSendMessage}
          disabled={(!newMessage && !file) || isSending}
          className="h-10 w-10 flex-shrink-0 rounded-full"
          isLoading={isSending}
        >
          {!isSending && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </Button> */}
        </div>
      </div>

      <Dialog isOpen={isFilePreviewOpen} onClose={() => setIsFilePreviewOpen(false)}>
        <DialogTitle>{"File Preview"}</DialogTitle>
        <DialogContent>
          {previewFile?.type === "image" ? (
            <div className="flex justify-center">
              <img
                src={previewFile.url || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-[60vh] object-contain rounded-lg border border-indigo-500/20"
              />
            </div>
          ) : (
            <div className="text-center p-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 text-indigo-400/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>Preview not available for this file type</p>
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsFilePreviewOpen(false)} isLoading={false}>
            Close
          </Button>
          <Button variant="primary" onClick={() => downloadFile(previewFile?.name)} isLoading={false}>
            Download
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export {
  Web3Provider,
  useWeb3,
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  ChatInterface,
  ConnectWallet,
  ContactsList,
  MessagePanel,
}

