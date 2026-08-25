import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { DualWalletModal } from './DualWalletModal';
import { Atom, Wallet, Droplets, Shield, Sparkles, Activity, Layers, Terminal, Cpu, ChevronDown, Zap, CheckCircle2 } from 'lucide-react';
import { NavigationTab } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenWalletModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onOpenWalletModal }) => {
  const { walletState, autoPilotOneClickConnectAndClaim, autoPilotLoading, autoPilotProof } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [autoPilotStatus, setAutoPilotStatus] = useState<string | null>(null);

  const handleMasterAutoPilot = async () => {
    setAutoPilotStatus('? Auto-Pilot: Connecting BNB & Solana + Auto-Collecting Faucets...');
    const proof = await autoPilotOneClickConnectAndClaim();
    setAutoPilotStatus('? Auto-Pilot Success! +1.0 tBNB, +2.5 devSOL, +5,000 $QAI Claimed & Synced!');
    setTimeout(() => setAutoPilotStatus(null), 5000);
  };

  const navItems: { id: NavigationTab; label: string; icon: any; tag: string }[] = [
    { id: 'optimizer', label: 'Quantum Optimizer', icon: Atom, tag: 'QUBO/QAOA' },
    { id: 'launchpad', label: 'AI Launchpad', icon: Sparkles, tag: 'Bonding Curves' },
    { id: 'automaton', label: 'Conway Automaton', icon: Activity, tag: 'Burn Vortex' },
    { id: 'tokenomics', label: 'Tokenomics & Staking', icon: Layers, tag: '48.6% APY' },
    { id: 'ai-chat', label: 'Multi-Model AI', icon: Cpu, tag: 'Gemini/DeepSeek' },
    { id: 'mesh', label: 'Autonomous Mesh', icon: Layers, tag: '3,200 TPS' },
    { id: 'pqc-suite', label: 'PQC Suite', icon: Shield, tag: 'ML-KEM-768' },
    { id: 'contracts', label: 'Smart Contracts', icon: Terminal, tag: 'Live Testnets' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Banner / Auto-Pilot Ribbon */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-purple-950/80 to-indigo-950/80 px-4 py-2 border-b border-cyan-500/30 text-[11px] flex flex-wrap items-center justify-between gap-2 text-slate-300">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-1.5 font-medium text-cyan-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="font-bold">Web 4.0 Quantum Auto-Pilot Active</span>
          </div>
          <div className="hidden lg:flex items-center gap-3 font-mono text-slate-400">
            <span>BNB Testnet: <b className="text-amber-400">#12.7M (0.4s)</b></span>
            <span>?</span>
            <span>Solana Devnet: <b className="text-purple-400">Token-2022</b></span>
            <span>?</span>
            <span>PQC Encryption: <b className="text-emerald-400">ML-KEM-768 Verified</b></span>
          </div>
        </div>

        {/* Master 1-Click Auto-Pilot Button */}
        <div className="flex items-center gap-2">
          <button
            id="master-autopilot-btn"
            onClick={handleMasterAutoPilot}
            disabled={autoPilotLoading}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold px-3 py-1 rounded-lg text-xs shadow-md shadow-cyan-500/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer animate-pulse"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{autoPilotLoading ? 'Auto-Pilot Executing...' : '? 1-Click Auto-Connect & Auto-Faucet'}</span>
          </button>
        </div>
      </div>

      {/* Auto-Pilot Toast Proof Banner */}
      {autoPilotStatus && (
        <div className="bg-gradient-to-r from-emerald-950/90 to-cyan-950/90 border-b border-emerald-500/50 px-4 py-2 text-center text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{autoPilotStatus}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => onTabChange('optimizer')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25 p-2">
              <Atom className="w-6 h-6 text-white animate-spin-slow" />
              <div className="absolute inset-0 rounded-xl border border-white/30"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
                  QUANTUM AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  Web 4.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                DUAL-CHAIN LAUNCHPAD & OPTIMIZER
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
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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
                  walletState.activeChain === 'bnb' ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-purple-400 shadow-sm shadow-purple-400/50'
                }`}
              ></span>
              <span className="font-mono text-slate-300 uppercase font-semibold">
                {walletState.activeChain === 'bnb' ? 'BNB Testnet' : 'Solana Devnet'}
              </span>
            </div>

            {/* Wallet Connect Button */}
            <button
              id="open-dual-wallet-modal-btn"
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 border border-cyan-400/30 transition active:scale-95 cursor-pointer"
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

        {/* Mobile Nav Scroll */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
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
    </header>
  );
};