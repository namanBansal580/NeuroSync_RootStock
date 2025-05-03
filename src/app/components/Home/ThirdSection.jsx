"use client"

import { useEffect, useState } from "react"

export default function ThirdSection() {
  const [rotation, setRotation] = useState(0)

  // Continuous rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#0B061D] overflow-hidden flex gap-8 pt-24">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
      </div>

      {/* Main content */}
   
        {/* Rotating circle with icons */}
        <div className="relative w-[500px] h-[500px] flex-shrink-0 animate-pulse duration-700 transition-all">
         <img src="https://merlinchain.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmerlin-circle.7ee65ba0.webp&w=1920&q=75" alt="" />
          </div>

          {/* Decorative stars */}
        
    

        {/* Text content */}
        <div className="flex-1 space-y-8 \ pt-24">
          <h2 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Pay AI</span>{" "}
            <span className="text-white">supports various types of assets</span>
          </h2>

          <p className="text-lg text-purple-200/80">
            Pay AI will bring innovation and utilities on Layer2 with those native Layer1 assets
          </p>

          <div className="space-y-4">
            <p className="text-sm text-purple-300/60">Coming Soon</p>

            <div className="space-y-4">
              <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/25">
                Build on Pay AI 
              </button>

              <button className="w-full ml-3 sm:w-auto px-8 py-3 border border-purple-500/30 rounded-xl text-purple-300 font-semibold hover:bg-purple-500/10 transition-all duration-300">
                Apply for Pay AI   Grant
              </button>
            </div>
          </div>
        </div>
      </div>

  )
}

