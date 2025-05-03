import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum,mantleSepoliaTestnet, hederaTestnet, eduChainTestnet,seiTestnet, rootstockTestnet } from '@reown/appkit/networks'

export const projectId = 'a132ea5c4c81a0001bf5d8a1ce98791a'
if (!projectId) {
  throw new Error('Project ID is not defined')
}
export const networks = [mainnet, arbitrum,mantleSepoliaTestnet,hederaTestnet,eduChainTestnet,seiTestnet,rootstockTestnet]
console.log("my Cookie Storage is:::::::",cookieStorage);

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
