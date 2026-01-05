import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { LivePriceTicker } from "@/components/LivePriceTicker";
import { SmartMoneyIndicator } from "@/components/SmartMoneyIndicator";
import { UnlockCalendar } from "@/components/UnlockCalendar";
import { TradingLevels } from "@/components/TradingLevels";
import { MarketDominance } from "@/components/MarketDominance";
import HistoricalPerformance from "@/components/HistoricalPerformance";

interface TokenMetrics {
  name: string;
  symbol: string;
  price: string;
  marketCap: string;
  change24h: number;
  change7d: number;
  volume: string;
  recommendation: 'very_strong_buy' | 'strong_buy' | 'speculative_buy' | 'hold' | 'avoid';
  score: number;
  tier: 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';
  allocation?: string;
  isNew?: boolean;
}

const tokens: TokenMetrics[] = [
  {
    name: "Sui Network",
    symbol: "SUI",
    price: "$1.70",
    marketCap: "$6.47B",
    change24h: 3.01,
    change7d: 18.37,
    volume: "$767M",
    recommendation: 'very_strong_buy',
    score: 9.0,
    tier: 'tier_1',
    allocation: "$22,500 (45%)"
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    price: "$13.38",
    marketCap: "$9.47B",
    change24h: 1.57,
    change7d: 8.29,
    volume: "$574M",
    recommendation: 'strong_buy',
    score: 8.5,
    tier: 'tier_1',
    allocation: "$12,500 (25%)"
  },
  {
    name: "Sonic",
    symbol: "SONIC",
    price: "$0.0908",
    marketCap: "$262M",
    change24h: 10.77,
    change7d: 17.05,
    volume: "$54M",
    recommendation: 'speculative_buy',
    score: 7.0,
    tier: 'tier_2',
    allocation: "$5,000 (10%)",
    isNew: true
  },
  {
    name: "Aptos",
    symbol: "APT",
    price: "$1.92",
    marketCap: "$1.44B",
    change24h: 0.59,
    change7d: 12.22,
    volume: "$75M",
    recommendation: 'hold',
    score: 6.5,
    tier: 'tier_2',
    allocation: "$3,000 (6%)"
  },
  {
    name: "Maple Finance",
    symbol: "SYRUP",
    price: "$0.3617",
    marketCap: "$416M",
    change24h: 2.88,
    change7d: 12.18,
    volume: "$16M",
    recommendation: 'speculative_buy',
    score: 6.8,
    tier: 'tier_2',
    allocation: "$2,000 (4%)",
    isNew: true
  },
  {
    name: "Astar",
    symbol: "ASTER",
    price: "$0.7753",
    marketCap: "$1.93B",
    change24h: 3.98,
    change7d: 9.08,
    volume: "$187M",
    recommendation: 'hold',
    score: 6.2,
    tier: 'tier_3',
    allocation: "$2,500 (5%)",
    isNew: true
  },
  {
    name: "Sei Network",
    symbol: "SEI",
    price: "$0.1234",
    marketCap: "$801M",
    change24h: 2.06,
    change7d: 8.47,
    volume: "$59M",
    recommendation: 'hold',
    score: 5.5,
    tier: 'tier_3'
  },
  {
    name: "Pyth Network",
    symbol: "PYTH",
    price: "$0.0674",
    marketCap: "$387M",
    change24h: 6.09,
    change7d: 11.33,
    volume: "$21M",
    recommendation: 'hold',
    score: 5.2,
    tier: 'tier_3'
  },
  {
    name: "EigenLayer",
    symbol: "EIGEN",
    price: "$0.4207",
    marketCap: "$227M",
    change24h: 1.93,
    change7d: 8.97,
    volume: "$37M",
    recommendation: 'avoid',
    score: 4.5,
    tier: 'tier_4'
  },
  {
    name: "Nillion",
    symbol: "NIL",
    price: "$0.0765",
    marketCap: "$22.4M",
    change24h: -2.15,
    change7d: -8.32,
    volume: "$3.2M",
    recommendation: 'avoid',
    score: 2.5,
    tier: 'tier_4'
  },
  {
    name: "Allora",
    symbol: "ALLO",
    price: "$0.1213",
    marketCap: "$45.6M",
    change24h: 1.23,
    change7d: -3.45,
    volume: "$5.8M",
    recommendation: 'avoid',
    score: 3.0,
    tier: 'tier_4'
  },
  {
    name: "Fartcoin",
    symbol: "FARTCOIN",
    price: "$0.3470",
    marketCap: "Unknown",
    change24h: 5.41,
    change7d: 0,
    volume: "Unknown",
    recommendation: 'avoid',
    score: 1.0,
    tier: 'tier_4'
  }
];

