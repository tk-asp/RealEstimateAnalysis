import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { marketDataApi } from "@/lib/api";
import { TrendingUp, TrendingDown, Building } from "lucide-react";
import VacancyRateChart from "@/components/charts/vacancy-rate-chart";
import MarketTrendChart from "@/components/charts/market-trend-chart";

export default function MarketData() {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ["/api/market-data"],
    queryFn: marketDataApi.getAll,
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  return (
    <div className="min-h-screen">
      <Header title="市場データ" onMenuClick={() => {}} />
      
      <div className="p-6 space-y-6">
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketTrendChart />
          <VacancyRateChart />
        </div>

        {/* Market Overview */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                地域別市場概況
              </CardTitle>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全地域</SelectItem>
                  <SelectItem value="tokyo">東京都</SelectItem>
                  <SelectItem value="kanagawa">神奈川県</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">地域</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">平均価格/㎡</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">前月比</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">空室率</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">物件数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded"></div></td>
                      </tr>
                    ))
                  ) : (
                    marketData?.map((data) => {
                      const changeValue = parseFloat(data.monthlyChangePercent);
                      const isPositive = changeValue > 0;
                      
                      return (
                        <tr key={data.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <Building className="w-5 h-5 text-gray-400 mr-3" />
                              <span className="font-medium text-gray-900">{data.region}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {formatCurrency(data.averagePricePerSqm)}
                          </td>
                          <td className="py-4 px-6">
                            <div className={`flex items-center text-sm ${
                              isPositive ? 'text-real-estate-success' : 'text-real-estate-danger'
                            }`}>
                              {isPositive ? (
                                <TrendingUp className="w-4 h-4 mr-1" />
                              ) : (
                                <TrendingDown className="w-4 h-4 mr-1" />
                              )}
                              {changeValue > 0 ? '+' : ''}{changeValue}%
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {data.vacancyRate}%
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {data.propertyCount.toLocaleString()}件
                          </td>
                        </tr>
                      );
                    }) || []
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
