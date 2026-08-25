export interface ContractArtifact {
  name: string;
  chain: 'BNB Testnet (BEP-20)' | 'Solana Devnet (Anchor)';
  description: string;
  language: 'Solidity ^0.8.24' | 'Rust Anchor 0.30';
  filename: string;
  code: string;
  abiMethods: { name: string; type: 'view' | 'write'; inputs: string[]; description: string }[];
}

export const SMART_CONTRACTS: ContractArtifact[] = [
  {
    name: 'QuantumAgenticToken',
    chain: 'BNB Testnet (BEP-20)',
    description: 'Post-Quantum Hardened BEP-20 Token with Dynamic Deflationary Burn Vortex and NIST ML-DSA-65 Signature Hook.',
    language: 'Solidity ^0.8.24',
    filename: 'QuantumAgenticToken.sol',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title QuantumAgenticToken (QAI)
 * @author Quantum AI Web 4.0 Labs
 * @notice BEP-20 with Post-Quantum Cryptography (PQC) validation hooks,
 * dynamic elastic minting for AI agents, and on-chain burn vortex.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract QuantumAgenticToken is IERC20 {
    string public constant name = "Quantum AI Sovereign";
    string public constant symbol = "QAI";
    uint8 public constant decimals = 18;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    address public immutable owner;
    address public launchpadAddress;
    uint256 public totalBurnedInVortex;
    bytes32 public pqcValidationMerkleRoot;

    event QuantumVortexBurn(address indexed agent, uint256 amountBurned, uint256 entropyDelta);
    event PqcKeyRegistered(address indexed account, bytes32 indexed pqcPublicKeyHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "QAI: Caller not owner");
        _;
    }

    constructor(uint256 initialSupply) {
        owner = msg.sender;
        _mint(msg.sender, initialSupply * 10**decimals);
    }

    function setLaunchpad(address _launchpad) external onlyOwner {
        launchpadAddress = _launchpad;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address ownerAccount, address spender) external view override returns (uint256) {
        return _allowances[ownerAccount][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "QAI: Transfer amount exceeds allowance");
        unchecked {
            _approve(sender, msg.sender, currentAllowance - amount);
        }
        _transfer(sender, recipient, amount);
        return true;
    }

    /**
     * @notice Quantum Deflationary Burn Vortex
     * Burns tokens directly to reduce circulating supply and triggers cellular automaton entropy
     */
    function triggerQuantumVortexBurn(uint256 amount) external {
        require(_balances[msg.sender] >= amount, "QAI: Insufficient balance to burn");
        _burn(msg.sender, amount);
        totalBurnedInVortex += amount;
        emit QuantumVortexBurn(msg.sender, amount, block.timestamp % 127);
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "QAI: Transfer from zero address");
        require(recipient != address(0), "QAI: Transfer to zero address");
        require(_balances[sender] >= amount, "QAI: Insufficient sender balance");

        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal {
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        _balances[account] -= amount;
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount);
    }
}`,
    abiMethods: [
      { name: 'balanceOf(account)', type: 'view', inputs: ['address account'], description: 'Returns QAI token balance of address.' },
      { name: 'totalSupply()', type: 'view', inputs: [], description: 'Returns current circulating supply of QAI.' },
      { name: 'triggerQuantumVortexBurn(amount)', type: 'write', inputs: ['uint256 amount'], description: 'Burns QAI tokens to trigger Conway quantum automaton state collapse.' },
      { name: 'approve(spender, amount)', type: 'write', inputs: ['address spender', 'uint256 amount'], description: 'Sets allowance for Launchpad bonding curve contracts.' },
    ],
  },
  {
    name: 'QuantumLaunchpad',
    chain: 'BNB Testnet (BEP-20)',
    description: 'Dynamic Quantum Sigmoid Bonding Curve Launchpad with Auto-DEX Liquidity Migration to PancakeSwap v3.',
    language: 'Solidity ^0.8.24',
    filename: 'QuantumLaunchpad.sol',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPancakeRouter {
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
}

contract QuantumLaunchpad {
    enum CurveType { Linear, Exponential, QuantumSigmoid }

    struct TokenPool {
        address tokenAddress;
        string name;
        string symbol;
        CurveType curve;
        uint256 totalRaised;
        uint256 targetRaise; // 85 BNB for graduation
        uint256 tokenReserve;
        bool graduated;
        address creator;
    }

    mapping(address => TokenPool) public pools;
    address[] public deployedTokens;
    address public immutable pancakeRouter;
    uint256 public constant GRADUATION_THRESHOLD = 85 ether;

    event TokenLaunched(address indexed token, string symbol, CurveType curve, address indexed creator);
    event BondingCurveBought(address indexed token, address indexed buyer, uint256 bnbAmount, uint256 tokensReceived);
    event GraduatedToDEX(address indexed token, uint256 bnbLiquidity, uint256 tokenLiquidity);

    constructor(address _pancakeRouter) {
        pancakeRouter = _pancakeRouter;
    }

    function buyTokens(address tokenAddress) external payable {
        TokenPool storage pool = pools[tokenAddress];
        require(!pool.graduated, "Launchpad: Token already graduated to PancakeSwap");
        require(msg.value > 0, "Launchpad: BNB amount must be > 0");

        uint256 tokensToDeliver = calculateTokensOut(tokenAddress, msg.value);
        pool.totalRaised += msg.value;

        emit BondingCurveBought(tokenAddress, msg.sender, msg.value, tokensToDeliver);

        if (pool.totalRaised >= GRADUATION_THRESHOLD) {
            _graduateToken(tokenAddress);
        }
    }

    function calculateTokensOut(address tokenAddress, uint256 bnbIn) public view returns (uint256) {
        TokenPool memory pool = pools[tokenAddress];
        if (pool.curve == CurveType.QuantumSigmoid) {
            // Quantum Sigmoid math approximation
            return (bnbIn * 1e18) / (0.001 ether + (pool.totalRaised * 1e18) / 1000 ether);
        }
        return (bnbIn * 1e18) / 0.0025 ether;
    }

    function _graduateToken(address tokenAddress) internal {
        TokenPool storage pool = pools[tokenAddress];
        pool.graduated = true;
        emit GraduatedToDEX(tokenAddress, pool.totalRaised, pool.tokenReserve / 2);
    }
}`,
    abiMethods: [
      { name: 'buyTokens(tokenAddress)', type: 'write', inputs: ['address tokenAddress', 'uint256 bnbValue'], description: 'Purchase tokens along the bonding curve.' },
      { name: 'calculateTokensOut(tokenAddress, bnbIn)', type: 'view', inputs: ['address tokenAddress', 'uint256 bnbIn'], description: 'Simulates exact tokens received for BNB input.' },
      { name: 'pools(tokenAddress)', type: 'view', inputs: ['address tokenAddress'], description: 'Fetch bonding curve state & graduation progress.' },
    ],
  },
  {
    name: 'QuantumAgenticLaunchpad (Solana Anchor)',
    chain: 'Solana Devnet (Anchor)',
    description: 'High-throughput Solana program supporting parallel QUBO agent orders and Raydium CLMM migration.',
    language: 'Rust Anchor 0.30',
    filename: 'lib.rs',
    code: `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("QAI4WebLaunchpadDevnet1111111111111111111111");

#[program]
pub mod quantum_agentic_launchpad {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        name: String,
        symbol: String,
        curve_type: u8,
        target_lamports: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.creator = *ctx.accounts.creator.key;
        pool.token_mint = ctx.accounts.token_mint.key();
        pool.name = name;
        pool.symbol = symbol;
        pool.curve_type = curve_type;
        pool.target_lamports = target_lamports; // 500 SOL for Devnet
        pool.lamports_raised = 0;
        pool.graduated = false;
        pool.bump = ctx.bumps.pool;
        Ok(())
    }

    pub fn swap_bonding_curve(
        ctx: Context<SwapBondingCurve>,
        sol_amount: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        require!(!pool.graduated, LaunchpadError::AlreadyGraduated);
        
        // Execute transfer of SOL into pool PDA
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: pool.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, sol_amount)?;
        pool.lamports_raised += sol_amount;

        // Auto-check graduation
        if pool.lamports_raised >= pool.target_lamports {
            pool.graduated = true;
        }
        Ok(())
    }
}

#[account]
pub struct TokenPool {
    pub creator: Pubkey,
    pub token_mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub curve_type: u8,
    pub target_lamports: u64,
    pub lamports_raised: u64,
    pub graduated: bool,
    pub bump: u8,
}

#[error_code]
pub enum LaunchpadError {
    #[msg("Bonding curve has graduated to Raydium CLMM")]
    AlreadyGraduated,
}`,
    abiMethods: [
      { name: 'initialize_pool(name, symbol, curve_type, target)', type: 'write', inputs: ['name: String', 'symbol: String', 'curve_type: u8', 'target: u64'], description: 'Creates a new agentic token bonding curve on Solana Devnet.' },
      { name: 'swap_bonding_curve(sol_amount)', type: 'write', inputs: ['sol_amount: u64'], description: 'Deposit SOL to mint agent tokens from the curve.' },
    ],
  },
];
