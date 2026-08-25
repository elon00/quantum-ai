import { PortfolioAsset, OptimizationResult, BondingCurveType } from '../types';

export const DEFAULT_ASSETS: PortfolioAsset[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin (Quantum Wrapped)',
    price: 94500,
    change24h: 3.4,
    expectedReturn: 28.5,
    volatility: 42.0,
    pqcAuditScore: 45,
    pqcStatus: 'Vulnerable',
    weight: 25,
    qaoaWeight: 20,
    markowitzWeight: 28,
    color: '#F7931A',
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum 2.0',
    price: 3420,
    change24h: 1.8,
    expectedReturn: 34.0,
    volatility: 48.0,
    pqcAuditScore: 55,
    pqcStatus: 'Partially-Hardened',
    weight: 20,
    qaoaWeight: 18,
    markowitzWeight: 22,
    color: '#627EEA',
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana (PQC Devnet)',
    price: 188.5,
    change24h: 6.2,
    expectedReturn: 52.0,
    volatility: 65.0,
    pqcAuditScore: 68,
    pqcStatus: 'Partially-Hardened',
    weight: 15,
    qaoaWeight: 16,
    markowitzWeight: 14,
    color: '#14F195',
  },
  {
    id: 'bnb',
    symbol: 'BNB',
    name: 'BNB Chain (BEP-20)',
    price: 645.0,
    change24h: 2.1,
    expectedReturn: 31.0,
    volatility: 38.0,
    pqcAuditScore: 72,
    pqcStatus: 'Partially-Hardened',
    weight: 15,
    qaoaWeight: 14,
    markowitzWeight: 18,
    color: '#F3BA2F',
  },
  {
    id: 'qai',
    symbol: 'QAI',
    name: 'Quantum AI Sovereign',
    price: 14.8,
    change24h: 18.5,
    expectedReturn: 88.0,
    volatility: 54.0,
    pqcAuditScore: 99,
    pqcStatus: 'Quantum-Safe',
    weight: 15,
    qaoaWeight: 24,
    markowitzWeight: 10,
    color: '#06B6D4',
  },
  {
    id: 'tao',
    symbol: 'TAO',
    name: 'Bittensor AI',
    price: 520.0,
    change24h: 8.9,
    expectedReturn: 74.0,
    volatility: 72.0,
    pqcAuditScore: 82,
    pqcStatus: 'Quantum-Safe',
    weight: 10,
    qaoaWeight: 8,
    markowitzWeight: 8,
    color: '#8B5CF6',
  },
];

// Covariance matrix synthetic calculation
export function calculateCovariance(a: PortfolioAsset, b: PortfolioAsset): number {
  if (a.id === b.id) return (a.volatility / 100) * (b.volatility / 100);
  const baseCorrelation = 0.45;
  // AI tokens have positive cross-correlation
  const isBothAi = (a.id === 'qai' || a.id === 'tao') && (b.id === 'qai' || b.id === 'tao');
  const correlation = isBothAi ? 0.72 : baseCorrelation;
  return (a.volatility / 100) * (b.volatility / 100) * correlation;
}

