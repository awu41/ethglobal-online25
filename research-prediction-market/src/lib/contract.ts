import { ethers } from 'ethers';

// Contract ABI - minimal interface for createMarket function
const RESEARCH_MARKET_ABI = [
  "function createMarket(string memory title, string memory description, uint256 resolutionDate) external returns (uint256)",
  "function getMarket(uint256 marketId) external view returns (tuple(uint256 id, string title, string description, address creator, uint256 yesPool, uint256 noPool, uint256 totalBets, uint256 resolutionDate, bool resolved, bool outcome, uint256 platformFeePercent, uint256 createdAt))",
  "function nextMarketId() external view returns (uint256)",
  "event MarketCreated(uint256 indexed marketId, address indexed creator, string title, uint256 resolutionDate)"
];

// These would be the actual deployed addresses on your network
// For now using placeholder addresses
export const CONTRACT_ADDRESSES = {
  RESEARCH_MARKET: process.env.NEXT_PUBLIC_RESEARCH_MARKET_ADDRESS || '0x0000000000000000000000000000000000000000',
  YELLOW_SESSION_MANAGER: process.env.NEXT_PUBLIC_YELLOW_SESSION_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000',
};

export interface MarketCreationParams {
  title: string;
  description: string;
  resolutionDate: Date;
}

export interface Market {
  id: number;
  title: string;
  description: string;
  creator: string;
  yesPool: string;
  noPool: string;
  totalBets: number;
  resolutionDate: Date;
  resolved: boolean;
  outcome: boolean;
  platformFeePercent: number;
  createdAt: Date;
}

/**
 * Get the ResearchMarket contract instance
 */
export function getResearchMarketContract(signerOrProvider: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.RESEARCH_MARKET,
    RESEARCH_MARKET_ABI,
    signerOrProvider
  );
}

/**
 * Create a new market on the smart contract
 */
export async function createMarket(
  signer: ethers.Signer,
  params: MarketCreationParams
): Promise<number> {
  try {
    const contract = getResearchMarketContract(signer);
    
    // Convert resolution date to Unix timestamp
    const resolutionTimestamp = Math.floor(params.resolutionDate.getTime() / 1000);
    
    // Call the contract
    const tx = await contract.createMarket(
      params.title,
      params.description,
      resolutionTimestamp
    );
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    // Extract market ID from event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'MarketCreated';
      } catch (e) {
        return false;
      }
    });
    
    if (event) {
      const parsed = contract.interface.parseLog(event);
      return Number(parsed?.args.marketId) || 0;
    }
    
    // Fallback: query nextMarketId
    const nextId = await contract.nextMarketId();
    return Number(nextId) - 1;
    
  } catch (error) {
    console.error('Error creating market:', error);
    throw new Error('Failed to create market on blockchain');
  }
}

/**
 * Get market details from the smart contract
 */
export async function getMarket(
  provider: ethers.Provider,
  marketId: number
): Promise<Market | null> {
  try {
    const contract = getResearchMarketContract(provider);
    const marketData = await contract.getMarket(marketId);
    
    return {
      id: Number(marketData.id),
      title: marketData.title,
      description: marketData.description,
      creator: marketData.creator,
      yesPool: marketData.yesPool.toString(),
      noPool: marketData.noPool.toString(),
      totalBets: Number(marketData.totalBets),
      resolutionDate: new Date(Number(marketData.resolutionDate) * 1000),
      resolved: marketData.resolved,
      outcome: marketData.outcome,
      platformFeePercent: Number(marketData.platformFeePercent),
      createdAt: new Date(Number(marketData.createdAt) * 1000),
    };
  } catch (error) {
    console.error('Error fetching market:', error);
    return null;
  }
}

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Get MetaMask provider
 */
export function getMetaMaskProvider(): ethers.BrowserProvider | null {
  if (!isMetaMaskInstalled()) {
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
}

/**
 * Request account access
 */
export async function requestAccounts(): Promise<string[]> {
  if (!isMetaMaskInstalled()) {
    throw new Error('Please install MetaMask');
  }
  
  return await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
}
