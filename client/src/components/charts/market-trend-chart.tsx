import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const mockData = {
  "東京都": [
    { month: "1月", price: 65 },
    { month: "2月", price: 67 },
    { month: "3月", price: 68 },
    { month: "4月", price: 66 },
    { month: "5月", price: 69 },
    { month: "6月", price: 68 },
  ],
  "大阪府": [
    { month: "1月", price: 45 },
    { month: "2月", price: 46 },
    { month: "3月", price: 47 },
    { month: "4月", price: 46 },
    { month: "5月", price: 48 },
    { month: "6月", price: 47 },
  ],
  "神奈川県": [
    { month: "1月", price: 52 },
    { month: "2月", price: 53 },
    { month: "3月", price: 54 },
    { month: "4月", price: 53 },
    { month: "5月", price: 55 },
    { month: "6月", price: 54 },
  ],
};

export default function MarketTrendChart() {
  const [selectedRegion, setSelectedRegion] = useState<keyof typeof mockData>("東京都");

  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-gray-900">市場トレンド</CardTitle>
        <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as keyof typeof mockData)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="東京都">東京都</SelectItem>
            <SelectItem value="大阪府">大阪府</SelectItem>
            <SelectItem value="神奈川県">神奈川県</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData[selectedRegion]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${value}万`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}万円/㎡`, "平均価格"]}
                labelStyle={{ color: "#666" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(207, 90%, 54%)"
                strokeWidth={3}
                dot={{ fill: "hsl(207, 90%, 54%)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(207, 90%, 54%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
