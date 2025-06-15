import Header from "@/components/layout/header";
import KPICards from "@/components/kpi-cards";
import PropertyTable from "@/components/property-table";
import ActivityFeed from "@/components/activity-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { propertiesApi } from "@/lib/api";

export default function Portfolio() {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["/api/properties"],
    queryFn: propertiesApi.getAll,
  });

  const regionData = properties?.reduce((acc, property) => {
    const region = property.region;
    if (!acc[region]) {
      acc[region] = { region, count: 0, value: 0 };
    }
    acc[region].count += 1;
    acc[region].value += parseFloat(property.currentValue);
    return acc;
  }, {} as Record<string, { region: string; count: number; value: number }>);

  const pieData = regionData ? Object.values(regionData).map((item, index) => ({
    ...item,
    fill: ['#1976D2', '#4CAF50', '#FF6B35', '#FF9800', '#9C27B0'][index % 5]
  })) : [];

  const yieldData = properties?.map(property => ({
    name: property.name.length > 10 ? property.name.substring(0, 10) + "..." : property.name,
    yield: parseFloat(((parseFloat(property.monthlyRent) * 12) / parseFloat(property.currentValue) * 100).toFixed(1))
  })) || [];

  return (
    <div className="min-h-screen">
      <Header title="ポートフォリオ管理" onMenuClick={() => {}} />
      
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <KPICards />

        {/* Portfolio Analysis Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Distribution */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">地域別分散</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
              ) : pieData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ region, count }) => `${region}: ${count}件`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}件`, "物件数"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  データがありません
                </div>
              )}
            </CardContent>
          </Card>

          {/* Yield Analysis */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">物件別利回り</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
              ) : yieldData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#666"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        stroke="#666"
                        fontSize={12}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, "利回り"]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px"
                        }}
                      />
                      <Bar 
                        dataKey="yield" 
                        fill="hsl(207, 90%, 54%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  データがありません
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Property Table and Activity Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PropertyTable />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
