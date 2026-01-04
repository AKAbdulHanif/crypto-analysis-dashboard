import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Target, Shield, AlertCircle } from 'lucide-react';

interface TradingLevel {
  symbol: string;
  name: string;
  currentPrice: string;
  allocation: string;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid';
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
    recommendation: 'strong_buy',
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
    recommendation: 'strong_buy',
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
    recommendation: 'buy',
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
  },
  {
    symbol: 'SEI',
    name: 'Sei Network',
    currentPrice: '$0.1221',
    allocation: 'Watch Only',
    recommendation: 'hold',
    entryZones: {
      optimal: '$0.110 - $0.115',
      acceptable: '$0.116 - $0.125',
      aggressive: '$0.126 - $0.135'
    },
    takeProfitTargets: {
      tp1: { price: '$0.140', percentage: '+15%', description: 'First resistance' },
      tp2: { price: '$0.159', percentage: '+30%', description: 'Major resistance' },
      tp3: { price: '$0.183', percentage: '+50%', description: 'Previous high' }
    },
    stopLoss: {
      price: '$0.110',
      percentage: '-10%',
      reasoning: 'Below key support zone'
    },
    keyLevels: {
      support: ['$0.115', '$0.105', '$0.095'],
      resistance: ['$0.130', '$0.140', '$0.159']
    },
    technicalNotes: 'Feb 1 unlock creates uncertainty. Moderate volume $114.65M. Wait for post-unlock stabilization before entry. L1 with decent fundamentals but needs catalyst.'
  },
  {
    symbol: 'ASTER',
    name: 'Astar',
    currentPrice: '$0.71',
    allocation: 'Watch Only',
    recommendation: 'hold',
    entryZones: {
      optimal: '$0.65 - $0.68',
      acceptable: '$0.69 - $0.74',
      aggressive: '$0.75 - $0.80'
    },
    takeProfitTargets: {
      tp1: { price: '$0.82', percentage: '+15%', description: 'Near-term resistance' },
      tp2: { price: '$0.92', percentage: '+30%', description: 'Major level' },
      tp3: { price: '$1.07', percentage: '+50%', description: 'Previous consolidation' }
    },
    stopLoss: {
      price: '$0.64',
      percentage: '-10%',
      reasoning: 'Below support cluster'
    },
    keyLevels: {
      support: ['$0.68', '$0.62', '$0.55'],
      resistance: ['$0.75', '$0.82', '$0.92']
    },
    technicalNotes: 'Polkadot ecosystem play. $146M volume shows interest. Needs broader market strength. Monitor for breakout above $0.75.'
  },
  {
    symbol: 'SONIC',
    name: 'Sonic',
    currentPrice: '$0.0810',
    allocation: 'Speculative Only',
    recommendation: 'hold',
    entryZones: {
      optimal: '$0.070 - $0.075',
      acceptable: '$0.076 - $0.085',
      aggressive: '$0.086 - $0.095'
    },
    takeProfitTargets: {
      tp1: { price: '$0.093', percentage: '+15%', description: 'First target' },
      tp2: { price: '$0.105', percentage: '+30%', description: 'Resistance zone' },
      tp3: { price: '$0.122', percentage: '+50%', description: 'Major resistance' }
    },
    stopLoss: {
      price: '$0.073',
      percentage: '-10%',
      reasoning: 'Below accumulation zone'
    },
    keyLevels: {
      support: ['$0.075', '$0.068', '$0.060'],
      resistance: ['$0.085', '$0.093', '$0.105']
    },
    technicalNotes: 'Small-cap with $234M market cap. Low volume $27M. High risk/reward. Only for speculative allocation (<2% portfolio).'
  },
  {
    symbol: 'PYTH',
    name: 'Pyth Network',
    currentPrice: '$0.0638',
    allocation: 'Speculative Only',
    recommendation: 'hold',
    entryZones: {
      optimal: '$0.058 - $0.062',
      acceptable: '$0.063 - $0.068',
      aggressive: '$0.069 - $0.075'
    },
    takeProfitTargets: {
      tp1: { price: '$0.073', percentage: '+15%', description: 'Near resistance' },
      tp2: { price: '$0.083', percentage: '+30%', description: 'Major level' },
      tp3: { price: '$0.096', percentage: '+50%', description: 'Previous high' }
    },
    stopLoss: {
      price: '$0.057',
      percentage: '-10%',
      reasoning: 'Below support'
    },
    keyLevels: {
      support: ['$0.060', '$0.055', '$0.050'],
      resistance: ['$0.070', '$0.073', '$0.083']
    },
    technicalNotes: 'Oracle competitor to LINK. Low volume $14.3M. Needs market catalyst. Monitor for accumulation.'
  },
  {
    symbol: 'EIGEN',
    name: 'EigenLayer',
    currentPrice: '$0.38',
    allocation: 'Avoid',
    recommendation: 'avoid',
    entryZones: {
      optimal: '$0.32 - $0.35',
      acceptable: '$0.36 - $0.40',
      aggressive: '$0.41 - $0.45'
    },
    takeProfitTargets: {
      tp1: { price: '$0.44', percentage: '+15%', description: 'Quick scalp only' },
      tp2: { price: '$0.49', percentage: '+30%', description: 'Resistance' },
      tp3: { price: '$0.57', percentage: '+50%', description: 'Major resistance' }
    },
    stopLoss: {
      price: '$0.34',
      percentage: '-10%',
      reasoning: 'Below support'
    },
    keyLevels: {
      support: ['$0.35', '$0.30', '$0.25'],
      resistance: ['$0.42', '$0.44', '$0.49']
    },
    technicalNotes: 'High volatility (+9.72% today). Restaking narrative but execution risk. Avoid until proven use case emerges.'
  },
  {
    symbol: 'SYRUP',
    name: 'Maple Finance',
    currentPrice: '$0.3547',
    allocation: 'Avoid',
    recommendation: 'avoid',
    entryZones: {
      optimal: '$0.30 - $0.32',
      acceptable: '$0.33 - $0.37',
      aggressive: '$0.38 - $0.42'
    },
    takeProfitTargets: {
      tp1: { price: '$0.41', percentage: '+15%', description: 'Scalp target' },
      tp2: { price: '$0.46', percentage: '+30%', description: 'Resistance' },
      tp3: { price: '$0.53', percentage: '+50%', description: 'Major resistance' }
    },
    stopLoss: {
      price: '$0.32',
      percentage: '-10%',
      reasoning: 'Below support'
    },
    keyLevels: {
      support: ['$0.33', '$0.28', '$0.23'],
      resistance: ['$0.38', '$0.41', '$0.46']
    },
    technicalNotes: 'DeFi lending protocol. -4.03% today. Low conviction. Sector facing headwinds. Avoid.'
  },
  {
    symbol: 'NIL',
    name: 'Nillion',
    currentPrice: '$0.0765',
    allocation: 'Avoid',
    recommendation: 'avoid',
    entryZones: {
      optimal: '$0.050 - $0.055 (post-unlock crash)',
      acceptable: '$0.056 - $0.065',
      aggressive: 'DO NOT ENTER'
    },
    takeProfitTargets: {
      tp1: { price: '$0.088', percentage: '+15%', description: 'Only if unlock absorbed' },
      tp2: { price: '$0.099', percentage: '+30%', description: 'Unlikely target' },
      tp3: { price: '$0.115', percentage: '+50%', description: 'Avoid entirely' }
    },
    stopLoss: {
      price: '$0.069',
      percentage: '-10%',
      reasoning: 'Cut losses immediately'
    },
    keyLevels: {
      support: ['$0.070', '$0.060', '$0.050'],
      resistance: ['$0.080', '$0.088', '$0.099']
    },
    technicalNotes: 'CRITICAL AVOID: Jan 19 unlock (45% supply). Micro-cap $22.4M. Extreme selling pressure expected. Only consider 30+ days post-unlock if price stabilizes.'
  },
  {
    symbol: 'ALLO',
    name: 'Allora',
    currentPrice: '$0.1213',
    allocation: 'Avoid',
    recommendation: 'avoid',
    entryZones: {
      optimal: '$0.080 - $0.090 (post-unlock)',
      acceptable: '$0.091 - $0.105',
      aggressive: 'DO NOT ENTER'
    },
    takeProfitTargets: {
      tp1: { price: '$0.140', percentage: '+15%', description: 'Only post-unlock' },
      tp2: { price: '$0.158', percentage: '+30%', description: 'Unlikely' },
      tp3: { price: '$0.182', percentage: '+50%', description: 'Avoid' }
    },
    stopLoss: {
      price: '$0.109',
      percentage: '-10%',
      reasoning: 'Exit immediately'
    },
    keyLevels: {
      support: ['$0.110', '$0.095', '$0.080'],
      resistance: ['$0.130', '$0.140', '$0.158']
    },
    technicalNotes: 'Jan 25 unlock (35% supply). Micro-cap $24.4M. High volume $20.21M suggests speculation. Wait 2-3 weeks post-unlock before considering.'
  },
  {
    symbol: 'FARTCOIN',
    name: 'Fartcoin',
    currentPrice: '$0.334',
    allocation: 'Avoid',
    recommendation: 'avoid',
    entryZones: {
      optimal: 'N/A - Meme coin',
      acceptable: 'N/A',
      aggressive: 'DO NOT ENTER'
    },
    takeProfitTargets: {
      tp1: { price: 'N/A', percentage: 'N/A', description: 'Pure speculation' },
      tp2: { price: 'N/A', percentage: 'N/A', description: 'No technical basis' },
      tp3: { price: 'N/A', percentage: 'N/A', description: 'Avoid entirely' }
    },
    stopLoss: {
      price: 'N/A',
      percentage: 'N/A',
      reasoning: 'Do not enter position'
    },
    keyLevels: {
      support: ['N/A'],
      resistance: ['N/A']
    },
    technicalNotes: 'Meme coin with no fundamental value. $87.36M volume suggests pump/dump activity. Rational analysis not applicable. AVOID for serious portfolio.'
  }
];

