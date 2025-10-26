"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, Users, DollarSign, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for research markets
const mockMarkets = [
  {
    id: "1",
    title: "Will mRNA vaccines reduce symptoms by >50%?",
    description: "Medical Research • Resolves in 6 months",
    category: "Medical",
    yesOdds: 67,
    noOdds: 33,
    totalBets: 247,
    totalVolume: 1247.50,
    participants: 89,
    resolutionDate: "2024-06-15",
    status: "active"
  },
  {
    id: "2", 
    title: "Will fusion energy achieve net positive by 2026?",
    description: "Energy Research • Resolves in 2 years",
    category: "Energy",
    yesOdds: 23,
    noOdds: 77,
    totalBets: 89,
    totalVolume: 445.00,
    participants: 34,
    resolutionDate: "2026-12-31",
    status: "active"
  },
  {
    id: "3",
    title: "Will AI safety research receive >$1B funding in 2024?",
    description: "AI Research • Resolves in 3 months",
    category: "AI",
    yesOdds: 45,
    noOdds: 55,
    totalBets: 156,
    totalVolume: 780.00,
    participants: 67,
    resolutionDate: "2024-03-31",
    status: "active"
  },
  {
    id: "4",
    title: "Will quantum computers break RSA encryption by 2025?",
    description: "Cryptography Research • Resolves in 1 year",
    category: "Cryptography",
    yesOdds: 12,
    noOdds: 88,
    totalBets: 203,
    totalVolume: 1015.00,
    participants: 78,
    resolutionDate: "2025-01-01",
    status: "active"
  },
  {
    id: "5",
    title: "Will CRISPR gene editing cure sickle cell disease?",
    description: "Biotech Research • Resolves in 8 months",
    category: "Biotech",
    yesOdds: 78,
    noOdds: 22,
    totalBets: 134,
    totalVolume: 670.00,
    participants: 45,
    resolutionDate: "2024-08-15",
    status: "active"
  },
  {
    id: "6",
    title: "Will carbon capture technology reach $100/ton by 2025?",
    description: "Climate Research • Resolves in 1 year",
    category: "Climate",
    yesOdds: 34,
    noOdds: 66,
    totalBets: 98,
    totalVolume: 490.00,
    participants: 56,
    resolutionDate: "2025-01-01",
    status: "active"
  }
];

const categories = ["All", "Medical", "Energy", "AI", "Cryptography", "Biotech", "Climate"];

export default function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredMarkets = mockMarkets.filter(market => {
    const matchesSearch = market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || market.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                <Button variant="ghost" className="bg-blue-50 text-blue-600">Markets</Button>
              </Link>
              <Link href="/create">
                <Button variant="ghost">Create Market</Button>
              </Link>
              <Button>Connect Wallet</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Research Prediction Markets
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Bet on the future of science with instant transactions and zero gas fees
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search research questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{mockMarkets.length}</div>
              <div className="text-sm text-gray-500">Active Markets</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {mockMarkets.reduce((sum, market) => sum + market.totalBets, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Bets</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                ${mockMarkets.reduce((sum, market) => sum + market.totalVolume, 0).toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">Total Volume</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(mockMarkets.flatMap(market => Array(market.participants).fill(market.id))).size}
              </div>
              <div className="text-sm text-gray-500">Participants</div>
            </CardContent>
          </Card>
        </div>

        {/* Markets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <Card key={market.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={`/markets/${market.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="mb-2">
                      {market.category}
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {market.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Resolves {new Date(market.resolutionDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Odds Display */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-green-600">{market.yesOdds}%</div>
                        <div className="text-sm text-gray-500">YES</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-red-600">{market.noOdds}%</div>
                        <div className="text-sm text-gray-500">NO</div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${market.yesOdds}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Market Stats */}
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Volume
                      </span>
                      <span className="font-semibold">${market.totalVolume.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Bets
                      </span>
                      <span className="font-semibold">{market.totalBets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Participants
                      </span>
                      <span className="font-semibold">{market.participants}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 pt-4 border-t">
                    <Button className="w-full" size="sm">
                      Place Bet
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No markets found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <Link href="/create">
              <Button>Create First Market</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
