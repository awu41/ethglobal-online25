# Deployment Instructions - ResearchBet

## Step-by-Step Guide

### 1️⃣ Start Hardhat Node

Open **Terminal 1**:
```bash
cd research-prediction-market
npx hardhat node
```

You should see:
```
Started HTTP and WebSocket server on http://127.0.0.1:8545/
Account #0: 0xf39Fd... (10000 ETH)
...
```

**Keep this terminal running!**

### 2️⃣ Deploy Contracts via Console

Open **Terminal 2** (new terminal):
```bash
cd research-prediction-market
npx hardhat console --network localhost
```

Wait for the console to load, then copy and paste this entire script:

```javascript
const ResearchMarket = await ethers.getContractFactory("ResearchMarket");
const YellowSessionManager = await ethers.getContractFactory("YellowSessionManager");

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

console.log("\n📋 Contract Addresses:");
console.log("ResearchMarket:", researchMarketAddress);
console.log("YellowSessionManager:", sessionManagerAddress);
```

Copy the contract addresses from the output!

### 3️⃣ Create Environment File

In the project root, create `.env.local`:

```bash
NEXT_PUBLIC_RESEARCH_MARKET_ADDRESS=<paste_research_market_address>
NEXT_PUBLIC_YELLOW_SESSION_MANAGER_ADDRESS=<paste_session_manager_address>
```

Example:
```bash
NEXT_PUBLIC_RESEARCH_MARKET_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_YELLOW_SESSION_MANAGER_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### 4️⃣ Configure MetaMask

1. **Add Network**:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Account**:
   - Import account with private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - You'll see 10000 ETH!

### 5️⃣ Start Development Server

Open **Terminal 3** (new terminal):
```bash
cd research-prediction-market
npm run dev
```

Open http://localhost:3000 in your browser.

### 6️⃣ Test Market Creation!

1. Connect your wallet in MetaMask
2. Click "Create Market"
3. Fill out the form:
   - Title: `Will AI achieve AGI by 2030?`
   - Description: `Testing artificial general intelligence timeline`
   - Category: Select "AI"
   - Resolution Date: `2026-12-31`
4. Click "Create Market"
5. Confirm in MetaMask
6. See your market appear!

## Quick Reference

| Terminal | Command | Purpose |
|----------|---------|---------|
| 1 | `npx hardhat node` | Blockchain server |
| 2 | `npx hardhat console --network localhost` | Deploy contracts |
| 3 | `npm run dev` | Start web app |

## What You'll See

After deployment:
- ✅ Contracts deployed successfully
- ✅ Test market created (Market ID: 1)
- ✅ Contract addresses displayed
- ✅ Ready to create more markets via UI

After starting the app:
- ✅ Homepage loads at localhost:3000
- ✅ Can connect MetaMask
- ✅ Can navigate to "Create Market"
- ✅ Form works with validation
- ✅ Transaction executes successfully
- ✅ Market appears in markets list

## Need Help?

Check `TESTING_ISSUES.md` for troubleshooting tips.
