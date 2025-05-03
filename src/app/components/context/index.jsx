'use client';

import { wagmiAdapter, projectId } from '../config/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { mainnet, arbitrum, avalanche, base, optimism, polygon, hederaTestnet, eduChainTestnet,seiTestnet, rootstockTestnet } from '@reown/appkit/networks';
import React from 'react';
import { cookieToInitialState, WagmiProvider } from 'wagmi';

// Fixed Flow Testnet Network definition
const flowTestnet = {
  id: 999, // Unique ID for Flow Testnet
  name: "Flow Testnet",
  chainId: 999, // Flow Testnet Chain ID
  rpcUrls: {
    default: {
      http: ["https://rest-testnet.onflow.org"], // Properly structured RPC URLs
    },
    public: {
      http: ["https://rest-testnet.onflow.org"], // Properly structured RPC URLs
    }
  },
  nativeCurrency: {
    name: "Flow",
    symbol: "FLOW",
    decimals: 8,
  },
  blockExplorers: {
    default: {
      name: "FlowScan",
      url: "https://testnet.flowscan.org",
    },
  },
};

const MantleTestnet = {
  id: 5003, // Unique ID for Flow Testnet
  name: "Mantle Testnet",
  chainId: 5003 , // Flow Testnet Chain ID
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia.mantle.xyz"], // Properly structured RPC URLs
    },
    public: {
      http: ["https://rpc.sepolia.mantle.xyz"], // Properly structured RPC URLs
    }
  },
  nativeCurrency: {
    name: "MNT",
    symbol: "MNT",
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: "MNTScan",
      url: "https://explorer.sepolia.mantle.xyz",
    },
  },
};

// Set up queryClient
const queryClient = new QueryClient();


if (!projectId) {
  throw new Error('Project ID is not defined');
}


// Set up metadata
const metadata = {
  name: 'pay-ai',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

// Create the modal
const modal = createAppKit({

  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon, flowTestnet,MantleTestnet,hederaTestnet,eduChainTestnet,seiTestnet,rootstockTestnet],
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true,
  },
});

function ContextProvider({ children, cookies }) {

  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export { modal };
export default ContextProvider;
