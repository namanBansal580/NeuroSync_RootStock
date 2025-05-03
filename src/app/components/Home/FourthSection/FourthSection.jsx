import React from 'react';
import FeatureCard from './FeatureCard';
import walletIcon from "../../../../../public/wallet-icon.svg";
import bitIcon from "../../../../../public/bitcoin.svg";
import globeIcon from "../../../../../public/global-icon.svg";
import cubeIcon from "../../../../../public/cube-icon.svg";
import A from "../../../../../public/10002.jpeg";
import B from "../../../../../public/10003.jpeg";
import C from "../../../../../public/10004.jpeg";
import D from "../../../../../public/10005.jpeg";

// import {  } from "../../../../../public";
const features = [
  {
    title: "Low Fees, High Scalability",
    description: "Pay-AI offers low fees and high scalability as an EVM-compatible chain, ensuring swift transaction processing and enhancing transaction liquidity.",
    imageSrc: A.src
  },
  {
    title: "BTC Protocols Support",
    description: "Pay-AI supports popular Bitcoin protocols such as BRC20, BRC420, Bitmap, Atomicals, Pipe, Stamp, and more, enabling a more extensive user base to interact on Bitcoin Layer2.",
    imageSrc: B.src
  },
  {
    title: "ZK Rollup on Bitcoin",
    description: "Pay-AI has implemented ZK-Rollup to enhance efficiency and scalability, with sequencer nodes responsibly managing data transmission via decentralized Oracles, ensuring transparency and security.",
    imageSrc: C.src
  },
  {
    title: "Native Innovation",
    description: "Pay-AI continues its commitment to fair launches and community-driven native innovations on Layer2, dedicated to delivering unique solutions designed for the Bitcoin network and its users.",
    imageSrc: D.src
  }
];

const FourthSection = () => {
  return (
    <section className="py-24 overflow-hidden relative">
      <div className="bg-stars"></div>
      
      <div className="container mx-auto px-4 feature-container">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Core <span>Features</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              imageSrc={feature.imageSrc}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourthSection;
