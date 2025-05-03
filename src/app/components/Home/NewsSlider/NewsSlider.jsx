"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import AOS from "aos";
import "aos/dist/aos.css";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

// News data for CryptoSafe with relevant images
const newsItems = [
  {
    title: "NeuroSync Launches Escrow Protection Feature",
    description:
      "Our new escrow protection system ensures your crypto transfers are secure and only complete when all conditions are met. This revolutionary feature eliminates the risk of sending funds to incorrect addresses and provides peace of mind for all your transactions.",
    imagePath: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop",
    imageAlt: "Crypto security lock concept with digital protection",
  },
  {
    title: "Group Payments Now Available on CryptoSafe",
    description:
      "Split bills, collect funds for events, or manage shared expenses with our new Group Payments feature. Experience complete transparency and security while managing finances with friends, family, or colleagues. Never worry about who paid what again.",
    imagePath: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2787&auto=format&fit=crop",
    imageAlt: "Group of people collaborating on finances",
  },
  {
    title: "Introducing Savings Pots for Shared Goals",
    description:
      "Create secure savings goals with friends or family using our new Savings Pots feature. Perfect for vacations, gifts, or shared purchases, this tool helps you track progress and ensures all contributions are securely managed on the blockchain.",
    imagePath: "https://images.unsplash.com/photo-1621501103258-3e135c8c1fda?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Digital savings concept with growth chart",
  },
  {
    title: "Multi-Signature Verification Enhances Security",
    description:
      "CryptoSafe now offers multi-signature verification for all transactions, providing an additional layer of security. This feature requires multiple approvals before completing transfers, protecting you from unauthorized access and ensuring your funds remain safe.",
    imagePath: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Multi-layer security concept with digital verification",
  },
]

export default function NewsSlider() {
  useEffect(() => {
    AOS.init({
      duration: 1500, // Animation duration in milliseconds
      easing: "ease-in-out", // Animation easing
      once: true, // Whether animation should happen only once
    });
  }, []);
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length)
  }

  return (
    <section className="py-16   relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent opacity-30"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl font-bold text-center text-white mb-12">News & Updates</h2>

        <div className="relative bg-black/80 rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <div className="relative">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {newsItems.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0 ">
                  <div className="grid md:grid-cols-2 gap-6 p-8 w-full h-[70vh] bg-neutral-900  md:p-16">
                    <div className="flex flex-col justify-center  space-y-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">{item.title}</h3>
                      <p className="text-gray-400 text-sm md:text-base">{item.description}</p>
                      <div>
                        <button className="mt-4 group flex items-center cursor-pointer text-white border border-white/20 px-4 py-2 rounded-md hover:bg-white/10 transition-colors">
                          Read <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 cursor-pointer transition-transform" />
                        </button>
                      </div>
                    </div>
                    <div className="flex h-full items-center justify-center order-first md:order-last">
                      <div className="relative w-full h-[200px] md:h-full  rounded-2xl overflow-hidden">
                        <img
                        
                          src={item.imagePath || "/placeholder.svg"}
                          alt={item.imageAlt}
                        
                          className="object-cover h-96"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 cursor-pointer left-4 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 cursor-pointer right-4 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index ? "bg-white w-8 h-2" : "bg-white/30 w-2 h-2 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

