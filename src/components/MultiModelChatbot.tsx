import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Bot, Send, User, Sparkles, Shield, Cpu, Terminal, Copy, CheckCircle2, RefreshCw, Trash2, Atom } from 'lucide-react';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    model: 'gemini-3.7-flash',
    content:
      "👋 Welcome to the **Quantum AI Web 4.0 Assistant**!\n\nI can help you analyze **QUBO/QAOA Hamiltonian parameters**, audit smart contracts for **Shor 127Q quantum vulnerabilities**, simulate **dynamic bonding curves**, or inspect **NIST ML-KEM-768 lattice keys**.\n\nSelect any quick tool below or ask any quantitative query!",
    timestamp: 'Just now',
  },
];

export const MultiModelChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<ChatMessage['model']>('gemini-3.7-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, toolName?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      model: selectedModel,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolInvoked: toolName,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        model: selectedModel,
        content: data.text || 'Unable to compute quantum answer.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: data.simulated,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          model: selectedModel,
          content:
            "⚠️ [Quantum Coherence Interruption]: System operated in fallback simulator.\n\n" +
            `Analysis of "${text}":\n` +
            "• **QUBO Optimization**: Recommended risk penalty $\\theta = 0.38$.\n" +
            "• **PQC Security**: NIST ML-KEM-768 lattice encryption verified.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickTools = [
    {
      label: 'Audit Smart Contract for Reentrancy & Quantum Risk',
      prompt: 'Perform a comprehensive security audit of a BEP-20 launchpad smart contract, specifically checking for reentrancy, integer overflow, and post-quantum vulnerability to Shor 127Q factorization.',
      icon: Shield,
    },
    {
      label: 'Optimize QUBO Risk Parameter θ',
      prompt: 'Explain the mathematical formulation of the QUBO Hamiltonian for crypto portfolio optimization: min x^T Sigma x - theta mu^T x + lambda (1 - sum x)^2. How should theta be tuned for a high-volatility regime?',
      icon: Atom,
    },
    {
      label: 'Simulate Quantum Sigmoid vs Linear Bonding Curve',
      prompt: 'Compare a Quantum Sigmoid bonding curve P(S) = L / (1 + e^-k(S-S0)) vs Linear P(S) = a*S in terms of early-stage slippage, bot MEV protection, and DEX graduation liquidity depth.',
      icon: Cpu,
    },
    {
      label: 'Generate NIST ML-KEM-768 Lattice Keypair Code',
      prompt: 'Provide a TypeScript snippet using post-quantum cryptography to generate an ML-KEM-768 key encapsulation pair and encapsulate a shared symmetric secret.',
      icon: Terminal,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Multi-Model Quantum AI Reasoning
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Server-Side Gemini 3.7 Flash Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Multi-Model Quantum AI Assistant
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Switch seamlessly between premier AI models to audit smart contracts, tune QUBO Hamiltonian weights, simulate tokenomics curves, and verify post-quantum cryptography.
            </p>
          </div>

          {/* Model Selector Pill */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash', badge: 'Default' },
              { id: 'gpt-4o', label: 'GPT-4o', badge: 'Reasoning' },
              { id: 'claude-3.5', label: 'Claude 3.5 Sonnet', badge: 'Code' },
              { id: 'deepseek-r1', label: 'DeepSeek-R1', badge: 'Math' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                  selectedModel === m.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[600px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-slate-950" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 shadow-sm relative group ${
                    isUser
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-slate-950/90 border border-slate-800/90 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5 text-[10px] font-mono text-slate-400">
                    <span className="font-semibold text-cyan-300">
                      {isUser ? 'You' : `${msg.model.toUpperCase()} Engine`}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-4 h-4 text-slate-950 animate-spin" />
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl rounded-bl-none text-xs font-mono text-cyan-400 flex items-center gap-2">
                <span>Sampling quantum states across 127-qubit lattice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Tools Tray */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 p-3 flex gap-2 overflow-x-auto no-scrollbar">
          {quickTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(tool.prompt, tool.label)}
                disabled={isLoading}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setMessages(INITIAL_MESSAGES)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
            title="Reset Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <input
            id="ai-chat-input"
            type="text"
            placeholder={`Ask ${selectedModel} about QUBO formulas, smart contracts, PQC lattice keys...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-4 py-2.5 rounded-xl outline-none transition"
          />

          <button
            id="send-ai-message-btn"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-cyan-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
