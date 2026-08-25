const hre = require("hardhat");

async function main() {
  console.log("=== Deploying Quantum Agentic Token on BNB Testnet ===");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer ? deployer.address : "Default Local");

  const Token = await hre.ethers.getContractFactory("QuantumAgenticToken");
  const token = await Token.deploy(
    deployer ? deployer.address : "0x0000000000000000000000000000000000000001",
    deployer ? deployer.address : "0x0000000000000000000000000000000000000001"
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token Address:", tokenAddress);

  const Launchpad = await hre.ethers.getContractFactory("QuantumLaunchpad");
  const launchpad = await Launchpad.deploy(tokenAddress);
  await launchpad.waitForDeployment();
  const launchpadAddress = await launchpad.getAddress();
  console.log("Launchpad Address:", launchpadAddress);

  await (await token.setLaunchpadContract(launchpadAddress)).wait();
  console.log("Launchpad set as authorized minter!");
}

main().catch(console.error);