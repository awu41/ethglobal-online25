async function main() {
  // Import the ethers plugin explicitly
  const hardhat = await import("hardhat");
  const hre = hardhat.default;
  
  console.log("HRE keys:", Object.keys(hre));
  console.log("Checking for ethers plugin...");
  
  // Try to access ethers
  const ethers = hre.ethers;
  console.log("Ethers:", ethers ? "found" : "not found");
  
  // If ethers is not found, it means the plugin is not loaded
  // For Hardhat 3.x, we need to use the hardhat-ethers plugin
  // Let's try importing it directly
  
  console.log("🚀 Starting Research Prediction Market deployment...");
  
  // Get the contract factory - try different approaches
  let ResearchMarket, YellowSessionManager;
  
  if (ethers) {
    ResearchMarket = await ethers.getContractFactory("ResearchMarket");
    YellowSessionManager = await ethers.getContractFactory("YellowSessionManager");
  } else {
    console.error("❌ Ethers plugin not found. Check hardhat.config.ts for plugin configuration.");
    process.exit(1);
  }

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
