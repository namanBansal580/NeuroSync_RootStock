"use client";

import React, { useEffect, useState } from "react";

import { Home, Phone, Mail, Info, Send, ArrowRight } from "lucide-react";
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Github 
} from "lucide-react";
// import { useToast } from '@/components/ui/use-toast';

const Footer = () => {
  // const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3,
      animationDuration: Math.random() * 4 + 2,
      animationDelay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // if (!email) {
    //   toast({
    //     title: "Please enter your email",
    //     variant: "destructive",
    //   });
    //   return;
    // }
    
    // toast({
    //   title: "Thank you for subscribing!",
    //   description: "You'll receive our newsletter at " + email,
    // });
    
    setEmail("");
  };

  return (
    <footer className="w-full bg-gradient-to-br from-[#0D0B1A] to-[#1A103B] text-white relative overflow-hidden">
      {/* Blinking Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div 
            key={particle.id}
            className="absolute rounded-full bg-purple-400"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              opacity: particle.opacity,
              animation: `pulse ${particle.animationDuration}s infinite ${particle.animationDelay}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4 mb-8 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple flex items-center justify-center">
                <span className="text-white text-xl">✧</span>
              </div>
              <h2 className="text-white text-xl font-bold">Pay AI</h2>
            </div>
            <p className="text-gray-400 text-sm">Make Bitcoin Fun Again</p>
          </div>

          {/* Main Footer Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl">
            {/* Hackathons */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Hackathons</h3>
              <div className="flex flex-col space-y-3">
                <a href="/hacks" className="text-gray-400 hover:text-purple-400 transition-colors">View Hacks</a>
                <a href="/hacks/create" className="text-gray-400 hover:text-purple-400 transition-colors">Create Hacks</a>
                <a href="/hacks/latest" className="text-gray-400 hover:text-purple-400 transition-colors">Latest Hacks</a>
              </div>
            </div>

            {/* Builds */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Builds</h3>
              <div className="flex flex-col space-y-3">
                <a href="/builds" className="text-gray-400 hover:text-purple-400 transition-colors">My Builds</a>
                <a href="/builds/create" className="text-gray-400 hover:text-purple-400 transition-colors">Create Build</a>
                <a href="/builds/submit" className="text-gray-400 hover:text-purple-400 transition-colors">Submit Build</a>
              </div>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">About</h3>
              <div className="flex flex-col space-y-3">
                <a href="/about" className="text-gray-400 hover:text-purple-400 transition-colors">About</a>
                <a href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">Terms & Conditions</a>
                <a href="/profile" className="text-gray-400 hover:text-purple-400 transition-colors">User Profile</a>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="flex flex-col space-y-4 mt-8 md:mt-0">
            <h3 className="text-white font-semibold">Subscribe to Newsletter</h3>
            <p className="text-gray-400 text-sm">Stay updated with the latest news</p>
            <form onSubmit={handleSubscribe} className="mt-2">
              <div className="relative">
                {/* <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pr-12 bg-dark border-purple/20 focus:border-purple/50 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                /> */}
                {/* <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full text-purple hover:bg-purple/10"
                >
                  <ArrowRight size={18} />
                </Button> */}
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-purple/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2025 pay-ai.vercel.app</p>

          {/* Social Media Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://twitter.com" className="text-white"><Twitter size={16} /></a>
            <a href="https://discord.com" className="text-white"><Github size={16} /></a>
            <a href="https://instagram.com" className="text-white"><Instagram size={16} /></a>
            <a href="https://github.com" className="text-white"><Github size={16} /></a>
            <a href="https://youtube.com" className="text-white"><Youtube size={16} /></a>
            <a href="https://linkedin.com" className="text-white"><Linkedin size={16} /></a>
            <a href="https://facebook.com" className="text-white"><Facebook size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
