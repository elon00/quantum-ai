export type SupportedChain = 'bnb' | 'solana';

export type NavigationTab =
  | 'optimizer'
  | 'launchpad'
  | 'automaton'
  | 'tokenomics'
  | 'ai-chat'
  | 'mesh'
  | 'pqc-suite'
  | 'contracts';

export interface WalletAccount {
  address: string;
  chain: SupportedChain;
  balance: number; // in BNB or SOL
  qaiBalance: number; // in QAI tokens
  connected: boolean;
  networkName: string;
  chainId?: number | string;
}

export interface DualWalletState {
  bnb: WalletAccount;
  solana: WalletAccount;
  activeChain: SupportedChain;
  isConnecting: boolean;
  txHistory: TransactionRecord[];
}

export interface TransactionRecord {
  id: string;
  hash: string;
  type: 'faucet' | 'deploy' | 'swap' | 'stake' | 'burn' | 'optimize' | 'pqc_verify';
  chain: SupportedChain;
  amount?: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  description: string;
}

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  expectedReturn: number; // annual %
  volatility: number; // annual %
  pqcAuditScore: number; // 0 - 100
  pqcStatus: 'Quantum-Safe' | 'Vulnerable' | 'Partially-Hardened';
  weight: number; // 0 - 100
  qaoaWeight: number; // 0 - 100
  markowitzWeight: number; // 0 - 100
  color: string;
}

export interface OptimizationResult {
  solver: 'QAOA' | 'QUBO_Annealing' | 'Classical_Markowitz' | 'Monte_Carlo';
  expectedReturn: number;
  expectedVolatility: number;
  sharpeRatio: number;
  quantumSpeedup: string;
  energyEigenvalue: number;
  pqcResilienceScore: number;
  allocations: { symbol: string; weight: number; color: string }[];
  frontierPoints: { vol: number; ret: number; isOptimal?: boolean; isQuantum?: boolean }[];
  eigenstates: { state: string; probability: number; energy: number }[];
}

export type BondingCurveType = 'Linear' | 'Exponential' | 'QuantumSigmoid';

export interface AgentToken {
  id: string;
  name: string;
  symbol: string;
  description: string;
  avatar: string;
  agentRole: 'DeFi Arbitrage' | 'MEV Shield' | 'Quantum Oracle' | 'Autonomous Liquidity' | 'PQC Sentinel';
  chain: SupportedChain;
  contractAddress: string;
  curveType: BondingCurveType;
  price: number;
  change24h: number;
  marketCap: number;
  raised: number;
  targetRaise: number; // e.g. 85 BNB or 500 SOL
  graduationProgress: number; // 0 - 100%
  holders: number;
  transactions: number;
  volume24h: number;
  creator: string;
  createdAt: string;
  dexTarget: 'PancakeSwap v3' | 'Raydium CLMM';
  graduated: boolean;
}

export interface CellularAgent {
  id: string;
  x: number;
  y: number;
  type: 'Hunter' | 'Stabilizer' | 'Glider' | 'Replicator';
  superpositionPhase: number;
  energy: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  model: 'gemini-3.7-flash' | 'gpt-4o' | 'claude-3.5' | 'deepseek-r1';
  content: string;
  timestamp: string;
  toolInvoked?: string;
  isSimulated?: boolean;
}

export interface MeshNode {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  status: 'active' | 'syncing' | 'optimizing';
  tps: number;
  latencyMs: number;
  quantumQubits: number;
  pqcMode: string;
  role: 'Validator' | 'QUBO Solver' | 'PQC Relay' | 'Oracle';
}

export interface StakingVault {
  id: string;
  name: string;
  lockDays: number;
  baseApy: number;
  quantumBoostMultiplier: number;
  totalStaked: number;
  userStaked: number;
  earnedQAI: number;
}
