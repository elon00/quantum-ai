import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { SupportedChain, CrossChainBridgeTransfer } from '../types';
import { Zap, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2, Lock, Sparkles, Globe, Layers, ArrowLeftRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CrossChainQuantumBridge: React.FC = () => {
  const { walletState, addTransaction, updateBalances } = useWallet();
  const [fromChain, setFromChain] = useState<SupportedChain>('bnb');
  const [toChain, setToChain] = useState<SupportedChain>('solana');
  const [transferAmount, setTransferAmount] = useState<string>('500');
  const [isRelaying, setIsRelaying] = useState<boolean>(false);
  const [relayStatus, setRelayStatus] = useState<string | null>(null);

  const [history, setHistory] = useState<CrossChainBridgeTransfer[]>([
    {
      id: 'br-1',
      fromChain: 'bnb',
      toChain: 'solana',
      amount: 1000,
      tokenSymbol: 'QAGENT',
      pqcProofHash: '0x94fa812048...mldsa65_wormhole_lock',
      status: 'completed',
      timestamp: Date.now() - 3600000,
    },
    {
      id: 'br-2',
      fromChain: 'solana',
      toChain: 'sui',
      amount: 450,
      tokenSymbol: 'QAGENT',
      pqcProofHash: '0x38b2910fa1...atomic_pqc_relay',
      status: 'completed',
      timestamp: Date.now() - 1800000,
    },
  ]);

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleExecuteBridge = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) return;

    setIsRelaying(true);
    setRelayStatus('Step 1/3: Locking tokens in Quantum Vault with NIST ML-DSA-65 signature...');
    await new Promise((r) => setTimeout(r, 900));

    setRelayStatus('Step 2/3: Broadcasting cross-chain zero-knowledge entanglement relay...');
    await new Promise((r) => setTimeout(r, 900));

    setRelayStatus('Step 3/3: Minting equivalent PQC-wrapped tokens on target destination...');
    await new Promise((r) => setTimeout(r, 800));

    const proofHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newTransfer: CrossChainBridgeTransfer = {
      id: `br-${Date.now()}`,
      fromChain,
      toChain,
      amount: amt,
      tokenSymbol: 'QAGENT',
      pqcProofHash: proofHash.slice(0, 12) + '...' + proofHash.slice(-6),
      status: 'completed',
      timestamp: Date.now(),
    };

    setHistory((prev) => [newTransfer, ...prev]);
    setIsRelaying(false);
    setRelayStatus(`? Successfully Teleported ${amt} $QAGENT from ${fromChain.toUpperCase()} to ${toChain.toUpperCase()}!`);

    addTransaction({
      hash: proofHash.slice(0, 10) + '...' + proofHash.slice(-6),
      type: 'bridge',
      chain: fromChain,
      amount: `${amt} QAGENT`,
      status: 'success',
      description: `Quantum Wormhole Bridge: ${fromChain.toUpperCase()} ? ${toChain.toUpperCase()}`,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F5FF', '#7B2CBF', '#F59E0B'],
    });

    setTimeout(() => setRelayStatus(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Quantum Wormhole Inter-Chain Bridge
            </span>
            <span className="px-2.5 py-1 text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl">
              NIST FIPS 204 Atomic Locks
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interdimensional Cross-Chain Liquidity Bridge
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Teleport $QAGENT and cryptographic liquidity seamlessly between <b>BNB Smart Chain (97)</b>, <b>Solana Devnet</b>, <b>Sui Network (Move)</b>, and <b>Ethereum/Arbitrum</b> with zero quantum-sponge exploit risk.
          </p>
        </div>
      </div>

      {/* Main Bridge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Interactive Bridge Portal */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" /> Quantum Teleportation Portal
          </h3>

          <form onSubmit={handleExecuteBridge} className="space-y-4 text-xs">
            {/* Origin Chain */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Origin Blockchain (Source)</label>
              <select
                value={fromChain}
                onChange={(e) => setFromChain(e.target.value as SupportedChain)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-bold focus:outline-none focus:border-cyan-400"
              >
                <option value="bnb">BNB Smart Chain Testnet (Chain ID 97)</option>
                <option value="solana">Solana Devnet (Anchor Token-2022)</option>
                <option value="sui">Sui Move Quantum Object Layer</option>
                <option value="arbitrum">Arbitrum Nitro (EVM L2)</option>
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSwapChains}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer active:scale-95"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Target Chain */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Target Destination (Sink)</label>
              <select
                value={toChain}
                onChange={(e) => setToChain(e.target.value as SupportedChain)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-bold focus:outline-none focus:border-cyan-400"
              >
                <option value="solana">Solana Devnet (Anchor Token-2022)</option>
                <option value="bnb">BNB Smart Chain Testnet (Chain ID 97)</option>
                <option value="sui">Sui Move Quantum Object Layer</option>
                <option value="arbitrum">Arbitrum Nitro (EVM L2)</option>
              </select>
            </div>

            {/* Transfer Amount */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Teleport Amount ($QAGENT)</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="500"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={isRelaying || fromChain === toChain}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition cursor-pointer active:scale-98 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Zap className={`w-4 h-4 ${isRelaying ? 'animate-spin' : ''}`} />
              <span>{isRelaying ? 'Teleporting through Quantum Wormhole...' : '? Teleport Assets Across Blockchains'}</span>
            </button>
          </form>

          {relayStatus && (
            <div className="p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{relayStatus}</span>
            </div>
          )}
        </div>

        {/* Right: Live Teleportation Streams & History */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" /> Live Interdimensional Teleportation Ledger
            </h3>
            <span className="text-xs font-mono text-emerald-400">Atomic Lattice Finality</span>
          </div>

          <div className="space-y-3">
            {history.map((tx) => (
              <div key={tx.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono uppercase">{tx.fromChain}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono uppercase">{tx.toChain}</span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-400 truncate max-w-sm">Proof: {tx.pqcProofHash}</p>
                </div>

                <div className="text-right font-mono">
                  <span className="text-emerald-400 font-extrabold text-sm block">+{tx.amount} {tx.tokenSymbol}</span>
                  <span className="text-[10px] text-slate-500">Atomic Relay Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};