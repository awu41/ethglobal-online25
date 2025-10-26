// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ResearchMarket.sol";

/**
 * @title YellowSessionManager
 * @dev Manages Yellow SDK sessions and batch settlements for research prediction markets
 */
contract YellowSessionManager is ReentrancyGuard, Ownable {
    
    // Session structure
    struct Session {
        address user;
        uint256 depositAmount;
        uint256 remainingBalance;
        uint256 createdAt;
        uint256 expiresAt;
        bool active;
        bool settled;
    }
    
    // Settlement batch structure
    struct SettlementBatch {
        uint256 marketId;
        address[] users;
        uint256[] amounts;
        bool[] sides;
        uint256 totalAmount;
        bool processed;
    }
    
    // State variables
    ResearchMarket public researchMarket;
    IERC20 public paymentToken;
    uint256 public sessionDuration = 3600; // 1 hour default
    uint256 public minDeposit = 10 * 10**6; // 10 USDC (assuming 6 decimals)
    
    // Mappings
    mapping(address => Session) public sessions;
    mapping(address => uint256[]) public userBets;
    mapping(uint256 => SettlementBatch) public settlementBatches;
    uint256 public nextBatchId = 1;
    
    // Events
    event SessionCreated(
        address indexed user,
        uint256 depositAmount,
        uint256 expiresAt
    );
    
    event BetPlaced(
        address indexed user,
        uint256 indexed marketId,
        uint256 amount,
        bool side,
        uint256 remainingBalance
    );
    
    event SessionSettled(
        address indexed user,
        uint256 totalBets,
        uint256 totalWinnings,
        uint256 batchId
    );
    
    event SettlementBatchProcessed(
        uint256 indexed batchId,
        uint256 totalAmount,
        uint256 userCount
    );
    
    constructor(address _researchMarket, address _paymentToken) Ownable(msg.sender) {
        researchMarket = ResearchMarket(_researchMarket);
        paymentToken = IERC20(_paymentToken);
    }
    
    /**
     * @dev Create a new Yellow session for a user
     * @param depositAmount Amount to deposit for the session
     */
    function createSession(uint256 depositAmount) external nonReentrant {
        require(depositAmount >= minDeposit, "Deposit too small");
        require(!sessions[msg.sender].active, "Session already active");
        
        // Transfer tokens from user
        require(
            paymentToken.transferFrom(msg.sender, address(this), depositAmount),
            "Token transfer failed"
        );
        
        sessions[msg.sender] = Session({
            user: msg.sender,
            depositAmount: depositAmount,
            remainingBalance: depositAmount,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + sessionDuration,
            active: true,
            settled: false
        });
        
        emit SessionCreated(msg.sender, depositAmount, block.timestamp + sessionDuration);
    }
    
    /**
     * @dev Place a bet using session balance (called by Yellow SDK)
     * @param user The user placing the bet
     * @param marketId The market to bet on
     * @param amount The bet amount
     * @param side true for YES, false for NO
     */
    function placeBet(
        address user,
        uint256 marketId,
        uint256 amount,
        bool side
    ) external onlyOwner {
        Session storage session = sessions[user];
        require(session.active, "No active session");
        require(!session.settled, "Session already settled");
        require(block.timestamp <= session.expiresAt, "Session expired");
        require(amount <= session.remainingBalance, "Insufficient balance");
        require(amount > 0, "Amount must be positive");
        
        // Update session balance
        session.remainingBalance -= amount;
        
        // Record the bet
        userBets[user].push(marketId);
        
        // Place bet in research market
        researchMarket.placeBet(marketId, user, amount, side);
        
        emit BetPlaced(user, marketId, amount, side, session.remainingBalance);
    }
    
    /**
     * @dev Settle a user's session and process all bets
     * @param user The user to settle
     */
    function settleSession(address user) external nonReentrant {
        Session storage session = sessions[user];
        require(session.active, "No active session");
        require(!session.settled, "Session already settled");
        require(
            msg.sender == user || msg.sender == owner(),
            "Only user or owner can settle"
        );
        
        // Create settlement batch
        uint256 batchId = nextBatchId++;
        SettlementBatch storage batch = settlementBatches[batchId];
        
        // Process all user bets
        uint256 totalBets = userBets[user].length;
        uint256 totalWinnings = 0;
        
        for (uint256 i = 0; i < totalBets; i++) {
            uint256 marketId = userBets[user][i];
            
            // Check if market is resolved and user has winnings
            (bool resolved, bool outcome) = getMarketResolution(marketId);
            if (resolved) {
                uint256 winnings = calculateWinnings(user, marketId, outcome);
                if (winnings > 0) {
                    totalWinnings += winnings;
                }
            }
        }
        
        // Mark session as settled
        session.settled = true;
        session.active = false;
        
        // Calculate total payout
        uint256 totalPayout = session.remainingBalance + totalWinnings;
        
        // Transfer remaining balance + winnings to user
        if (totalPayout > 0) {
            require(
                paymentToken.transfer(user, totalPayout),
                "Transfer failed"
            );
        }
        
        emit SessionSettled(user, totalBets, totalWinnings, batchId);
    }
    
    /**
     * @dev Process a settlement batch (called by research market)
     * @param batchId The batch to process
     */
    function processSettlementBatch(uint256 batchId) external onlyOwner {
        SettlementBatch storage batch = settlementBatches[batchId];
        require(!batch.processed, "Batch already processed");
        
        batch.processed = true;
        
        emit SettlementBatchProcessed(batchId, batch.totalAmount, batch.users.length);
    }
    
    /**
     * @dev Get session information for a user
     * @param user The user address
     * @return Session struct
     */
    function getSession(address user) external view returns (Session memory) {
        return sessions[user];
    }
    
    /**
     * @dev Get user's bet history
     * @param user The user address
     * @return Array of market IDs
     */
    function getUserBets(address user) external view returns (uint256[] memory) {
        return userBets[user];
    }
    
    /**
     * @dev Check if user has active session
     * @param user The user address
     * @return true if active session exists
     */
    function hasActiveSession(address user) external view returns (bool) {
        Session memory session = sessions[user];
        return session.active && !session.settled && block.timestamp <= session.expiresAt;
    }
    
    /**
     * @dev Get session balance for a user
     * @param user The user address
     * @return Remaining balance
     */
    function getSessionBalance(address user) external view returns (uint256) {
        Session memory session = sessions[user];
        if (!session.active || session.settled || block.timestamp > session.expiresAt) {
            return 0;
        }
        return session.remainingBalance;
    }
    
    /**
     * @dev Calculate winnings for a user on a specific market
     * @param user The user address
     * @param marketId The market ID
     * @param outcome The market outcome
     * @return Winnings amount
     */
    function calculateWinnings(
        address user,
        uint256 marketId,
        bool outcome
    ) internal view returns (uint256) {
        (uint256 yesBets, uint256 noBets) = researchMarket.getUserBets(marketId, user);
        
        if (outcome && yesBets > 0) {
            // YES won, calculate winnings from NO pool
            return yesBets; // Simplified - actual calculation would be more complex
        } else if (!outcome && noBets > 0) {
            // NO won, calculate winnings from YES pool
            return noBets; // Simplified - actual calculation would be more complex
        }
        
        return 0;
    }
    
    /**
     * @dev Get market resolution status
     * @param marketId The market ID
     * @return resolved Whether market is resolved
     * @return outcome The market outcome
     */
    function getMarketResolution(uint256 marketId) internal view returns (bool resolved, bool outcome) {
        ResearchMarket.Market memory market = researchMarket.getMarket(marketId);
        return (market.resolved, market.outcome);
    }
    
    /**
     * @dev Update session duration (owner only)
     * @param newDuration New duration in seconds
     */
    function setSessionDuration(uint256 newDuration) external onlyOwner {
        require(newDuration > 0, "Duration must be positive");
        sessionDuration = newDuration;
    }
    
    /**
     * @dev Update minimum deposit (owner only)
     * @param newMinDeposit New minimum deposit amount
     */
    function setMinDeposit(uint256 newMinDeposit) external onlyOwner {
        minDeposit = newMinDeposit;
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        
        require(
            paymentToken.transfer(owner(), balance),
            "Transfer failed"
        );
    }
}
