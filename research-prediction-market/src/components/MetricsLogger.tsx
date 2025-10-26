"use client";

import { useEffect } from 'react';

interface MetricsLoggerProps {
  betsPlaced: number;
  totalVolume: number;
  gasSaved: number;
  timeSaved: number;
  sessionDuration: number;
}

export default function MetricsLogger({ 
  betsPlaced, 
  totalVolume, 
  gasSaved, 
  timeSaved, 
  sessionDuration 
}: MetricsLoggerProps) {
  useEffect(() => {
    // Log metrics to console
    console.log('🚀 ResearchBet Performance Metrics:');
    console.log('=====================================');
    console.log(`📊 Bets Placed: ${betsPlaced}`);
    console.log(`💰 Total Volume: $${totalVolume.toFixed(2)}`);
    console.log(`⛽ Gas Saved: $${gasSaved.toFixed(2)}`);
    console.log(`⏱️  Time Saved: ${timeSaved} seconds`);
    console.log(`🕐 Session Duration: ${sessionDuration} seconds`);
    console.log(`⚡ Avg Speed: ${(betsPlaced / sessionDuration).toFixed(2)} bets/second`);
    console.log(`💸 Cost per Bet: $0.00 (vs $1.50 traditional)`);
    console.log('=====================================');
    
    // Also log a comparison table
    console.table({
      'Traditional Blockchain': {
        'Gas Cost': `$${gasSaved.toFixed(2)}`,
        'Time per Bet': '12+ seconds',
        'Total Time': `${timeSaved} seconds`,
        'Cost per Bet': '$1.50'
      },
      'Our Technology': {
        'Gas Cost': '$0.00',
        'Time per Bet': 'Instant',
        'Total Time': '0 seconds',
        'Cost per Bet': '$0.00'
      }
    });
  }, [betsPlaced, totalVolume, gasSaved, timeSaved, sessionDuration]);

  return null; // This component doesn't render anything
}
