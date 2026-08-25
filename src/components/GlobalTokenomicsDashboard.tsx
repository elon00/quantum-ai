import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { StakingVault } from '../types';
import { Layers, Share2, Award, Lock, Unlock, TrendingUp, Users, Gift, Copy, CheckCircle2, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_VAULTS: StakingVault[] = [
  {
    id: 'vault-1',
    name: 'Quantum Flexible Vault',
    lockDays: 0,
    baseApy: 12.4,
    quantumBoostMultiplier: 1.0,
    totalStaked: 1420000,
    userStaked: 1000,
    earnedQAI: 42.8,
  },
  {
    id: 'vault-2',
    name: '30-Day Quantum Annealing',
    lockDays: 30,
    baseApy: 24.8,
    quantumBoostMultiplier: 1.2,
    totalStaked: 3890000,
    userStaked: 2500,
    earnedQAI: 184.2,
  },
  {
    id: 'vault-3',
    name: '90-Day Hamiltonian Lock',
    lockDays: 90,
    baseApy: 36.2,
    quantumBoostMultiplier: 1.5,
    totalStaked: 7650000,
    userStaked: 5000,
    earnedQAI: 612.0,
  },
  {
    id: 'vault-4',
    name: '365-Day Institutional Citadel',
    lockDays: 365,
    baseApy: 48.6,
    quantumBoostMultiplier: 2.0,
    totalStaked: 18400000,
    userStaked: 0,
    earnedQAI: 0,
  },
];

export const GlobalTokenomicsDashboard: React.FC = () => {
  const { walletState, addTransaction, updateBalances } = useWallet();
  const [vaults, setVaults] = useState<StakingVault[]>(INITIAL_VAULTS);
  const [selectedVault, setSelectedVault] = useState<StakingVault | null>(null);
  const [stakeAmount, setStakeAmount] = useState('500');
  const [isStaking, setIsStaking] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Airdrop claim state
  const [airdropClaimed, setAirdropClaimed] = useState(false);
  const [isClaimingAirdrop, setIsClaimingAirdrop] = useState(false);

  const referralCode = `QAI-${walletState.bnb.address.slice(2, 8).toUpperCase()}`;
  const referralLink = `https://quantum-ai.web4.launchpad/?ref=${referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleExecuteStake = async () => {
    if (!selectedVault) return;
    const amt = parseFloat(stakeAmount) || 500;
    setIsStaking(true);
    await new Promise((r) => setTimeout(r, 1000));

    // Deduct from wallet & increase vault stake
    updateBalances(0, 0, -amt);
    setVaults((prev) =>
      prev.map((v) =>
        v.id === selectedVault.id
          ? {
              ...v,
              userStaked: v.userStaked + amt,
              totalStaked: v.totalStaked + amt,
            }
          : v
      )
    );

    const chain = walletState.activeChain;
    const txHash = chain === 'bnb'
      ? '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      : Array.from({ length: 44 }, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');

    addTransaction({
      hash: txHash.slice(0, 10) + '...' + txHash.slice(-6),
      type: 'stake',
      chain,
      amount: `${amt.toLocaleString()} $QAI`,
      status: 'success',
      description: `Staked in ${selectedVault.name} (${selectedVault.baseApy}% APY)`,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06B6D4', '#10B981', '#F59E0B'],
    });

    setIsStaking(false);
    setSelectedVault(null);
  };

  const handleClaimAirdrop = async () => {
    setIsClaimingAirdrop(true);
    await new Promise((r) => setTimeout(r, 1200));

    updateBalances(0, 0, 1000);
    setAirdropClaimed(true);

    const chain = walletState.activeChain;
    const txHash = chain === 'bnb'
      ? '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      : Array.from({ length: 44 }, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');

    addTransaction({
      hash: txHash.slice(0, 10) + '...' + txHash.slice(-6),
      type: 'faucet',
      chain,
      amount: '1,000 $QAI',
      status: 'success',
      description: 'KOL Quantum Genesis Airdrop Claimed',
    });

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#06B6D4', '#8B5CF6', '#10B981'],
    });

    setIsClaimingAirdrop(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Strategic Elastic Supply & Staking
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Up to 48.6% APY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Global Tokenomics & Staking Vaults
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Dynamic mint-and-burn token mechanics, multi-tier viral viral tree incentives, and institutional quantum staking vaults secured by post-quantum cryptographic signatures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-right">
              <span className="text-[11px] text-slate-400 block font-mono">Circulating Supply</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">100,000,000 QAI</span>
              <span className="text-[10px] text-emerald-400 block font-mono">Elastic Mint/Burn Model</span>
            </div>
          </div>
        </div>
      </div>

      {/* Staking Vaults Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          Quantum Staking Vaults
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vaults.map((vault) => (
            <div
              key={vault.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {vault.lockDays === 0 ? 'No Lock (Flexible)' : `${vault.lockDays} Days Lock`}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {vault.quantumBoostMultiplier}x Boost
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white mb-1">{vault.name}</h3>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono mb-3">
                  {vault.baseApy}% <span className="text-xs text-slate-400 font-normal">APY</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs font-mono space-y-1 mb-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Staked:</span>
                    <span className="text-slate-200">{(vault.totalStaked / 1000).toFixed(0)}k QAI</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Your Stake:</span>
                    <span className="text-cyan-400 font-bold">{vault.userStaked.toLocaleString()} QAI</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Rewards Accrued:</span>
                    <span className="text-emerald-400 font-bold">+{vault.earnedQAI.toFixed(1)} QAI</span>
                  </div>
                </div>
              </div>

              <button
                id={`stake-vault-${vault.id}-btn`}
                onClick={() => setSelectedVault(vault)}
                className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Stake into Vault
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Program & KOL Airdrop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viral Referral Tree Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              Multi-Tier Viral Referral Tree
            </h3>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
              3-Level Boost
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Invite fellow quantum quant traders and AI developers. Earn direct yield multipliers on their staking rewards and token launches across BNB & Solana.
          </p>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500">Tier 1 Direct</div>
              <div className="text-sm font-bold text-cyan-400">10.0%</div>
              <div className="text-[9px] text-slate-400">Reward Share</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500">Tier 2 Sub</div>
              <div className="text-sm font-bold text-emerald-400">5.0%</div>
              <div className="text-[9px] text-slate-400">Reward Share</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500">Tier 3 Deep</div>
              <div className="text-sm font-bold text-amber-400">2.5%</div>
              <div className="text-[9px] text-slate-400">Reward Share</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Your Quantum Referral Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs font-mono text-cyan-300 outline-none"
              />
              <button
                id="copy-referral-link-btn"
                onClick={handleCopyReferral}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition flex-shrink-0"
              >
                {copiedReferral ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedReferral ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* KOL Quantum Airdrop Simulator */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Gift className="w-4 h-4 text-cyan-400" />
              KOL & Early Adopter Quantum Airdrop
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
              Merkle Root Validated
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Verify your address against the Merkle tree snapshot for the 5,000,000 $QAI Post-Quantum genesis allocation.
          </p>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Target Wallet:</span>
              <span className="text-cyan-300">
                {walletState.bnb.address.slice(0, 8)}...{walletState.bnb.address.slice(-6)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Allocation Status:</span>
              <span className="text-emerald-400 font-bold">Eligible (Tier 1 Genesis Whitelist)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Claimable Amount:</span>
              <span className="text-white font-bold">1,000 $QAI</span>
            </div>
          </div>

          <button
            id="claim-kol-airdrop-btn"
            onClick={handleClaimAirdrop}
            disabled={airdropClaimed || isClaimingAirdrop}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isClaimingAirdrop ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                Verifying Merkle Proof on Testnet...
              </>
            ) : airdropClaimed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                Airdrop Claimed (+1,000 $QAI Credited)
              </>
            ) : (
              <>
                <Gift className="w-3.5 h-3.5 text-slate-950" />
                Claim 1,000 $QAI Genesis Airdrop
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stake Modal */}
      {selectedVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Stake into {selectedVault.name}</h3>
              </div>
              <button
                onClick={() => setSelectedVault(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Stake Amount ($QAI)</span>
                  <span>Balance: {walletState.bnb.qaiBalance.toLocaleString()} QAI</span>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    id="stake-modal-amount-input"
                    type="number"
                    step="100"
                    min="50"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="bg-transparent font-mono text-lg font-bold text-white outline-none w-full"
                  />
                  <span className="text-xs font-mono font-bold text-cyan-400">$QAI</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Base APY:</span>
                  <span className="text-emerald-400 font-bold">{selectedVault.baseApy}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Lock Period:</span>
                  <span className="text-slate-200">
                    {selectedVault.lockDays === 0 ? 'Flexible' : `${selectedVault.lockDays} Days`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Annual Return:</span>
                  <span className="text-cyan-400 font-bold">
                    +{(
                      (parseFloat(stakeAmount) || 0) *
                      (selectedVault.baseApy / 100) *
                      selectedVault.quantumBoostMultiplier
                    ).toFixed(1)}{' '}
                    QAI
                  </span>
                </div>
              </div>

              <button
                id="confirm-stake-btn"
                onClick={handleExecuteStake}
                disabled={isStaking || walletState.bnb.qaiBalance < parseFloat(stakeAmount)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isStaking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    Locking Post-Quantum Staking Vault...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-950" />
                    Confirm Stake ({stakeAmount} $QAI)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
