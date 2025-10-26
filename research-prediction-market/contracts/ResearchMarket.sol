// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ResearchMarket
 * @dev Core contract for research prediction markets with Yellow SDK integration
 */
contract ResearchMarket is ReentrancyGuard, Ownable {
    
    // Market structure
    struct Market {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 yesPool;
        uint256 noPool;
        uint256 totalBets;
        uint256 resolutionDate;
        bool resolved;
        bool outcome; // true = YES, false = NO
        uint256 platformFeePercent; // Basis points (e.g., 500 = 5%)
        uint256 createdAt;
    }
    
    // Bet structure for tracking individual bets
    struct Bet {
        address user;
        uint256 amount;
        bool side; // true = YES, false = NO
        uint256 timestamp;
    }
    
    // State variables
    uint256 public nextMarketId = 1;
    uint256 public platformFeePercent = 500; // 5% default
    IERC20 public paymentToken; // USDC or other ERC20 token
    
    // Mappings
    mapping(uint256 => Market) public markets;
    mapping(uint256 => Bet[]) public marketBets;
    mapping(address => uint256[]) public userMarkets;
    mapping(address => mapping(uint256 => uint256)) public userYesBets;
    mapping(address => mapping(uint256 => uint256)) public userNoBets;
    
    // Events
    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string title,
        uint256 resolutionDate
    );
    
    event BetPlaced(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount,
        bool side
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        uint256 totalWinnings
    );
    
    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );
    
    constructor(address _paymentToken) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
    }
    
    /**
     * @dev Create a new research prediction market
     * @param title The research question title
     * @param description Detailed description of the research
     * @param resolutionDate Unix timestamp when market resolves
     */
    function createMarket(
        string memory title,
        string memory description,
        uint256 resolutionDate
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(resolutionDate > block.timestamp, "Resolution date must be in future");
        
        uint256 marketId = nextMarketId++;
        
        markets[marketId] = Market({
            id: marketId,
            title: title,
            description: description,
            creator: msg.sender,
            yesPool: 0,
            noPool: 0,
            totalBets: 0,
            resolutionDate: resolutionDate,
            resolved: false,
            outcome: false,
            platformFeePercent: platformFeePercent,
            createdAt: block.timestamp
        });
        
        userMarkets[msg.sender].push(marketId);
        
        emit MarketCreated(marketId, msg.sender, title, resolutionDate);
        
        return marketId;
    }
    
    /**
     * @dev Place a bet on a market (called by Yellow SDK session manager)
     * @param marketId The market to bet on
     * @param user The user placing the bet
     * @param amount The bet amount
     * @param side true for YES, false for NO
     */
    function placeBet(
        uint256 marketId,
        address user,
        uint256 amount,
        bool side
    ) external onlyOwner nonReentrant {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market does not exist");
        require(!market.resolved, "Market already resolved");
        require(block.timestamp < market.resolutionDate, "Market resolution date passed");
        require(amount > 0, "Bet amount must be positive");
        
        // Transfer tokens from Yellow session manager
        require(
            paymentToken.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        
        // Update market pools
        if (side) {
            market.yesPool += amount;
            userYesBets[user][marketId] += amount;
        } else {
            market.noPool += amount;
            userNoBets[user][marketId] += amount;
        }
        
        market.totalBets++;
        
        // Record the bet
        marketBets[marketId].push(Bet({
            user: user,
            amount: amount,
            side: side,
            timestamp: block.timestamp
        }));
        
        emit BetPlaced(marketId, user, amount, side);
    }
    
    /**
     * @dev Resolve a market with the outcome
     * @param marketId The market to resolve
     * @param outcome true for YES, false for NO
     */
    function resolveMarket(uint256 marketId, bool outcome) external {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market does not exist");
        require(!market.resolved, "Market already resolved");
        require(
            msg.sender == market.creator || msg.sender == owner(),
            "Only creator or owner can resolve"
        );
        require(
            block.timestamp >= market.resolutionDate,
            "Resolution date not reached"
        );
        
        market.resolved = true;
        market.outcome = outcome;
        
        uint256 totalWinnings = outcome ? market.noPool : market.yesPool;
        
        emit MarketResolved(marketId, outcome, totalWinnings);
    }
    
    /**
     * @dev Claim winnings for a resolved market
     * @param marketId The market to claim winnings from
     */
    function claimWinnings(uint256 marketId) external nonReentrant {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market does not exist");
        require(market.resolved, "Market not resolved");
        
        uint256 userBetAmount;
        uint256 totalPool;
        
        if (market.outcome) {
            // YES won
            userBetAmount = userYesBets[msg.sender][marketId];
            totalPool = market.yesPool;
        } else {
            // NO won
            userBetAmount = userNoBets[msg.sender][marketId];
            totalPool = market.noPool;
        }
        
        require(userBetAmount > 0, "No winning bets");
        
        // Calculate winnings (proportional share of losing pool minus platform fee)
        uint256 losingPool = market.outcome ? market.noPool : market.yesPool;
        uint256 platformFee = (losingPool * market.platformFeePercent) / 10000;
        uint256 netWinnings = losingPool - platformFee;
        
        uint256 userWinnings = (netWinnings * userBetAmount) / totalPool;
        uint256 totalPayout = userBetAmount + userWinnings;
        
        // Reset user bets to prevent double claiming
        if (market.outcome) {
            userYesBets[msg.sender][marketId] = 0;
        } else {
            userNoBets[msg.sender][marketId] = 0;
        }
        
        // Transfer winnings
        require(
            paymentToken.transfer(msg.sender, totalPayout),
            "Transfer failed"
        );
        
        emit WinningsClaimed(marketId, msg.sender, totalPayout);
    }
    
    /**
     * @dev Get market details
     * @param marketId The market ID
     * @return Market struct
     */
    function getMarket(uint256 marketId) external view returns (Market memory) {
        return markets[marketId];
    }
    
    /**
     * @dev Get current odds for a market
     * @param marketId The market ID
     * @return yesOdds Percentage for YES (in basis points)
     * @return noOdds Percentage for NO (in basis points)
     */
    function getOdds(uint256 marketId) external view returns (uint256 yesOdds, uint256 noOdds) {
        Market memory market = markets[marketId];
        uint256 totalPool = market.yesPool + market.noPool;
        
        if (totalPool == 0) {
            return (5000, 5000); // 50/50 if no bets
        }
        
        yesOdds = (market.yesPool * 10000) / totalPool;
        noOdds = (market.noPool * 10000) / totalPool;
    }
    
    /**
     * @dev Get user's bets for a market
     * @param marketId The market ID
     * @param user The user address
     * @return yesAmount Total YES bets
     * @return noAmount Total NO bets
     */
    function getUserBets(uint256 marketId, address user) external view returns (uint256 yesAmount, uint256 noAmount) {
        return (userYesBets[user][marketId], userNoBets[user][marketId]);
    }
    
    /**
     * @dev Update platform fee percentage (owner only)
     * @param newFeePercent New fee percentage in basis points
     */
    function setPlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = newFeePercent;
    }
    
    /**
     * @dev Withdraw platform fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        
        require(
            paymentToken.transfer(owner(), balance),
            "Transfer failed"
        );
    }
}
