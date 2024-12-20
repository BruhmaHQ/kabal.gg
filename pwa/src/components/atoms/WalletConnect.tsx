// @ts-nocheck
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

const StarKeyWalletConnect = () => {
    const [account, setAccount] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const router = useRouter()

    // Check StarKey installation
    useEffect(() => {
        const checkStarKeyInstallation = () => {

            const starKeyInstalled = window?.starkey;

            setIsInstalled(starKeyInstalled);
        };

        checkStarKeyInstallation();
    }, []);

    // Get StarKey provider
    const getProvider = () => {
        if ('starkey' in window) {
            const provider = window.starkey?.supra;
            return provider;
        }
        return null;
    };

    // Connect wallet handler
    const connectWallet = async () => {
        if (!isInstalled) {
            // Redirect to StarKey installation
            window.open('https://starkey.app/', '_blank');
            return;
        }

        try {
            const provider = getProvider();
            if (!provider) {
                throw new Error('StarKey provider not found');
            }

            // Connect to wallet
            const accounts = await provider.connect();
            setAccount(accounts[0]);

            // Listen for account changes
            provider.on('accountChanged', (newAccounts) => {
                if (newAccounts.length > 0) {
                    setAccount(newAccounts[0]);
                }
            });
            router.push('/')
        } catch (error) {
            console.error('Wallet connection failed:', error);
            if (error.code === 4001) {
                alert('Connection request was rejected by the user');
            } else {
                alert('Failed to connect wallet');
            }
        }
    };

    // Disconnect wallet handler
    const disconnectWallet = async () => {
        try {
            const provider = getProvider();
            if (provider) {
                await provider.disconnect();
                setAccount(null);
            }
        } catch (error) {
            console.error('Wallet disconnection failed:', error);
            alert('Failed to disconnect wallet');
        }
    };

    // Send transaction example method
    const sendTransaction = async (toAddress, amount) => {
        try {
            const provider = getProvider();
            if (!provider || !account) {
                throw new Error('Wallet not connected');
            }

            const transaction = {
                from: account,
                to: toAddress,
                value: amount,
                data: "" // Optional data field
            };

            const txHash = await provider.sendTransaction(transaction);
            console.log("Transaction Hash:", txHash);
            return txHash;
        } catch (error) {
            console.error('Transaction failed:', error);
            alert('Failed to send transaction');
        }
    };

    return (
        <div className="space-y-4">
            {!isInstalled ? (
                <button className='p-2 rounded bg-blue-800 text-white'
                    onClick={connectWallet}
                    className="w-full"
                    variant="outline"
                >
                    Install StarKey Wallet
                </button>
            ) : (
                <>
                    <button className='p-2 rounded bg-blue-800 rounded text-white'
                        onClick={account ? disconnectWallet : connectWallet}
                        className="w-full"
                    >
                        {account
                            ? `Disconnect: ${account.slice(0, 6)}...${account.slice(-4)}`
                            : 'Connect StarKey Wallet'
                        }
                    </button>

                    {account && (
                        <div className="mt-2 bg-blue-600 text-wrap p-2 max-w-[200px] te text-sm">
                            Connected Account: {account}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


export default StarKeyWalletConnect;