export default function Loading() {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Notifications</h2>
          <p className="text-purple-300">Please wait while we fetch your notifications...</p>
        </div>
      </div>
    )
  }
  