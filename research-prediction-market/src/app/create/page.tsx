"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { WalletNavButton } from "@/components/WalletNavButton";
import { createMarket, getMetaMaskProvider, requestAccounts, isMetaMaskInstalled } from "@/lib/contract";
import { useYellow } from "@/contexts/YellowContext";

const categories = ["Medical", "Energy", "AI", "Cryptography", "Biotech", "Climate", "Other"];

export default function CreateMarketPage() {
  const { userAddress } = useYellow();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    resolutionDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdMarketId, setCreatedMarketId] = useState<number | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setCreatedMarketId(null);

    // Check wallet connection
    if (!userAddress) {
      setSubmitError("Please connect your wallet first");
      return;
    }

    if (!isMetaMaskInstalled()) {
      setSubmitError("Please install MetaMask to create markets");
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      setSubmitError("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      setSubmitError("Description is required");
      return;
    }
    if (!formData.category) {
      setSubmitError("Please select a category");
      return;
    }
    if (!formData.resolutionDate) {
      setSubmitError("Resolution date is required");
      return;
    }

    const resolutionDateObj = new Date(formData.resolutionDate);
    if (resolutionDateObj <= new Date()) {
      setSubmitError("Resolution date must be in the future");
      return;
    }

    setIsSubmitting(true);

    try {
      // Request account access if needed
      await requestAccounts();
      
      // Get provider and signer
      const provider = getMetaMaskProvider();
      if (!provider) {
        throw new Error("Could not get MetaMask provider");
      }
      
      const signer = await provider.getSigner();
      
      // Create market on blockchain
      const marketId = await createMarket(signer, {
        title: formData.title,
        description: formData.description,
        resolutionDate: resolutionDateObj,
      });
      
      setCreatedMarketId(marketId);
      setSubmitSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          resolutionDate: "",
        });
        setSubmitSuccess(false);
        setCreatedMarketId(null);
      }, 3000);
      
    } catch (error: any) {
      console.error("Market creation failed:", error);
      
      // User-friendly error messages
      if (error.code === 4001) {
        setSubmitError("Transaction was rejected");
      } else if (error.message?.includes("revert")) {
        setSubmitError("Transaction failed. Please check the contract address and network.");
      } else {
        setSubmitError(error.message || "Failed to create market. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <Button variant="ghost">Markets</Button>
              </Link>
              <Link href="/create">
                <Button variant="ghost" className="bg-blue-50 text-blue-600">Create Market</Button>
              </Link>
              <WalletNavButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/markets" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Market
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Start a prediction market for a research question
          </p>
        </div>

        {/* Wallet Connection Banner */}
        {!userAddress && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-yellow-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-900">Wallet Not Connected</div>
                  <div className="text-sm text-yellow-700">
                    Please connect your wallet to create a market
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Market Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Market Details
            </CardTitle>
            <CardDescription>
              Fill in the details for your research prediction market
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="text-sm font-medium mb-2 block">
                  Market Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Will mRNA vaccines reduce symptoms by >50%?"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  maxLength={200}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific and measurable
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="text-sm font-medium mb-2 block">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide detailed context about the research question and how it will be evaluated..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Category *
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      variant={formData.category === cat ? "default" : "outline"}
                      onClick={() => handleInputChange("category", cat)}
                      className="flex-1 min-w-[100px]"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Resolution Date */}
              <div>
                <label htmlFor="resolutionDate" className="text-sm font-medium mb-2 block">
                  Resolution Date *
                </label>
                <Input
                  id="resolutionDate"
                  type="date"
                  value={formData.resolutionDate}
                  onChange={(e) => handleInputChange("resolutionDate", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  When will this research question be answered?
                </p>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                  {submitError}
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && createdMarketId !== null && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
                  <div className="font-semibold mb-2">✅ Market created successfully!</div>
                  <div className="text-sm">Market ID: {createdMarketId}</div>
                  {createdMarketId > 0 && (
                    <Link href={`/markets/${createdMarketId}`} className="text-sm underline mt-1 block">
                      View Market →
                    </Link>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Creating..." : "Create Market"}
                </Button>
                <Link href="/markets">
                  <Button type="button" variant="outline" size="lg">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Market Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5">1</Badge>
                <span>Make your question clear and answerable with YES or NO</span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5">2</Badge>
                <span>Include specific, measurable criteria for resolution</span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5">3</Badge>
                <span>Choose a realistic resolution date based on research timelines</span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5">4</Badge>
                <span>Only the creator can resolve the market after the resolution date</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
