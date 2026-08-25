import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { SupportedChain } from '../types';
import { Wallet, ShieldCheck, Droplets, CheckCircle, ExternalLink, RefreshCw, X, Copy, Zap } from 'lucide-react';

interface DualWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DualWalletModal: React.FC<DualWalletModalProps> = ({ isOpen, onClose }) => {
  const { walletState, connectWallet, disconnectWallet, switchActiveChain, claimFaucet } = useWallet();
  const [copiedChain, setCopiedChain] = useState<SupportedChain | null>(null);
  const [faucetLoading, setFaucetLoading] = useState<SupportedChain | null>(null);

  if (!isOpen) return null;

  const handleCopy = (address: string, chain: SupportedChain) => {
    navigator.clipboard.writeText(address);
    setCopiedChain(chain);
    setTimeout(() => setCopiedChain(null), 2000);
  };

  const handleFaucetClick = async (chain: SupportedChain) => {
    setFaucetLoading(chain);
    await claimFaucet(chain);
    setFaucetLoading(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          id="close-wallet-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-500/30">
            <Wallet className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Dual Web3 Quantum Wallet Connect
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PQC Auto-Synced
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Seamlessly link BNB Chain Testnet (97) & Solana Devnet with post-quantum key validation.
            </p>
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="space-y-4">
          {/* BNB Chain Card */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              walletState.activeChain === 'bnb'
                ? 'bg-amber-500/5 border-amber-500/40 shadow-lg shadow-amber-500/5'
                : 'bg-slate-800/60 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 text-xs">
                  BNB
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-slate-200">BNB Smart Chain Testnet</h3>
                    <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20">
                      ChainID: 97
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">MetaMask / TrustWallet / Web3 Provider</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {walletState.bnb.connected ? (
                  <button
                    id="switch-bnb-active-btn"
                    onClick={() => switchActiveChain('bnb')}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                      walletState.activeChain === 'bnb'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 text-amber-400 border-amber-500/30 hover:bg-slate-700'
                    }`}
                  >
                    {walletState.activeChain === 'bnb' ? 'Active' : 'Set Active'}
                  </button>
                ) : (
                  <button
                    id="connect-bnb-wallet-btn"
                    onClick={() => connectWallet('bnb')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>

            {walletState.bnb.connected && (
              <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Address:</span>
                  <div className="flex items-center gap-1.5 font-mono text-amber-300">
                    <span>
                      {walletState.bnb.address.slice(0, 8)}...{walletState.bnb.address.slice(-6)}
                    </span>
                    <button
                      onClick={() => handleCopy(walletState.bnb.address, 'bnb')}
                      className="p-1 hover:text-white transition"
                      title="Copy Address"
                    >
                      {copiedChain === 'bnb' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="text-slate-300 font-mono">
                    <span className="text-amber-400 font-bold">{walletState.bnb.balance.toFixed(3)} tBNB</span>
                    <span className="text-slate-500 mx-1.5">|</span>
                    <span className="text-cyan-400 font-bold">{walletState.bnb.qaiBalance.toLocaleString()} $QAI</span>
                  </div>
                  <button
                    id="faucet-bnb-btn"
                    onClick={() => handleFaucetClick('bnb')}
                    disabled={faucetLoading === 'bnb'}
                    className="flex items-center gap-1 text-[11px] bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 px-2 py-0.5 rounded transition disabled:opacity-50"
                  >
                    {faucetLoading === 'bnb' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Droplets className="w-3 h-3" />}
                    +0.5 tBNB Faucet
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Solana Devnet Card */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              walletState.activeChain === 'solana'
                ? 'bg-emerald-500/5 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                : 'bg-slate-800/60 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
                  SOL
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-slate-200">Solana Devnet</h3>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Anchor 0.30
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Phantom / Solflare / Backpack</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {walletState.solana.connected ? (
                  <button
                    id="switch-solana-active-btn"
                    onClick={() => switchActiveChain('solana')}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                      walletState.activeChain === 'solana'
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                        : 'bg-slate-800 text-emerald-400 border-emerald-500/30 hover:bg-slate-700'
                    }`}
                  >
                    {walletState.activeChain === 'solana' ? 'Active' : 'Set Active'}
                  </button>
                ) : (
                  <button
                    id="connect-solana-wallet-btn"
                    onClick={() => connectWallet('solana')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>

            {walletState.solana.connected && (
              <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Address:</span>
                  <div className="flex items-center gap-1.5 font-mono text-emerald-300">
                    <span>
                      {walletState.solana.address.slice(0, 8)}...{walletState.solana.address.slice(-6)}
                    </span>
                    <button
                      onClick={() => handleCopy(walletState.solana.address, 'solana')}
                      className="p-1 hover:text-white transition"
                      title="Copy Address"
                    >
                      {copiedChain === 'solana' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="text-slate-300 font-mono">
                    <span className="text-emerald-400 font-bold">{walletState.solana.balance.toFixed(2)} devSOL</span>
                    <span className="text-slate-500 mx-1.5">|</span>
                    <span className="text-cyan-400 font-bold">{walletState.solana.qaiBalance.toLocaleString()} $QAI</span>
                  </div>
                  <button
                    id="faucet-solana-btn"
                    onClick={() => handleFaucetClick('solana')}
                    disabled={faucetLoading === 'solana'}
                    className="flex items-center gap-1 text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 px-2 py-0.5 rounded transition disabled:opacity-50"
                  >
                    {faucetLoading === 'solana' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Droplets className="w-3 h-3" />}
                    +2.0 devSOL Faucet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security / PQC Notice */}
        <div className="mt-5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2.5 text-xs text-cyan-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-cyan-300">NIST PQC ML-KEM-768 Cryptographic Tunnel:</span>{' '}
            Both testnet sessions are wrapped in post-quantum lattice encryption, shielding simulated key exchanges from Shor’s quantum factorization attacks.
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            id="close-wallet-modal-footer-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
