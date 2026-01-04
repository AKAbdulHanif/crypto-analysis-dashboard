import { useEffect, useState } from 'react';

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  change7d: number;
  change30d: number;
  lastUpdated: string;
}

interface UseCryptoPricesOptions {
  symbols?: string[];
  refreshInterval?: number; // in milliseconds, default 5 minutes
  enabled?: boolean;
}

export function useCryptoPrices(options: UseCryptoPricesOptions = {}) {
  const {
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    enabled = true
  } = options;

  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchPrices = async () => {
    if (!enabled) return;
    
    try {
      setError(null);
      
      const response = await fetch('/api/prices');
      const result = await response.json();
      
      if (result.success) {
        setPrices(result.data);
        setLastRefresh(new Date());
        setIsLoading(false);
      } else {
        setError(result.error || 'Failed to fetch prices');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Price fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();

    if (enabled) {
      const interval = setInterval(fetchPrices, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [enabled, refreshInterval]);

  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else if (marketCap >= 1e3) {
      return `$${(marketCap / 1e3).toFixed(2)}K`;
    } else {
      return `$${marketCap.toFixed(0)}`;
    }
  };

  const formatVolume = (volume: number): string => {
    return formatMarketCap(volume);
  };

  return {
    prices,
    isLoading,
    error,
    lastRefresh,
    refetch: fetchPrices,
    formatPrice,
    formatMarketCap,
    formatVolume,
    isSuccess: !error && prices.length > 0
  };
}
