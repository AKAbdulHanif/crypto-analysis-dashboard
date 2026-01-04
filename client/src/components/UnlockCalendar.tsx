import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Calendar, TrendingDown } from 'lucide-react';

interface TokenUnlock {
  symbol: string;
  name: string;
  unlockDate: string;
  daysUntil: number;
  unlockAmount: string;
  percentOfSupply: number;
  estimatedValue: string;
  risk: 'high' | 'medium' | 'low';
  impact: string;
}

const unlockEvents: TokenUnlock[] = [
  {
    symbol: 'APT',
    name: 'Aptos',
    unlockDate: 'January 11, 2026',
    daysUntil: 7,
    unlockAmount: '11.31M APT',
    percentOfSupply: 2.4,
    estimatedValue: '$21.6M',
    risk: 'medium',
    impact: 'Post-unlock dip possible, but market has absorbed previous unlocks well. Strong accumulation opportunity if price holds.'
  },
  {
    symbol: 'NIL',
    name: 'Nillion',
    unlockDate: 'January 19, 2026',
    daysUntil: 15,
    unlockAmount: '~50M NIL',
    percentOfSupply: 45,
    estimatedValue: '$3.8M',
    risk: 'high',
    impact: 'CRITICAL: 45% supply unlock creates extreme selling pressure. Micro-cap status amplifies volatility. Avoid until post-unlock stabilization.'
  },
  {
    symbol: 'ALLO',
    name: 'Allora',
    unlockDate: 'January 25, 2026',
    daysUntil: 21,
    unlockAmount: '~30M ALLO',
    percentOfSupply: 35,
    estimatedValue: '$3.6M',
    risk: 'high',
    impact: 'Major unlock event for micro-cap token. High probability of cascade selling. Monitor post-unlock for potential entry.'
  },
  {
    symbol: 'SEI',
    name: 'Sei Network',
    unlockDate: 'February 1, 2026',
    daysUntil: 28,
    unlockAmount: '~80M SEI',
    percentOfSupply: 12,
    estimatedValue: '$9.8M',
    risk: 'medium',
    impact: 'Moderate unlock for established L1. Market depth should absorb selling pressure. Watch for accumulation zone.'
  }
];

const riskConfig = {
  high: { color: 'bg-red-100 text-red-800 border-red-300', icon: AlertTriangle },
  medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: TrendingDown },
  low: { color: 'bg-green-100 text-green-800 border-green-300', icon: Calendar }
};

export function UnlockCalendar() {
  const sortedUnlocks = [...unlockEvents].sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Token Unlock Calendar - January 2026
            </CardTitle>
            <CardDescription>
              Upcoming unlock events that may impact prices and create accumulation opportunities
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            Next 30 Days
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline visualization */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>
            <div className="space-y-6">
              {sortedUnlocks.map((unlock, index) => {
                const config = riskConfig[unlock.risk];
                const Icon = config.icon;
                
                return (
                  <div key={unlock.symbol} className="relative pl-16">
                    {/* Timeline dot */}
                    <div className={`absolute left-6 top-1 w-5 h-5 rounded-full border-2 ${
                      unlock.risk === 'high' ? 'bg-red-500 border-red-600' :
                      unlock.risk === 'medium' ? 'bg-yellow-500 border-yellow-600' :
                      'bg-green-500 border-green-600'
                    } flex items-center justify-center`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>

                    {/* Event card */}
                    <Card className={`border-l-4 ${
                      unlock.risk === 'high' ? 'border-l-red-500 bg-red-50/50' :
                      unlock.risk === 'medium' ? 'border-l-yellow-500 bg-yellow-50/50' :
                      'border-l-green-500 bg-green-50/50'
                    }`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-slate-900">{unlock.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {unlock.symbol}
                              </Badge>
                              <Badge className={config.color}>
                                <Icon className="w-3 h-3 mr-1" />
                                {unlock.risk.toUpperCase()} RISK
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {unlock.unlockDate} • <strong>{unlock.daysUntil} days</strong>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3 pb-3 border-b border-slate-200">
                          <div>
                            <p className="text-xs text-slate-500 font-semibold mb-1">UNLOCK AMOUNT</p>
                            <p className="text-sm font-bold text-slate-900">{unlock.unlockAmount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-semibold mb-1">% OF SUPPLY</p>
                            <p className="text-sm font-bold text-slate-900">{unlock.percentOfSupply}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-semibold mb-1">EST. VALUE</p>
                            <p className="text-sm font-bold text-slate-900">{unlock.estimatedValue}</p>
                          </div>
                        </div>

                        <div className={`p-3 rounded-lg ${
                          unlock.risk === 'high' ? 'bg-red-100' :
                          unlock.risk === 'medium' ? 'bg-yellow-100' :
                          'bg-green-100'
                        }`}>
                          <p className="text-xs font-semibold text-slate-700 mb-1">MARKET IMPACT ANALYSIS</p>
                          <p className="text-sm text-slate-700">{unlock.impact}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              Trading Strategy Around Unlocks
            </h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• <strong>Pre-unlock (7-14 days):</strong> Reduce exposure or take profits as selling pressure builds</li>
              <li>• <strong>Unlock day:</strong> Expect volatility; avoid new positions until dust settles</li>
              <li>• <strong>Post-unlock (3-7 days):</strong> Monitor for accumulation zones if price stabilizes</li>
              <li>• <strong>High-risk unlocks (NIL, ALLO):</strong> Avoid entirely until market absorbs supply</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
