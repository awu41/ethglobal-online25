"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useYellow } from '@/contexts/YellowContext';
import { Wallet, Zap, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export const WalletConnect: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    userAddress,
    session,
    sessionBalance,
    connectWallet,
    createSession,
    settleSession,
    betsPlaced,
    totalVolume,
    gasSaved,
    timeSaved,
  } = useYellow();

  const [depositAmount, setDepositAmount] = useState('50');
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConnect = async () => {
    setConnectionError(null);
    try {
      await connectWallet();
    } catch (error: any) {
      console.error('Connection failed:', error);
      setConnectionError(error.message || 'Failed to connect wallet');
    }
  };

  const handleCreateSession = async () => {
    try {
      setIsCreatingSession(true);
      const amount = parseFloat(depositAmount) * 1000000; // Convert to USDC units (6 decimals)
      await createSession(amount);
    } catch (error) {
      console.error('Session creation failed:', error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSettleSession = async () => {
    try {
      await settleSession();
    } catch (error) {
      console.error('Settlement failed:', error);
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Wallet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to start betting on research with zero gas fees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
          
          {connectionError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {connectionError}
            </div>
          )}
          
          <div className="text-xs text-gray-500 text-center">
            Make sure you have MetaMask installed in your browser
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <CardTitle>Create Yellow Session</CardTitle>
          <CardDescription>
            Deposit funds to start placing instant bets with zero gas fees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Deposit Amount (USDC)
            </label>
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="50"
              min="10"
              max="1000"
            />
          </div>
          <Button 
            onClick={handleCreateSession} 
            disabled={isCreatingSession}
            className="w-full"
            size="lg"
          >
            {isCreatingSession ? 'Creating Session...' : 'Create Session'}
          </Button>
          <div className="text-xs text-gray-500 text-center">
            Connected: {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Yellow Session Active
          </CardTitle>
          <CardDescription>
            Session ID: {session.sessionId.slice(0, 8)}...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${(sessionBalance / 1000000).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Session Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {betsPlaced}
              </div>
              <div className="text-sm text-gray-500">Bets Placed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Live Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-600">
                ${gasSaved.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Gas Saved</div>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">
                {Math.floor(timeSaved / 60)}m
              </div>
              <div className="text-sm text-gray-500">Time Saved</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settlement Button */}
      <Button 
        onClick={handleSettleSession}
        variant="outline"
        className="w-full"
      >
        Settle Session (On-Chain)
      </Button>
    </div>
  );
};
