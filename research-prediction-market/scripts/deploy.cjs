const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Research Prediction Market deployment...");

  // Get the contract factory
  const ResearchMarket = await ethers.getContractFactory("ResearchMarket");
  const YellowSessionManager = await ethers.getContractFactory("YellowSessionManager");

  // For testing, we'll use a mock USDC address
  const mockUSDC = "0x1234567890123456789012345678901234567890";

  console.log("📝 Deploying ResearchMarket contract...");
  const researchMarket = await ResearchMarket.deploy(mockUSDC);
  await researchMarket.waitForDeployment();

  const researchMarketAddress = await researchMarket.getAddress();
  console.log("✅ ResearchMarket deployed to:", researchMarketAddress);

  console.log("📝 Deploying YellowSessionManager contract...");
  const sessionManager = await YellowSessionManager.deploy(researchMarketAddress, mockUSDC);
  await sessionManager.waitForDeployment();

  const sessionManagerAddress = await sessionManager.getAddress();
  console.log("✅ YellowSessionManager deployed to:", sessionManagerAddress);

  // Test creating a market
  console.log("🧪 Testing market creation...");
  const tx = await researchMarket.createMarket(
    "Will mRNA vaccines reduce symptoms by >50%?",
    "Testing mRNA vaccine effectiveness in clinical trials",
    Math.floor(Date.now() / 1000) + 86400
  );
  await tx.wait();

  const marketId = 1;
  const market = await researchMarket.getMarket(marketId);
  console.log("✅ Market created:", market.title);

  const [yesOdds, noOdds] = await researchMarket.getOdds(marketId);
  console.log("📊 Initial odds - YES:", yesOdds.toString(), "NO:", noOdds.toString());

  console.log("🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("ResearchMarket:", researchMarketAddress);
  console.log("YellowSessionManager:", sessionManagerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
