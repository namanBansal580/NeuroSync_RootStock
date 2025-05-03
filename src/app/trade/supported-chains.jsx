"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ExternalLink, ChevronRight, Shield, Zap, Globe } from 'lucide-react'

// Custom blockchain icons
const EthereumIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#627EEA"/>
    <path d="M20.498 5V16.1L29.995 20.32L20.498 5Z" fill="white" fillOpacity="0.6"/>
    <path d="M20.498 5L11 20.32L20.498 16.1V5Z" fill="white"/>
    <path d="M20.498 27.4724V34.9954L30 22.0054L20.498 27.4724Z" fill="white" fillOpacity="0.6"/>
    <path d="M20.498 34.9954V27.4714L11 22.0054L20.498 34.9954Z" fill="white"/>
    <path d="M20.498 25.7683L29.995 20.3013L20.498 16.0923V25.7683Z" fill="white" fillOpacity="0.2"/>
    <path d="M11 20.3013L20.498 25.7683V16.0923L11 20.3013Z" fill="white" fillOpacity="0.6"/>
  </svg>
)

const PolygonIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#8247E5"/>
    <path d="M26.5 15.4C25.9 15.1 25.15 15.1 24.55 15.4L20.9 17.45L18.35 18.85L14.7 20.9C14.1 21.2 13.35 21.2 12.75 20.9L9.9 19.25C9.3 18.95 8.9 18.3 8.9 17.6V14.4C8.9 13.7 9.25 13.1 9.9 12.75L12.7 11.15C13.3 10.85 14.05 10.85 14.65 11.15L17.45 12.75C18.05 13.05 18.45 13.7 18.45 14.4V16.45L21 15.05V13C21 12.3 20.65 11.7 20 11.35L14.7 8.35C14.1 8.05 13.35 8.05 12.75 8.35L7.3 11.4C6.65 11.7 6.3 12.35 6.3 13V19C6.3 19.7 6.65 20.3 7.3 20.65L12.7 23.65C13.3 23.95 14.05 23.95 14.65 23.65L18.3 21.65L20.85 20.25L24.5 18.25C25.1 17.95 25.85 17.95 26.45 18.25L29.25 19.85C29.85 20.15 30.25 20.8 30.25 21.5V24.7C30.25 25.4 29.9 26 29.25 26.35L26.5 27.95C25.9 28.25 25.15 28.25 24.55 27.95L21.75 26.35C21.15 26.05 20.75 25.4 20.75 24.7V22.7L18.2 24.1V26.15C18.2 26.85 18.55 27.45 19.2 27.8L24.6 30.8C25.2 31.1 25.95 31.1 26.55 30.8L31.95 27.8C32.55 27.5 32.95 26.85 32.95 26.15V20.1C32.95 19.4 32.6 18.8 31.95 18.45L26.5 15.4Z" fill="white"/>
  </svg>
)

const BinanceIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#F3BA2F"/>
    <path d="M20 10.8333L23.9583 14.7917L16.0417 22.7083L12.0833 18.75L20 10.8333Z" fill="white"/>
    <path d="M20 10.8333L27.9167 18.75L24.0417 22.625L16.125 14.7083L20 10.8333Z" fill="white"/>
    <path d="M14.7917 16.0417L18.75 20L14.7917 23.9583L10.8333 20L14.7917 16.0417Z" fill="white"/>
    <path d="M25.2083 16.0417L29.1667 20L25.2083 23.9583L21.25 20L25.2083 16.0417Z" fill="white"/>
    <path d="M20 25.2083L23.9583 21.25L27.9167 25.2083L23.9583 29.1667L20 25.2083Z" fill="white"/>
    <path d="M20 25.2083L16.0417 21.25L12.0833 25.2083L16.0417 29.1667L20 25.2083Z" fill="white"/>
  </svg>
)

const SolanaIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#14F195"/>
    <path d="M11.5 25.5C11.7761 25.5 12.0261 25.6021 12.2 25.775L19.025 31.5C19.3 31.75 19.65 31.875 20 31.875C20.35 31.875 20.7 31.75 20.975 31.5L27.8 25.775C27.9739 25.6021 28.2239 25.5 28.5 25.5H30.5C31.0523 25.5 31.5 25.9477 31.5 26.5C31.5 26.7761 31.3979 27.0261 31.225 27.2L22.2 34.775C21.65 35.275 20.85 35.5 20 35.5C19.15 35.5 18.35 35.25 17.8 34.775L8.775 27.2C8.60208 27.0261 8.5 26.7761 8.5 26.5C8.5 25.9477 8.94772 25.5 9.5 25.5H11.5Z" fill="#000000"/>
    <path d="M11.5 14.5C11.7761 14.5 12.0261 14.6021 12.2 14.775L19.025 20.5C19.3 20.75 19.65 20.875 20 20.875C20.35 20.875 20.7 20.75 20.975 20.5L27.8 14.775C27.9739 14.6021 28.2239 14.5 28.5 14.5H30.5C31.0523 14.5 31.5 14.9477 31.5 15.5C31.5 15.7761 31.3979 16.0261 31.225 16.2L22.2 23.775C21.65 24.275 20.85 24.5 20 24.5C19.15 24.5 18.35 24.25 17.8 23.775L8.775 16.2C8.60208 16.0261 8.5 15.7761 8.5 15.5C8.5 14.9477 8.94772 14.5 9.5 14.5H11.5Z" fill="#000000"/>
    <path d="M30.5 3.5C31.0523 3.5 31.5 3.94772 31.5 4.5C31.5 4.77614 31.3979 5.02614 31.225 5.2L22.2 12.775C21.65 13.275 20.85 13.5 20 13.5C19.15 13.5 18.35 13.25 17.8 12.775L8.775 5.2C8.60208 5.02614 8.5 4.77614 8.5 4.5C8.5 3.94772 8.94772 3.5 9.5 3.5H11.5C11.7761 3.5 12.0261 3.60208 12.2 3.775L19.025 9.5C19.3 9.75 19.65 9.875 20 9.875C20.35 9.875 20.7 9.75 20.975 9.5L27.8 3.775C27.9739 3.60208 28.2239 3.5 28.5 3.5H30.5Z" fill="#000000"/>
  </svg>
)

const AvalancheIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#E84142"/>
    <path d="M20 8C13.3726 8 8 13.3726 8 20C8 26.6274 13.3726 32 20 32C26.6274 32 32 26.6274 32 20C32 13.3726 26.6274 8 20 8ZM16.1213 24.5455H13.3334L19.1213 14.5455C19.3334 14.1818 19.8182 14.1818 20.0304 14.5455L21.4546 16.9091L16.1213 24.5455ZM26.6667 24.5455H17.9395L23.2728 16.9091L26.0607 21.4546C26.8789 22.7273 26.6667 23.6364 26.6667 24.5455Z" fill="white"/>
  </svg>
)

export default function SupportedChains() {
  const [expandedChain, setExpandedChain] = useState(null)

  const chains = [
    {
      id: "ethereum",
      name: "Ethereum",
      icon: <EthereumIcon />,
      description: "The original smart contract platform with the largest developer ecosystem.",
      tokenSymbol: "ETH",
      status: "active",
      features: ["Smart Contracts", "DeFi", "NFTs", "DAOs"],
    },
    {
      id: "polygon",
      name: "Polygon",
      icon: <PolygonIcon />,
      description: "Ethereum scaling solution with fast and low-cost transactions.",
      tokenSymbol: "MATIC",
      status: "active",
      features: ["Low Fees", "Fast Transactions", "EVM Compatible", "Staking"],
    },
    {
      id: "binance",
      name: "BNB Chain",
      icon: <BinanceIcon />,
      description: "High-throughput blockchain with BNB as the native token.",
      tokenSymbol: "BNB",
      status: "active",
      features: ["High Performance", "Low Fees", "Cross-Chain", "DeFi"],
    },
    {
      id: "solana",
      name: "Solana",
      icon: <SolanaIcon />,
      description: "High-performance blockchain with fast transactions and low fees.",
      tokenSymbol: "SOL",
      status: "coming-soon",
      features: ["High TPS", "Low Latency", "Proof of History", "DeFi"],
    },
    {
      id: "avalanche",
      name: "Avalanche",
      icon: <AvalancheIcon />,
      description: "Platform for launching decentralized applications with high throughput.",
      tokenSymbol: "AVAX",
      status: "coming-soon",
      features: ["Subnets", "Fast Finality", "EVM Compatible", "Staking"],
    },
  ]

  const toggleChain = (chainId) => {
    if (expandedChain === chainId) {
      setExpandedChain(null)
    } else {
      setExpandedChain(chainId)
    }
  }

  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
          Supported Blockchain Networks
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Our platform supports multiple blockchain networks, allowing you to send and receive crypto across different
          ecosystems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chains.map((chain) => (
          <motion.div
            key={chain.id}
            className={`bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden
              ${expandedChain === chain.id ? "md:col-span-2 lg:col-span-3" : ""}
            `}
            layoutId={`chain-${chain.id}`}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6 cursor-pointer" onClick={() => toggleChain(chain.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${chain.status === "active" ? "bg-green-500/20" : "bg-yellow-500/20"}`}
                  >
                    <div className="w-10 h-10">
                      {chain.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{chain.name}</h3>
                      {chain.status === "coming-soon" && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{chain.tokenSymbol}</p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedChain === chain.id ? "rotate-90" : ""}`}
                />
              </div>

              {expandedChain !== chain.id && <p className="mt-4 text-gray-400 line-clamp-2">{chain.description}</p>}
            </div>

            {expandedChain === chain.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-300 mb-4">{chain.description}</p>

                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      Key Features
                    </h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {chain.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-400">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Network Stats
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className={chain.status === "active" ? "text-green-400" : "text-yellow-400"}>
                          {chain.status === "active" ? "Active" : "Coming Soon"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Transaction Speed</span>
                        <span>
                          {chain.id === "ethereum"
                            ? "~15 sec"
                            : chain.id === "polygon"
                              ? "~2 sec"
                              : chain.id === "binance"
                                ? "~3 sec"
                                : chain.id === "solana"
                                  ? "400ms"
                                  : "~2 sec"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Fee</span>
                        <span>
                          {chain.id === "ethereum"
                            ? "~$5-20"
                            : chain.id === "polygon"
                              ? "~$0.01"
                              : chain.id === "binance"
                                ? "~$0.30"
                                : chain.id === "solana"
                                  ? "~$0.00025"
                                  : "~$0.25"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Finality</span>
                        <span>
                          {chain.id === "ethereum"
                            ? "~12 min"
                            : chain.id === "polygon"
                              ? "~30 min"
                              : chain.id === "binance"
                                ? "~30 sec"
                                : chain.id === "solana"
                                  ? "~400ms"
                                  : "~2 sec"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1">
                        <Globe className="w-4 h-4" />
                        View Explorer
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
