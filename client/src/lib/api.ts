import { apiRequest } from "./queryClient";
import type { Property, InsertProperty, MarketData, Activity, InsertActivity } from "@shared/schema";

export interface PortfolioAnalytics {
  totalValue: number;
  monthlyIncome: number;
  averageYield: number;
  vacancyRate: number;
  propertyCount: number;
  occupiedCount: number;
  vacantCount: number;
}

// Properties API
export const propertiesApi = {
  getAll: (): Promise<Property[]> =>
    fetch("/api/properties", { credentials: "include" }).then(res => res.json()),
  
  get: (id: number): Promise<Property> =>
    fetch(`/api/properties/${id}`, { credentials: "include" }).then(res => res.json()),
  
  create: async (property: InsertProperty): Promise<Property> => {
    const res = await apiRequest("POST", "/api/properties", property);
    return res.json();
  },
  
  update: async (id: number, property: Partial<InsertProperty>): Promise<Property> => {
    const res = await apiRequest("PUT", `/api/properties/${id}`, property);
    return res.json();
  },
  
  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/properties/${id}`);
  },
};

// Market Data API
export const marketDataApi = {
  getAll: (): Promise<MarketData[]> =>
    fetch("/api/market-data", { credentials: "include" }).then(res => res.json()),
  
  getByRegion: (region: string): Promise<MarketData[]> =>
    fetch(`/api/market-data/region/${encodeURIComponent(region)}`, { credentials: "include" })
      .then(res => res.json()),
};

// Activities API
export const activitiesApi = {
  getAll: (): Promise<Activity[]> =>
    fetch("/api/activities", { credentials: "include" }).then(res => res.json()),
  
  create: async (activity: InsertActivity): Promise<Activity> => {
    const res = await apiRequest("POST", "/api/activities", activity);
    return res.json();
  },
};

// Portfolio Analytics API
export const portfolioApi = {
  getAnalytics: (): Promise<PortfolioAnalytics> =>
    fetch("/api/portfolio/analytics", { credentials: "include" }).then(res => res.json()),
};
