import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface TokenMetrics {
  name: string;
  symbol: string;
  price: string;
  marketCap: string;
  change24h: number;
  volume: string;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid';
  score: number;
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
    score: 8.5
  },
  {
    name: "Sei Network",
    symbol: "SEI",
    price: "$0.1221",
    marketCap: "$794M",
    change24h: -0.57,
    volume: "$114.65M",
    recommendation: 'hold',
    score: 5.5
  },
  {
    name: "Maple Finance",
    symbol: "SYRUP",
    price: "$0.3547",
    marketCap: "$404M",
    change24h: -4.03,
    volume: "$22.29M",
    recommendation: 'avoid',
    score: 4.0
  },
  {
    name: "Nillion",
    symbol: "NIL",
    price: "$0.0765",
    marketCap: "$22.4M",
    change24h: -2.24,
    volume: "$6.23M",
    recommendation: 'avoid',
    score: 3.0
  },
  {
    name: "Allora",
    symbol: "ALLO",
    price: "$0.1213",
    marketCap: "$24.4M",
    change24h: 3.09,
    volume: "$20.21M",
    recommendation: 'avoid',
    score: 4.0
  }
];

const recommendationConfig = {
  strong_buy: { label: 'Strong Buy', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  buy: { label: 'Buy', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  hold: { label: 'Hold', color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp },
  avoid: { label: 'Avoid', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
};

export default function Home() {
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
        {/* Executive Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Executive Summary</h2>
          <Card className="border-l-4 border-l-blue-500 bg-white">
            <CardHeader>
              <CardTitle>Portfolio Allocation for $10,000</CardTitle>
              <CardDescription>Data-driven recommendations based on technical analysis, on-chain metrics, and macro conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-700 mb-2">SUI ALLOCATION</p>
                  <p className="text-3xl font-bold text-green-900">$6,000</p>
                  <p className="text-sm text-green-700 mt-2">60% - Strong fundamentals & bullish setup</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-700 mb-2">SEI ALLOCATION</p>
                  <p className="text-3xl font-bold text-blue-900">$2,000</p>
                  <p className="text-sm text-blue-700 mt-2">20% - Moderate risk-reward profile</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-2">CASH RESERVE</p>
                  <p className="text-3xl font-bold text-slate-900">$2,000</p>
                  <p className="text-sm text-slate-700 mt-2">20% - Risk management & opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Token Analysis Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Token Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token) => {
              const config = recommendationConfig[token.recommendation];
              const Icon = config.icon;
              return (
                <Card key={token.symbol} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-lg">{token.name}</CardTitle>
                        <CardDescription>{token.symbol}</CardDescription>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Findings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  SUI: Strong Accumulation Signal
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                <ul className="space-y-2">
                  <li>• Long/Short ratio 1.88+ (extremely bullish)</li>
                  <li>• $1.40B futures volume (healthy liquidity)</li>
                  <li>• 7-day performance +15.10%</li>
                  <li>• Recent token unlock absorbed well</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  SEI: Moderate Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                <ul className="space-y-2">
                  <li>• L1 blockchain with potential for rotation</li>
                  <li>• Weaker technicals vs SUI</li>
                  <li>• 30-day performance -10.05%</li>
                  <li>• Suitable for diversification only</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  High-Risk Tokens: SYRUP, NILLION, ALLORA
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                <ul className="space-y-2">
                  <li>• NILLION: 71% of supply locked (extreme vesting risk)</li>
                  <li>• ALLORA: 79.58% locked or untracked (unfavorable tokenomics)</li>
                  <li>• SYRUP: Bearish setup, low growth potential</li>
                  <li>• All three show speculative volume patterns (not fundamental demand)</li>
                </ul>
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
