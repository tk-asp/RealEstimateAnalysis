import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { marketDataApi } from "@/lib/api";

export default function VacancyRateChart() {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ["/api/market-data"],
    queryFn: marketDataApi.getAll,
  });

  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>地域別空室率</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const chartData = marketData?.map((data, index) => ({
    region: data.region.replace(/東京都|神奈川県/, "").replace(/市|区/, ""),
    vacancyRate: parseFloat(data.vacancyRate),
    fill: [
      "hsl(207, 90%, 54%)",
      "hsl(122, 39%, 49%)",
      "hsl(14, 100%, 60%)",
      "hsl(36, 100%, 50%)",
      "hsl(270, 50%, 40%)"
    ][index % 5]
  })) || [];

  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-gray-900">地域別空室率</CardTitle>
        <Button variant="ghost" size="sm" className="text-real-estate-primary hover:text-blue-700">
          詳細を見る
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="region" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, "空室率"]}
                labelStyle={{ color: "#666" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px"
                }}
              />
              <Bar 
                dataKey="vacancyRate" 
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
