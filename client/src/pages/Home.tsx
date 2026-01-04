import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { LivePriceTicker } from "@/components/LivePriceTicker";
import { SmartMoneyIndicator } from "@/components/SmartMoneyIndicator";
import { UnlockCalendar } from "@/components/UnlockCalendar";
import { TradingLevels } from "@/components/TradingLevels";
import { MarketDominance } from "@/components/MarketDominance";

interface TokenMetrics {
  name: string;
  symbol: string;
  price: string;
  marketCap: string;
  change24h: number;
  volume: string;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid';
  score: number;
  tier: 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';
  allocation?: string;
}

const tokens: TokenMetrics[] = [
  {
    name: "Sui Network",
    symbol: "SUI",
    price: "$1.67",
    marketCap: "$6.35B",
    change24h: 2.32,
    volume: "$1.58B",
    recommendation: 'strong_buy',
    score: 8.5,
    tier: 'tier_1',
    allocation: "$25,000 (50%)"
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    price: "$13.31",
    marketCap: "$9.41B",
    change24h: -0.31,
    volume: "$719.73M",
    recommendation: 'strong_buy',
    score: 8.2,
    tier: 'tier_1',
    allocation: "$15,000 (30%)"
  },
  {
    name: "Aptos",
    symbol: "APT",
    price: "$1.91",
    marketCap: "$1.43B",
    change24h: 1.74,
    volume: "$105.7M",
    recommendation: 'buy',
    score: 6.5,
    tier: 'tier_2',
    allocation: "$5,000 (10%)"
  },
  {
    name: "Sei Network",
    symbol: "SEI",
    price: "$0.1221",
    marketCap: "$794M",
    change24h: -0.57,
    volume: "$114.65M",
    recommendation: 'hold',
    score: 5.5,
    tier: 'tier_2'
  },
  {
    name: "Aster",
    symbol: "ASTER",
    price: "$0.71",
    marketCap: "$1.77B",
    change24h: 0.13,
    volume: "$146.06M",
    recommendation: 'hold',
    score: 5.8,
    tier: 'tier_2'
  },
  {
    name: "Sonic",
    symbol: "SONIC",
    price: "$0.0810",
    marketCap: "$234.68M",
    change24h: 0.58,
    volume: "$27.02M",
    recommendation: 'hold',
    score: 4.5,
    tier: 'tier_3'
  },
  {
    name: "Pyth Network",
    symbol: "PYTH",
    price: "$0.0638",
    marketCap: "$875M",
    change24h: 2.36,
    volume: "$14.3M",
    recommendation: 'hold',
    score: 4.8,
    tier: 'tier_3'
  },
  {
    name: "EigenLayer",
    symbol: "EIGEN",
    price: "$0.38",
    marketCap: "$450M",
    change24h: 9.72,
    volume: "$52.3M",
    recommendation: 'avoid',
    score: 3.5,
    tier: 'tier_3'
  },
  {
    name: "Maple Finance",
    symbol: "SYRUP",
    price: "$0.3547",
    marketCap: "$404M",
    change24h: -4.03,
    volume: "$22.29M",
    recommendation: 'avoid',
    score: 4.0,
    tier: 'tier_4'
  },
  {
    name: "Nillion",
    symbol: "NIL",
    price: "$0.0765",
    marketCap: "$22.4M",
    change24h: -2.24,
    volume: "$6.23M",
    recommendation: 'avoid',
    score: 3.0,
    tier: 'tier_4'
  },
  {
    name: "Allora",
    symbol: "ALLO",
    price: "$0.1213",
    marketCap: "$24.4M",
    change24h: 3.09,
    volume: "$20.21M",
    recommendation: 'avoid',
    score: 4.0,
    tier: 'tier_4'
  },
  {
    name: "Fartcoin",
    symbol: "FARTCOIN",
    price: "$0.334",
    marketCap: "Micro-cap",
    change24h: 0,
    volume: "$87.36M",
    recommendation: 'avoid',
    score: 1.5,
    tier: 'tier_4'
  }
];

