import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { DualWalletModal } from './components/DualWalletModal';
import { QuantumPortfolioOptimizer } from './components/QuantumPortfolioOptimizer';
import { HistoricalBacktester } from './components/HistoricalBacktester';
import { QuantumHardwareCloud } from './components/QuantumHardwareCloud';
import { CrossChainQuantumBridge } from './components/CrossChainQuantumBridge';
import { TokenLaunchpad } from './components/TokenLaunchpad';
import { ConwayQuantumAutomaton } from './components/ConwayQuantumAutomaton';
import { GlobalTokenomicsDashboard } from './components/GlobalTokenomicsDashboard';
import { MultiModelChatbot } from './components/MultiModelChatbot';
import { Web4AutonomousMesh } from './components/Web4AutonomousMesh';
import { PqcCryptoSuite } from './components/PqcCryptoSuite';
import { SmartContractsExplorer } from './components/SmartContractsExplorer';
import { NavigationTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('optimizer');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <WalletProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
        {/* Futuristic Background Sci-Fi Grid & Glows */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#082f490a_1px,transparent_1px),linear-gradient(to_bottom,#082f490a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />

        {/* Top Sci-Fi Navbar */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenWalletModal={() => setIsWalletModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'optimizer' && <QuantumPortfolioOptimizer />}
          {activeTab === 'backtester' && <HistoricalBacktester />}
          {activeTab === 'quantum-cloud' && <QuantumHardwareCloud />}
          {activeTab === 'bridge' && <CrossChainQuantumBridge />}
          {activeTab === 'launchpad' && <TokenLaunchpad />}
          {activeTab === 'automaton' && <ConwayQuantumAutomaton />}
          {activeTab === 'tokenomics' && <GlobalTokenomicsDashboard />}
          {activeTab === 'ai-chat' && <MultiModelChatbot />}
          {activeTab === 'mesh' && <Web4AutonomousMesh />}
          {activeTab === 'pqc-suite' && <PqcCryptoSuite />}
          {activeTab === 'contracts' && <SmartContractsExplorer />}
        </main>

        {/* Global Sci-Fi Footer */}
        <footer className="border-t border-slate-900/90 bg-slate-950/90 py-6 px-4 text-center text-xs text-slate-400 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Quantum AI Web 4.0 OS ? NIST FIPS 203/204 PQC (ML-KEM / ML-DSA)</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <a
                href="https://github.com/elon00/quantum-ai.git"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-300 transition text-cyan-400 font-bold"
              >
                GitHub: elon00/quantum-ai
              </a>
              <span>?</span>
              <span className="text-amber-400">BNB Chain Testnet (97)</span>
              <span>?</span>
              <span className="text-purple-400">Solana Devnet</span>
              <span>?</span>
              <span className="text-emerald-400">Sui Move</span>
            </div>
          </div>
        </footer>

        {/* Dual Wallet Modal */}
        <DualWalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
        />
      </div>
    </WalletProvider>
  );
}