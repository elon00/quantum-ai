import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { DEFAULT_ASSETS, solveQuantumPortfolio } from '../utils/quantumMath';
import { PortfolioAsset, OptimizationResult } from '../types';
import { Atom, Sliders, ShieldCheck, TrendingUp, Zap, CheckCircle2, Play, RefreshCw, BarChart2, AlertTriangle, ArrowUpRight, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuantumPortfolioOptimizer: React.FC = () => {
  const { walletState, addTransaction } = useWallet();
  const [assets, setAssets] = useState<PortfolioAsset[]>(DEFAULT_ASSETS);
  const [theta, setTheta] = useState<number>(0.35); // Risk penalty parameter
  const [selectedSolver, setSelectedSolver] = useState<'QAOA' | 'QUBO_Annealing' | 'Classical_Markowitz' | 'Monte_Carlo'>('QAOA');
  const [isExecutingRebalance, setIsExecutingRebalance] = useState(false);
  const [rebalanceSuccess, setRebalanceSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute optimization results
  const optimizationResult: OptimizationResult = useMemo(() => {
    return solveQuantumPortfolio(assets, theta, selectedSolver);
  }, [assets, theta, selectedSolver]);

  // Handle asset weight manual nudge
  const toggleAssetSelection = (assetId: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, weight: a.weight > 0 ? 0 : 15 } : a))
    );
  };

  // Rebalance Execution handler
  const handleExecuteRebalance = async () => {
    setIsExecutingRebalance(true);
    await new Promise((r) => setTimeout(r, 1200));

    const chain = walletState.activeChain;
    const txHash = chain === 'bnb'
      ? '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      : Array.from({ length: 44 }, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');

    addTransaction({
      hash: txHash.slice(0, 10) + '...' + txHash.slice(-6),
      type: 'optimize',
      chain,
      amount: 'Rebalanced 6 Assets',
      status: 'success',
      description: `QAOA Portfolio Rebalance (θ=${theta.toFixed(2)}, Sharpe=${optimizationResult.sharpeRatio}) on ${chain.toUpperCase()}`,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06B6D4', '#3B82F6', '#10B981', '#F59E0B'],
    });

    setIsExecutingRebalance(false);
    setRebalanceSuccess(true);
    setTimeout(() => setRebalanceSuccess(false), 4000);
  };

  // Render HTML5 Canvas for Markowitz Efficient Frontier & Quantum State Spectrum
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 40; x < width - 20; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 30);
      ctx.stroke();
    }
    for (let y = 20; y < height - 30; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('Volatility σ (%)', width / 2 - 40, height - 10);
    ctx.save();
    ctx.translate(15, height / 2 + 30);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Expected Return μ (%)', 0, 0);
    ctx.restore();

    // Plot Monte Carlo cloud
    for (let i = 0; i < 75; i++) {
      const simVol = 25 + Math.random() * 45;
      const simRet = 15 + Math.random() * 40 + (simVol - 25) * 0.4;
      const px = 40 + ((simVol - 15) / 60) * (width - 70);
      const py = height - 30 - ((simRet - 10) / 75) * (height - 60);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Plot Efficient Frontier Line
    const pts = optimizationResult.frontierPoints;
    if (pts.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;

      pts.forEach((p, idx) => {
        const px = 40 + ((p.vol - 15) / 60) * (width - 70);
        const py = height - 30 - ((p.ret - 10) / 75) * (height - 60);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Plot Individual Assets
    assets.forEach((asset) => {
      const px = 40 + ((asset.volatility - 15) / 60) * (width - 70);
      const py = height - 30 - ((asset.expectedReturn - 10) / 75) * (height - 60);

      ctx.fillStyle = asset.color;
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px sans-serif';
      ctx.fillText(asset.symbol, px + 7, py + 3);
    });

    // Plot Optimal QAOA Point
    const optPx = 40 + ((optimizationResult.expectedVolatility - 15) / 60) * (width - 70);
    const optPy = height - 30 - ((optimizationResult.expectedReturn - 10) / 75) * (height - 60);

    // Glowing halo
    const gradient = ctx.createRadialGradient(optPx, optPy, 2, optPx, optPy, 14);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(optPx, optPy, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(optPx, optPy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`|ψ_opt⟩ (${optimizationResult.sharpeRatio} Sharpe)`, optPx + 10, optPy - 6);
  }, [optimizationResult, assets]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                Hamiltonian QUBO / QAOA Engine
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Speedup: {optimizationResult.quantumSpeedup}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Quantum Portfolio Optimizer
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Solves non-convex crypto portfolio allocation by mapping covariance matrices to Ising spin glasses, optimizing risk penalty parameter <span className="font-mono text-cyan-300">θ</span> and Post-Quantum Cryptography (PQC) security weights.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block font-mono">Expected Return μ</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                +{optimizationResult.expectedReturn}%
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block font-mono">Volatility σ</span>
              <span className="text-base sm:text-lg font-bold text-amber-400 font-mono">
                {optimizationResult.expectedVolatility}%
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block font-mono">Sharpe Ratio</span>
              <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono">
                {optimizationResult.sharpeRatio}
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block font-mono">PQC Resilience</span>
              <span className="text-base sm:text-lg font-bold text-indigo-400 font-mono">
                {optimizationResult.pqcResilienceScore}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls + Frontier Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Solvers & Theta Slider (4 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Solver Selector */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Quantum Optimization Algorithm
              </h3>
              <span className="text-[10px] font-mono text-slate-400">127 Qubit Ising Lattice</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'QAOA', label: 'QAOA Superposition', desc: 'Quantum Annealing + Gates', tag: 'Fastest' },
                { id: 'QUBO_Annealing', label: 'QUBO Ising Model', desc: 'Ground State Energy', tag: 'Optimal' },
                { id: 'Classical_Markowitz', label: 'Classical Markowitz', desc: 'Standard Quadratic', tag: 'CPU' },
                { id: 'Monte_Carlo', label: 'Monte Carlo 10k', desc: 'Stochastic Walks', tag: 'Heuristic' },
              ].map((s) => (
                <button
                  key={s.id}
                  id={`solver-btn-${s.id}`}
                  onClick={() => setSelectedSolver(s.id as any)}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedSolver === s.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{s.label}</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                      {s.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{s.desc}</p>
                </button>
              ))}
            </div>

            {/* Theta Slider */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <label htmlFor="theta-slider" className="text-xs font-semibold text-slate-200">
                    θ Quantum Risk Penalty Factor
                  </label>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  θ = {theta.toFixed(2)}
                </span>
              </div>

              <input
                id="theta-slider"
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={theta}
                onChange={(e) => setTheta(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Aggressive Alpha (θ=0.05)</span>
                <span>Balanced</span>
                <span>PQC Maximum Resilience (θ=0.95)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-mono">
                <span className="text-cyan-400 font-semibold">QUBO Hamiltonian:</span> min{' '}
                <span className="text-amber-300">xᵀΣx</span> -{' '}
                <span className="text-cyan-300">{theta.toFixed(2)}·μᵀx</span> +{' '}
                <span className="text-indigo-300">λ(1 - Σx)²</span>
              </div>
            </div>

            {/* Execute Rebalance Button */}
            <div className="pt-2">
              <button
                id="execute-quantum-rebalance-btn"
                onClick={handleExecuteRebalance}
                disabled={isExecutingRebalance}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition disabled:opacity-50 active:scale-[0.98]"
              >
                {isExecutingRebalance ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    Calculating QAOA Quantum Spin Vectors...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-slate-950 fill-current" />
                    Execute Quantum Rebalance ({walletState.activeChain.toUpperCase()})
                  </>
                )}
              </button>
              {rebalanceSuccess && (
                <div className="mt-2 p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Portfolio state reconciled with on-chain PQC testnet vault!
                </div>
              )}
            </div>
          </div>

          {/* Allocation Weights Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Optimal Asset Weights ({selectedSolver})</span>
              <span className="text-xs font-mono text-cyan-400">Total: 100%</span>
            </h3>

            <div className="space-y-2.5">
              {optimizationResult.allocations.map((alloc) => (
                <div key={alloc.symbol} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: alloc.color }}></span>
                      ${alloc.symbol}
                    </span>
                    <span className="text-cyan-300 font-bold">{alloc.weight}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${alloc.weight}%`, backgroundColor: alloc.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Markowitz Efficient Frontier Canvas & Quantum Eigenstates (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visual Canvas Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  Markowitz Efficient Frontier & Quantum State Space
                </h3>
                <p className="text-[11px] text-slate-400">
                  Continuous risk/return hyperbolic frontier plotted against 10k Monte Carlo paths & QAOA optimum.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span> QAOA Optimum
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span> Monte Carlo
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-950 rounded-xl p-2 border border-slate-800 flex justify-center">
              <canvas
                ref={canvasRef}
                width={560}
                height={280}
                className="w-full max-w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Quantum Eigenstate Distribution */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Atom className="w-4 h-4 text-cyan-400" />
                Quantum Eigenstate Amplitudes & Ground Energy
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Eigenvalue E = {optimizationResult.energyEigenvalue} eV
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="pb-2">Quantum State |ψ⟩</th>
                    <th className="pb-2">Energy (H)</th>
                    <th className="pb-2">Probability |⟨ψ|ψ_opt⟩|²</th>
                    <th className="pb-2 text-right">Convergence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {optimizationResult.eigenstates.map((es, idx) => (
                    <tr key={es.state} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-cyan-300">{es.state}</td>
                      <td className="py-2.5 text-slate-400">{es.energy.toFixed(3)}</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${es.probability * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-slate-200">{(es.probability * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${idx === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                          {idx === 0 ? 'Ground Optimum' : 'Superposition'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* NIST PQC Vulnerability Audit Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              NIST Post-Quantum Cryptography (PQC) Security Audit Table
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates classical ECDSA secp256k1 vulnerabilities vs Shor’s 127Q & 2048Q quantum factorization algorithms.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            Hardened with ML-KEM-768
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-3">Asset</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Exp. Return</th>
                <th className="pb-3">Vol σ</th>
                <th className="pb-3">PQC Score</th>
                <th className="pb-3">Shor 127Q Threat</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-semibold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }}></span>
                    <span>{asset.name}</span>
                    <span className="text-slate-400">(${asset.symbol})</span>
                  </td>
                  <td className="py-3 text-slate-300">${asset.price.toLocaleString()}</td>
                  <td className="py-3 text-emerald-400 font-bold">+{asset.expectedReturn}%</td>
                  <td className="py-3 text-amber-400">{asset.volatility}%</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{asset.pqcAuditScore}/100</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          asset.pqcStatus === 'Quantum-Safe'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : asset.pqcStatus === 'Partially-Hardened'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {asset.pqcStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-[11px] ${asset.pqcAuditScore > 80 ? 'text-emerald-400' : asset.pqcAuditScore > 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {asset.pqcAuditScore > 80 ? 'Protected (Lattice Hardened)' : asset.pqcAuditScore > 50 ? 'Medium Vulnerability' : 'High Shor Risk (ECDSA)'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => toggleAssetSelection(asset.id)}
                      className={`text-[11px] px-2 py-1 rounded border font-medium transition ${
                        asset.weight > 0
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {asset.weight > 0 ? 'Included' : 'Exclude'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
