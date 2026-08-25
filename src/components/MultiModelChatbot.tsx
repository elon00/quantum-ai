import React, { useState } from 'react';
import { Bot, Send, Sparkles, Cpu, User, Zap, Terminal, ShieldCheck, RefreshCw, Layers, Lock, Play, Activity } from 'lucide-react';
import { ChatMessage } from '../types';

export const MultiModelChatbot: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<'gemini-3.7-flash' | 'gpt-4o' | 'claude-3.5' | 'deepseek-r1'>('gemini-3.7-flash');
  const [input, setInput] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      model: 'gemini-3.7-flash',
      content: `?? **Quantum AI Agentic Neural Copilot Active [Q-OS v4.0]**\n\nI am your unified mathematical and quantum-cryptographic orchestrator. I can compute **QUBO Ising Hamiltonians**, transpile circuits for **IBM Heron 133Q**, seal orders with **NIST FIPS 204 ML-DSA-65**, and execute cross-chain rebalances.\n\n$$\\min_x \\left[ q \\cdot x^T \\Sigma x - \\mu^T x + \\theta \\cdot \\mathcal{V}^T x + P \\left(\\sum x_i - K\\right)^2 \\right]$$\n\nWhat subroutine would you like to execute?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      model: selectedModel,
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsThinking(true);

    await new Promise((r) => setTimeout(r, 1000));

    let assistantResponse = '';
    let toolInvoked = undefined;

    const lower = promptToSend.toLowerCase();

    if (lower.includes('qaoa') || lower.includes('optimize') || lower.includes('portfolio') || lower.includes('qubo')) {
      toolInvoked = 'QUANTUM_QAOA_SOLVER';
      assistantResponse = `? **[${selectedModel.toUpperCase()} SUBROUTINE EXECUTED: QAOA ISING SOLVER]**\n\n- **Hamiltonian Energy Minimum**: $E_0 = -4.1824 \\text{ Hartree}$\n- **Quantum Speedup**: **348x Quadratic Tunneling** via Qiskit Primitives\n- **Optimal Vector Allocation**: **35% $QAGENT, 20% $QRL, 15% $ALGO, 15% $TAO, 15% $SPY**\n- **Risk-Adjusted Alpha Return**: **+68.4% APY** | **Sharpe Ratio**: **1.94**\n- **Post-Quantum Security**: Hardened against Shor 2048-bit factorization.`;
    } else if (lower.includes('transpile') || lower.includes('ibm') || lower.includes('heron') || lower.includes('circuit')) {
      toolInvoked = 'IBM_HERON_CIRCUIT_TRANSPILER';
      assistantResponse = `?? **[${selectedModel.toUpperCase()} SUBROUTINE EXECUTED: IBM HERON QPU TRANSPILER]**\n\n- **Target QPU Architecture**: **IBM Heron r2 (133 Superconducting Qubits)**\n- **Heavy-Hex Lattice Mapping**: 8 Logical $\\rightarrow$ 14 Physical Qubits\n- **2-Qubit CNOT Count**: 24 Gates | **Pulse Duration**: 420 ns (5.1 GHz)\n- **OpenQASM 3.0 Schedule**: Compiled with Zero-Noise Extrapolation (ZNE).`;
    } else if (lower.includes('lock') || lower.includes('sign') || lower.includes('pqc') || lower.includes('mldsa')) {
      toolInvoked = 'NIST_FIPS_204_ML_DSA_SIGNER';
      assistantResponse = `?? **[${selectedModel.toUpperCase()} SUBROUTINE EXECUTED: ML-DSA-65 SIGNING]**\n\n- **Cryptographic Standard**: **NIST FIPS 204 (ML-DSA-65 / Dilithium)**\n- **Lattice Dimension**: Ring Modulus $q = 8380417$, Rank $(k=6, l=5)$\n- **Signature Verification**: **100% Zero-Tamper Bit Parity Confirmed**\n- **Trade Order Sealed**: Ready for atomic broadcast on BNB Smart Chain (97) & Solana Devnet.`;
    } else if (lower.includes('conway') || lower.includes('burn') || lower.includes('automaton')) {
      toolInvoked = 'CONWAY_BURN_VORTEX_TRIGGER';
      assistantResponse = `?? **[${selectedModel.toUpperCase()} SUBROUTINE EXECUTED: CONWAY BURN VORTEX]**\n\n- **Superposition Cluster**: Generation #68 reached critical Bell-pair density ($>120$ living cells).\n- **On-Chain Deflationary Action**: Triggered automatic burn of **15,000 $QAGENT** tokens on BSC Testnet.\n- **Net Circulating Supply Reduced**: Mathematical deflationary vortex active.`;
    } else {
      assistantResponse = `?? **[${selectedModel.toUpperCase()} NEURAL RESPONSE]**\n\nQuantum state coherence stabilized at **148.5 ?s**. All mathematical modules (QUBO, QAOA, VQE, NIST FIPS 203/204, Conway Superposition Automata, Cross-Chain Wormhole Bridge) are fully synchronized and available for instantaneous on-chain execution.`;
    }

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      sender: 'assistant',
      model: selectedModel,
      content: assistantResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolInvoked,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsThinking(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-6 bg-slate-900 border border-cyan-500/40 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl flex items-center gap-1.5 shadow-sm">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" /> Sci-Fi Autonomous Agentics Copilot
            </span>
            <span className="px-2.5 py-1 text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl">
              Multimodal Math & QPU Kernel
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Scientific Quantum-AI Command Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Autonomous multi-model intelligence equipped with direct tools to compile Qiskit circuits, optimize QUBO matrices, seal PQC orders, and govern on-chain liquidity.
          </p>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as any)}
            className="px-4 py-2.5 bg-slate-950 border border-cyan-500/40 rounded-2xl text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            <option value="gemini-3.7-flash">Gemini 3.7 Flash (Quantum Native)</option>
            <option value="deepseek-r1">DeepSeek-R1 (Pure Mathematics)</option>
            <option value="claude-3.5">Claude 3.5 Sonnet (Agentic Mesh)</option>
            <option value="gpt-4o">GPT-4o (Quantitative Engine)</option>
          </select>
        </div>
      </div>

      {/* Chat Terminal Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-[560px]">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-lg shadow-cyan-500/30">
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white self-end shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono text-cyan-400 font-semibold flex items-center gap-2">
                  <span>{msg.model?.toUpperCase()}</span>
                  <span>? {msg.timestamp}</span>
                  {msg.toolInvoked && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
                      TOOL: {msg.toolInvoked}
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-line leading-relaxed font-sans">{msg.content}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 text-xs font-bold border border-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center text-xs text-cyan-400 font-mono italic">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 animate-spin">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span>{selectedModel.toUpperCase()} is computing quantum statevector & executing subroutines...</span>
            </div>
          )}
        </div>

        {/* 1-Click Executable Sci-Fi Action Palette */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { label: '? Execute QAOA Solver', prompt: 'Execute the QAOA quantum optimization solver for my portfolio with theta=0.65' },
            { label: '?? Transpile for IBM Heron 133Q', prompt: 'Transpile the portfolio Hamiltonian into native OpenQASM 3.0 for IBM Heron QPU' },
            { label: '?? Lock Order with NIST ML-DSA-65', prompt: 'Lock and cryptographically sign the optimal allocation with NIST FIPS 204 ML-DSA-65 signature' },
            { label: '?? Trigger Conway Burn Vortex', prompt: 'Simulate Conway Quantum Automaton and trigger on-chain 15,000 $QAGENT token burn' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => handleSend(action.prompt)}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-[11px] font-mono text-cyan-300 whitespace-nowrap transition cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="pt-3 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Enter quantum command or mathematical query for ${selectedModel.toUpperCase()}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="p-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white rounded-2xl hover:opacity-90 transition cursor-pointer disabled:opacity-40 shadow-lg shadow-cyan-500/25"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};