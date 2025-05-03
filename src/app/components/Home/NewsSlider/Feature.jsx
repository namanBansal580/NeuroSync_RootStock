import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";



const Feature = ({ category, title, description, imagePath, delay }) => {
  useEffect(() => {
    AOS.init({
      duration: 1500, // Animation duration in milliseconds
      easing: "ease-in-out", // Animation easing
      once: true, // Whether animation should happen only once
    });
  }, []);
  return (
    <div data-aos="flip-left"
      className="feature-card rounded-xl bg-gradient-to-br from-black/80 to-gray-900/80 overflow-hidden p-6 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 ease-in-out animate-fade-in relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="relative mb-10 h-40 flex items-center justify-center">
          <img 
            src={imagePath} 
            alt={title} 
            className="w-full h-full object-contain animate-float"
          />
        </div>

        <div className="uppercase text-sm font-medium text-gray-400 tracking-wide mb-2">
          {category}
        </div>

        <div className="flex justify-between items-start">
          <h3 className="text-xl font-medium mb-6">{title}</h3>
          <ArrowRight size={20} className="opacity-70" />
        </div>

        <p className="text-gray-400 text-balance text-sm mb-4">{description}</p>
      </div>
    </div>
  );
};

export default Feature;
