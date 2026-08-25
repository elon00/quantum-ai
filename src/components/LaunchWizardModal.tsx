import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { BondingCurveType, SupportedChain, AgentToken } from '../types';
import { Sparkles, X, Rocket, Shield, Layers, HelpCircle, CheckCircle2, RefreshCw, Atom } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LaunchWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenCreated: (token: AgentToken) => void;
}

export const LaunchWizardModal: React.FC<LaunchWizardModalProps> = ({ isOpen, onClose, onTokenCreated }) => {
  const { walletState, addTransaction, updateBalances } = useWallet();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [agentRole, setAgentRole] = useState<AgentToken['agentRole']>('DeFi Arbitrage');
  const [curveType, setCurveType] = useState<BondingCurveType>('QuantumSigmoid');
  const [chain, setChain] = useState<SupportedChain>(walletState.activeChain);
  const [isDeploying, setIsDeploying] = useState(false);

  if (!isOpen) return null;

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol) return;

    setIsDeploying(true);
    await new Promise((r) => setTimeout(r, 1500));

    const isBnb = chain === 'bnb';
    const contractAddr = isBnb
      ? '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      : Array.from({ length: 44 }, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');

    const newToken: AgentToken = {
      id: `token-${Date.now()}`,
      name,
      symbol: symbol.toUpperCase(),
      description: description || `Autonomous ${agentRole} AI agent powered by quantum bonding curve on ${chain.toUpperCase()}.`,
      avatar: ['🤖', '⚡', '🧠', '⚛️', '🛡️', '🧬'][Math.floor(Math.random() * 6)],
      agentRole,
      chain,
      contractAddress: contractAddr,
      curveType,
      price: curveType === 'QuantumSigmoid' ? 0.0024 : 0.0012,
      change24h: 0,
      marketCap: 24000,
      raised: 0.1,
      targetRaise: isBnb ? 85 : 500,
      graduationProgress: 0.5,
      holders: 1,
      transactions: 1,
      volume24h: 0,
      creator: isBnb ? walletState.bnb.address : walletState.solana.address,
      createdAt: 'Just now',
      dexTarget: isBnb ? 'PancakeSwap v3' : 'Raydium CLMM',
      graduated: false,
    };

    addTransaction({
      hash: contractAddr.slice(0, 10) + '...' + contractAddr.slice(-6),
      type: 'deploy',
      chain,
      amount: `0.05 ${isBnb ? 'tBNB' : 'devSOL'} Gas`,
      status: 'success',
      description: `Deployed Agent Token $${symbol.toUpperCase()} (${curveType} Curve) to ${chain.toUpperCase()}`,
    });

    updateBalances(isBnb ? -0.05 : 0, !isBnb ? -0.05 : 0, 0);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#06B6D4', '#10B981', '#F59E0B', '#8B5CF6'],
    });

    setIsDeploying(false);
    onTokenCreated(newToken);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative text-slate-100 my-8">
        <button
          id="close-launch-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-500/30">
            <Rocket className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Launch Autonomous AI Agent Token
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                1-Click Testnet
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Deploy an on-chain BEP-20 or Solana Anchor token powered by fair-launch dynamic bonding curves.
            </p>
          </div>
        </div>

        <form onSubmit={handleDeploy} className="space-y-4">
          {/* Target Chain Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Blockchain Network</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setChain('bnb')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                  chain === 'bnb'
                    ? 'bg-amber-500/15 border-amber-400 text-white shadow-sm'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 text-xs">
                  BNB
                </span>
                <div className="text-left">
                  <div className="text-xs font-bold">BNB Chain Testnet (97)</div>
                  <div className="text-[10px] text-slate-400">Graduates to PancakeSwap v3 (85 BNB)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setChain('solana')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                  chain === 'solana'
                    ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-sm'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
                  SOL
                </span>
                <div className="text-left">
                  <div className="text-xs font-bold">Solana Devnet (Anchor)</div>
                  <div className="text-[10px] text-slate-400">Graduates to Raydium CLMM (500 SOL)</div>
                </div>
              </button>
            </div>
          </div>

          {/* Token Name & Symbol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="token-name-input" className="text-xs font-semibold text-slate-300">
                Agent Token Name
              </label>
              <input
                id="token-name-input"
                type="text"
                required
                placeholder="e.g. NeuroQ Agentics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="token-symbol-input" className="text-xs font-semibold text-slate-300">
                Ticker Symbol
              </label>
              <input
                id="token-symbol-input"
                type="text"
                required
                placeholder="e.g. NEUROQ"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm uppercase outline-none transition"
              />
            </div>
          </div>

          {/* Agent Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">AI Agent Specialization</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  'DeFi Arbitrage',
                  'MEV Shield',
                  'Quantum Oracle',
                  'Autonomous Liquidity',
                  'PQC Sentinel',
                ] as const
              ).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setAgentRole(role)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition ${
                    agentRole === role
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Bonding Curve Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Bonding Curve Pricing Model</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'Linear', label: 'Linear', formula: 'P = a · S', desc: 'Predictable steady rise' },
                { id: 'Exponential', label: 'Exponential', formula: 'P = a · e^(k·S)', desc: 'High momentum reward' },
                { id: 'QuantumSigmoid', label: 'Quantum Sigmoid', formula: 'P = L/(1+e^-kS)', desc: 'Optimal liquidity buffer' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCurveType(c.id as any)}
                  className={`p-3 rounded-xl border text-left transition ${
                    curveType === c.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold text-cyan-300">{c.label}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{c.formula}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="token-description-input" className="text-xs font-semibold text-slate-300">
              Agent Autonomous Strategy Description
            </label>
            <textarea
              id="token-description-input"
              rows={2}
              placeholder="Describe the agent's on-chain execution logic..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs outline-none transition"
            />
          </div>

          {/* Graduation Preview */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 text-cyan-400" />
                DEX Graduation Mechanism:
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {chain === 'bnb' ? '85 BNB Target' : '500 SOL Target'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Once bonding curve completes, 100% of collected liquidity is automatically locked into{' '}
              {chain === 'bnb' ? 'PancakeSwap v3 with burned LP tokens' : 'Raydium CLMM with immutable freeze authority'}.
            </p>
          </div>

          {/* Submit / Deploy Button */}
          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              id="deploy-token-submit-btn"
              type="submit"
              disabled={isDeploying || !name || !symbol}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition disabled:opacity-50"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  Broadcasting Post-Quantum Bytecode...
                </>
              ) : (
                <>
                  <Rocket className="w-3.5 h-3.5 text-slate-950" />
                  Deploy Agent Token (Testnet)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