const TRACKED_SYMBOLS = ['SUI', 'LINK', 'APT', 'SEI', 'ASTER', 'SONIC', 'PYTH', 'EIGEN', 'SYRUP', 'FARTCOIN', 'ALEO', 'TIBBIR'];

export default function Home() {
  const getRecommendationBadge = (recommendation: string) => {
    const badges = {
      very_strong_buy: { label: 'VERY STRONG BUY', className: 'bg-emerald-600 text-white hover:bg-emerald-700' },
      strong_buy: { label: 'STRONG BUY', className: 'bg-green-600 text-white hover:bg-green-700' },
      speculative_buy: { label: 'SPECULATIVE BUY', className: 'bg-amber-500 text-white hover:bg-amber-600' },
      buy: { label: 'BUY', className: 'bg-blue-600 text-white hover:bg-blue-700' },
      hold: { label: 'HOLD', className: 'bg-slate-500 text-white hover:bg-slate-600' },
      avoid: { label: 'AVOID', className: 'bg-red-600 text-white hover:bg-red-700' }
    };
    const badge = badges[recommendation as keyof typeof badges] || badges.hold;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  const getTierBadge = (tier: string) => {
    const tiers = {
      tier_1: { label: 'Tier 1: Infrastructure', className: 'bg-purple-100 text-purple-800 border-purple-300' },
      tier_2: { label: 'Tier 2: Growth', className: 'bg-blue-100 text-blue-800 border-blue-300' },
      tier_3: { label: 'Tier 3: Speculative', className: 'bg-amber-100 text-amber-800 border-amber-300' },
      tier_4: { label: 'Tier 4: Avoid', className: 'bg-red-100 text-red-800 border-red-300' }
    };
    const tierBadge = tiers[tier as keyof typeof tiers] || tiers.tier_3;
    return <Badge variant="outline" className={tierBadge.className}>{tierBadge.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Crypto Market Analysis</h1>
              <p className="text-slate-600 mt-1">
                January 4, 2026 - <span className="font-semibold text-emerald-600">REVISED</span> Token Evaluation & Allocation Strategy
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-sm px-3 py-1">
                <Zap className="w-3 h-3 mr-1 inline" />
                Early Altcoin Season Signals
              </Badge>
              <p className="text-xs text-slate-500 mt-1">Altcoin Season Index: 57/100</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Live Price Ticker */}
        <LivePriceTicker symbols={TRACKED_SYMBOLS} />

        {/* Revision Notice */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 p-6">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">🔄 ALLOCATION REVISED - January 4, 2026</h3>
              <div className="text-sm text-slate-700 space-y-2">
                <p className="font-semibold">Key Changes Based on Market Momentum:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>SONIC added</strong> at 10% ($5,000) - Explosive +17% weekly momentum</li>
                  <li><strong>SYRUP added</strong> at 4% ($2,000) - DeFi recovery play (+42.77% monthly)</li>
                  <li><strong>ASTER added</strong> at 5% ($2,500) - Volume surge to $187M</li>
                  <li><strong>SUI reduced</strong> to 45% ($22,500) from 50% - Still #1 conviction</li>
                  <li><strong>LINK reduced</strong> to 25% ($12,500) from 30% - Maintained strong conviction</li>
                  <li><strong>APT reduced</strong> to 6% ($3,000) from 10% - Jan 11 unlock risk</li>
                  <li><strong>Cash reduced</strong> to 5% ($2,500) from 10% - Deploy in favorable conditions</li>
                </ul>
                <p className="text-emerald-700 font-semibold mt-3">
                  ✅ Portfolio positioned for early altcoin season with 6 active positions + cash reserve
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Uncomment when Nansen API is working */}
        {/* <SmartMoneyIndicator /> */}
        
        {/* Uncomment when Market Dominance API is working */}
        {/* <MarketDominance /> */}

        {/* Executive Summary */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Executive Summary</h2>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">REVISED Portfolio Allocation for $50,000</h3>
            <p className="text-slate-600 mb-6">
              Increased from 3 to 6 active positions to capitalize on early altcoin season signals
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* SUI */}
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-emerald-900">SUI (PRIMARY)</h4>
                  {getTierBadge('tier_1')}
                </div>
                <div className="text-4xl font-bold text-emerald-700 mb-2">$22,500</div>
                <p className="text-sm text-emerald-800 font-semibold mb-2">45% - Strongest conviction</p>
                <p className="text-xs text-slate-600">Previous: $25,000 (50%)</p>
                <Badge className="mt-2 bg-emerald-600 text-white">VERY STRONG BUY</Badge>
              </Card>

              {/* LINK */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-blue-900">LINK (SECONDARY)</h4>
                  {getTierBadge('tier_1')}
                </div>
                <div className="text-4xl font-bold text-blue-700 mb-2">$12,500</div>
                <p className="text-sm text-blue-800 font-semibold mb-2">25% - Institutional oracle</p>
                <p className="text-xs text-slate-600">Previous: $15,000 (30%)</p>
                <Badge className="mt-2 bg-blue-600 text-white">STRONG BUY</Badge>
              </Card>

              {/* SONIC */}
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-amber-900 flex items-center gap-2">
                    SONIC (MOMENTUM)
                    <Badge className="bg-red-500 text-white text-xs">NEW</Badge>
                  </h4>
                  {getTierBadge('tier_2')}
                </div>
                <div className="text-4xl font-bold text-amber-700 mb-2">$5,000</div>
                <p className="text-sm text-amber-800 font-semibold mb-2">10% - Explosive momentum</p>
                <p className="text-xs text-slate-600">+17% weekly, +10.77% daily</p>
                <Badge className="mt-2 bg-amber-500 text-white">SPECULATIVE BUY</Badge>
              </Card>

              {/* APT */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-purple-900">APT (WATCH)</h4>
                  {getTierBadge('tier_2')}
                </div>
                <div className="text-4xl font-bold text-purple-700 mb-2">$3,000</div>
                <p className="text-sm text-purple-800 font-semibold mb-2">6% - Post-unlock play</p>
                <p className="text-xs text-slate-600">Previous: $5,000 (10%)</p>
                <Badge className="mt-2 bg-slate-500 text-white">HOLD</Badge>
              </Card>

              {/* SYRUP */}
              <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-teal-900 flex items-center gap-2">
                    SYRUP (DeFi)
                    <Badge className="bg-red-500 text-white text-xs">NEW</Badge>
                  </h4>
                  {getTierBadge('tier_2')}
                </div>
                <div className="text-4xl font-bold text-teal-700 mb-2">$2,000</div>
                <p className="text-sm text-teal-800 font-semibold mb-2">4% - DeFi recovery</p>
                <p className="text-xs text-slate-600">+42.77% monthly performance</p>
                <Badge className="mt-2 bg-amber-500 text-white">SPECULATIVE BUY</Badge>
              </Card>

              {/* ASTER */}
              <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-violet-900 flex items-center gap-2">
                    ASTER (DOT)
                    <Badge className="bg-red-500 text-white text-xs">NEW</Badge>
                  </h4>
                  {getTierBadge('tier_3')}
                </div>
                <div className="text-4xl font-bold text-violet-700 mb-2">$2,500</div>
                <p className="text-sm text-violet-800 font-semibold mb-2">5% - Ecosystem play</p>
                <p className="text-xs text-slate-600">Volume surge to $187M</p>
                <Badge className="mt-2 bg-slate-500 text-white">HOLD</Badge>
              </Card>

              {/* CASH RESERVE */}
              <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-300 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900">CASH RESERVE</h4>
                </div>
                <div className="text-4xl font-bold text-slate-700 mb-2">$2,500</div>
                <p className="text-sm text-slate-700 font-semibold mb-2">5% - Risk management</p>
                <p className="text-xs text-slate-600">Previous: $5,000 (10%)</p>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-slate-700">
                <strong>Strategy Rationale:</strong> Early altcoin season signals (Altcoin Season Index 57/100, BTC dominance declining to 59.43%) justify increased alt exposure and diversification into momentum plays while maintaining core SUI+LINK positions.
              </p>
            </div>
          </Card>
        </section>

        {/* Entry & Exit Strategy */}
        <TradingLevels />

        {/* Unlock Calendar */}
        <UnlockCalendar />

        {/* 12-Token Analysis Grid */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">12-Token Analysis Grid</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token) => (
              <Card 
                key={token.symbol}
                className={`p-6 hover:shadow-lg transition-shadow ${
                  token.recommendation === 'very_strong_buy' ? 'border-emerald-300 bg-emerald-50/50' :
                  token.recommendation === 'strong_buy' ? 'border-green-300 bg-green-50/50' :
                  token.recommendation === 'speculative_buy' ? 'border-amber-300 bg-amber-50/50' :
                  token.recommendation === 'hold' ? 'border-slate-300 bg-slate-50/50' :
                  'border-red-300 bg-red-50/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{token.name}</h3>
                      {token.isNew && (
                        <Badge className="bg-red-500 text-white text-xs">NEW</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 font-mono">{token.symbol}</p>
                  </div>
                  {getTierBadge(token.tier)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Price</span>
                    <span className="text-lg font-bold text-slate-900">{token.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">24h Change</span>
                    <span className={`text-sm font-semibold ${token.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </span>
                  </div>

                  {token.change7d !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">7d Change</span>
                      <span className={`text-sm font-semibold ${token.change7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {token.change7d >= 0 ? '+' : ''}{token.change7d.toFixed(2)}%
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Volume 24h</span>
                    <span className="text-sm font-semibold text-slate-900">{token.volume}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Market Cap</span>
                    <span className="text-sm font-semibold text-slate-900">{token.marketCap}</span>
                  </div>

                  {token.allocation && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="text-sm font-semibold text-slate-700">Allocation</span>
                      <span className="text-sm font-bold text-blue-700">{token.allocation}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  {getRecommendationBadge(token.recommendation)}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">Score:</span>
                    <span className="text-sm font-bold text-slate-900">{token.score}/10</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Historical Performance Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">📊 Historical Performance & Prediction Accuracy</h2>
          <div className="space-y-6">
            <HistoricalPerformance symbol="SUI" />
            <HistoricalPerformance symbol="LINK" />
            <HistoricalPerformance symbol="ASTER" />
          </div>
        </section>

        {/* Key Findings */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Key Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Strong Momentum</h3>
                  <p className="text-sm text-slate-700">
                    Broad altcoin strength with 8-12% weekly gains. SUI leading at +18.37%, SONIC explosive at +17.05%.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Unlock Risks</h3>
                  <p className="text-sm text-slate-700">
                    APT (Jan 11), NILLION (Jan 19), ALLORA (Jan 25), SEI (Feb 1) - Monitor for dip opportunities.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Altcoin Season</h3>
                  <p className="text-sm text-slate-700">
                    Index at 57/100 (threshold 75). BTC dominance 59.43% declining. Early signals aligning for Q1 2026 rally.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 py-8 border-t border-slate-200">
          <p>
            This analysis is for informational purposes only and does not constitute financial advice.
            Always conduct your own research and consult with a qualified financial advisor.
          </p>
          <p className="mt-2">
            Data sources: CoinMarketCap, Coinglass, DEX Screener, DropsTab | Last updated: January 4, 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
