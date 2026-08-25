import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';
import { CellularAgent } from '../types';
import { Activity, Play, Pause, RotateCcw, Flame, Sparkles, Zap, Shield, RefreshCw, Cpu, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

const GRID_COLS = 50;
const GRID_ROWS = 30;

export const ConwayQuantumAutomaton: React.FC = () => {
  const { walletState, addTransaction, updateBalances } = useWallet();
  
  // Grid state: continuous superposition phase [0, 1] for each cell
  const [grid, setGrid] = useState<Float32Array>(() => {
    const arr = new Float32Array(GRID_COLS * GRID_ROWS);
    // Seed initial Bell-state patterns
    for (let i = 0; i < arr.length; i++) {
      if (Math.random() < 0.2) arr[i] = Math.random();
    }
    return arr;
  });

  const [isRunning, setIsRunning] = useState(true);
  const [speedMs, setSpeedMs] = useState(80);
  const [selectedPreset, setSelectedPreset] = useState<string>('Grover Search');
  const [entropy, setEntropy] = useState<number>(3.84);
  const [coherenceTime, setCoherenceTime] = useState<number>(148.5);
  const [totalBurned, setTotalBurned] = useState<number>(18400);
  const [isBurning, setIsBurning] = useState(false);
  const [burnAmount, setBurnAmount] = useState('250');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMouseDownRef = useRef(false);

  // Evolving Agents roaming in the quantum grid
  const [agents, setAgents] = useState<CellularAgent[]>([
    { id: 'ag-1', x: 12, y: 10, type: 'Hunter', superpositionPhase: 0.85, energy: 95, color: '#ef4444' },
    { id: 'ag-2', x: 38, y: 18, type: 'Stabilizer', superpositionPhase: 0.92, energy: 88, color: '#06b6d4' },
    { id: 'ag-3', x: 25, y: 15, type: 'Glider', superpositionPhase: 0.74, energy: 92, color: '#10b981' },
    { id: 'ag-4', x: 20, y: 22, type: 'Replicator', superpositionPhase: 0.65, energy: 78, color: '#8b5cf6' },
  ]);

  // Step function implementing Quantum Conway Superposition Rules
  const stepQuantumSimulation = useCallback(() => {
    setGrid((prev) => {
      const next = new Float32Array(GRID_COLS * GRID_ROWS);
      let activeCount = 0;
      let sumPhase = 0;

      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const idx = r * GRID_COLS + c;
          let neighborSum = 0;
          let neighborCount = 0;

          // 8 Moore neighbors with toroidal periodic boundary conditions
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = (r + dr + GRID_ROWS) % GRID_ROWS;
              const nc = (c + dc + GRID_COLS) % GRID_COLS;
              const nVal = prev[nr * GRID_COLS + nc];
              neighborSum += nVal;
              if (nVal > 0.4) neighborCount++;
            }
          }

          const current = prev[idx];
          // Quantum superposition transition with Schrödinger wave decay:
          // |ψ_{t+1}⟩ = α |alive⟩ + β |decay⟩ + interference
          let nextVal = 0;
          if (current > 0.4) {
            // Survival rule: 2 or 3 neighbors
            if (neighborCount === 2 || neighborCount === 3) {
              nextVal = Math.min(1.0, current + 0.05 + 0.02 * Math.sin(neighborSum));
            } else {
              // Quantum decay tunnel
              nextVal = Math.max(0, current - 0.2);
            }
          } else {
            // Birth rule: exactly 3 neighbors or constructive interference
            if (neighborCount === 3 || neighborSum > 2.8) {
              nextVal = Math.min(0.9, 0.4 + 0.15 * neighborSum);
            } else {
              nextVal = Math.max(0, current - 0.05);
            }
          }

          next[idx] = nextVal;
          if (nextVal > 0.3) {
            activeCount++;
            sumPhase += nextVal;
          }
        }
      }

      // Update Entropy & Coherence
      const prob = activeCount / (GRID_COLS * GRID_ROWS);
      const calculatedEntropy = prob > 0 && prob < 1 ? -(prob * Math.log2(prob) + (1 - prob) * Math.log2(1 - prob)) * 4.5 : 2.1;
      setEntropy(parseFloat(calculatedEntropy.toFixed(2)));
      setCoherenceTime((c) => Math.max(80, c + (Math.random() * 4 - 2)));

      return next;
    });

    // Move agents
    setAgents((prev) =>
      prev.map((agent) => {
        const dx = Math.floor(Math.random() * 3) - 1;
        const dy = Math.floor(Math.random() * 3) - 1;
        const nx = (agent.x + dx + GRID_COLS) % GRID_COLS;
        const ny = (agent.y + dy + GRID_ROWS) % GRID_ROWS;
        return {
          ...agent,
          x: nx,
          y: ny,
          superpositionPhase: Math.min(1.0, Math.max(0.2, agent.superpositionPhase + (Math.random() * 0.1 - 0.05))),
          energy: Math.max(20, Math.min(100, agent.energy + (Math.random() * 6 - 3))),
        };
      })
    );
  }, []);

  // Animation Loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(stepQuantumSimulation, speedMs);
    return () => clearInterval(interval);
  }, [isRunning, speedMs, stepQuantumSimulation]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / GRID_COLS;
    const cellH = height / GRID_ROWS;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Draw grid cells with quantum glowing intensity
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const val = grid[r * GRID_COLS + c];
        if (val > 0.05) {
          const px = c * cellW;
          const py = r * cellH;
          
          if (val > 0.6) {
            ctx.fillStyle = `rgba(6, 182, 212, ${val})`;
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = val > 0.8 ? 8 : 4;
          } else {
            ctx.fillStyle = `rgba(59, 130, 246, ${val * 0.8})`;
            ctx.shadowBlur = 0;
          }

          ctx.fillRect(px + 0.5, py + 0.5, cellW - 1, cellH - 1);
        }
      }
    }
    ctx.shadowBlur = 0;

    // Draw Cellular Agents
    agents.forEach((ag) => {
      const px = ag.x * cellW + cellW / 2;
      const py = ag.y * cellH + cellH / 2;

      ctx.fillStyle = ag.color;
      ctx.beginPath();
      ctx.arc(px, py, cellW * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Outer aura ring
      ctx.strokeStyle = ag.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px, py, cellW * 1.6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText(ag.type[0], px - 3, py + 3);
    });
  }, [grid, agents]);

  // Handle Preset Loading
  const loadPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    const arr = new Float32Array(GRID_COLS * GRID_ROWS);

    if (presetName === 'Grover Search') {
      for (let r = 5; r < GRID_ROWS - 5; r += 4) {
        for (let c = 5; c < GRID_COLS - 5; c += 4) {
          arr[r * GRID_COLS + c] = 0.95;
          arr[r * GRID_COLS + c + 1] = 0.85;
          arr[(r + 1) * GRID_COLS + c] = 0.75;
        }
      }
    } else if (presetName === 'Bell State Entangler') {
      const midR = Math.floor(GRID_ROWS / 2);
      for (let c = 5; c < GRID_COLS - 5; c++) {
        arr[midR * GRID_COLS + c] = 0.9;
        arr[(midR - 1) * GRID_COLS + c] = 0.6 * Math.sin(c / 2);
        arr[(midR + 1) * GRID_COLS + c] = 0.6 * Math.cos(c / 2);
      }
    } else if (presetName === 'Quantum Vortex') {
      const centerR = Math.floor(GRID_ROWS / 2);
      const centerC = Math.floor(GRID_COLS / 2);
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const dist = Math.hypot(r - centerR, c - centerC);
          if (dist > 3 && dist < 14) {
            arr[r * GRID_COLS + c] = Math.max(0, 0.9 - dist * 0.05);
          }
        }
      }
    } else {
      // Gosper Glider Gun
      for (let i = 0; i < arr.length; i++) {
        if (Math.random() < 0.25) arr[i] = Math.random();
      }
    }

    setGrid(arr);
  };

  // Canvas Click/Drag Handler to Draw Quantum Superposition Cells
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor((x / rect.width) * GRID_COLS);
    const row = Math.floor((y / rect.height) * GRID_ROWS);

    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
      setGrid((prev) => {
        const next = new Float32Array(prev);
        const idx = row * GRID_COLS + col;
        next[idx] = next[idx] > 0.5 ? 0 : 0.95;
        return next;
      });
    }
  };

  // Trigger On-chain Deflationary Burn Vortex
  const handleTriggerBurnVortex = async () => {
    const burnVal = parseInt(burnAmount) || 250;
    if (burnVal <= 0) return;

    setIsBurning(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Deduct QAI from wallet
    updateBalances(0, 0, -burnVal);
    setTotalBurned((prev) => prev + burnVal);

    // Apply vortex collapse pattern to the grid
    setGrid((prev) => {
      const next = new Float32Array(prev);
      const centerR = Math.floor(GRID_ROWS / 2);
      const centerC = Math.floor(GRID_COLS / 2);
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const dist = Math.hypot(r - centerR, c - centerC);
          if (dist < 10) next[r * GRID_COLS + c] = 1.0;
        }
      }
      return next;
    });

    const chain = walletState.activeChain;
    const txHash = chain === 'bnb'
      ? '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      : Array.from({ length: 44 }, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');

    addTransaction({
      hash: txHash.slice(0, 10) + '...' + txHash.slice(-6),
      type: 'burn',
      chain,
      amount: `${burnVal.toLocaleString()} $QAI Burned`,
      status: 'success',
      description: `Deflationary Burn Vortex Triggered (-${burnVal} QAI burned into cellular state space)`,
    });

    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f97316', '#eab308', '#06b6d4'],
    });

    setIsBurning(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                2D Cellular Automaton Superposition
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" />
                Deflationary Burn Vortex Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Conway Quantum AI Automaton
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Simulates probabilistic wave function collapses $| \psi \rangle = \alpha |0\rangle + \beta |1\rangle$. Autonomous AI agent nodes evolve, stabilize, and harvest energy while user burns compress token supply.
            </p>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Entanglement Entropy</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">{entropy} S/k_B</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Coherence Time T₂*</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{coherenceTime.toFixed(1)} μs</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Active Agent Nodes</span>
              <span className="text-sm font-bold text-indigo-400 font-mono">{agents.length} Agents</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Total Vortex Burned</span>
              <span className="text-sm font-bold text-rose-400 font-mono">{totalBurned.toLocaleString()} QAI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Simulation View & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Display (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  id="toggle-automaton-run-btn"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    isRunning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isRunning ? 'Pause Wave' : 'Resume Wave'}
                </button>

                <button
                  id="step-automaton-btn"
                  onClick={stepQuantumSimulation}
                  disabled={isRunning}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition disabled:opacity-50"
                >
                  Step (1 Epoch)
                </button>

                <button
                  id="clear-automaton-btn"
                  onClick={() => setGrid(new Float32Array(GRID_COLS * GRID_ROWS))}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear Grid
                </button>
              </div>

              {/* Preset Selector */}
              <div className="flex items-center gap-1.5">
                {['Grover Search', 'Bell State Entangler', 'Quantum Vortex', 'Gosper Gun'].map((p) => (
                  <button
                    key={p}
                    onClick={() => loadPreset(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                      selectedPreset === p
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive HTML5 Canvas */}
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 relative cursor-crosshair">
              <canvas
                ref={canvasRef}
                width={700}
                height={400}
                onMouseDown={(e) => {
                  isMouseDownRef.current = true;
                  handleCanvasInteraction(e);
                }}
                onMouseUp={() => {
                  isMouseDownRef.current = false;
                }}
                onMouseMove={(e) => {
                  if (isMouseDownRef.current) handleCanvasInteraction(e);
                }}
                className="w-full h-auto rounded-lg shadow-inner"
              />
              <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-400">
                Click/Drag canvas to seed superposition cells
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Burn Vortex & Agent Nodes (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* On-Chain Deflationary Burn Vortex */}
          <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                Deflationary Burn Vortex
              </h3>
              <span className="text-[10px] font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                On-Chain Trigger
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Burning $QAI permanently destroys circulating supply on-chain and triggers a massive quantum wave collapse in the cellular grid.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/20 space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Burn Amount:</span>
                <span>Wallet: {walletState.bnb.qaiBalance.toLocaleString()} QAI</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['100', '250', '1000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setBurnAmount(amt)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                      burnAmount === amt
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {amt} QAI
                  </button>
                ))}
              </div>
            </div>

            <button
              id="trigger-burn-vortex-btn"
              onClick={handleTriggerBurnVortex}
              disabled={isBurning || walletState.bnb.qaiBalance < parseInt(burnAmount)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-[0.98]"
            >
              {isBurning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Collapsing Wave Function & Burning QAI...
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-white" />
                  Ignite Burn Vortex ({burnAmount} $QAI)
                </>
              )}
            </button>
          </div>

          {/* Cellular Autonomous Agents Roster */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Autonomous Agent Nodes
              </span>
              <span className="text-xs font-mono text-cyan-400">{agents.length} Active</span>
            </h3>

            <div className="space-y-2.5">
              {agents.map((ag) => (
                <div key={ag.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ag.color }}></span>
                      <span className="font-bold text-slate-200">{ag.type} Agent</span>
                      <span className="text-[10px] text-slate-500">
                        [{ag.x},{ag.y}]
                      </span>
                    </div>
                    <span className="text-emerald-400 font-bold">{ag.energy}% Energy</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Phase |ψ⟩: {ag.superpositionPhase.toFixed(2)}</span>
                    <span className="text-cyan-400">Entropy S: 0.84</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
