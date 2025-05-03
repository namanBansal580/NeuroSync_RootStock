"use client"

import { useState, useEffect, useRef } from "react"
import { ethers } from "ethers"
import UserProfile from "./user-profile"

import imga from "../../../public/10016.svg";
import { CONTRACT_ABI as contractABI,CONTRACT_ADDRESS as contractAddress } from "@/ContractABI";
import Web3Service from "../trade/web3-service";
import { useChainId } from "wagmi";
export default function Home() {
  const web3Service=new Web3Service(useChainId())
  const canvasRef = useRef(null)
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState("0")
  const [showTerms, setShowTerms] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  })

  // Contract ABI for the register_user function
 
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create orbs
    const orbs = []
    const orbCount = 15
    
    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 60 + 20,
        color: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 150 + 100)}, ${Math.random() * 0.5 + 0.1})`,
        speedX: Math.random() * 0.2 - 0.1,
        speedY: Math.random() * 0.2 - 0.1
      })
    }

    // Create lines
    const lines = []
    const lineCount = 10
    
    for (let i = 0; i < lineCount; i++) {
      lines.push({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
        width: Math.random() * 1 + 0.5,
        color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
        speed: Math.random() * 0.5 + 0.2
      })
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#0f0f1e')
      gradient.addColorStop(0.5, '#1a103c')
      gradient.addColorStop(1, '#0f172a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw orbs
      orbs.forEach(orb => {
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = orb.color
        ctx.fill()
        
        // Move orbs
        orb.x += orb.speedX
        orb.y += orb.speedY
        
        // Bounce off edges
        if (orb.x - orb.radius < 0 || orb.x + orb.radius > canvas.width) {
          orb.speedX = -orb.speedX
        }
        if (orb.y - orb.radius < 0 || orb.y + orb.radius > canvas.height) {
          orb.speedY = -orb.speedY
        }
      })
      
      // Draw lines
      lines.forEach(line => {
        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.strokeStyle = line.color
        ctx.lineWidth = line.width
        ctx.stroke()
        
        // Move lines
        line.x1 += line.speed
        line.x2 += line.speed
        
        // Reset lines when they go off screen
        if (line.x1 > canvas.width && line.x2 > canvas.width) {
          line.x1 = -100
          line.x2 = -100
          line.y1 = Math.random() * canvas.height
          line.y2 = Math.random() * canvas.height
        }
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Replace with your actual contract address

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Request account access
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })

          setAccount(accounts[0])

          // Get balance
          const provider = new ethers.BrowserProvider(window.ethereum)
          const balance = await provider.getBalance(accounts[0])
          setBalance(ethers.formatEther(balance))

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0])
            updateBalance(accounts[0], provider)
          })
        } catch (error) {
          console.error("Error connecting to wallet:", error)
        }
      } else {
        showNotification("Please install MetaMask!", "error")
      }
    }

    const updateBalance = async (address, provider) => {
      const balance = await provider.getBalance(address)
      setBalance(ethers.formatEther(balance))
    }

    connectWallet()

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [])

  const registerUsername = async (username) => {
    if (!account) {
      showNotification("Please connect your wallet first", "error")
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner();
      // const contract = new ethers.Contract(contractAddress(), contractABI, signer)

      const success = await web3Service.registerUser(username)
      console.log("My Success is:::",success);
      
      if (success) {
        showNotification("Username registered successfully!", "success")
      } else {
        showNotification("Unable to register username. It may already be taken.", "error")
      }
    } catch (error) {
      console.error("Error registering username:", error)
      showNotification("Error registering username", "error")
    }
  }

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    })

    setTimeout(() => {
      setNotification({
        ...notification,
        show: false,
      })
    }, 3000)
  }
  

  return (
    <main className="min-h-screen relative overflow-hidden bg-black pt-20">
     
         <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
      <img src={imga.src} className="absolute -top-[60vh] rotate-90 left-[20vw] animate-pulse duration-1000"/>  

      <div className="container mx-auto px-4 py-8 relative z-10 ">
        <UserProfile
          account={account}
          balance={balance}
          onRegister={registerUsername}
          onOpenTerms={() => setShowTerms(true)}
        />
      </div>

    

     
    </main>
  )
}

