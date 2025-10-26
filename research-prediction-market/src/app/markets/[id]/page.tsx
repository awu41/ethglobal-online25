"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WalletConnect } from '@/components/WalletConnect';
import { BettingInterface } from '@/components/BettingInterface';
import { ArrowLeft, Clock, Users, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock market data - in production this would come from smart contract
const mockMarkets = {
  "1": {
    id: "1",
    title: "Will mRNA vaccines reduce symptoms by >50%?",
    description: "Testing mRNA vaccine effectiveness in clinical trials for COVID-19 variants",
    category: "Medical",
    yesOdds: 67,
    noOdds: 33,
    totalBets: 247,
    totalVolume: 1247.50,
    participants: 89,
    resolutionDate: "2024-06-15",
    status: "active"
  },
  "2": {
    id: "2",
    title: "Will fusion energy achieve net positive by 2026?",
    description: "Nuclear fusion research achieving energy output greater than input",
    category: "Energy",
    yesOdds: 23,
    noOdds: 77,
    totalBets: 89,
    totalVolume: 445.00,
    participants: 34,
    resolutionDate: "2026-12-31",
    status: "active"
  },
  "3": {
    id: "3",
    title: "Will AI safety research receive >$1B funding in 2024?",
    description: "Total global funding for AI safety and alignment research",
    category: "AI",
    yesOdds: 45,
    noOdds: 55,
    totalBets: 156,
    totalVolume: 780.00,
    participants: 67,
    resolutionDate: "2024-03-31",
    status: "active"
  }
};

export default function MarketPage() {
  const params = useParams();
  const marketId = params.id as string;
  const market = mockMarkets[marketId as keyof typeof mockMarkets];

  if (!market) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Market Not Found
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              The market you're looking for doesn't exist.
            </p>
            <Link href="/markets">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Back to Markets
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ResearchBet</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/markets">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Markets
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Market Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="mb-2">
                    {market.category}
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{market.title}</CardTitle>
                <CardDescription className="text-base">
                  {market.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Resolves {new Date(market.resolutionDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {market.participants} participants
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${market.totalVolume.toFixed(2)} volume
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Betting Interface */}
            <BettingInterface
              marketId={market.id}
              marketTitle={market.title}
              yesOdds={market.yesOdds}
              noOdds={market.noOdds}
              totalVolume={market.totalVolume}
              totalBets={market.totalBets}
            />
          </div>

          {/* Right Column - Wallet & Session */}
          <div className="space-y-6">
            <WalletConnect />
            
            {/* Market Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Market Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bets</span>
                    <span className="font-semibold">{market.totalBets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Volume</span>
                    <span className="font-semibold">${market.totalVolume.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-semibold">{market.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution Date</span>
                    <span className="font-semibold">
                      {new Date(market.resolutionDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How Yellow SDK Works</CardTitle>
                <CardDescription>
                  Understanding the technology behind instant betting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong>1. Create Session:</strong> Deposit funds once to start
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <strong>2. Instant Bets:</strong> Place unlimited bets with $0 gas fees
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <strong>3. Settlement:</strong> Single on-chain transaction when market resolves
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
