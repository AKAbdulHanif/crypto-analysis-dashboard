import { trpc } from '@/lib/trpc';
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
    symbols,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    enabled = true
  } = options;

  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const { data, isLoading, error, refetch } = trpc.crypto.getPrices.useQuery(
    { symbols },
    {
      enabled,
      refetchInterval: refreshInterval,
      refetchOnWindowFocus: true,
      staleTime: refreshInterval / 2 // Consider data stale after half the refresh interval
    }
  );

  // Track last refresh time
  useEffect(() => {
    if (data?.success) {
      setLastRefresh(new Date());
    }
  }, [data]);

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
    prices: data?.data || [],
    isLoading,
    error: error?.message || data?.error,
    lastRefresh,
    refetch,
    formatPrice,
    formatMarketCap,
    formatVolume,
    isSuccess: data?.success || false
  };
}
