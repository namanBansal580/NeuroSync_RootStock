import Link from "next/link"

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden  bg-[url('https://firebasestorage.googleapis.com/v0/b/osc-official-b3cab.appspot.com/o/files%2F10001.jpeg?alt=media&token=e238733e-25b3-4f10-8904-450683880cee')] bg-cover ">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />

      {/* Main content */}
      <div className="relative z-10 mx-auto mt-24 max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6">
          {/* Headings */}
          <div className="max-w-4xl space-y-4 animate-pulse">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your NeuroSync
              <span className="mt-2 block">Your AI Trading Platform</span>
            </h1>
            <p className="text-lg text-gray-300 sm:text-xl lg:text-2xl">
              Send Payements With Trust To Anyone On Secure Protocol
            </p>
          </div>

          {/* Powered by section */}
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-400">Powered by</p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="h-8 w-32 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-pink-500 font-semibold">PARTICLE </span>
              </div>
              <div className="h-8 w-24 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 font-semibold">LUMOZ</span>
              </div>
              <div className="h-8 w-24 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 font-semibold">polygon</span>
              </div>
              <div className="h-8 w-24 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-semibold">bobo</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mt-8">
            <Link
              href="/trade"
              className="inline-flex items-center justify-center rounded-xl bg-[#0066FF] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#0052CC] min-w-[240px]"
            >
              Market Analysis
            </Link>
            <Link
              href="chat"
              className="inline-flex items-center justify-center rounded-xl bg-[#7B3FE4] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#6232B4] min-w-[240px] relative"
            >
              Chaindrop
              <span className="absolute -top-2 -right-2 bg-white text-[#7B3FE4] text-xs px-2 py-0.5 rounded-full font-bold">
                BETA
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-1/2 h-full">
        <div className="absolute inset-0 bg-gradient-to-l from-purple-600/30 to-transparent" />
      </div>
    </div>
  )
}

