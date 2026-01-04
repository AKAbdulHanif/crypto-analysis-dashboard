import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Activity, Users, Wallet } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface SmartMoneyIndicatorProps {
  symbols: string[];
}

export function SmartMoneyIndicator({ symbols }: SmartMoneyIndicatorProps) {
  const { data, isLoading, error } = trpc.nansen.getTokenData.useQuery(
    { symbols },
    { refetchInterval: 300000 } // Refresh every 5 minutes
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Smart Money Analytics (Nansen)
          </CardTitle>
          <CardDescription>Loading on-chain intelligence...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.success) {
    return (
      <Card className="border-yellow-300 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <Activity className="w-5 h-5" />
            Smart Money Analytics (Nansen)
          </CardTitle>
          <CardDescription className="text-yellow-700">
            {error?.message || data?.error || 'Unable to load Nansen data at this time'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const tokens = data.data || [];

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'bearish':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Smart Money Analytics (Nansen)
            </CardTitle>
            <CardDescription>
              Real-time on-chain intelligence • Institutional & whale activity tracking
            </CardDescription>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            Live Data
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token: any) => {
            const buyPressureNum = parseFloat(token.buyPressure || '50');
            const isBullish = buyPressureNum > 55;
            const isBearish = buyPressureNum < 45;

            return (
              <Card key={token.symbol} className={`border-2 ${
                isBullish ? 'border-green-300 bg-green-50' :
                isBearish ? 'border-red-300 bg-red-50' :
                'border-gray-300 bg-gray-50'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{token.symbol}</CardTitle>
                    <Badge className={getSignalColor(token.smartMoneySignal)}>
                      {token.smartMoneySignal.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {token.chain.toUpperCase()} • {token.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Price from Nansen */}
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm font-semibold text-slate-700">Price</span>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">
                        ${token.price.toFixed(token.price < 1 ? 4 : 2)}
                      </div>
                      <div className={`text-xs font-semibold ${
                        token.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Smart Money Holders */}
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-200">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-900">Smart Money</span>
                    </div>
                    <span className="font-bold text-purple-900">{token.smartMoneyHolders}</span>
                  </div>

                  {/* Fresh Wallets */}
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">Fresh Wallets 24h</span>
                    </div>
                    <span className="font-bold text-blue-900">{token.freshWallets24h}</span>
                  </div>

                  {/* Buy Pressure */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Buy Pressure</span>
                      <span className={`font-bold ${
                        isBullish ? 'text-green-600' : isBearish ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {token.buyPressure}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          isBullish ? 'bg-green-500' : isBearish ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${token.buyPressure}%` }}
                      />
                    </div>
                  </div>

                  {/* Volume 24h */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t">
                    <span className="text-slate-600">24h Volume</span>
                    <span className="font-semibold text-slate-900">
                      ${(token.volume24h / 1000000).toFixed(2)}M
                    </span>
                  </div>

                  {/* Holder Count */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Total Holders</span>
                    <span className="font-semibold text-slate-900">
                      {token.holderCount.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Insight */}
        <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Smart Money Insights
          </h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• <strong>Smart Money Holders:</strong> Number of institutional/whale wallets holding the token</li>
            <li>• <strong>Fresh Wallets:</strong> New unique addresses buying in the last 24h (indicates retail interest)</li>
            <li>• <strong>Buy Pressure:</strong> Ratio of buy volume to total volume (&gt;55% = bullish, &lt;45% = bearish)</li>
            <li>• <strong>Signal:</strong> Bullish (&gt;10 smart money holders), Neutral (5-10), Bearish (&lt;5)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
