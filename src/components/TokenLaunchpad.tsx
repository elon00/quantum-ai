import React, { useState, useMemo } from 'react';
import { useWallet } from '../context/WalletContext';
import { AgentToken, SupportedChain } from '../types';
import { LaunchWizardModal } from './LaunchWizardModal';
import { calculateBondingPrice } from '../utils/quantumMath';
import { Sparkles, Plus, Search, Filter, ArrowUpRight, TrendingUp, ShieldCheck, Zap, Layers, RefreshCw, CheckCircle2, ChevronRight, Droplet } from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_TOKENS: AgentToken[] = [
  {
    id: 'tok-1',
    name: 'NeuroQ DeFi Arbitrage',
    symbol: 'NEUROQ',
    description: 'Autonomous cross-DEX quantum arbitrage agent optimizing flash-loan yields across BNB and Solana pools.',
    avatar: '🧠',
    agentRole: 'DeFi Arbitrage',
    chain: 'bnb',
    contractAddress: '0x88F1b71192e21b0Fa369D4b2b1a03e1e564883A1',
    curveType: 'QuantumSigmoid',
    price: 0.00342,
    change24h: 38.4,
    marketCap: 342000,
    raised: 54.2,
    targetRaise: 85,
    graduationProgress: 63.7,
    holders: 384,
    transactions: 2190,
    volume24h: 42100,
    creator: '0x8F94...7De0',
    createdAt: '2 hrs ago',
    dexTarget: 'PancakeSwap v3',
    graduated: false,
  },
  {
    id: 'tok-2',
    name: 'Chronos-7 MEV Shield',
    symbol: 'CHRONOS',
    description: 'Post-quantum lattice encrypted private mempool routing agent protecting transactions from front-running.',
    avatar: '🛡️',
    agentRole: 'MEV Shield',
    chain: 'solana',
    contractAddress: 'Chr7...99xK4m2PqL81vN5b',
    curveType: 'Exponential',
    price: 0.0148,
    change24h: 84.1,
    marketCap: 740000,
    raised: 395.0,
    targetRaise: 500,
    graduationProgress: 79.0,
    holders: 912,
    transactions: 6420,
    volume24h: 128000,
    creator: '7XqP...R9aB',
    createdAt: '5 hrs ago',
    dexTarget: 'Raydium CLMM',
    graduated: false,
  },
  {
    id: 'tok-3',
    name: 'Synthex Quantum Oracle',
    symbol: 'SYNTHEX',
    description: 'High-frequency telemetry agent publishing QUBO state solutions and real-time covariance matrices on-chain.',
    avatar: '⚛️',
    agentRole: 'Quantum Oracle',
    chain: 'bnb',
    contractAddress: '0x321aB...8849b21C4',
    curveType: 'Linear',
    price: 0.00185,
    change24h: 14.2,
    marketCap: 185000,
    raised: 28.5,
    targetRaise: 85,
    graduationProgress: 33.5,
    holders: 182,
    transactions: 890,
    volume24h: 18200,
    creator: '0x334a...92b1',
    createdAt: '1 day ago',
    dexTarget: 'PancakeSwap v3',
    graduated: false,
  },
  {
    id: 'tok-4',
    name: 'Singularity PQC Sentinel',
    symbol: 'SINGULAR',
    description: 'Continuous Shor 127Q threat auditor enforcing ML-DSA-65 signature checks on high-value smart contract calls.',
    avatar: '⚡',
    agentRole: 'PQC Sentinel',
    chain: 'solana',
    contractAddress: 'Sing...7741pL92bX8',
    curveType: 'QuantumSigmoid',
    price: 0.0245,
    change24h: 112.5,
    marketCap: 1225000,
    raised: 500.0,
    targetRaise: 500,
    graduationProgress: 100,
    holders: 1840,
    transactions: 14800,
    volume24h: 310000,
    creator: '44Km...82b1',
    createdAt: '3 days ago',
    dexTarget: 'Raydium CLMM',
    graduated: true,
  },
];

