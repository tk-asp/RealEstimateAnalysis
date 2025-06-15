import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { marketDataApi } from "@/lib/api";
import { TrendingUp, TrendingDown, Shield, Bot } from "lucide-react";

export default function MarketInsights() {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ["/api/market-data"],
    queryFn: marketDataApi.getAll,
  });

  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>市場インサイト & 価格予測</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  // Mock AI predictions - in a real app this would come from an AI service
  const predictions = {
    aiPrice: 45200000,
    expectedYield: 5.4,
    confidence: 87
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            市場インサイト & 価格予測
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-sm">
              1ヶ月
            </Button>
            <Button size="sm" className="bg-real-estate-primary text-white">
              3ヶ月
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              1年
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Regional Market Data */}
          <div className="lg:col-span-2">
            <h4 className="text-md font-medium text-gray-900 mb-4">地域別市場データ</h4>
            <div className="space-y-4">
              {marketData?.slice(0, 3).map((region, index) => {
                const changeValue = parseFloat(region.monthlyChangePercent);
                const isPositive = changeValue > 0;
                
                return (
                  <div key={region.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-real-estate-primary' :
                        index === 1 ? 'bg-real-estate-success' :
                        'bg-real-estate-warning'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{region.region}</p>
                        <p className="text-sm text-gray-500">
                          物件数: {region.propertyCount.toLocaleString()}件
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(region.averagePricePerSqm)}/㎡
                      </p>
                      <p className={`text-sm flex items-center ${
                        isPositive ? 'text-real-estate-success' : 'text-real-estate-danger'
                      }`}>
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {changeValue > 0 ? '+' : ''}{changeValue}%
                      </p>
                    </div>
                  </div>
                );
              }) || []}
            </div>
          </div>

          {/* Price Prediction */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">価格予測</h4>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">AI予測価格</span>
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {new Intl.NumberFormat('ja-JP', {
                    style: 'currency',
                    currency: 'JPY'
                  }).format(predictions.aiPrice)}
                </p>
                <p className="text-sm text-blue-700 mt-1">3ヶ月後の推定価格</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">予想利回り</span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">{predictions.expectedYield}%</p>
                <p className="text-sm text-green-700 mt-1">来年度予想</p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-900">市場信頼度</span>
                  <Shield className="w-4 h-4 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-900">{predictions.confidence}%</p>
                <p className="text-sm text-yellow-700 mt-1">予測精度</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
