import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, JapaneseYen, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi } from "@/lib/api";

export default function KPICards() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/portfolio/analytics"],
    queryFn: portfolioApi.getAnalytics,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const kpis = [
    {
      title: "総資産価値",
      value: formatCurrency(analytics.totalValue),
      change: "+2.3%",
      changeType: "increase" as const,
      icon: JapaneseYen,
      bgColor: "bg-blue-50",
      iconColor: "text-real-estate-primary"
    },
    {
      title: "月間収益",
      value: formatCurrency(analytics.monthlyIncome),
      change: "+1.2%",
      changeType: "increase" as const,
      icon: TrendingUp,
      bgColor: "bg-green-50",
      iconColor: "text-real-estate-success"
    },
    {
      title: "利回り",
      value: `${analytics.averageYield}%`,
      change: "年間平均",
      changeType: "neutral" as const,
      icon: TrendingUp,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "空室率",
      value: `${analytics.vacancyRate}%`,
      change: "-0.5%",
      changeType: "decrease" as const,
      icon: Home,
      bgColor: "bg-orange-50",
      iconColor: "text-real-estate-warning"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <p className={`text-sm mt-1 flex items-center ${
                  kpi.changeType === "increase" ? "text-real-estate-success" :
                  kpi.changeType === "decrease" ? "text-real-estate-warning" :
                  "text-gray-500"
                }`}>
                  {kpi.changeType === "increase" && <TrendingUp className="w-3 h-3 mr-1" />}
                  {kpi.changeType === "decrease" && <TrendingDown className="w-3 h-3 mr-1" />}
                  前月比 {kpi.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                <kpi.icon className={`${kpi.iconColor} w-6 h-6`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
