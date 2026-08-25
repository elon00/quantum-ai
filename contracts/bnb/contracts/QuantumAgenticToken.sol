// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function getOwner() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address _owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract QuantumAgenticToken is IBEP20 {
    string private _name = "Quantum Agentic Network";
    string private _symbol = "QAGENT";
    uint8 private constant _decimals = 18;
    uint256 private _totalSupply;

    address public owner;
    address public conwayAutomatonContract;
    address public launchpadContract;
    address public marketingTreasury;
    address public quantumSecurityVault;

    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10**18;
    uint256 public totalMintedByAgents;
    uint256 public totalBurnedByQuantumEngine;

    uint256 public burnTaxBasisPoints = 100;
    uint256 public marketingTaxBasisPoints = 150;
    bool public elasticMintingEnabled = true;

    mapping(address => bytes32) public pqcPublicKeyHashes;
    mapping(address => bool) public authorizedAiAgents;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event AgentAuthorized(address indexed agent, string modelType);
    event PqcKeyRegistered(address indexed user, bytes32 pqcKeyHash);
    event ElasticStrategicMint(address indexed recipient, uint256 amount, string reason);
    event QuantumBurnVortex(address indexed triggerer, uint256 amount);
    event AutomatonEvolutionTrigger(uint256 generation, uint256 burnedAmount, uint256 rewardedAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "QAGENT: not owner");
        _;
    }

    modifier onlyAuthorizedAgentOrOwner() {
        require(msg.sender == owner || authorizedAiAgents[msg.sender] || msg.sender == launchpadContract, "QAGENT: unauthorized");
        _;
    }

    constructor(address _marketingTreasury, address _quantumVault) {
        owner = msg.sender;
        marketingTreasury = _marketingTreasury != address(0) ? _marketingTreasury : msg.sender;
        quantumSecurityVault = _quantumVault != address(0) ? _quantumVault : msg.sender;
        _totalSupply = INITIAL_SUPPLY;
        _balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
        authorizedAiAgents[msg.sender] = true;
    }

    function name() public view override returns (string memory) { return _name; }
    function symbol() public view override returns (string memory) { return _symbol; }
    function decimals() public pure override returns (uint8) { return _decimals; }
    function totalSupply() public view override returns (uint256) { return _totalSupply; }
    function getOwner() public view override returns (address) { return owner; }
    function balanceOf(address account) public view override returns (uint256) { return _balances[account]; }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address _owner, address spender) public view override returns (uint256) {
        return _allowances[_owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "QAGENT: allowance exceeded");
        _approve(sender, msg.sender, currentAllowance - amount);
        _transfer(sender, recipient, amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "transfer from zero");
        require(recipient != address(0), "transfer to zero");
        require(_balances[sender] >= amount, "insufficient balance");

        uint256 burnAmount = 0;
        uint256 marketingAmount = 0;

        if (sender != owner && recipient != owner && sender != launchpadContract) {
            burnAmount = (amount * burnTaxBasisPoints) / 10000;
            marketingAmount = (amount * marketingTaxBasisPoints) / 10000;
        }

        uint256 sendAmount = amount - burnAmount - marketingAmount;
        _balances[sender] -= amount;
        _balances[recipient] += sendAmount;
        emit Transfer(sender, recipient, sendAmount);

        if (burnAmount > 0) {
            _totalSupply -= burnAmount;
            totalBurnedByQuantumEngine += burnAmount;
            emit Transfer(sender, address(0), burnAmount);
            emit QuantumBurnVortex(sender, burnAmount);
        }

        if (marketingAmount > 0) {
            _balances[marketingTreasury] += marketingAmount;
            emit Transfer(sender, marketingTreasury, marketingAmount);
        }
    }

    function _approve(address _owner, address spender, uint256 amount) internal {
        require(_owner != address(0), "approve from zero");
        require(spender != address(0), "approve to zero");
        _allowances[_owner][spender] = amount;
        emit Approval(_owner, spender, amount);
    }

    function strategicAgenticMint(address recipient, uint256 amount, string memory reason) external onlyAuthorizedAgentOrOwner returns (bool) {
        require(elasticMintingEnabled, "Elastic minting disabled");
        require(recipient != address(0), "zero recipient");
        _totalSupply += amount;
        totalMintedByAgents += amount;
        _balances[recipient] += amount;
        emit Transfer(address(0), recipient, amount);
        emit ElasticStrategicMint(recipient, amount, reason);
        return true;
    }

    function registerPqcIdentity(bytes32 pqcKeyHash) external {
        require(pqcKeyHash != bytes32(0), "Invalid PQC Hash");
        pqcPublicKeyHashes[msg.sender] = pqcKeyHash;
        emit PqcKeyRegistered(msg.sender, pqcKeyHash);
    }

    function triggerAutomatonEvolution(uint256 generation, uint256 burnUnits, address topAgentSurvivor, uint256 rewardUnits) external {
        require(msg.sender == conwayAutomatonContract || msg.sender == owner, "Automaton only");
        if (burnUnits > 0 && _balances[address(this)] >= burnUnits) {
            _balances[address(this)] -= burnUnits;
            _totalSupply -= burnUnits;
            totalBurnedByQuantumEngine += burnUnits;
            emit Transfer(address(this), address(0), burnUnits);
        }
        if (rewardUnits > 0 && topAgentSurvivor != address(0)) {
            _totalSupply += rewardUnits;
            _balances[topAgentSurvivor] += rewardUnits;
            emit Transfer(address(0), topAgentSurvivor, rewardUnits);
        }
        emit AutomatonEvolutionTrigger(generation, burnUnits, rewardUnits);
    }

    function setAuthorizedAgent(address agent, bool authorized, string memory modelType) external onlyOwner {
        authorizedAiAgents[agent] = authorized;
        emit AgentAuthorized(agent, modelType);
    }

    function setLaunchpadContract(address _launchpad) external onlyOwner {
        launchpadContract = _launchpad;
        authorizedAiAgents[_launchpad] = true;
    }

    function setConwayAutomatonContract(address _conway) external onlyOwner {
        conwayAutomatonContract = _conway;
    }

    function setMarketingTreasury(address _treasury) external onlyOwner {
        marketingTreasury = _treasury;
    }

    function setTaxRates(uint256 _burnBasisPoints, uint256 _marketingBasisPoints) external onlyOwner {
        require(_burnBasisPoints <= 500 && _marketingBasisPoints <= 500, "Tax too high");
        burnTaxBasisPoints = _burnBasisPoints;
        marketingTaxBasisPoints = _marketingBasisPoints;
    }

    function toggleElasticMinting(bool _enabled) external onlyOwner {
        elasticMintingEnabled = _enabled;
    }
}