const recommendationConfig = {
  strong_buy: { label: 'Strong Buy', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  buy: { label: 'Buy', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  hold: { label: 'Hold', color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp },
  avoid: { label: 'Avoid', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
};

const tierConfig = {
  tier_1: { label: 'Tier 1: Established', color: 'border-green-500 bg-green-50', description: 'Institutional-grade, high conviction' },
  tier_2: { label: 'Tier 2: L1 Blockchains', color: 'border-blue-500 bg-blue-50', description: 'Moderate conviction, diversification' },
  tier_3: { label: 'Tier 3: Emerging', color: 'border-yellow-500 bg-yellow-50', description: 'Speculative, requires monitoring' },
  tier_4: { label: 'Tier 4: Avoid', color: 'border-red-500 bg-red-50', description: 'High risk, unfavorable tokenomics' }
};

export default function Home() {
  const allSymbols = tokens.map(t => t.symbol);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Crypto Market Analysis</h1>
          <p className="text-lg text-slate-600">January 4, 2026 - Comprehensive Token Evaluation & Allocation Strategy</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Live Price Ticker */}
        <section className="mb-12">
          <LivePriceTicker symbols={allSymbols} />
        </section>

        {/* Smart Money Analytics from Nansen - Temporarily disabled due to API issues */}
        {/* <section className="mb-12">
          <SmartMoneyIndicator symbols={['SUI', 'LINK', 'APT', 'PYTH', 'EIGEN']} />
        </section> */}

        {/* Market Dominance Tracker - Temporarily disabled */}
        {/* <section className="mb-12">
          <MarketDominance />
        </section> */}

        {/* Executive Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Executive Summary</h2>
          <Card className="border-l-4 border-l-blue-500 bg-white">
            <CardHeader>
              <CardTitle>High-Conviction Portfolio Allocation for $50,000</CardTitle>
              <CardDescription>Focused January accumulation strategy with only 3 positions + cash reserve</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-700 mb-2">SUI (PRIMARY)</p>
                  <p className="text-3xl font-bold text-green-900">$25,000</p>
                  <p className="text-sm text-green-700 mt-2">50% - Strongest conviction</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-700 mb-2">LINK (SECONDARY)</p>
                  <p className="text-3xl font-bold text-blue-900">$15,000</p>
                  <p className="text-sm text-blue-700 mt-2">30% - Institutional oracle</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <p className="text-sm font-semibold text-purple-700 mb-2">APT (DIVERSIFIER)</p>
                  <p className="text-3xl font-bold text-purple-900">$5,000</p>
                  <p className="text-sm text-purple-700 mt-2">10% - Post-unlock play</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-2">CASH RESERVE</p>
                  <p className="text-3xl font-bold text-slate-900">$5,000</p>
                  <p className="text-sm text-slate-700 mt-2">10% - Risk management</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Trading Levels - NEW */}
        <section className="mb-12">
          <TradingLevels />
        </section>

        {/* Unlock Calendar - NEW */}
        <section className="mb-12">
          <UnlockCalendar />
        </section>

        {/* Token Analysis Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">12-Token Analysis</h2>
          <p className="text-slate-600 mb-6">Comprehensive evaluation of all tokens analyzed. Tier 1 tokens are high-conviction positions recommended for January accumulation.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token) => {
              const config = recommendationConfig[token.recommendation];
              const tierInfo = tierConfig[token.tier];
              const Icon = config.icon;
              return (
                <Card key={token.symbol} className={`hover:shadow-lg transition-shadow border-l-4 ${tierInfo.color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-lg">{token.name}</CardTitle>
                        <CardDescription className="text-xs">{tierInfo.label}</CardDescription>
                      </div>
                      <Badge className={`${config.color} border-0`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">PRICE</p>
                          <p className="text-lg font-bold text-slate-900">{token.price}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">24H CHANGE</p>
                          <p className={`text-lg font-bold ${token.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">MARKET CAP</p>
                          <p className="text-sm font-semibold text-slate-700">{token.marketCap}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-semibold mb-1">24H VOLUME</p>
                          <p className="text-sm font-semibold text-slate-700">{token.volume}</p>
                        </div>
                      </div>
                      {token.allocation && (
                        <div className="pt-2 border-t border-slate-200 bg-slate-50 p-2 rounded">
                          <p className="text-xs text-slate-600 font-semibold">RECOMMENDED ALLOCATION</p>
                          <p className="text-sm font-bold text-slate-900">{token.allocation}</p>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500 font-semibold">ANALYSIS SCORE</p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  token.score >= 7 ? 'bg-green-500' : 
                                  token.score >= 5 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${(token.score / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-slate-900">{token.score}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Key Findings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Why This Allocation?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  SUI: Strongest Conviction (50%)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p>Long/Short ratio 1.88+ (extremely bullish institutional backing). $1.40B futures volume with healthy liquidity. 7-day +15.10% uptrend with mature tokenomics (37.9% circulating). Recent $60M token unlock absorbed well, indicating market strength.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  LINK: Institutional Oracle (30%)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p>$9.41B market cap with $719.73M daily volume (highest quality liquidity). Long/Short 1.9753 shows strong institutional conviction. 30-day -6.65% creates accumulation opportunity. 70.8% circulating supply reduces vesting risk.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  APT: Post-Unlock Play (10%)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p>Jan 11 unlock (7 days) creates timing opportunity. If market absorbs well, significant upside potential. Move-based L1 provides diversification vs SUI. Smaller allocation manages unlock volatility risk.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-slate-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-slate-600" />
                  Cash Reserve: Risk Management (10%)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p>Dry powder for unexpected dips or better entry points. Flexibility to rebalance or capture weakness. January volatility may create superior opportunities. Protects against downside scenarios.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Macro Context */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Market Context</h2>
          <Card>
            <CardHeader>
              <CardTitle>January 2026 Crypto Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Positive Factors
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Bitcoin consolidating near $90K with institutional support</li>
                    <li>• Grayscale: "Dawn of the Institutional Era"</li>
                    <li>• Altcoin Season Index rising</li>
                    <li>• L1 blockchain season potentially beginning</li>
                    <li>• Regulatory clarity improving</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Risk Factors
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Early crypto winter signals (less chaotic)</li>
                    <li>• Market favoring projects with real utility</li>
                    <li>• Most altcoins may never recover</li>
                    <li>• Volatility remains elevated</li>
                    <li>• Speculation declining (quality matters more)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* January Execution Strategy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">January Execution Strategy</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Week 1 (Jan 4-10): Accumulation Phase</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p><strong>SUI:</strong> Accumulate 60% of position ($15,000) at current levels</p>
                <p><strong>LINK:</strong> Accumulate 50% of position ($7,500) at current levels</p>
                <p><strong>APT:</strong> Wait for Jan 11 unlock event</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Week 2 (Jan 11-17): Post-Unlock Assessment</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p><strong>APT:</strong> Monitor Jan 11 unlock reaction, accumulate if market absorbs well</p>
                <p><strong>SUI/LINK:</strong> Continue accumulation if momentum continues</p>
                <p><strong>Cash:</strong> Hold 50% for potential dips</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Week 3-4 (Jan 18-31): Final Positioning</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p><strong>NILLION:</strong> Monitor Jan 19 unlock (watch for cascade selling)</p>
                <p><strong>SUI/LINK:</strong> Complete positions if technicals remain bullish</p>
                <p><strong>Rebalance:</strong> Adjust based on market reaction to unlocks</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-12 bg-slate-100 p-6 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">Disclaimer</h3>
          <p className="text-sm text-slate-600">
            This analysis is provided for informational purposes only and should not be considered financial advice. Cryptocurrency markets are highly volatile and carry significant risk. Past performance does not guarantee future results. Always conduct your own research and consult with a qualified financial advisor before making investment decisions. The allocation recommendations are based on current market data and technical analysis and may change as market conditions evolve.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Crypto Market Analysis | January 4, 2026 | Prepared by Manus AI</p>
          <p className="mt-2">Data sourced from CoinMarketCap, CoinGecko, Coinglass, DEX Screener, and DropsTab</p>
        </div>
      </footer>
    </div>
  );
}
