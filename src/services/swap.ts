// const handleSwap = async () => {
//     if (!isConnected) {
//       toast.error("Please connect your wallet");
//       return;
//     }

//     if (!swapData || !address) {
//       toast.error("Failed to prepare swap transaction");
//       return;
//     }

//     const provider = getProvider();
//     if (!provider) return;

//     try {
//       setIsLoading(true);
//       // const transaction = {
//       //   data: swapData.txnData,
//       //   from: address,
//       //   to: address, // In Supra, transaction is sent to self
//       //   value: "0", // Value is managed by the contract
//       // };

//       swapData.txnData.arguments[2] = parseInt(
//         String(swapData.txnData.arguments[2])
//       );
//       swapData.txnData.arguments[3] = parseInt(
//         String(swapData.txnData.arguments[3])
//       );

//       const txHex = await createTxHexData(
//         address,
//         config.contractAddress,
//         "entry",
//         "swap_exact_in_multihop",
//         swapData.txnData.typeArguments,
//         swapData.txnData.arguments
//       );

//       const transaction = {
//         data: txHex,
//         from: address,
//         to: config.contractAddress, // In Supra, transaction is sent to self
//         value: 0, // Value is managed by the contract
//       };
//       TokenSelectModal;

//             const txHash = await provider.sendTransaction(transaction);

    
//     } catch (error) {
//       console.error("Swap failed:", error);
//       toast.error("Failed to execute swap");
//     } 
//   };




// const response = await axios.post(
//     ${config.swapBackendUrl}/api/swap,
//     {
//       amountIn: parseFloat(inputAmount),
//       inputToken: inputToken.address,
//       outputToken: outputToken.address,
//     },
//     {}
//   );

//   const data = response.data;