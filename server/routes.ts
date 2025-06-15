import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertActivitySchema, insertMarketDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Properties endpoints
  app.get("/api/properties", async (req, res) => {
    try {
      // In a real app, get userId from session/auth
      const userId = 1; // Mock user ID
      const properties = await storage.getProperties(userId);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const userId = 1; // Mock user ID
      
      const property = await storage.createProperty({ ...validatedData, userId });
      
      // Create activity for new property
      await storage.createActivity({
        title: "新規物件追加",
        description: `${property.name}を追加しました`,
        activityType: "income",
        propertyId: property.id,
        userId,
      });
      
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPropertySchema.partial().parse(req.body);
      
      const property = await storage.updateProperty(id, validatedData);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProperty(id);
      
      if (!success) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Market data endpoints
  app.get("/api/market-data", async (req, res) => {
    try {
      const marketData = await storage.getMarketData();
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.get("/api/market-data/region/:region", async (req, res) => {
    try {
      const region = decodeURIComponent(req.params.region);
      const marketData = await storage.getMarketDataByRegion(region);
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data for region" });
    }
  });

  // Activities endpoints
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const activities = await storage.getActivities(userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const userId = 1; // Mock user ID
      
      const activity = await storage.createActivity({ ...validatedData, userId });
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Portfolio analytics endpoints
  app.get("/api/portfolio/analytics", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const properties = await storage.getProperties(userId);
      
      const totalValue = properties.reduce((sum, p) => sum + parseFloat(p.currentValue), 0);
      const monthlyIncome = properties.reduce((sum, p) => sum + parseFloat(p.monthlyRent), 0);
      const monthlyExpenses = properties.reduce((sum, p) => sum + parseFloat(p.monthlyExpenses), 0);
      const netMonthlyIncome = monthlyIncome - monthlyExpenses;
      const averageYield = totalValue > 0 ? (netMonthlyIncome * 12) / totalValue * 100 : 0;
      const vacantProperties = properties.filter(p => !p.isOccupied).length;
      const vacancyRate = properties.length > 0 ? (vacantProperties / properties.length) * 100 : 0;
      
      const analytics = {
        totalValue,
        monthlyIncome: netMonthlyIncome,
        averageYield: Math.round(averageYield * 10) / 10,
        vacancyRate: Math.round(vacancyRate * 10) / 10,
        propertyCount: properties.length,
        occupiedCount: properties.filter(p => p.isOccupied).length,
        vacantCount: vacantProperties,
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