export const TokenLaunchpad: React.FC = () => {
  const { walletState, addTransaction, updateBalances } = useWallet();
  const [tokens, setTokens] = useState<AgentToken[]>(INITIAL_TOKENS);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChainFilter, setSelectedChainFilter] = useState<'all' | SupportedChain>('all');
  const [selectedTokenForSwap, setSelectedTokenForSwap] = useState<AgentToken | null>(null);

  // Swap State
  const [swapAmount, setSwapAmount] = useState('0.1');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  const filteredTokens = useMemo(() => {
    return tokens.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.agentRole.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChain = selectedChainFilter === 'all' || t.chain === selectedChainFilter;
      return matchesSearch && matchesChain;
    });
  }, [tokens, searchQuery, selectedChainFilter]);

  const handleTokenCreated = (newToken: AgentToken) => {
    setTokens((prev) => [newToken, ...prev]);
  };

  const handleExecuteSwap = async () => {
    if (!selectedTokenForSwap) return;
    setIsSwapping(true);
    await new Promise((r) => setTimeout(r, 1000));

    const numAmount = parseFloat(swapAmount) || 0.1;
    const isBnb = selectedTokenForSwap.chain === 'bnb';
    const tokensBought = Math.round(numAmount / selectedTokenForSwap.price);

    // Update token raise & progress
    setTokens((prev) =>
      prev.map((t) => {
        if (t.id === selectedTokenForSwap.id) {
          const newRaised = Math.min(t.targetRaise, t.raised + numAmount);
          const newGraduation = Math.min(100, (newRaised / t.targetRaise) * 100);
          return {
            ...t,
            raised: parseFloat(newRaised.toFixed(2)),
            graduationProgress: parseFloat(newGraduation.toFixed(1)),
            graduated: newGraduation >= 100,
            holders: t.holders + 1,
            transactions: t.transactions + 1,
          };
        }
        return t;
      })
    );

    // Update wallet balance
    updateBalances(isBnb ? -numAmount : 0, !isBnb ? -numAmount : 0, tokensBought);

    // Add TX
    const txHash = isBnb
      ? '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      : Array.from({ length: 44 }, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');

    addTransaction({
      hash: txHash.slice(0, 10) + '...' + txHash.slice(-6),
      type: 'swap',
      chain: selectedTokenForSwap.chain,
      amount: `${numAmount} ${isBnb ? 'tBNB' : 'devSOL'} -> ${tokensBought.toLocaleString()} $${selectedTokenForSwap.symbol}`,
      status: 'success',
      description: `Bought $${selectedTokenForSwap.symbol} along ${selectedTokenForSwap.curveType} curve`,
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#06B6D4', '#10B981', '#F59E0B'],
    });

    setIsSwapping(false);
    setSwapSuccess(true);
    setTimeout(() => {
      setSwapSuccess(false);
      setSelectedTokenForSwap(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Launch CTA */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Fair-Launch Dynamic Bonding Curves
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PancakeSwap & Raydium Auto-Migration
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Agentics Token Launchpad
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Deploy autonomous AI agent tokens with zero seed capital. Liquidity builds deterministically along Quantum Sigmoid bonding curves until auto-graduating to premier DEXs.
            </p>
          </div>

          <button
            id="launch-new-agent-btn"
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            Launch Agent Token
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 focus-within:border-cyan-500 transition">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            id="search-tokens-input"
            type="text"
            placeholder="Search AI agents by name, symbol, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none w-full"
          />
        </div>

        {/* Chain Filters */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'All Chains' },
            { id: 'bnb', label: 'BNB Testnet' },
            { id: 'solana', label: 'Solana Devnet' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedChainFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedChainFilter === f.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Token Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredTokens.map((token) => (
          <div
            key={token.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition">
                    {token.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">{token.name}</h3>
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        ${token.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          token.chain === 'bnb'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {token.chain === 'bnb' ? 'BNB Chain' : 'Solana Anchor'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {token.agentRole}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-200 text-sm">
                    ${token.price.toFixed(4)}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 font-bold">
                    +{token.change24h}% 24h
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {token.description}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 text-[11px] font-mono mb-4">
                <div>
                  <span className="text-slate-500 block text-[10px]">Market Cap</span>
                  <span className="text-slate-300 font-bold">${token.marketCap.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Curve Type</span>
                  <span className="text-cyan-400 font-bold">{token.curveType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Holders</span>
                  <span className="text-slate-300 font-bold">{token.holders.toLocaleString()}</span>
                </div>
              </div>

              {/* DEX Graduation Progress */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <span>Graduation:</span>
                    <span className="text-slate-200 font-bold">
                      {token.raised} / {token.targetRaise} {token.chain === 'bnb' ? 'BNB' : 'SOL'}
                    </span>
                  </span>
                  <span className={`font-bold ${token.graduated ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {token.graduated ? 'GRADUATED TO DEX' : `${token.graduationProgress}%`}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      token.graduated
                        ? 'bg-emerald-400 shadow-md shadow-emerald-400/50'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${token.graduationProgress}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                  <span>Target: {token.dexTarget}</span>
                  <span>Creator: {token.creator.slice(0, 6)}...{token.creator.slice(-4)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                id={`trade-token-${token.symbol}-btn`}
                onClick={() => setSelectedTokenForSwap(token)}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Buy / Trade on Curve
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Swap Modal */}
      {selectedTokenForSwap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedTokenForSwap.avatar}</span>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Buy ${selectedTokenForSwap.symbol}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Bonding Curve: {selectedTokenForSwap.curveType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTokenForSwap(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Input Box */}
            <div className="space-y-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Pay Amount ({selectedTokenForSwap.chain === 'bnb' ? 'tBNB' : 'devSOL'})</span>
                  <span>
                    Balance:{' '}
                    {selectedTokenForSwap.chain === 'bnb'
                      ? `${walletState.bnb.balance.toFixed(3)} tBNB`
                      : `${walletState.solana.balance.toFixed(2)} devSOL`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    id="swap-amount-input"
                    type="number"
                    step="0.05"
                    min="0.01"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="bg-transparent font-mono text-lg font-bold text-white outline-none w-full"
                  />
                  <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-1 bg-cyan-500/10 rounded border border-cyan-500/20">
                    {selectedTokenForSwap.chain.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Estimated output */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Estimated Tokens Received</span>
                  <span>Price Impact: ~0.12%</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-lg font-bold text-emerald-400">
                    ~{Math.round((parseFloat(swapAmount) || 0) / selectedTokenForSwap.price).toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-300">${selectedTokenForSwap.symbol}</span>
                </div>
              </div>

              {/* Execute Swap button */}
              <button
                id="confirm-swap-token-btn"
                onClick={handleExecuteSwap}
                disabled={isSwapping}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSwapping ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    Executing On-Chain Bonding Curve Swap...
                  </>
                ) : swapSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    Swap Completed! Tokens Minted
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-slate-950 fill-current" />
                    Confirm Swap ({swapAmount} {selectedTokenForSwap.chain === 'bnb' ? 'tBNB' : 'devSOL'})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creation Wizard Modal */}
      <LaunchWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onTokenCreated={handleTokenCreated}
      />
    </div>
  );
};
