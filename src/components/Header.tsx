import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { DualWalletModal } from './DualWalletModal';
import { Atom, Wallet, Droplets, Shield, Sparkles, Activity, Layers, Terminal, Cpu, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { walletState, claimFaucet } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [faucetBusy, setFaucetBusy] = useState(false);

  const handleQuickFaucet = async () => {
    setFaucetBusy(true);
    await claimFaucet(walletState.activeChain);
    setTimeout(() => setFaucetBusy(false), 500);
  };

  const navItems = [
    { id: 'optimizer', label: 'Quantum Optimizer', icon: Atom, tag: 'QUBO/QAOA' },
    { id: 'launchpad', label: 'AI Launchpad', icon: Sparkles, tag: 'Bonding Curves' },
    { id: 'automaton', label: 'Conway Automaton', icon: Activity, tag: 'Burn Vortex' },
    { id: 'tokenomics', label: 'Tokenomics & Staking', icon: Layers, tag: '48.6% APY' },
    { id: 'mesh', label: 'Autonomous Mesh', icon: Cpu, tag: '3,200 TPS' },
    { id: 'pqc', label: 'PQC Suite', icon: Shield, tag: 'ML-KEM-768' },
    { id: 'contracts', label: 'Smart Contracts', icon: Terminal, tag: 'Solidity/Rust' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Banner / Ticker */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 px-4 py-1.5 border-b border-cyan-500/20 text-[11px] flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-1.5 font-medium text-cyan-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Web 4.0 Quantum Mesh Live</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 font-mono text-slate-400">
            <span>BNB Testnet: <b className="text-amber-400">97 (0.4s)</b></span>
            <span>•</span>
            <span>Solana Devnet: <b className="text-emerald-400">Anchor 0.30</b></span>
            <span>•</span>
            <span>Shor Factorization Threat: <b className="text-rose-400">Mitigated (PQC Safe)</b></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="quick-faucet-top-btn"
            onClick={handleQuickFaucet}
            disabled={faucetBusy}
            className="flex items-center gap-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[11px] font-medium transition disabled:opacity-50"
          >
            <Droplets className="w-3 h-3 text-cyan-400" />
            {faucetBusy ? 'Dispensing...' : `1-Click Faucet (+${walletState.activeChain === 'bnb' ? '0.5 tBNB' : '2.0 devSOL'})`}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => setActiveTab('optimizer')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 p-2">
              <Atom className="w-6 h-6 text-white animate-spin-slow" />
              <div className="absolute inset-0 rounded-xl border border-white/30"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
                  QUANTUM AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  Web 4.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                PORTFOLIO OPTIMIZER & AGENTIC LAUNCHPAD
              </p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Dual Wallet Status & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Active Chain Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  walletState.activeChain === 'bnb' ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                }`}
              ></span>
              <span className="font-mono text-slate-300 uppercase font-semibold">
                {walletState.activeChain === 'bnb' ? 'BNB Testnet' : 'Solana Devnet'}
              </span>
            </div>

            {/* Wallet Connect Button */}
            <button
              id="open-dual-wallet-modal-btn"
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 border border-cyan-400/30 transition active:scale-95"
            >
              <Wallet className="w-3.5 h-3.5 text-cyan-200" />
              <div className="flex items-center gap-1.5 font-mono">
                <span>
                  {walletState.activeChain === 'bnb'
                    ? `${walletState.bnb.balance.toFixed(2)} tBNB`
                    : `${walletState.solana.balance.toFixed(1)} devSOL`}
                </span>
                <span className="text-cyan-200/60">|</span>
                <span className="text-cyan-200">{walletState.bnb.qaiBalance.toLocaleString()} QAI</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-200" />
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Nav Scroll */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <DualWalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </header>
  );
};
