import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { DualWalletModal } from './DualWalletModal';
import { Atom, Wallet, Shield, Sparkles, Activity, Layers, Terminal, Cpu, ChevronDown, Zap, CheckCircle2, Globe, Calendar, Radio, ArrowLeftRight, Bot } from 'lucide-react';
import { NavigationTab } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenWalletModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onOpenWalletModal }) => {
  const { walletState, autoPilotOneClickConnectAndClaim, autoPilotLoading } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [autoPilotStatus, setAutoPilotStatus] = useState<string | null>(null);

  const handleMasterAutoPilot = async () => {
    setAutoPilotStatus('? Auto-Pilot: Synchronizing Wormholes + Collecting Testnet Gas...');
    const proof = await autoPilotOneClickConnectAndClaim();
    setAutoPilotStatus('? Sci-Fi Auto-Pilot: +1.0 tBNB, +2.5 devSOL, +5,000 $QAI Claimed & Synced!');
    setTimeout(() => setAutoPilotStatus(null), 5000);
  };

  const navItems: { id: NavigationTab; label: string; icon: any; tag?: string }[] = [
    { id: 'optimizer', label: 'Quantum Optimizer', icon: Atom },
    { id: 'backtester', label: '10Y Backtest', icon: Calendar },
    { id: 'quantum-cloud', label: 'IBM QPU Cloud', icon: Radio },
    { id: 'bridge', label: 'Wormhole Bridge', icon: ArrowLeftRight },
    { id: 'launchpad', label: 'AI Launchpad', icon: Sparkles },
    { id: 'automaton', label: 'Conway Automaton', icon: Activity },
    { id: 'tokenomics', label: 'Tokenomics', icon: Layers },
    { id: 'ai-chat', label: 'AI Agentics Copilot', icon: Bot },
    { id: 'mesh', label: 'Web4 Mesh', icon: Cpu },
    { id: 'pqc-suite', label: 'PQC Suite', icon: Shield },
    { id: 'contracts', label: 'Smart Contracts', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/30 text-slate-100 shadow-2xl">
      {/* Top Sci-Fi Telemetry Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-purple-950/80 to-slate-950/90 px-4 py-1.5 border-b border-cyan-500/20 text-[11px] flex flex-wrap items-center justify-between gap-2 text-slate-300">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-1.5 font-mono text-cyan-400 font-bold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span>Q-OS v4.0 NEURAL WARP CORE ACTIVE</span>
          </div>
          <div className="hidden xl:flex items-center gap-3 font-mono text-slate-400 text-[10px]">
            <span>BNB Chain: <b className="text-amber-400">BSC Testnet 97</b></span>
            <span>?</span>
            <span>Solana: <b className="text-purple-400">Devnet SPL-2022</b></span>
            <span>?</span>
            <span>QPU Clock: <b className="text-cyan-300">5.1 GHz Transmon</b></span>
            <span>?</span>
            <span>PQC Shield: <b className="text-emerald-400">NIST ML-DSA-65 Locked</b></span>
          </div>
        </div>

        {/* Master 1-Click Auto-Pilot Button */}
        <button
          id="master-autopilot-btn"
          onClick={handleMasterAutoPilot}
          disabled={autoPilotLoading}
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold px-3 py-1 rounded-xl text-xs shadow-md shadow-cyan-500/30 transition active:scale-95 disabled:opacity-50 cursor-pointer animate-pulse"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-cyan-200" />
          <span>{autoPilotLoading ? 'Auto-Pilot Running...' : '? 1-Click Auto-Connect & Faucet'}</span>
        </button>
      </div>

      {/* Auto-Pilot Toast Proof Banner */}
      {autoPilotStatus && (
        <div className="bg-gradient-to-r from-emerald-950/90 to-cyan-950/90 border-b border-emerald-500/50 px-4 py-2 text-center text-xs font-mono font-bold text-emerald-300 flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{autoPilotStatus}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Sci-Fi Brand */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => onTabChange('optimizer')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 shadow-lg shadow-cyan-500/30 p-2 border border-cyan-400/40">
              <Atom className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
                  QUANTUM AI
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  Web 4.0 OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                POST-QUANTUM PORTFOLIO & AGENTIC ECOSYSTEM
              </p>
            </div>
          </div>

          {/* Desktop Sci-Fi Nav Tabs */}
          <nav className="hidden 2xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
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
            <button
              id="open-dual-wallet-modal-btn"
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 border border-cyan-400/30 transition active:scale-95 cursor-pointer"
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

        {/* Horizontal Nav Scroll for Screens Below 2XL */}
        <div className="flex 2xl:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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