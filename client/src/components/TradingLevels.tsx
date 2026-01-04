import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Target, Shield, AlertCircle } from 'lucide-react';

interface TradingLevel {
  symbol: string;
  name: string;
  currentPrice: string;
  allocation: string;
  entryZones: {
    optimal: string;
    acceptable: string;
    aggressive: string;
  };
  takeProfitTargets: {
    tp1: { price: string; percentage: string; description: string };
    tp2: { price: string; percentage: string; description: string };
    tp3: { price: string; percentage: string; description: string };
  };
  stopLoss: {
    price: string;
    percentage: string;
    reasoning: string;
  };
  keyLevels: {
    support: string[];
    resistance: string[];
  };
  technicalNotes: string;
}

const tradingLevels: TradingLevel[] = [
  {
    symbol: 'SUI',
    name: 'Sui Network',
    currentPrice: '$1.67',
    allocation: '$25,000 (50%)',
    entryZones: {
      optimal: '$1.55 - $1.62',
      acceptable: '$1.63 - $1.70',
      aggressive: '$1.71 - $1.75'
    },
    takeProfitTargets: {
      tp1: { price: '$1.92', percentage: '+15%', description: 'Near-term resistance, partial profit taking' },
      tp2: { price: '$2.17', percentage: '+30%', description: 'Major resistance zone, reduce 50% of position' },
      tp3: { price: '$2.51', percentage: '+50%', description: 'ATH retest, exit remaining position' }
    },
    stopLoss: {
      price: '$1.50',
      percentage: '-10%',
      reasoning: 'Below key support at $1.52, invalidates bullish structure'
    },
    keyLevels: {
      support: ['$1.52', '$1.42', '$1.28'],
      resistance: ['$1.75', '$1.92', '$2.17']
    },
    technicalNotes: 'HTF: Bullish trend intact with higher lows. LTF: Consolidating above $1.60 support. Volume profile shows strong accumulation. Long/Short ratio 1.88+ confirms institutional backing.'
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    currentPrice: '$13.31',
    allocation: '$15,000 (30%)',
    entryZones: {
      optimal: '$12.50 - $13.00',
      acceptable: '$13.01 - $13.50',
      aggressive: '$13.51 - $14.00'
    },
    takeProfitTargets: {
      tp1: { price: '$15.30', percentage: '+15%', description: 'First resistance cluster' },
      tp2: { price: '$17.30', percentage: '+30%', description: 'Major psychological level' },
      tp3: { price: '$19.30', percentage: '+45%', description: 'Previous local high' }
    },
    stopLoss: {
      price: '$12.00',
      percentage: '-10%',
      reasoning: 'Below 200-day MA and key horizontal support'
    },
    keyLevels: {
      support: ['$12.80', '$12.00', '$11.20'],
      resistance: ['$14.50', '$15.30', '$17.30']
    },
    technicalNotes: 'HTF: Consolidating after -6.65% monthly decline, creating accumulation zone. LTF: Testing support at $13.00. Institutional oracle play with 70.8% circulating supply reduces vesting risk.'
  },
  {
    symbol: 'APT',
    name: 'Aptos',
    currentPrice: '$1.91',
    allocation: '$5,000 (10%)',
    entryZones: {
      optimal: '$1.70 - $1.80 (post-unlock dip)',
      acceptable: '$1.81 - $1.95',
      aggressive: '$1.96 - $2.10'
    },
    takeProfitTargets: {
      tp1: { price: '$2.20', percentage: '+15%', description: 'Quick bounce target if unlock absorbed' },
      tp2: { price: '$2.48', percentage: '+30%', description: 'Resistance from previous consolidation' },
      tp3: { price: '$2.86', percentage: '+50%', description: 'Major resistance zone' }
    },
    stopLoss: {
      price: '$1.72',
      percentage: '-10%',
      reasoning: 'Below post-unlock support, indicates poor absorption'
    },
    keyLevels: {
      support: ['$1.80', '$1.65', '$1.50'],
      resistance: ['$2.05', '$2.20', '$2.48']
    },
    technicalNotes: 'CRITICAL: Jan 11 unlock (7 days). Wait for market reaction before entry. HTF: Uptrend with +1.74% daily. LTF: Approaching unlock event. Strategy: Monitor Jan 11-13 for dip, enter if support holds at $1.70-$1.80.'
  }
];

