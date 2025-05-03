export default function LoadingSpinner() {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-purple-300/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
        </div>
        <p className="text-purple-300 text-lg font-medium animate-pulse">Loading trade data...</p>
      </div>
    )
  }
  