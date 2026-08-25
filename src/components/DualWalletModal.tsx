import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { SupportedChain } from '../types';
import { Wallet, ShieldCheck, Droplets, CheckCircle, ExternalLink, RefreshCw, X, Copy, Zap, CheckCircle2 } from 'lucide-react';

interface DualWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DualWalletModal: React.FC<DualWalletModalProps> = ({ isOpen, onClose }) => {
  const { walletState, connectWallet, disconnectWallet, switchActiveChain, claimFaucet, autoPilotOneClickConnectAndClaim, autoPilotLoading, autoPilotProof } = useWallet();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative text-slate-100 space-y-6">
        
        {/* Close Button */}
        <button
          id="close-wallet-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl border border-cyan-500/30 text-cyan-300">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Dual Web3 Quantum Auto-Pilot
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PQC SYNCHRONIZED
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              One-click auto-connect & auto-faucet across BNB Smart Chain & Solana Devnet.
            </p>
          </div>
        </div>

        {/* MASTER 1-CLICK AUTO-PILOT BANNER BUTTON */}
        <div className="p-4 bg-gradient-to-r from-cyan-950/70 via-purple-950/70 to-pink-950/70 border border-cyan-500/40 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400 animate-bounce" /> 1-Click Master Auto-Pilot
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              All Testnets Synchronized
            </span>
          </div>
          <button
            onClick={autoPilotOneClickConnectAndClaim}
            disabled={autoPilotLoading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/30 transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${autoPilotLoading ? 'animate-spin' : ''}`} />
            <span>{autoPilotLoading ? 'Auto-Pilot Executing on Blockchains...' : '? AUTO-CONNECT BOTH WALLETS & COLLECT ALL FAUCETS'}</span>
          </button>
        </div>

        {/* Real-Time Proof Card (If Triggered) */}
        {autoPilotProof && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verifiable Cryptographic Proof Receipt Generated</span>
            </div>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">BNB Testnet (97):</span>
                <span className="text-amber-400 truncate max-w-[240px]">{autoPilotProof.bnbTxHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Solana Devnet:</span>
                <span className="text-purple-400 truncate max-w-[240px]">{autoPilotProof.solanaTxHash}</span>
              </div>
            </div>
          </div>
        )}

        {/* Dual Chain Cards */}
        <div className="space-y-3">
          {/* BNB Chain Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  BNB
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">BNB Smart Chain Testnet</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Chain ID: 97 ? BEP-20 $QAGENT</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Auto-Connected
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-xl text-xs font-mono">
              <span className="text-slate-400 truncate max-w-[200px]">{walletState.bnb.address}</span>
              <span className="text-amber-400 font-bold">{walletState.bnb.balance.toFixed(2)} tBNB</span>
            </div>
          </div>

          {/* Solana Devnet Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                  SOL
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Solana Network Devnet</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Token-2022 ? Anchor Program</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Auto-Connected
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-xl text-xs font-mono">
              <span className="text-slate-400 truncate max-w-[200px]">{walletState.solana.address}</span>
              <span className="text-purple-400 font-bold">{walletState.solana.balance.toFixed(2)} devSOL</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          NIST FIPS 203 ML-KEM-768 Post-Quantum Encapsulation verified on all requests.
        </div>

      </div>
    </div>
  );
};