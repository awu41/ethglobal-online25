"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useYellow } from '@/contexts/YellowContext';
import { Wallet } from 'lucide-react';

export const WalletNavButton: React.FC = () => {
  const { isConnected, isConnecting, userAddress, connectWallet, disconnect } = useYellow();

  const handleClick = async () => {
    if (!isConnected) {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Connection failed:', error);
      }
    }
  };

  if (isConnected && userAddress) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Wallet className="h-4 w-4 mr-2" />
          {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={disconnect}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleClick} disabled={isConnecting}>
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};
