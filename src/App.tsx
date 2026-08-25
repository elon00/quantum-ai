import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { DualWalletModal } from './components/DualWalletModal';
import { QuantumPortfolioOptimizer } from './components/QuantumPortfolioOptimizer';
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Top Navbar */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenWalletModal={() => setIsWalletModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'optimizer' && <QuantumPortfolioOptimizer />}
          {activeTab === 'launchpad' && <TokenLaunchpad />}
          {activeTab === 'automaton' && <ConwayQuantumAutomaton />}
          {activeTab === 'tokenomics' && <GlobalTokenomicsDashboard />}
          {activeTab === 'ai-chat' && <MultiModelChatbot />}
          {activeTab === 'mesh' && <Web4AutonomousMesh />}
          {activeTab === 'pqc-suite' && <PqcCryptoSuite />}
          {activeTab === 'contracts' && <SmartContractsExplorer />}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              Quantum AI Web 4.0 Launchpad & Optimizer • NIST FIPS 203 PQC ML-KEM-768
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <a
                href="https://github.com/elon00/quantum-portfolio-optimizer.git"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-300 transition"
              >
                GitHub Repository
              </a>
              <span>•</span>
              <span>BNB Chain Testnet (97)</span>
              <span>•</span>
              <span>Solana Devnet</span>
            </div>
          </div>
        </footer>

        {/* Wallet Modal */}
        <DualWalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
        />
      </div>
    </WalletProvider>
  );
}
