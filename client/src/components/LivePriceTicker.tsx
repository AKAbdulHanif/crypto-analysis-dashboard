import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface LivePriceTickerProps {
  symbols: string[];
}

export function LivePriceTicker({ symbols }: LivePriceTickerProps) {
  const { prices, isLoading, error, lastRefresh, refetch, formatPrice, isSuccess } = useCryptoPrices({
    symbols,
    refreshInterval: 5 * 60 * 1000 // 5 minutes
  });

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-600">Failed to load live prices: {error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          className="mt-2"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Live Market Prices</h3>
          <Badge variant="secondary" className="text-xs">
            Auto-refresh: 5min
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {isLoading ? 'Updating...' : `Updated ${formatTimeAgo(lastRefresh)}`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="h-7 w-7 p-0"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {isLoading && prices.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {symbols.map((symbol) => (
            <div key={symbol} className="bg-white rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-12 mb-2"></div>
              <div className="h-6 bg-slate-200 rounded w-20 mb-1"></div>
              <div className="h-3 bg-slate-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {prices.map((token) => (
            <div
              key={token.symbol}
              className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow border border-slate-100"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">{token.symbol}</span>
                {token.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
              </div>
              <div className="text-lg font-bold text-slate-900 mb-1">
                {formatPrice(token.price)}
              </div>
              <div className={`text-xs font-semibold ${
                token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSuccess && !isLoading && (
        <p className="text-xs text-slate-500 text-center mt-2">
          Price data unavailable. Using static values.
        </p>
      )}
    </div>
  );
}
