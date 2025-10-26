"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Yellow SDK types
interface YellowSession {
  sessionId: string;
  userAddress: string;
  balance: number;
  isActive: boolean;
  expiresAt: number;
}

interface YellowContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  userAddress: string | null;
  
  // Session state
  session: YellowSession | null;
  sessionBalance: number;
  
  // Actions
  connectWallet: () => Promise<void>;
  createSession: (depositAmount: number) => Promise<void>;
  placeBet: (marketId: string, amount: number, side: boolean) => Promise<void>;
  settleSession: () => Promise<void>;
  disconnect: () => void;
  
  // Stats
  betsPlaced: number;
  totalVolume: number;
  gasSaved: number;
  timeSaved: number;
}

const YellowContext = createContext<YellowContextType | null>(null);

export const useYellow = () => {
  const context = useContext(YellowContext);
  if (!context) {
    throw new Error('useYellow must be used within a YellowProvider');
  }
  return context;
};

interface YellowProviderProps {
  children: React.ReactNode;
}

export const YellowProvider: React.FC<YellowProviderProps> = ({ children }) => {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  
  // Session state
  const [session, setSession] = useState<YellowSession | null>(null);
  const [sessionBalance, setSessionBalance] = useState(0);
  
  // Stats
  const [betsPlaced, setBetsPlaced] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [gasSaved, setGasSaved] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
  
  // WebSocket connection
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Listen for account changes (but don't auto-connect on mount)
  useEffect(() => {
    if (!window.ethereum) return;

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setSession(null);
        setSessionBalance(0);
        setIsConnected(false);
        setUserAddress(null);
        setBetsPlaced(0);
        setTotalVolume(0);
        setGasSaved(0);
        setTimeSaved(0);
      } else {
        // User switched accounts
        setUserAddress(accounts[0]);
        console.log('🔄 Account changed:', accounts[0]);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        // Reload the page when chain changes
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask');
    }

    // Check if MetaMask is installed
    if (!window.ethereum.isMetaMask) {
      throw new Error('Please use MetaMask browser extension');
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      const address = accounts[0];
      setUserAddress(address);
      setIsConnected(true);
      
      console.log('✅ Wallet connected:', address);
    } catch (error: any) {
      console.error('❌ Wallet connection failed:', error);
      
      // Provide user-friendly error messages
      if (error.code === 4001) {
        throw new Error('User rejected connection request');
      } else if (error.code === -32002) {
        throw new Error('Connection request already pending');
      }
      
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Create Yellow session
  const createSession = useCallback(async (depositAmount: number) => {
    if (!userAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      // Connect to Yellow Network
      const websocket = new WebSocket('wss://clearnet.yellow.com/ws');
      
      websocket.onopen = () => {
        console.log('✅ Connected to Yellow Network');
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Yellow message:', message);
          
          switch (message.type) {
            case 'session_created':
              const newSession: YellowSession = {
                sessionId: message.sessionId,
                userAddress,
                balance: depositAmount,
                isActive: true,
                expiresAt: Date.now() + 3600000 // 1 hour
              };
              setSession(newSession);
              setSessionBalance(depositAmount);
              console.log('✅ Yellow session created:', newSession);
              break;
              
            case 'payment':
              setSessionBalance(prev => prev - message.amount);
              setBetsPlaced(prev => prev + 1);
              setTotalVolume(prev => prev + message.amount);
              setGasSaved(prev => prev + 1.5); // $1.50 per bet saved
              setTimeSaved(prev => prev + 12); // 12 seconds per bet saved
              console.log('💰 Bet placed:', message);
              break;
              
            case 'error':
              console.error('❌ Yellow error:', message.error);
              break;
          }
        } catch (error) {
          console.error('❌ Failed to parse Yellow message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('❌ Yellow WebSocket error:', error);
      };

      // Create session message
      const sessionMessage = {
        type: 'create_session',
        userAddress,
        depositAmount,
        timestamp: Date.now()
      };

      websocket.send(JSON.stringify(sessionMessage));
      
    } catch (error) {
      console.error('❌ Session creation failed:', error);
      throw error;
    }
  }, [userAddress]);

  // Place bet (off-chain)
  const placeBet = useCallback(async (marketId: string, amount: number, side: boolean) => {
    if (!session || !ws) {
      throw new Error('No active session');
    }

    if (sessionBalance < amount) {
      throw new Error('Insufficient balance');
    }

    try {
      const betMessage = {
        type: 'place_bet',
        sessionId: session.sessionId,
        marketId,
        amount,
        side,
        timestamp: Date.now()
      };

      ws.send(JSON.stringify(betMessage));
      
      // Update local state immediately for instant UX
      setSessionBalance(prev => prev - amount);
      setBetsPlaced(prev => prev + 1);
      setTotalVolume(prev => prev + amount);
      setGasSaved(prev => prev + 1.5);
      setTimeSaved(prev => prev + 12);
      
      console.log('⚡ Bet placed instantly:', betMessage);
      
    } catch (error) {
      console.error('❌ Bet placement failed:', error);
      throw error;
    }
  }, [session, ws, sessionBalance]);

  // Settle session (on-chain)
  const settleSession = useCallback(async () => {
    if (!session || !ws) {
      throw new Error('No active session');
    }

    try {
      const settlementMessage = {
        type: 'settle_session',
        sessionId: session.sessionId,
        timestamp: Date.now()
      };

      ws.send(JSON.stringify(settlementMessage));
      
      // Close session
      setSession(null);
      setSessionBalance(0);
      
      console.log('🏁 Session settled on-chain');
      
    } catch (error) {
      console.error('❌ Session settlement failed:', error);
      throw error;
    }
  }, [session, ws]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (ws) {
      ws.close();
      setWs(null);
    }
    
    setSession(null);
    setSessionBalance(0);
    setIsConnected(false);
    setUserAddress(null);
    setBetsPlaced(0);
    setTotalVolume(0);
    setGasSaved(0);
    setTimeSaved(0);
    
    console.log('👋 Disconnected from Yellow Network');
  }, [ws]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const value: YellowContextType = {
    isConnected,
    isConnecting,
    userAddress,
    session,
    sessionBalance,
    connectWallet,
    createSession,
    placeBet,
    settleSession,
    disconnect,
    betsPlaced,
    totalVolume,
    gasSaved,
    timeSaved,
  };

  return (
    <YellowContext.Provider value={value}>
      {children}
    </YellowContext.Provider>
  );
};
