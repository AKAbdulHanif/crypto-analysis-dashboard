import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { TrendingUp, TrendingDown, Calendar, Target } from "lucide-react";

interface HistoricalPerformanceProps {
  symbol: string;
}

export default function HistoricalPerformance({ symbol }: HistoricalPerformanceProps) {
  const [days, setDays] = useState(30);

  const { data: prices, isLoading: pricesLoading } = trpc.archive.getHistoricalPrices.useQuery({
    symbol,
    days,
  });

  const { data: recommendations, isLoading: recsLoading } = trpc.archive.getHistoricalRecommendations.useQuery({
    symbol,
    days,
  });

  const { data: accuracy } = trpc.archive.getPredictionAccuracy.useQuery({
    symbol,
  });

  if (pricesLoading || recsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical Performance - {symbol}</CardTitle>
          <CardDescription>Loading historical data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const priceChange = prices && prices.length >= 2
    ? ((prices[0].price - prices[prices.length - 1].price) / prices[prices.length - 1].price) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Historical Performance - {symbol}</span>
          <div className="flex gap-2">
            <Badge variant={priceChange >= 0 ? "default" : "destructive"}>
              {priceChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {priceChange.toFixed(2)}% ({days}D)
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Track price history and recommendation accuracy over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prices" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prices">Price History</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          </TabsList>

          <TabsContent value="prices" className="space-y-4">
            <div className="flex gap-2 mb-4">
              {[7, 14, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1 rounded text-sm ${
                    days === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {prices && prices.length > 0 ? (
                prices.slice(0, 10).map((log, idx) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(log.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${log.price.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {log.priceChange24h && (
                        <Badge
                          variant={log.priceChange24h >= 0 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {log.priceChange24h >= 0 ? "+" : ""}
                          {log.priceChange24h.toFixed(2)}%
                        </Badge>
                      )}
                      {log.volume24h && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Vol: ${(log.volume24h / 1000000).toFixed(2)}M
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No price history available yet
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-2">
              {recommendations && recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-lg border bg-card space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            rec.action === "BUY"
                              ? "default"
                              : rec.action === "SELL"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {rec.action}
                        </Badge>
                        <Badge variant="outline">{rec.conviction}</Badge>
                        {rec.allocation && (
                          <Badge variant="secondary">{rec.allocation}%</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(rec.date).toLocaleDateString()}
                      </p>
                    </div>

                    {rec.reasoning && (
                      <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {rec.entryZoneMin && rec.entryZoneMax && (
                        <div>
                          <span className="text-muted-foreground">Entry: </span>
                          <span className="font-medium">
                            ${rec.entryZoneMin.toFixed(4)} - ${rec.entryZoneMax.toFixed(4)}
                          </span>
                        </div>
                      )}
                      {rec.stopLoss && (
                        <div>
                          <span className="text-muted-foreground">Stop Loss: </span>
                          <span className="font-medium text-destructive">
                            ${rec.stopLoss.toFixed(4)}
                          </span>
                        </div>
                      )}
                      {rec.takeProfit1 && (
                        <div>
                          <span className="text-muted-foreground">TP1: </span>
                          <span className="font-medium text-green-600">
                            ${rec.takeProfit1.toFixed(4)}
                          </span>
                        </div>
                      )}
                      {rec.predictedPriceChange && (
                        <div>
                          <span className="text-muted-foreground">Predicted: </span>
                          <span className={`font-medium ${rec.predictedPriceChange >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                            {rec.predictedPriceChange >= 0 ? "+" : ""}
                            {rec.predictedPriceChange.toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {rec.predictionAccurate !== "PENDING" && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Prediction: {rec.predictionAccurate}
                          </span>
                          {rec.actualPriceChange && (
                            <Badge variant="outline">
                              Actual: {rec.actualPriceChange >= 0 ? "+" : ""}
                              {rec.actualPriceChange.toFixed(2)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recommendations recorded yet
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="accuracy" className="space-y-4">
            {accuracy ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Predictions</CardDescription>
                    <CardTitle className="text-3xl">{accuracy.total}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Accurate</CardDescription>
                    <CardTitle className="text-3xl text-green-600">
                      {accuracy.accurate}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Inaccurate</CardDescription>
                    <CardTitle className="text-3xl text-destructive">
                      {accuracy.inaccurate}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Accuracy Rate</CardDescription>
                    <CardTitle className="text-3xl">
                      {accuracy.accuracyRate.toFixed(1)}%
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No accuracy data available yet
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