const recommendationConfig = {
  strong_buy: { color: 'border-green-500', badge: 'bg-green-100 text-green-800' },
  buy: { color: 'border-blue-500', badge: 'bg-blue-100 text-blue-800' },
  hold: { color: 'border-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
  avoid: { color: 'border-red-500', badge: 'bg-red-100 text-red-800' }
};

export function TradingLevels() {
  // Group tokens by recommendation
  const strongBuyTokens = tradingLevels.filter(t => t.recommendation === 'strong_buy');
  const buyTokens = tradingLevels.filter(t => t.recommendation === 'buy');
  const holdTokens = tradingLevels.filter(t => t.recommendation === 'hold');
  const avoidTokens = tradingLevels.filter(t => t.recommendation === 'avoid');

  const renderTokenCard = (token: TradingLevel) => {
    const config = recommendationConfig[token.recommendation];
    
    return (
      <Card key={token.symbol} className={`border-l-4 ${config.color}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{token.name} ({token.symbol})</CardTitle>
              <CardDescription className="mt-1">
                Current: <strong>{token.currentPrice}</strong> • Allocation: <strong>{token.allocation}</strong>
              </CardDescription>
            </div>
            <Badge className={config.badge}>
              {token.recommendation.replace('_', ' ').toUpperCase()}
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
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">ACCEPTABLE ENTRY</p>
                <p className="text-lg font-bold text-blue-900">{token.entryZones.acceptable}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-orange-700 mb-1">AGGRESSIVE ENTRY</p>
                <p className="text-lg font-bold text-orange-900">{token.entryZones.aggressive}</p>
              </div>
            </div>
          </div>

          {/* Take Profit Targets */}
          {token.takeProfitTargets.tp1.price !== 'N/A' && (
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
          )}

          {/* Stop Loss */}
          {token.stopLoss.price !== 'N/A' && (
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
                <p className="text-sm text-red-700">{token.stopLoss.reasoning}</p>
              </div>
            </div>
          )}

          {/* Key Levels */}
          {token.keyLevels.support[0] !== 'N/A' && (
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
          )}

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
    );
  };

  return (
    <div className="space-y-8">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Entry & Exit Strategy - All 12 Tokens Analyzed
          </CardTitle>
          <CardDescription>
            Comprehensive trading levels for every token in the analysis, grouped by recommendation strength
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Strong Buy Tokens */}
      {strongBuyTokens.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Strong Buy - High Conviction Positions
          </h3>
          <div className="space-y-6">
            {strongBuyTokens.map(renderTokenCard)}
          </div>
        </div>
      )}

      {/* Buy Tokens */}
      {buyTokens.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            Buy - Moderate Conviction
          </h3>
          <div className="space-y-6">
            {buyTokens.map(renderTokenCard)}
          </div>
        </div>
      )}

      {/* Hold Tokens */}
      {holdTokens.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            Hold - Watch Only
          </h3>
          <div className="space-y-6">
            {holdTokens.map(renderTokenCard)}
          </div>
        </div>
      )}

      {/* Avoid Tokens */}
      {avoidTokens.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            Avoid - High Risk / Unfavorable
          </h3>
          <div className="space-y-6">
            {avoidTokens.map(renderTokenCard)}
          </div>
        </div>
      )}

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
            <li>• <strong>Position Sizing:</strong> Never exceed recommended allocation percentages. Strong Buy = 80% total, Buy = 10%, Hold/Avoid = 0%</li>
            <li>• <strong>Stop Loss Discipline:</strong> Set stop-loss orders immediately after entry. No exceptions, no emotional holds.</li>
            <li>• <strong>Profit Taking:</strong> Scale out at each TP level (e.g., sell 33% at TP1, 33% at TP2, 34% at TP3)</li>
            <li>• <strong>Re-entry Strategy:</strong> If stopped out, wait for price to reclaim entry zone before re-entering</li>
            <li>• <strong>Cash Reserve:</strong> Keep 10% ($5,000) in stablecoins for unexpected dips or better opportunities</li>
            <li>• <strong>Unlock Events:</strong> Reduce exposure 7 days before major unlocks, re-enter post-stabilization</li>
            <li>• <strong>Avoid Category:</strong> Do not enter positions in "Avoid" tokens unless you have specific contrarian thesis with 2% max allocation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
