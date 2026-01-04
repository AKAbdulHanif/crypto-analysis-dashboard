import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function MarketDominance() {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dominance');
        const result = await response.json();
        setData(result);
        setError(result.success ? null : result.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data?.success) {
      setLastRefresh(new Date());
    }
  }, [data]);

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
      <Card className="border-l-4 border-l-red-500">
        <CardContent className="pt-6">
          <p className="text-sm text-red-600">Failed to load market dominance data</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data?.data) {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
            Market Dominance & Altcoin Season Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-slate-200 rounded"></div>
              <div className="h-24 bg-slate-200 rounded"></div>
              <div className="h-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const dominanceData = data.data;
  const altSignal = dominanceData.altcoinSeasonSignal;

  const getSignalColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Market Dominance & Altcoin Season Tracker
              </CardTitle>
              <CardDescription>
                Real-time market share analysis to identify capital rotation and altcoin rally signals
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Updated {formatTimeAgo(lastRefresh)}
              </span>
              <Badge variant="secondary" className="text-xs">
                Auto-refresh: 5min
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Altcoin Season Signal */}
          <div className={`p-6 rounded-lg border-2 ${
            altSignal.isAltSeason 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
              : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {altSignal.isAltSeason ? '🚀 ALTCOIN SEASON ACTIVE' : '⏳ Bitcoin Dominance Phase'}
                </h3>
                <p className="text-sm text-slate-600">
                  {altSignal.isAltSeason 
                    ? 'Capital is rotating into altcoins - favorable conditions for ALT positions'
                    : 'Bitcoin dominance high - wait for rotation before aggressive ALT accumulation'}
                </p>
              </div>
              <Badge className={`${getSignalColor(altSignal.strength)} text-lg px-4 py-2`}>
                {altSignal.strength.toUpperCase()}
              </Badge>
            </div>

            {/* Signal Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`p-3 rounded-lg ${
                altSignal.indicators.btcDominanceFalling 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-red-100 border border-red-300'
              }`}>
                <p className="text-xs font-semibold text-slate-700 mb-1">BTC.D Falling</p>
                <p className={`text-sm font-bold ${
                  altSignal.indicators.btcDominanceFalling ? 'text-green-700' : 'text-red-700'
                }`}>
                  {altSignal.indicators.btcDominanceFalling ? '✓ YES' : '✗ NO'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                altSignal.indicators.othersDominanceRising 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-red-100 border border-red-300'
              }`}>
                <p className="text-xs font-semibold text-slate-700 mb-1">OTHERS.D Rising</p>
                <p className={`text-sm font-bold ${
                  altSignal.indicators.othersDominanceRising ? 'text-green-700' : 'text-red-700'
                }`}>
                  {altSignal.indicators.othersDominanceRising ? '✓ YES' : '✗ NO'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                altSignal.indicators.ethbtcRising 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-red-100 border border-red-300'
              }`}>
                <p className="text-xs font-semibold text-slate-700 mb-1">ETHBTC Rising</p>
                <p className={`text-sm font-bold ${
                  altSignal.indicators.ethbtcRising ? 'text-green-700' : 'text-red-700'
                }`}>
                  {altSignal.indicators.ethbtcRising ? '✓ YES' : '✗ NO'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                altSignal.indicators.stablecoinDominanceFalling 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-red-100 border border-red-300'
              }`}>
                <p className="text-xs font-semibold text-slate-700 mb-1">Stables Falling</p>
                <p className={`text-sm font-bold ${
                  altSignal.indicators.stablecoinDominanceFalling ? 'text-green-700' : 'text-red-700'
                }`}>
                  {altSignal.indicators.stablecoinDominanceFalling ? '✓ YES' : '✗ NO'}
                </p>
              </div>
            </div>
          </div>

          {/* Dominance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* BTC.D */}
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600">BTC.D</span>
                  {dominanceData.btcDominance.value < 50 ? (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {dominanceData.btcDominance.value.toFixed(2)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {dominanceData.btcDominance.value < 45 ? 'Low - ALT favorable' : 
                   dominanceData.btcDominance.value < 55 ? 'Moderate' : 'High - BTC dominant'}
                </p>
              </CardContent>
            </Card>

            {/* ETH.D */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600">ETH.D</span>
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {dominanceData.ethDominance.value.toFixed(2)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Ethereum share</p>
              </CardContent>
            </Card>

            {/* OTHERS.D */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600">OTHERS.D</span>
                  {dominanceData.othersDominance.value > 40 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {dominanceData.othersDominance.value.toFixed(2)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {dominanceData.othersDominance.value > 45 ? 'Strong ALT season' : 
                   dominanceData.othersDominance.value > 40 ? 'Moderate ALT season' : 'Weak ALTs'}
                </p>
              </CardContent>
            </Card>

            {/* USDT.D */}
            <Card className="border-l-4 border-l-teal-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600">USDT.D</span>
                  <Activity className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {dominanceData.usdtDominance.value.toFixed(2)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Tether dominance</p>
              </CardContent>
            </Card>

            {/* USDC.D */}
            <Card className="border-l-4 border-l-cyan-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600">USDC.D</span>
                  <Activity className="w-4 h-4 text-cyan-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {dominanceData.usdcDominance.value.toFixed(2)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">USDC dominance</p>
              </CardContent>
            </Card>

            {/* ETHBTC */}
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600">ETHBTC</span>
                  {dominanceData.ethbtc.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {dominanceData.ethbtc.value.toFixed(4)}
                </p>
                <p className={`text-xs font-semibold mt-1 ${
                  dominanceData.ethbtc.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dominanceData.ethbtc.change24h >= 0 ? '+' : ''}
                  {dominanceData.ethbtc.change24h.toFixed(2)}% (24h)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Guide */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                How to Read These Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-2">
              <p><strong>Altcoin Season Conditions:</strong> OTHERS.D &gt; 40% AND BTC.D &lt; 45% = favorable for ALT accumulation</p>
              <p><strong>BTC.D Falling:</strong> Capital rotating out of Bitcoin into altcoins (bullish for ALTs)</p>
              <p><strong>ETHBTC Rising:</strong> Ethereum outperforming Bitcoin = early altcoin strength signal</p>
              <p><strong>Stablecoin Dominance Falling:</strong> Money moving from sidelines into crypto (bullish overall)</p>
              <p><strong>Current Strategy:</strong> {altSignal.isAltSeason 
                ? 'Execute your SUI/LINK/APT accumulation plan aggressively. Market conditions favor altcoins.' 
                : 'Wait for BTC.D to drop below 50% before aggressive ALT positioning. Focus on quality over quantity.'}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
