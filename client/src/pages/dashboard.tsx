import Header from "@/components/layout/header";
import KPICards from "@/components/kpi-cards";
import MarketTrendChart from "@/components/charts/market-trend-chart";
import VacancyRateChart from "@/components/charts/vacancy-rate-chart";
import PropertyTable from "@/components/property-table";
import ActivityFeed from "@/components/activity-feed";
import MarketInsights from "@/components/market-insights";
import { useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header 
        title="ダッシュボード" 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <KPICards />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketTrendChart />
          <VacancyRateChart />
        </div>

        {/* Data Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PropertyTable />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>

        {/* Market Insights */}
        <MarketInsights />
      </div>
    </div>
  );
}
