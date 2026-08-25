import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DualWalletState, SupportedChain, TransactionRecord } from '../types';

interface WalletContextType {
  walletState: DualWalletState;
  connectWallet: (chain: SupportedChain) => Promise<void>;
  disconnectWallet: (chain: SupportedChain) => void;
  switchActiveChain: (chain: SupportedChain) => void;
  claimFaucet: (chain: SupportedChain) => Promise<void>;
  addTransaction: (tx: Omit<TransactionRecord, 'id' | 'timestamp'>) => void;
  updateBalances: (bnbDelta?: number, solDelta?: number, qaiDelta?: number) => void;
}

const initialWalletState: DualWalletState = {
  bnb: {
    address: '0x8F94a6E19E78Bc408A56a6358c9735d465337De0',
    chain: 'bnb',
    balance: 1.45,
    qaiBalance: 12500,
    connected: true,
    networkName: 'BNB Smart Chain Testnet (97)',
    chainId: 97,
  },
  solana: {
    address: '7XqP...9vKm4nL82tY5gW1zQp3xR9aB',
    chain: 'solana',
    balance: 8.24,
    qaiBalance: 12500,
    connected: true,
    networkName: 'Solana Devnet',
    chainId: 'devnet',
  },
  activeChain: 'bnb',
  isConnecting: false,
  txHistory: [
    {
      id: 'tx-1',
      hash: '0x94fa...22e1',
      type: 'faucet',
      chain: 'bnb',
      amount: '0.5 tBNB',
      timestamp: Date.now() - 120000,
      status: 'success',
      description: 'Testnet Faucet Dispensed',
    },
    {
      id: 'tx-2',
      hash: '5KpL...991a',
      type: 'swap',
      chain: 'solana',
      amount: '500 QAI',
      timestamp: Date.now() - 60000,
      status: 'success',
      description: 'Swapped 0.25 devSOL for $QAI',
    },
  ],
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<DualWalletState>(() => {
    const saved = localStorage.getItem('quantum_wallet_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialWalletState;
      }
    }
    return initialWalletState;
  });

  useEffect(() => {
    localStorage.setItem('quantum_wallet_state', JSON.stringify(walletState));
  }, [walletState]);

  const connectWallet = async (chain: SupportedChain) => {
    setWalletState((prev) => ({ ...prev, isConnecting: true }));
    try {
      // Check if real MetaMask or Phantom is injected
      if (chain === 'bnb' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setWalletState((prev) => ({
            ...prev,
            bnb: {
              ...prev.bnb,
              address: accounts[0],
              connected: true,
            },
            isConnecting: false,
          }));
          return;
        }
      }
      if (chain === 'solana' && (window as any).solana) {
        const resp = await (window as any).solana.connect();
        if (resp && resp.publicKey) {
          setWalletState((prev) => ({
            ...prev,
            solana: {
              ...prev.solana,
              address: resp.publicKey.toString(),
              connected: true,
            },
            isConnecting: false,
          }));
          return;
        }
      }

      // Simulated instant connection for testnet
      await new Promise((r) => setTimeout(r, 600));
      setWalletState((prev) => ({
        ...prev,
        [chain]: {
          ...prev[chain],
          connected: true,
        },
        isConnecting: false,
      }));
    } catch (e) {
      console.error('Wallet connect error:', e);
      setWalletState((prev) => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = (chain: SupportedChain) => {
    setWalletState((prev) => ({
      ...prev,
      [chain]: {
        ...prev[chain],
        connected: false,
      },
    }));
  };

  const switchActiveChain = (chain: SupportedChain) => {
    setWalletState((prev) => ({ ...prev, activeChain: chain }));
  };

  const claimFaucet = async (chain: SupportedChain) => {
    const isBnb = chain === 'bnb';
    const amountStr = isBnb ? '0.5 tBNB + 2,500 $QAI' : '2.0 devSOL + 2,500 $QAI';
    const txHash = isBnb
      ? '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      : Array.from({ length: 44 }, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');

    setWalletState((prev) => ({
      ...prev,
      [chain]: {
        ...prev[chain],
        balance: prev[chain].balance + (isBnb ? 0.5 : 2.0),
        qaiBalance: prev[chain].qaiBalance + 2500,
      },
      txHistory: [
        {
          id: `tx-${Date.now()}`,
          hash: txHash.slice(0, 10) + '...' + txHash.slice(-6),
          type: 'faucet',
          chain,
          amount: amountStr,
          timestamp: Date.now(),
          status: 'success',
          description: `Dispensed ${amountStr} to ${chain.toUpperCase()} wallet`,
        },
        ...prev.txHistory,
      ],
    }));
  };

  const addTransaction = (tx: Omit<TransactionRecord, 'id' | 'timestamp'>) => {
    const newTx: TransactionRecord = {
      ...tx,
      id: `tx-${Date.now()}`,
      timestamp: Date.now(),
    };
    setWalletState((prev) => ({
      ...prev,
      txHistory: [newTx, ...prev.txHistory],
    }));
  };

  const updateBalances = (bnbDelta = 0, solDelta = 0, qaiDelta = 0) => {
    setWalletState((prev) => ({
      ...prev,
      bnb: {
        ...prev.bnb,
        balance: Math.max(0, prev.bnb.balance + bnbDelta),
        qaiBalance: Math.max(0, prev.bnb.qaiBalance + qaiDelta),
      },
      solana: {
        ...prev.solana,
        balance: Math.max(0, prev.solana.balance + solDelta),
        qaiBalance: Math.max(0, prev.solana.qaiBalance + qaiDelta),
      },
    }));
  };

  return (
    <WalletContext.Provider
      value={{
        walletState,
        connectWallet,
        disconnectWallet,
        switchActiveChain,
        claimFaucet,
        addTransaction,
        updateBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