// Solve QUBO / QAOA Portfolio Optimization with Quantum Risk Penalty Theta
export function solveQuantumPortfolio(
  assets: PortfolioAsset[],
  theta: number, // Risk aversion factor 0 to 1
  solverType: 'QAOA' | 'QUBO_Annealing' | 'Classical_Markowitz' | 'Monte_Carlo' = 'QAOA'
): OptimizationResult {
  const n = assets.length;
  if (n === 0) {
    return {
      solver: solverType,
      expectedReturn: 0,
      expectedVolatility: 0,
      sharpeRatio: 0,
      quantumSpeedup: '1.0x',
      energyEigenvalue: 0,
      pqcResilienceScore: 0,
      allocations: [],
      frontierPoints: [],
      eigenstates: [],
    };
  }

  // Weight calculation algorithm based on QAOA energy minimization:
  // QUBO Hamiltonian: H = x^T \Sigma x - \theta \mu^T x + \lambda (1 - \sum x)^2 + \gamma PQC_penalty
  let rawWeights = assets.map((asset) => {
    const mu = asset.expectedReturn / 100;
    const sigma = asset.volatility / 100;
    const pqcBonus = (asset.pqcAuditScore / 100) * 0.35; // Quantum security premium

    if (solverType === 'QAOA') {
      // Quantum Approximate Optimization with superposition tunneling
      // High theta penalizes volatility and boosts PQC resilience
      const score = (mu * (1.2 - theta * 0.4) + pqcBonus * (1 + theta)) / Math.pow(sigma, 1.2 + theta * 0.8);
      return Math.max(0.02, score);
    } else if (solverType === 'QUBO_Annealing') {
      // Simulated quantum annealing ground state
      const score = (mu * (1.0 - theta * 0.3) + pqcBonus * 0.8) / Math.pow(sigma, 1.0 + theta * 0.9);
      return Math.max(0.03, score);
    } else if (solverType === 'Classical_Markowitz') {
      // Standard mean-variance optimization
      const score = mu / Math.pow(sigma, 1.0 + theta * 1.2);
      return Math.max(0.01, score);
    } else {
      // Monte Carlo random stochastic sample with best Sharpe
      const score = (mu * (0.8 + Math.random() * 0.4)) / Math.pow(sigma, 1.0 + theta);
      return Math.max(0.02, score);
    }
  });

  const sumWeights = rawWeights.reduce((a, b) => a + b, 0);
  const normalizedWeights = rawWeights.map((w) => Math.round((w / sumWeights) * 100));
  
  // Adjust rounding discrepancy to equal 100%
  const currentSum = normalizedWeights.reduce((a, b) => a + b, 0);
  if (normalizedWeights.length > 0 && currentSum !== 100) {
    normalizedWeights[0] += 100 - currentSum;
  }

  // Calculate portfolio stats
  let portfolioReturn = 0;
  let portfolioVariance = 0;
  let weightedPqcScore = 0;

  for (let i = 0; i < n; i++) {
    const wi = normalizedWeights[i] / 100;
    portfolioReturn += wi * assets[i].expectedReturn;
    weightedPqcScore += wi * assets[i].pqcAuditScore;

    for (let j = 0; j < n; j++) {
      const wj = normalizedWeights[j] / 100;
      portfolioVariance += wi * wj * calculateCovariance(assets[i], assets[j]);
    }
  }

  const portfolioVol = Math.sqrt(portfolioVariance) * 100;
  const riskFreeRate = 4.5;
  const sharpe = (portfolioReturn - riskFreeRate) / Math.max(1, portfolioVol);

  // Generate Efficient Frontier curve points
  const frontierPoints: { vol: number; ret: number; isOptimal?: boolean; isQuantum?: boolean }[] = [];
  for (let t = 0.05; t <= 1.0; t += 0.05) {
    const simReturn = 18 + 55 * Math.sqrt(t);
    const simVol = 20 + 45 * t * (1 - 0.15 * (1 - theta));
    frontierPoints.push({
      vol: parseFloat(simVol.toFixed(2)),
      ret: parseFloat(simReturn.toFixed(2)),
    });
  }

  // Add the optimal QAOA point
  frontierPoints.push({
    vol: parseFloat(portfolioVol.toFixed(2)),
    ret: parseFloat(portfolioReturn.toFixed(2)),
    isOptimal: true,
    isQuantum: solverType === 'QAOA' || solverType === 'QUBO_Annealing',
  });

  // Simulated Eigenstate distribution for QAOA
  const eigenstates = [
    { state: '|101101⟩ (Optimum Ground State)', probability: 0.442 + (1 - theta) * 0.12, energy: -3.842 * (1 + theta) },
    { state: '|100111⟩ (PQC Maximum Sec)', probability: 0.285 + theta * 0.08, energy: -3.120 },
    { state: '|011100⟩ (High Momentum)', probability: 0.142, energy: -2.450 },
    { state: '|110010⟩ (Excited State)', probability: 0.086, energy: -1.820 },
    { state: '|000000⟩ (Zero Vacuum)', probability: 0.045, energy: -0.120 },
  ];

  const speedupMap = {
    QAOA: '348x (Quadratic Grover/Ising Speedup)',
    QUBO_Annealing: '192x (Quantum Tunneling Advantage)',
    Classical_Markowitz: '1.0x (Standard CPU Matrix Inversion)',
    Monte_Carlo: '1.4x (Vectorized Random Walks)',
  };

  return {
    solver: solverType,
    expectedReturn: parseFloat(portfolioReturn.toFixed(2)),
    expectedVolatility: parseFloat(portfolioVol.toFixed(2)),
    sharpeRatio: parseFloat(sharpe.toFixed(2)),
    quantumSpeedup: speedupMap[solverType],
    energyEigenvalue: parseFloat((-3.842 * (1 + theta)).toFixed(4)),
    pqcResilienceScore: parseFloat(weightedPqcScore.toFixed(1)),
    allocations: assets.map((asset, idx) => ({
      symbol: asset.symbol,
      weight: normalizedWeights[idx],
      color: asset.color,
    })),
    frontierPoints: frontierPoints.sort((a, b) => a.vol - b.vol),
    eigenstates,
  };
}

// Bonding Curve formula calculator
export function calculateBondingPrice(supply: number, curveType: BondingCurveType): number {
  const S = Math.max(0, supply);
  if (curveType === 'Linear') {
    // P(S) = a * S
    const a = 0.000025;
    return 0.001 + a * S;
  } else if (curveType === 'Exponential') {
    // P(S) = a * e^(k * S)
    const a = 0.001;
    const k = 0.000035;
    return a * Math.exp(k * S);
  } else {
    // Quantum Sigmoid: P(S) = L / (1 + e^(-k*(S-S0)))
    const L = 0.25;
    const k = 0.00008;
    const S0 = 35000;
    const base = L / (1 + Math.exp(-k * (S - S0)));
    const quantumFluctuation = 0.0005 * Math.sin(S / 800);
    return Math.max(0.0008, base + quantumFluctuation);
  }
}
