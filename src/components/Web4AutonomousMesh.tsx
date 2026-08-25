import React, { useState, useEffect, useRef } from 'react';
import { MeshNode } from '../types';
import { Cpu, Activity, ShieldCheck, Zap, Globe, ArrowRightLeft, Radio, Server, Terminal, RefreshCw } from 'lucide-react';

const INITIAL_NODES: MeshNode[] = [
  { id: 'node-1', name: 'Frankfurt-PQC-01', region: 'EU Central', lat: 50.11, lng: 8.68, status: 'active', tps: 840, latencyMs: 14, quantumQubits: 127, pqcMode: 'ML-KEM-1024', role: 'Validator' },
  { id: 'node-2', name: 'Tokyo-QUBO-04', region: 'Asia East', lat: 35.68, lng: 139.69, status: 'optimizing', tps: 920, latencyMs: 22, quantumQubits: 127, pqcMode: 'ML-DSA-65', role: 'QUBO Solver' },
  { id: 'node-3', name: 'Virginia-Relay-02', region: 'US East', lat: 38.03, lng: -78.47, status: 'active', tps: 760, latencyMs: 8, quantumQubits: 64, pqcMode: 'ML-KEM-768', role: 'PQC Relay' },
  { id: 'node-4', name: 'Singapore-Oracle-09', region: 'Asia SE', lat: 1.35, lng: 103.82, status: 'active', tps: 620, latencyMs: 18, quantumQubits: 64, pqcMode: 'ML-DSA-65', role: 'Oracle' },
];

export const Web4AutonomousMesh: React.FC = () => {
  const [nodes, setNodes] = useState<MeshNode[]>(INITIAL_NODES);
  const [totalTps, setTotalTps] = useState(3140);
  const [activePackets, setActivePackets] = useState(148);
  const [logs, setLogs] = useState<string[]>([
    '[13:42:01.002] [MESH-ROUTER] Node Frankfurt-PQC-01 verified ML-DSA-65 signature on BNB block #42891901',
    '[13:42:01.450] [QUBO-AGENT] Tokyo-QUBO-04 solved 12-asset Ising Hamiltonian with θ=0.35 in 4.2ms',
    '[13:42:02.120] [BRIDGE-SHIELD] Routed 50.00 SOL across Solana-BNB lattice tunnel without mempool exposure',
    '[13:42:02.890] [PQC-SENTINEL] Lattice key encapsulation exchange (ML-KEM-768) completed with 0 errors',
    '[13:42:03.410] [LOAD-BALANCER] Global network throughput reached 3,140 TPS (Peak capacity: 10,000 TPS)',
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTps((prev) => 3000 + Math.floor(Math.random() * 300));
      setActivePackets((prev) => 130 + Math.floor(Math.random() * 40));

      const newLog = `[${new Date().toISOString().slice(11, 23)}] [AGENT-NET] Agent #${Math.floor(
        Math.random() * 900 + 100
      )} dispatched cross-chain liquidity quote (Gas delta: -28.4%)`;

      setLogs((prev) => [newLog, ...prev.slice(0, 15)]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Visual Topology Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Center hub
      const cx = w / 2;
      const cy = h / 2;

      // Draw pulsating concentric quantum rings
      for (let r = 40; r <= 160; r += 40) {
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 - (r / 200) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r + Math.sin(angle) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Center Hub
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('HUB', cx - 9, cy + 3);

      // Draw Orbiting Nodes
      nodes.forEach((node, idx) => {
        const nodeAngle = angle + (idx * Math.PI * 2) / nodes.length;
        const orbitR = 120;
        const nx = cx + Math.cos(nodeAngle) * orbitR;
        const ny = cy + Math.sin(nodeAngle) * (orbitR * 0.7);

        // Connection line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        ctx.setLineDash([]);

        // Node circle
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(nx, ny, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText(node.name.split('-')[0], nx - 14, ny + 3);
      });

      angle += 0.008;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [nodes]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Decentralized Autonomous Mesh
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PQC Encrypted P2P
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Web 4.0 Autonomous Mesh
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Cross-chain telemetry stream routing transactions through post-quantum encrypted peer nodes, load-balancing up to 3,200 TPS with zero central points of failure.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">Mesh Throughput</span>
              <span className="text-base font-bold text-cyan-400">{totalTps.toLocaleString()} TPS</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Active Packets</span>
              <span className="text-base font-bold text-emerald-400">{activePackets} In-Flight</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Avg Latency</span>
              <span className="text-base font-bold text-amber-400">14.2 ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Visual Topology Canvas + Nodes Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topology Canvas (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Real-Time Peer Topology
            </h3>
            <span className="text-xs font-mono text-cyan-400">4 Global Hubs</span>
          </div>

          <div className="bg-slate-950 rounded-xl p-2 border border-slate-800 flex justify-center">
            <canvas ref={canvasRef} width={480} height={300} className="w-full h-auto rounded-lg" />
          </div>
        </div>

        {/* Global Mesh Nodes Table (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Active Mesh Validator Nodes
          </h3>

          <div className="space-y-2.5">
            {nodes.map((node) => (
              <div key={node.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-white font-mono">{node.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {node.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {node.region} • {node.quantumQubits} Qubits • {node.pqcMode}
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="text-cyan-400 font-bold">{node.tps} TPS</div>
                  <div className="text-slate-500 text-[10px]">{node.latencyMs}ms ping</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-chain Telemetry Stream Log */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Cross-Chain Telemetry & Autonomous Agent Negotiation Stream
          </h3>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
            Streaming Live
          </span>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed hover:text-cyan-300 transition">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
