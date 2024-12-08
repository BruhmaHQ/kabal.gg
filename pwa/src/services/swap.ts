import axios from 'axios';
import { createTxHexData } from './supra';

const SWAP_API_URL = "https://swap-backend-prod-340342993997.asia-south2.run.app/api/swap";

export const createSupraSwap = async (amount: number, inputToken: any, ethOutputToken: any, ethPercent:number, btcOutputToken: any, btcPercent:number) => {
  try {
    const ethAmount = amount * ethPercent; 
    const btcAmount = amount * btcPercent; 

    // ETH Swap
    const ethResponse = await axios.post(SWAP_API_URL, {
      amountIn: ethAmount,
      inputToken: inputToken,
      outputToken: ethOutputToken,
    });

    const btcResponse = await axios.post(SWAP_API_URL, {
      amountIn: btcAmount,
      inputToken: inputToken,
      outputToken: btcOutputToken,
    });


    return {
      ethSwap: ethResponse.data,
      btcSwap: btcResponse.data,
    };
  } catch (error) {
    console.error('Error creating swaps:', error);
    throw error;
  }
};


export const handleSwap = async (swapData: { txnData: { arguments: any[]; typeArguments: string; }; }) => {

  const provider = getProvider();
  if (!provider) return;

  try {
    // setIsLoading(true);
    // const transaction = {
    //   data: swapData.txnData,
    //   from: address,
    //   to: address, // In Supra, transaction is sent to self
    //   value: "0", // Value is managed by the contract
    // };

    swapData.txnData.arguments[2] = parseInt(
      String(swapData.txnData.arguments[2])
    );
    swapData.txnData.arguments[3] = parseInt(
      String(swapData.txnData.arguments[3])
    );

    const txHex = await createTxHexData(
      // address,
      "0x8ede5b689d5ac487c3ee48ceabe28ae061be74071c86ffe523b7f42acda2fcb7",
      "entry",
      "swap_exact_in_multihop",
      swapData.txnData.typeArguments,
      swapData.txnData.arguments
    );

    const transaction = {
      data: txHex,
      // from: address,
      // to: config.contractAddress, // In Supra, transaction is sent to self
      value: 0, // Value is managed by the contract
    };
    

          const txHash = await provider.sendTransaction(transaction);

  
  } catch (error) {
    console.error("Swap failed:", error);
  } 
};
