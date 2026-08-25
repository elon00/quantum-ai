import React, { useState } from 'react';
import { SMART_CONTRACTS, ContractArtifact } from '../data/contractsData';
import { Terminal, Copy, CheckCircle2, Code2, Play, ExternalLink, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartContractsExplorer: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<ContractArtifact>(SMART_CONTRACTS[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeMethod, setActiveMethod] = useState<string>(selectedContract.abiMethods[0]?.name || '');
  const [executionLogs, setExecutionLogs] = useState<string[]>([
    '[VM] Connected to EVM / Solana Devnet Runtime',
    '[VM] Bytecode verified: 0x608060405234801561001057600080fd5b5060...',
    '[VM] ABI interfaces mapped with 100% Post-Quantum safety',
  ]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedContract.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExecuteAbiMethod = async (methodName: string) => {
    setIsExecuting(true);
    setActiveMethod(methodName);

    const logStart = `[EXEC] Invoking ${methodName} on ${selectedContract.name}...`;
    setExecutionLogs((prev) => [logStart, ...prev]);

    await new Promise((r) => setTimeout(r, 800));

    const logSuccess = `[SUCCESS] Transaction committed on block #${Math.floor(
      Math.random() * 900000 + 42000000
    )} | Gas Used: 48,290 | PQC Sig Status: VALID`;

    setExecutionLogs((prev) => [logSuccess, ...prev]);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#06B6D4', '#10B981', '#F59E0B'],
    });

    setIsExecuting(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                Dual EVM & Solana Anchor Smart Contracts
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Solidity ^0.8.24 & Rust 0.30
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart Contracts & ABI Executor
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Production smart contracts for BEP-20 bonding curves, deflationary burn vortex, and Solana Anchor programs. Inspect code or test ABI methods live.
            </p>
          </div>

          <a
            href="https://github.com/elon00/quantum-portfolio-optimizer.git"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold transition flex-shrink-0"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Contract Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {SMART_CONTRACTS.map((c) => (
          <button
            key={c.name}
            onClick={() => {
              setSelectedContract(c);
              setActiveMethod(c.abiMethods[0]?.name || '');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              selectedContract.name === c.name
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{c.filename}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
              {c.language}
            </span>
          </button>
        ))}
      </div>

      {/* Grid: Code Viewer & ABI Executor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono">{selectedContract.filename}</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {selectedContract.chain}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition"
            >
              {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied' : 'Copy Code'}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[440px] select-text">
            <code>{selectedContract.code}</code>
          </pre>
        </div>

        {/* ABI Method Executor (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* ABI Methods Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Interactive ABI Methods
              </h3>
              <span className="text-xs font-mono text-cyan-400">Testnet Simulated</span>
            </div>

            <div className="space-y-2">
              {selectedContract.abiMethods.map((method) => (
                <div
                  key={method.name}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          method.type === 'write' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {method.type.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">{method.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{method.description}</p>
                  </div>

                  <button
                    onClick={() => handleExecuteAbiMethod(method.name)}
                    disabled={isExecuting}
                    className="p-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition"
                    title="Execute Method"
                  >
                    {isExecuting && activeMethod === method.name ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Console Execution Stream */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Runtime Execution Stream
            </h3>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-36 overflow-y-auto">
              {executionLogs.map((log, idx) => (
                <div key={idx} className={log.includes('SUCCESS') ? 'text-emerald-400' : ''}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
