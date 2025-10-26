"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useYellow } from '@/contexts/YellowContext';
import { Zap, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface BettingInterfaceProps {
  marketId: string;
  marketTitle: string;
  yesOdds: number;
  noOdds: number;
  totalVolume: number;
  totalBets: number;
}

export const BettingInterface: React.FC<BettingInterfaceProps> = ({
  marketId,
  marketTitle,
  yesOdds,
  noOdds,
  totalVolume,
  totalBets,
}) => {
  const { session, sessionBalance, placeBet, betsPlaced } = useYellow();
  const [betAmount, setBetAmount] = useState('5');
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [lastBetResult, setLastBetResult] = useState<string | null>(null);

  const handlePlaceBet = async (side: boolean) => {
    if (!session) {
      alert('Please create a Yellow session first');
      return;
    }

    const amount = parseFloat(betAmount) * 1000000; // Convert to USDC units
    if (amount > sessionBalance) {
      alert('Insufficient session balance');
      return;
    }

    try {
      setIsPlacingBet(true);
      await placeBet(marketId, amount, side);
      
      const sideText = side ? 'YES' : 'NO';
      setLastBetResult(`✅ Bet $${betAmount} on ${sideText} placed instantly!`);
      
      // Clear result after 3 seconds
      setTimeout(() => setLastBetResult(null), 3000);
      
    } catch (error) {
      console.error('Bet placement failed:', error);
      setLastBetResult('❌ Bet placement failed');
      setTimeout(() => setLastBetResult(null), 3000);
    } finally {
      setIsPlacingBet(false);
    }
  };

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Place Your Bet</CardTitle>
          <CardDescription>
            Create a Yellow session to start betting instantly with zero gas fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            Connect wallet and create session to bet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Market Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{marketTitle}</CardTitle>
          <CardDescription>
            Current odds and market statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{yesOdds}%</div>
              <div className="text-sm text-gray-500">YES</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{noOdds}%</div>
              <div className="text-sm text-gray-500">NO</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${yesOdds}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>{totalBets} bets</span>
            <span>${totalVolume.toFixed(2)} volume</span>
          </div>
        </CardContent>
      </Card>

      {/* Betting Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Instant Betting
          </CardTitle>
          <CardDescription>
            Place bets instantly with zero gas fees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bet Amount Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Bet Amount (USDC)
            </label>
            <Input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="5"
              min="1"
              max={(sessionBalance / 1000000).toFixed(2)}
              step="1"
            />
            <div className="text-xs text-gray-500 mt-1">
              Available: ${(sessionBalance / 1000000).toFixed(2)}
            </div>
          </div>

          {/* Bet Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handlePlaceBet(true)}
              disabled={isPlacingBet || parseFloat(betAmount) > sessionBalance / 1000000}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {isPlacingBet ? 'Placing...' : `Bet YES $${betAmount}`}
            </Button>
            <Button
              onClick={() => handlePlaceBet(false)}
              disabled={isPlacingBet || parseFloat(betAmount) > sessionBalance / 1000000}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              {isPlacingBet ? 'Placing...' : `Bet NO $${betAmount}`}
            </Button>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2">
            {['1', '5', '10', '25'].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setBetAmount(amount)}
                className="flex-1"
              >
                ${amount}
              </Button>
            ))}
          </div>

          {/* Result Message */}
          {lastBetResult && (
            <div className={`text-center p-3 rounded-lg ${
              lastBetResult.includes('✅') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {lastBetResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Session Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-blue-600">{betsPlaced}</div>
              <div className="text-sm text-gray-500">Bets Placed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">$0.00</div>
              <div className="text-sm text-gray-500">Gas Fees</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">Instant</div>
              <div className="text-sm text-gray-500">Speed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
