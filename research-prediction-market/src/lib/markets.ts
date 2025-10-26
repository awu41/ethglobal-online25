import { ethers } from 'ethers';
import { getResearchMarketContract } from './contract';

export interface MarketData {
  id: string;
  title: string;
  description: string;
  category: string;
  yesOdds: number;
  noOdds: number;
  totalBets: number;
  totalVolume: number;
  participants: number;
  resolutionDate: string;
  status: string;
  creator: string;
}

/**
 * Fetch all markets from the smart contract
 */
export async function fetchMarkets(
  provider: ethers.Provider
): Promise<MarketData[]> {
  try {
    const contract = getResearchMarketContract(provider);
    
    // Get the next market ID to know how many markets exist
    const nextMarketId = await contract.nextMarketId();
    const totalMarkets = Number(nextMarketId) - 1;
    
    if (totalMarkets === 0) {
      return [];
    }
    
    // Fetch all markets
    const marketPromises = [];
    for (let i = 1; i <= totalMarkets; i++) {
      marketPromises.push(contract.getMarket(i));
    }
    
    const markets = await Promise.all(marketPromises);
    
    // Get odds for each market
    const oddsPromises = [];
    for (let i = 1; i <= totalMarkets; i++) {
      oddsPromises.push(contract.getOdds(i));
    }
    
    const oddsArray = await Promise.all(oddsPromises);
    
    // Transform to MarketData format
    return markets.map((market, index) => {
      const [yesOdds, noOdds] = oddsArray[index];
      const resolutionDate = new Date(Number(market.resolutionDate) * 1000);
      const now = new Date();
      
      return {
        id: market.id.toString(),
        title: market.title,
        description: market.description,
        category: "Other", // Default category - smart contract doesn't store this
        yesOdds: Number(yesOdds) / 100, // Convert from basis points to percentage
        noOdds: Number(noOdds) / 100,
        totalBets: Number(market.totalBets),
        totalVolume: (Number(market.yesPool) + Number(market.noPool)) / 1e6, // Assuming USDC with 6 decimals
        participants: 0, // Not stored in contract
        resolutionDate: resolutionDate.toISOString().split('T')[0],
        status: market.resolved ? 'resolved' : (resolutionDate < now ? 'pending' : 'active'),
        creator: market.creator,
      };
    }).reverse(); // Most recent first
  } catch (error) {
    console.error('Error fetching markets:', error);
    return [];
  }
}

/**
 * Fetch a single market by ID
 */
export async function fetchMarket(
  provider: ethers.Provider,
  marketId: number
): Promise<MarketData | null> {
  try {
    const contract = getResearchMarketContract(provider);
    const market = await contract.getMarket(marketId);
    const [yesOdds, noOdds] = await contract.getOdds(marketId);
    
    const resolutionDate = new Date(Number(market.resolutionDate) * 1000);
    const now = new Date();
    
    return {
      id: market.id.toString(),
      title: market.title,
      description: market.description,
      category: "Other",
      yesOdds: Number(yesOdds) / 100,
      noOdds: Number(noOdds) / 100,
      totalBets: Number(market.totalBets),
      totalVolume: (Number(market.yesPool) + Number(market.noPool)) / 1e6,
      participants: 0,
      resolutionDate: resolutionDate.toISOString().split('T')[0],
      status: market.resolved ? 'resolved' : (resolutionDate < now ? 'pending' : 'active'),
      creator: market.creator,
    };
  } catch (error) {
    console.error('Error fetching market:', error);
    return null;
  }
}
