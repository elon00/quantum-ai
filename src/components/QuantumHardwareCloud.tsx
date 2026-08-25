import React, { useState } from 'react';
import { Cpu, Zap, Activity, ShieldCheck, Terminal, Layers, RefreshCw, CheckCircle2, Play, Radio, Sparkles } from 'lucide-react';
import { QuantumHardwareBackend } from '../types';
import confetti from 'canvas-confetti';

export const QuantumHardwareCloud: React.FC = () => {
  const [selectedQpu, setSelectedQpu] = useState<string>('ibm-heron');
  const [circuitDepth, setCircuitDepth] = useState<number>(4);
  const [shots, setShots] = useState<number>(4096);
  const [isTranspiling, setIsTranspiling] = useState<boolean>(false);
  const [transpileOutput, setTranspileOutput] = useState<any | null>(null);
  const [activeQubit, setActiveQubit] = useState<number | null>(null);

  const qpuBackends: QuantumHardwareBackend[] = [
    { id: 'ibm-heron', name: 'IBM Heron r2 (133Q)', provider: 'IBM Quantum', qubits: 133, technology: 'Superconducting Transmon', status: 'online', avgQueueTimeMin: 1.2, fidelity2Qubit: 99.85, coherenceT1Us: 280 },
    { id: 'ibm-eagle', name: 'IBM Eagle r3 (127Q)', provider: 'IBM Quantum', qubits: 127, technology: 'Superconducting Transmon', status: 'online', avgQueueTimeMin: 2.8, fidelity2Qubit: 99.40, coherenceT1Us: 195 },
    { id: 'dwave-advantage', name: 'D-Wave Advantage 6.4 (5000Q)', provider: 'D-Wave Systems', qubits: 5640, technology: 'Quantum Annealer', status: 'online', avgQueueTimeMin: 0.4, fidelity2Qubit: 99.90, coherenceT1Us: 320 },
    { id: 'rigetti-ankaa', name: 'Rigetti Ankaa-2 (84Q)', provider: 'Rigetti Computing', qubits: 84, technology: 'Superconducting Transmon', status: 'online', avgQueueTimeMin: 4.1, fidelity2Qubit: 98.90, coherenceT1Us: 120 },
  ];

  const handleTranspileCircuit = async () => {
    setIsTranspiling(true);
    await new Promise((r) => setTimeout(r, 1100));

    const result = {
      qpu: selectedQpu,
      logicalQubits: 8,
      physicalQubitsMapped: 14,
      cnotCount: 24 * circuitDepth,
      pulseDurationNs: 420 * circuitDepth,
      estimatedErrorRate: '0.0034%',
      transpiledQasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[8] q;\nbit[8] c;\nh q[0..7];\n// QAOA Cost Hamiltonian Layer (p=${circuitDepth})\nrz(0.482) q[0];\ncx q[0], q[1];\nrz(-0.312) q[1];\ncx q[0], q[1];\n// Mixer Hamiltonian Layer\nrx(0.852) q[0..7];\nmeasure q -> c;`,
      jobId: 'job_ibm_heron_' + Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };

    setTranspileOutput(result);
    setIsTranspiling(false);

    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#00F5FF', '#7B2CBF', '#00FF66'],
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Sci-Fi Header */}
      <div className="p-6 bg-slate-900/90 border border-cyan-500/40 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> QPU Cloud Direct Grid
              </span>
              <span className="px-2.5 py-1 text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl">
                Microwave Pulse Control (5.1 GHz)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              Quantum Hardware Cloud Terminal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Dispatch QAOA and VQE Hamiltonian circuits directly to <b>IBM Heron 133Q</b> and <b>D-Wave 5000Q</b> superconducting quantum processors with automated error mitigation.
            </p>
          </div>

          <button
            onClick={handleTranspileCircuit}
            disabled={isTranspiling}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${isTranspiling ? 'animate-bounce' : 'text-cyan-200'}`} />
            <span>{isTranspiling ? 'Compiling Pulse Schedule...' : '? Transpile & Dispatch to QPU'}</span>
          </button>
        </div>
      </div>

      {/* QPU Hardware Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {qpuBackends.map((qpu) => {
          const isSelected = selectedQpu === qpu.id;
          return (
            <div
              key={qpu.id}
              onClick={() => setSelectedQpu(qpu.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {qpu.provider}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Online
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-white">{qpu.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{qpu.technology}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block">Qubits:</span>
                  <span className="text-cyan-300 font-bold">{qpu.qubits} Q</span>
                </div>
                <div>
                  <span className="text-slate-500 block">2Q Fidelity:</span>
                  <span className="text-emerald-400 font-bold">{qpu.fidelity2Qubit}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Holographic 16-Qubit Heavy-Hex Topology Grid & Transpiled Circuit Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Heavy-Hex Qubit Lattice Grid */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Superconducting Heavy-Hex Qubit Lattice
            </h3>
            <span className="text-xs font-mono text-cyan-400">T1 Coherence: 280 ?s</span>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap justify-center gap-3">
            {Array.from({ length: 16 }).map((_, i) => {
              const isActive = activeQubit === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveQubit(i)}
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/50 scale-110 border-2 border-white'
                      : i < 8
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px]">q[{i}]</span>
                  <span className="text-[9px] opacity-75">{i < 8 ? 'QAOA' : 'Aux'}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Coupling: Heavy-Hexagon Resonance</span>
            <span className="text-emerald-400">Entanglement: GHZ Bell State Active</span>
          </div>
        </div>

        {/* Transpiled Circuit OpenQASM 3.0 Terminal */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" /> OpenQASM 3.0 Pulse Execution Stream
            </h3>
            <span className="text-xs font-mono text-purple-400">Level 3 Optimizations</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-cyan-300 max-h-52 overflow-y-auto space-y-1 scrollbar-thin">
            {transpileOutput ? (
              <pre className="text-[11px] leading-relaxed text-slate-300">
                {transpileOutput.transpiledQasm}
              </pre>
            ) : (
              <div className="text-slate-500 italic py-8 text-center">
                Click "Transpile & Dispatch to QPU" to generate native microwave pulse schedules.
              </div>
            )}
          </div>

          {transpileOutput && (
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span>Job ID: <b className="text-cyan-300">{transpileOutput.jobId}</b></span>
              <span className="text-emerald-400 font-bold">Status: EXECUTING_ON_QPU</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};