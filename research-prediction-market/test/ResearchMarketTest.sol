// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import { ResearchMarket } from "../contracts/ResearchMarket.sol";
import { YellowSessionManager } from "../contracts/YellowSessionManager.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ResearchMarketTest {
    ResearchMarket public researchMarket;
    YellowSessionManager public sessionManager;
    IERC20 public paymentToken;
    
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    
    function setUp() public {
        // Deploy mock ERC20 token
        // For testing, we'll use a mock token
        // In production, this would be USDC
        paymentToken = IERC20(address(0x123)); // Mock token address
        
        // Deploy ResearchMarket
        researchMarket = new ResearchMarket(address(paymentToken));
        
        // Deploy YellowSessionManager
        sessionManager = new YellowSessionManager(address(researchMarket), address(paymentToken));
    }
    
    function testMarketCreation() public {
        uint256 marketId = researchMarket.createMarket(
            "Will mRNA vaccines reduce symptoms by >50%?",
            "Testing mRNA vaccine effectiveness",
            block.timestamp + 86400 // 1 day from now
        );
        
        assert(marketId == 1);
        
        ResearchMarket.Market memory market = researchMarket.getMarket(marketId);
        assert(keccak256(abi.encodePacked(market.title)) == keccak256(abi.encodePacked("Will mRNA vaccines reduce symptoms by >50%?")));
        assert(market.creator == address(this));
    }
    
    function testGetOdds() public {
        uint256 marketId = researchMarket.createMarket(
            "Test Market",
            "Test Description",
            block.timestamp + 86400
        );
        
        (uint256 yesOdds, uint256 noOdds) = researchMarket.getOdds(marketId);
        
        // Initial odds should be 50/50
        assert(yesOdds == 5000);
        assert(noOdds == 5000);
    }
}
