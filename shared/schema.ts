import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  region: text("region").notNull(),
  propertyType: text("property_type").notNull(), // "apartment", "house", "commercial"
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 12, scale: 2 }).notNull(),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  monthlyExpenses: decimal("monthly_expenses", { precision: 10, scale: 2 }).notNull().default("0"),
  buildingAge: integer("building_age").notNull(),
  area: decimal("area", { precision: 8, scale: 2 }).notNull(), // in square meters
  isOccupied: boolean("is_occupied").notNull().default(true),
  purchaseDate: timestamp("purchase_date").notNull(),
  userId: integer("user_id").notNull(),
});

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  region: text("region").notNull(),
  averagePricePerSqm: decimal("average_price_per_sqm", { precision: 10, scale: 2 }).notNull(),
  vacancyRate: decimal("vacancy_rate", { precision: 5, scale: 2 }).notNull(),
  propertyCount: integer("property_count").notNull(),
  monthlyChangePercent: decimal("monthly_change_percent", { precision: 5, scale: 2 }).notNull(),
  recordDate: timestamp("record_date").notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  activityType: text("activity_type").notNull(), // "income", "expense", "tenant_change", "maintenance"
  amount: decimal("amount", { precision: 10, scale: 2 }),
  propertyId: integer("property_id"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  userId: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type MarketData = typeof marketData.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
