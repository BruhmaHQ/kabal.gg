import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  Chain,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const PROJECT_ID = '48a5a433e7452eb7ae72f47f85f27858'

// Supra MoveVM Testnet Configuration
const supraMoveVMTestnet = {
    id: 6,
    name: 'Supra MoveVM Testnet',
    nativeCurrency: { name: 'Supra Token', symbol: 'SUPRA', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://rpc-testnet.supra.com'] },
    },
    blockExplorers: {
      default: { name: 'Supra Explorer', url: 'https://suprascan.io/' }, 
    },
  } as const satisfies Chain;


// Supra EVM Stagingnet Configuration
const supraEVMStagingnet = {
    id: 231,
    name: 'Supra EVM Stagingnet',
    nativeCurrency: { name: 'Supra Token', symbol: 'SUPRA', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://rpc-evmstaging.supra.com/rpc/v1/eth'] },
    },
    blockExplorers: {
      default: { name: 'Supra EVM Explorer', url: 'https://suprascan.io/' }, 
    },
  } as const satisfies Chain;
  
  // Wagmi Configuration
  const config = getDefaultConfig({
    appName: 'Supra WalletConnect App',
    projectId: PROJECT_ID,
    chains: [supraMoveVMTestnet, supraEVMStagingnet],
  });

  
const queryClient = new QueryClient();

export const WalletLayout = ({ children }: any) => {
  

  return (<>
      <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
        {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
</>)
}