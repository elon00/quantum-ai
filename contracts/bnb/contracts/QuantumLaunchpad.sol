// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./QuantumAgenticToken.sol";

contract QuantumLaunchpad {
    address public owner;
    QuantumAgenticToken public primaryNetworkToken;

    struct AgentToken {
        address tokenAddress;
        string name;
        string symbol;
        string aiModelType;
        string conwaySeed;
        address creator;
        uint256 targetFundingBnb;
        uint256 currentFundingBnb;
        uint256 tokensSold;
        bool graduatedToDEX;
        uint256 createdAt;
    }

    AgentToken[] public launchedTokens;
    mapping(address => uint256) public tokenIndex;
    mapping(address => uint256) public userBnbInvested;

    event TokenLaunched(address indexed tokenAddress, string name, string symbol, string aiModelType, address creator);
    event TokensPurchased(address indexed tokenAddress, address indexed buyer, uint256 bnbAmount, uint256 tokenAmount);
    event GraduatedToPancakeSwap(address indexed tokenAddress, uint256 totalLiquidityBnb);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _primaryToken) {
        owner = msg.sender;
        primaryNetworkToken = QuantumAgenticToken(_primaryToken);
    }

    function createAgentToken(
        string memory name,
        string memory symbol,
        string memory aiModelType,
        string memory conwaySeed,
        uint256 targetFundingBnb
    ) external returns (address) {
        QuantumAgenticToken newToken = new QuantumAgenticToken(owner, owner);
        address tokenAddr = address(newToken);

        launchedTokens.push(AgentToken({
            tokenAddress: tokenAddr,
            name: name,
            symbol: symbol,
            aiModelType: aiModelType,
            conwaySeed: conwaySeed,
            creator: msg.sender,
            targetFundingBnb: targetFundingBnb > 0 ? targetFundingBnb : 10 ether,
            currentFundingBnb: 0,
            tokensSold: 0,
            graduatedToDEX: false,
            createdAt: block.timestamp
        }));

        tokenIndex[tokenAddr] = launchedTokens.length - 1;
        emit TokenLaunched(tokenAddr, name, symbol, aiModelType, msg.sender);
        return tokenAddr;
    }

    function buyTokens(address tokenAddr) external payable {
        require(msg.value > 0, "Amount must be > 0");
        uint256 idx = tokenIndex[tokenAddr];
        AgentToken storage t = launchedTokens[idx];
        require(!t.graduatedToDEX, "Token already graduated to DEX");

        uint256 tokensToDeliver = (msg.value * 1_000_000 * 10**18) / 1 ether;

        t.currentFundingBnb += msg.value;
        t.tokensSold += tokensToDeliver;
        userBnbInvested[msg.sender] += msg.value;

        QuantumAgenticToken(tokenAddr).strategicAgenticMint(msg.sender, tokensToDeliver, "Bonding curve buy");
        emit TokensPurchased(tokenAddr, msg.sender, msg.value, tokensToDeliver);

        if (t.currentFundingBnb >= t.targetFundingBnb) {
            t.graduatedToDEX = true;
            emit GraduatedToPancakeSwap(tokenAddr, t.currentFundingBnb);
        }
    }

    function totalTokensLaunched() external view returns (uint256) {
        return launchedTokens.length;
    }

    function getLaunchedToken(uint256 index) external view returns (AgentToken memory) {
        require(index < launchedTokens.length, "Invalid index");
        return launchedTokens[index];
    }
}