## Short Description

Gasless prediction markets for research with Yellow SDK state channels. Bet on research outcomes with zero fees.

## Description

ResearchBet is a decentralized prediction market platform that combines on-chain verification with off-chain betting using Yellow SDK's state channels. It enables users to create markets around scientific research questions and place unlimited bets with zero gas fees.

**The Problem**: Traditional prediction markets have high gas costs that make frequent betting economically unfeasible. Research institutions need a way to create low-cost markets for research outcomes while maintaining blockchain security.

**The Solution**: By leveraging Yellow SDK's state channels (Nitrolite protocol), ResearchBet allows users to:
- Create research prediction markets on-chain (one-time gas cost)
- Place unlimited off-chain bets with instant settlements (zero gas)
- Settle final outcomes on-chain for permanent record
- Maintain full transparency and provability through blockchain verification

**Use Cases**:
- Pharmaceutical companies creating markets for clinical trial outcomes
- Academic institutions betting on research publication success
- Investors hedging on research project completion
- Public markets for scientific consensus on controversial topics

The platform uses a dual-contract architecture: `ResearchMarket.sol` for market creation and resolution, and `YellowSessionManager.sol` for off-chain session management. Users deposit USDC once, create a state channel session, place multiple bets without gas costs, and settle everything on-chain when the market resolves.

## How It's Made

**Smart Contracts (Solidity)**:
- `ResearchMarket.sol`: Core market logic with ERC7824-compatible interfaces for Yellow SDK integration. Handles market creation, bet placement, resolution, and winner claiming with automatic fee distribution.
- `YellowSessionManager.sol`: Manages state channel sessions using Yellow's Nitrolite protocol (ERC7824 standard). Handles deposits, withdrawals, and off-chain bet settlements.

**Frontend (Next.js 16, React 19, TypeScript)**:
- Server-side rendered pages for optimal performance
- MetaMask integration for wallet connectivity
- Real-time odds calculation and display
- Form validation with TypeScript for type safety
- Responsive UI using Radix UI components and Tailwind CSS

**State Channel Integration (Yellow SDK)**:
- Integrated Yellow SDK's Nitrolite protocol for gasless betting
- Session creation and management for off-chain interactions
- Deposit/withdrawal mechanisms for channel management
- Off-chain bet placement with on-chain settlement

**Development Stack**:
- Hardhat 3.x for smart contract compilation and testing
- Ethers.js v6 for blockchain interactions
- Hardhat EDR for local blockchain simulation
- TypeScript for type-safe development

**Technical Highlights**:
1. **Gasless Betting**: All individual bets happen off-chain via state channels, with only the initial deposit requiring gas. This reduces costs by 99%+ compared to traditional markets.
2. **Real-time Odds**: Dynamic odds calculation based on pool ratios, updated instantly as bets are placed.
3. **Automated Settlements**: Winners can claim their share of the pool plus their original bet, with automatic fee distribution to the platform.
4. **ERC7824 Compliance**: Full compatibility with Yellow's Nitrolite protocol for seamless state channel integration.

**Hacky Bits**:
- Worked around Hardhat 3.x ESM compatibility issues by using console-based deployment
- Created dual-architecture for on-chain resolution + off-chain betting
- Implemented custom odds calculation to provide meaningful probability estimates even with zero bets

The project demonstrates how state channels can democratize access to prediction markets by eliminating the transaction costs barrier, making research outcome betting accessible to a broader audience.
