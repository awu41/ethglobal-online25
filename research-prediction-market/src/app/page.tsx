import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, DollarSign, Clock, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import MetricsLogger from "@/components/MetricsLogger";

export default function Home() {
  // Demo metrics for console logging
  const demoMetrics = {
    betsPlaced: 247,
    totalVolume: 1247.50,
    gasSaved: 370.50,
    timeSaved: 2940, // 49 minutes in seconds
    sessionDuration: 60 // 1 minute session
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Console Metrics Logger */}
      <MetricsLogger {...demoMetrics} />
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ResearchBet</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/markets">
                <Button variant="ghost">Markets</Button>
              </Link>
              <Link href="/create">
                <Button variant="ghost">Create Market</Button>
              </Link>
              <Button>Connect Wallet</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Bet on Science,{" "}
            <span className="text-blue-600">Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            The first prediction market where you can place unlimited bets on research outcomes 
            with zero gas fees and instant settlements.
          </p>
          
          {/* Value Proposition Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle className="text-lg">Instant Bets</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Place hundreds of bets in seconds with zero gas fees using our advanced off-chain technology.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-lg">Zero Gas Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Traditional prediction markets cost $1.50+ per bet. With our technology, you pay $0 gas fees.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-lg">Real-Time</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Watch odds update in real-time as the research community weighs in on scientific questions.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/markets">
              <Button size="lg" className="text-lg px-8 py-4">
                Explore Markets
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/create">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Create Market
              </Button>
            </Link>
          </div>


          {/* Example Markets Preview */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Active Research Markets
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Will mRNA vaccines reduce symptoms by &gt;50%?</CardTitle>
                  <CardDescription>Medical Research • Resolves in 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">67%</p>
                      <p className="text-sm text-gray-500">YES</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">33%</p>
                      <p className="text-sm text-gray-500">NO</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>247 bets</span>
                    <span>$1,247 volume</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Will fusion energy achieve net positive by 2026?</CardTitle>
                  <CardDescription>Energy Research • Resolves in 2 years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">23%</p>
                      <p className="text-sm text-gray-500">YES</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">77%</p>
                      <p className="text-sm text-gray-500">NO</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>89 bets</span>
                    <span>$445 volume</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Will AI safety research receive &gt;$1B funding in 2024?</CardTitle>
                  <CardDescription>AI Research • Resolves in 3 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">45%</p>
                      <p className="text-sm text-gray-500">YES</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">55%</p>
                      <p className="text-sm text-gray-500">NO</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>156 bets</span>
                    <span>$780 volume</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
