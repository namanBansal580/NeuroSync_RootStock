"use client"
import Link from "next/link"
import AOS from "aos"
import "aos/dist/aos.css"
import {
  Wallet2,
  Copy,
  X,
  ArrowLeftRight,
  UsersRound,
  PiggyBank,
  BracketsIcon as Bridge,
  UserCircle,
} from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { modal } from "./context/index" // Import modal from context

// Update the navigationItems array to include colors for each icon
const navigationItems = [
  { name: "Trade", href: "/trade", icon: ArrowLeftRight, color: "#3b82f6" }, // Blue
  { name: "P2P", href: "/chat", icon: UsersRound, color: "#8b5cf6" }, // Purple
  { name: "AI Agent", href: "/ai-agent", icon: Bridge, color: "#10b981" }, // Emerald
  { name: "Notifications", href: "/notifications", icon: UserCircle, color: "#ec4899" }, // Pink
]

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    })

    // Handle clicks outside dropdown to close it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // Format address to show only first and last few characters
  const formatAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      // Optional: Add some visual feedback
      alert("Address copied to clipboard!")
      setIsDropdownOpen(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 ">
      <div className="max-w-[1680px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">NeuroSync</span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden lg:block bg-[#01051666] backdrop-blur-md rounded-full p-1.5">
          <div className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-6 py-2 text-sm text-gray-200 hover:text-white transition-colors rounded-full hover:bg-white/10 flex items-center gap-2"
              >
                {item.icon && <item.icon className="w-4 h-4" style={{ color: item.color }} />}
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side - Connect Wallet or Address Display */}
        <div className="flex items-center gap-4" ref={dropdownRef}>
          {isConnected ? (
            <div className="relative">
              {/* Wallet Address Display Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hidden lg:flex items-center text-white border border-slate-950 bg-[#01051666] hover:bg-white/10 backdrop-blur-md gap-2 px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
              >
                <div className="bg-yellow-300 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <span className="text-black font-bold">Ξ</span>
                </div>
                <span>0 ETH</span>
                <span className="ml-2">{formatAddress(address)}</span>
                <span
                  className={`ml-1 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                >
                  ▼
                </span>
              </button>

              {/* Animated Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform origin-top-right ${
                  isDropdownOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                }`}
              >
                <div className="p-4 flex justify-between items-center">
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <X size={18} className="transition-transform duration-300 hover:rotate-90" />
                  </button>
                </div>

                <div className="px-4 pb-2 flex flex-col items-center">
                  <div
                    className="bg-yellow-300 rounded-full w-12 h-12 flex items-center justify-center mb-2"
                    data-aos="zoom-in"
                    data-aos-delay="100"
                  >
                    <span className="text-black font-bold text-xl">Ξ</span>
                  </div>
                  <div className="text-white font-medium mb-1" data-aos="fade-up" data-aos-delay="200">
                    {formatAddress(address)}
                  </div>
                  <div className="text-gray-400 text-sm mb-4" data-aos="fade-up" data-aos-delay="300">
                    0 ETH
                  </div>

                  <div className="w-full grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded transition-all duration-300 hover:scale-105"
                      data-aos="fade-right"
                      data-aos-delay="400"
                    >
                      <Copy size={16} />
                      Copy Address
                    </button>
                    <button
                      onClick={disconnect}
                      className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded transition-all duration-300 hover:scale-105"
                      data-aos="fade-left"
                      data-aos-delay="400"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => modal.open()}
              className="hidden lg:flex items-center text-white border border-slate-950 bg-[#01051666] hover:bg-white/10 backdrop-blur-md gap-2 px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
            >
              <Wallet2 className="w-4 h-4" />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

