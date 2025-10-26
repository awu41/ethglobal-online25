# ResearchBet - Prediction Market for Research

The first prediction market where you can place unlimited bets on research outcomes with zero gas fees and instant settlements using Yellow SDK.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask browser extension
- Hardhat (installed via `npx`)

### ⚠️ Important Note

**Hardhat 3.x has ESM compatibility issues with deployment scripts.** Use the console method below instead.

### Installation

```bash
# Install dependencies
npm install

# Start local blockchain (Terminal 1)
npx hardhat node

# Deploy contracts (Terminal 2)
npx hardhat run scripts/deploy.cjs --network localhost

# Set environment variables
cp .env.example .env.local
# Edit .env.local with contract addresses from deployment

# Start development server (Terminal 3)
npm run dev
```

Open http://localhost:3000 in your browser.

## 📖 Table of Contents

1. [Features](#features)
2. [Quick Testing Guide](#quick-testing-guide)
3. [Smart Contracts](#smart-contracts)
4. [Gas & Funds](#gas--funds)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## ✨ Features

- **Zero Gas Fees**: Place bets off-chain with Yellow SDK
- **Instant Bets**: No waiting for block confirmations
- **Market Creation**: Create research prediction markets
- **Real-time Odds**: Live odds tracking
- **Wallet Integration**: MetaMask support

## 🧪 Quick Testing Guide

### 1. Start Local Blockchain

```bash
# Terminal 1
npx hardhat node
```

You'll get 20 accounts with 10,000 ETH each. Copy the private key of Account #0.

### 2. Deploy Contracts

```bash
# Terminal 2
npx hardhat run scripts/deploy.cjs --network localhost
```

Copy the contract addresses from the output.

### 3. Configure Environment

Create `.env.local`:
```bash
NEXT_PUBLIC_RESEARCH_MARKET_ADDRESS=0x... # From deployment
NEXT_PUBLIC_YELLOW_SESSION_MANAGER_ADDRESS=0x... # From deployment
```

### 4. Start App

```bash
# Terminal 3
npm run dev
```

### 5. Configure MetaMask

1. **Add Network**:
   - Name: `Hardhat Local`
   - RPC: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Symbol: `ETH`

2. **Import Account**: Paste private key from Terminal 1
3. **Switch to Hardhat Local network**

### 6. Create Market

1. Go to http://localhost:3000
2. Click "Create Market"
3. Fill form and submit
4. Confirm in MetaMask
5. View your market!

## 📜 Smart Contracts

### ResearchMarket.sol

Main functions:
- `createMarket(title, description, resolutionDate)` - Create market
- `placeBet(marketId, user, amount, side)` - Place bet (onlyOwner)
- `resolveMarket(marketId, outcome)` - Resolve market
- `getMarket(marketId)` - Get market details
- `getOdds(marketId)` - Get current odds

### YellowSessionManager.sol

Manages off-chain betting sessions:
- `createSession(depositAmount)` - Create session
- `placeBet(user, marketId, amount, side)` - Bet off-chain
- `settleSession(user)` - Finalize on-chain

## 💰 Gas & Funds

### Localhost (FREE)

- **Cost**: $0
- **Gas**: Free test tokens
- **Accounts**: 20 pre-funded with 10,000 ETH each
- Import any account to MetaMask and start

### Sepolia Testnet (FREE)

- **Cost**: $0 (use faucets)
- **Gas**: ~0.001-0.005 ETH per transaction
- **Faucets**:
  - https://sepoliafaucet.com
  - https://www.infura.io/faucet/sepolia
  - 0.5 ETH = enough for 100+ operations

### Mainnet

- **Deploy**: $50-200
- **Create Market**: $2-8
- **Budget**: $200-750 for testing

**For development and testing, you can do everything for $0!**

## 🚢 Deployment

### Local Network

```bash
npx hardhat node
npx hardhat run scripts/deploy.cjs --network localhost
```

### Sepolia Testnet

```bash
# Set up .env with:
# SEPOLIA_URL=<your_rpc_url>
# PRIVATE_KEY=<your_key>
# USDC_ADDRESS=<usdc_address>

npx hardhat run scripts/deploy-sepolia.cjs --network sepolia
```

### Production Build

```bash
npm run build
npm start
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npx hardhat test

# Run with logs
npx hardhat test --logs
```

### Test Checklist

- [ ] Create market with valid data
- [ ] Validation errors work
- [ ] Wallet connection works
- [ ] Transactions succeed
- [ ] Markets appear in list
- [ ] Market details display correctly

### Manual Testing

1. **Form Validation**:
   - Try empty fields → Error
   - Try past date → Error
   - Valid data → Success

2. **Wallet**:
   - Not connected → Warning
   - Connected → Can submit

3. **Transactions**:
   - MetaMask popup appears
   - Transaction confirms
   - Market ID shows

## 🛠️ Troubleshooting

### "Contract address not set"

```bash
# Check .env.local exists
cat .env.local

# Restart dev server after updating
npm run dev
```

### "Transaction failed"

- Check MetaMask network (Hardhat Local)
- Check Hardhat node is running
- Increase gas limit to 500,000

### "Insufficient funds"

- Localhost: You should have 10,000 ETH
- Testnet: Get more from faucets
- Mainnet: Buy ETH

### Markets not showing

- Check browser console (F12)
- Verify contract address
- Refresh page
- Check network connection

### MetaMask not connecting

1. Reset account: Settings → Advanced → Reset
2. Clear cache
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## 📁 Project Structure

```
research-prediction-market/
├── contracts/              # Smart contracts
│   ├── ResearchMarket.sol
│   └── YellowSessionManager.sol
├── src/
│   ├── app/               # Next.js pages
│   │   ├── create/        # Market creation page
│   │   └── markets/       # Market listing pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Yellow SDK)
│   └── lib/               # Utilities & contract interaction
├── scripts/               # Deployment scripts
├── test/                  # Test files
└── hardhat.config.ts      # Hardhat configuration
```

## 🔧 Environment Variables

### Required

```bash
NEXT_PUBLIC_RESEARCH_MARKET_ADDRESS=<contract_address>
NEXT_PUBLIC_YELLOW_SESSION_MANAGER_ADDRESS=<contract_address>
```

### Optional (for deployment)

```bash
SEPOLIA_URL=<rpc_url>
PRIVATE_KEY=<private_key>
USDC_ADDRESS=<usdc_address>
```

## 📚 Smart Contract Interface

### Create Market

```typescript
const marketId = await createMarket(signer, {
  title: "Will AI achieve AGI by 2030?",
  description: "Testing artificial general intelligence",
  resolutionDate: new Date("2026-12-31")
});
```

### Get Market

```typescript
const market = await getMarket(provider, 1);
```

### Get Odds

```typescript
const [yesOdds, noOdds] = await contract.getOdds(1);
```

## 🔒 Security Notes

1. **Never commit private keys** to version control
2. **Always use environment variables** for sensitive data
3. **Test on testnets** before mainnet
4. **Verify contracts** on block explorers
5. **Use hardware wallets** for production

## 📊 Cost Breakdown

| Operation | Localhost | Sepolia | Mainnet |
|-----------|-----------|---------|---------|
| Deploy | Free | ~$0.10 | ~$50-200 |
| Create Market | Free | ~$0.001 | ~$2-8 |
| Place Bet | Free | Free* | Free* |
| Resolve | Free | ~$0.001 | ~$2-8 |

*Bets are off-chain via Yellow SDK (gasless)

## 🎯 Recommended Workflow

1. **Develop**: Test on localhost (free, instant)
2. **Test**: Deploy to Sepolia (free faucet ETH)
3. **Deploy**: Production mainnet (real money)

## 📖 Additional Resources

- **Gas Tracker**: https://etherscan.io/gastracker
- **Sepolia Faucet**: https://sepoliafaucet.com
- **Hardhat Docs**: https://hardhat.org/docs
- **Yellow SDK**: https://yellow.org

## 🐛 Common Issues

### Transaction Reverted

**Cause**: Gas limit too low
**Fix**: Increase to 500,000 gas in MetaMask

### Contract Not Found

**Cause**: Wrong network or address
**Fix**: Check `.env.local` and network selection

### MetaMask Popup Not Showing

**Cause**: Popup blocked
**Fix**: Allow popups for localhost:3000

## 💡 Tips

- Always test locally first (free, instant)
- Use Sepolia for integration testing
- Monitor gas prices before mainnet
- Start with small amounts on mainnet
- Keep private keys secure

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📝 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

- Yellow Network for gasless transactions
- Hardhat for development tools
- OpenZeppelin for smart contract libraries

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues
- Review documentation

## 🎉 Getting Started Checklist

- [ ] Node.js 18+ installed
- [ ] MetaMask installed
- [ ] Cloned repository
- [ ] Ran `npm install`
- [ ] Started Hardhat node
- [ ] Deployed contracts
- [ ] Set up `.env.local`
- [ ] Configured MetaMask
- [ ] Created first market!

**Happy betting! 🚀**