export function TradingLevels() {
  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Entry & Exit Strategy - High-Conviction Positions
          </CardTitle>
          <CardDescription>
            Precise support/resistance levels, take-profit targets, and stop-loss placements for January accumulation
          </CardDescription>
        </CardHeader>
      </Card>

      {tradingLevels.map((token) => (
        <Card key={token.symbol} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{token.name} ({token.symbol})</CardTitle>
                <CardDescription className="mt-1">
                  Current: <strong>{token.currentPrice}</strong> • Allocation: <strong>{token.allocation}</strong>
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                Active Position
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Entry Zones */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Entry Zones
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-green-700 mb-1">OPTIMAL ENTRY</p>
                  <p className="text-lg font-bold text-green-900">{token.entryZones.optimal}</p>
                  <p className="text-xs text-green-700 mt-1">Best risk/reward ratio</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">ACCEPTABLE ENTRY</p>
                  <p className="text-lg font-bold text-blue-900">{token.entryZones.acceptable}</p>
                  <p className="text-xs text-blue-700 mt-1">Current market range</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-orange-700 mb-1">AGGRESSIVE ENTRY</p>
                  <p className="text-lg font-bold text-orange-900">{token.entryZones.aggressive}</p>
                  <p className="text-xs text-orange-700 mt-1">FOMO zone, avoid if possible</p>
                </div>
              </div>
            </div>

            {/* Take Profit Targets */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                Take Profit Targets
              </h4>
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-green-900">TP1: {token.takeProfitTargets.tp1.price}</span>
                    <Badge className="bg-green-600 text-white">{token.takeProfitTargets.tp1.percentage}</Badge>
                  </div>
                  <p className="text-xs text-green-700">{token.takeProfitTargets.tp1.description}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-green-900">TP2: {token.takeProfitTargets.tp2.price}</span>
                    <Badge className="bg-green-600 text-white">{token.takeProfitTargets.tp2.percentage}</Badge>
                  </div>
                  <p className="text-xs text-green-700">{token.takeProfitTargets.tp2.description}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-green-900">TP3: {token.takeProfitTargets.tp3.price}</span>
                    <Badge className="bg-green-600 text-white">{token.takeProfitTargets.tp3.percentage}</Badge>
                  </div>
                  <p className="text-xs text-green-700">{token.takeProfitTargets.tp3.description}</p>
                </div>
              </div>
            </div>

            {/* Stop Loss */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600" />
                Stop Loss
              </h4>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-red-900">{token.stopLoss.price}</span>
                  <Badge className="bg-red-600 text-white">{token.stopLoss.percentage}</Badge>
                </div>
                <p className="text-sm text-red-700 font-semibold mb-1">Reasoning:</p>
                <p className="text-sm text-red-700">{token.stopLoss.reasoning}</p>
              </div>
            </div>

            {/* Key Levels */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Key Support & Resistance Levels</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">SUPPORT LEVELS</p>
                  <div className="space-y-1">
                    {token.keyLevels.support.map((level, idx) => (
                      <div key={idx} className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm font-semibold text-green-900">
                        S{idx + 1}: {level}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">RESISTANCE LEVELS</p>
                  <div className="space-y-1">
                    {token.keyLevels.resistance.map((level, idx) => (
                      <div key={idx} className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm font-semibold text-red-900">
                        R{idx + 1}: {level}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Technical Analysis Notes
              </h4>
              <p className="text-sm text-blue-800">{token.technicalNotes}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Risk Management Summary */}
      <Card className="border-l-4 border-l-orange-500 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Risk Management Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-slate-700 space-y-2">
            <li>• <strong>Position Sizing:</strong> Never exceed recommended allocation percentages (SUI 50%, LINK 30%, APT 10%)</li>
            <li>• <strong>Stop Loss Discipline:</strong> Set stop-loss orders immediately after entry. No exceptions.</li>
            <li>• <strong>Profit Taking:</strong> Scale out at each TP level (e.g., sell 33% at TP1, 33% at TP2, 34% at TP3)</li>
            <li>• <strong>Re-entry Strategy:</strong> If stopped out, wait for price to reclaim entry zone before re-entering</li>
            <li>• <strong>Cash Reserve:</strong> Keep 10% ($5,000) in stablecoins for unexpected dips or better opportunities</li>
            <li>• <strong>Volatility Management:</strong> Reduce position size by 50% if daily volatility exceeds 15%</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
