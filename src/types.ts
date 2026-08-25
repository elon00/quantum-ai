export type SupportedChain = 'bnb' | 'solana' | 'sui' | 'ethereum' | 'arbitrum';

export type NavigationTab =
  | 'optimizer'
  | 'backtester'
  | 'quantum-cloud'
  | 'bridge'
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
  balance: number; // in native coin
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
  type: 'faucet' | 'deploy' | 'swap' | 'stake' | 'burn' | 'optimize' | 'pqc_verify' | 'bridge';
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
  solver: 'QAOA' | 'VQE' | 'QUBO_Annealing' | 'Classical_Markowitz' | 'AI_AutoPilot' | 'Monte_Carlo';
  expectedReturn: number;
  expectedVolatility: number;
  sharpeRatio: number;
  quantumSpeedup: string;
  energyEigenvalue: number;
  pqcResilienceScore: number;
  allocations: { symbol: string; weight: number; color?: string }[];
  frontierPoints: { vol: number; ret: number; isOptimal?: boolean; isQuantum?: boolean }[];
  eigenstates: { state: string; probability: number; energy: number }[];
}

export interface BacktestYearMetrics {
  year: number;
  classicalReturn: number;
  qaoaReturn: number;
  pqcHardenedReturn: number;
  classicalMdd: number;
  qaoaMdd: number;
  qDaySurvivabilityScore: number;
}

export interface QuantumHardwareBackend {
  id: string;
  name: string;
  provider: 'IBM Quantum' | 'D-Wave Systems' | 'Rigetti Computing' | 'IonQ' | 'Local Simulator';
  qubits: number;
  technology: 'Superconducting Transmon' | 'Quantum Annealer' | 'Trapped Ion' | 'Statevector Sim';
  status: 'online' | 'busy' | 'calibrating';
  avgQueueTimeMin: number;
  fidelity2Qubit: number;
  coherenceT1Us: number;
}

export interface CrossChainBridgeTransfer {
  id: string;
  fromChain: SupportedChain;
  toChain: SupportedChain;
  amount: number;
  tokenSymbol: string;
  pqcProofHash: string;
  status: 'locking' | 'relaying' | 'minting' | 'completed';
  timestamp: number;
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
  targetRaise: number;
  graduationProgress: number;
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
  toolResult?: any;
  latexFormulas?: string[];
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