import { 
  users, 
  properties, 
  marketData, 
  activities,
  type User, 
  type InsertUser,
  type Property,
  type InsertProperty,
  type MarketData,
  type InsertMarketData,
  type Activity,
  type InsertActivity
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property methods
  getProperties(userId: number): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty & { userId: number }): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;

  // Market data methods
  getMarketData(): Promise<MarketData[]>;
  getMarketDataByRegion(region: string): Promise<MarketData[]>;
  createMarketData(data: InsertMarketData): Promise<MarketData>;

  // Activity methods
  getActivities(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity & { userId: number }): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private marketData: Map<number, MarketData>;
  private activities: Map<number, Activity>;
  private currentUserId: number;
  private currentPropertyId: number;
  private currentMarketDataId: number;
  private currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.marketData = new Map();
    this.activities = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentMarketDataId = 1;
    this.currentActivityId = 1;

    // Initialize with sample market data
    this.initializeMarketData();
  }

  private initializeMarketData() {
    const sampleMarketData: InsertMarketData[] = [
      {
        region: "東京都渋谷区",
        averagePricePerSqm: "680000",
        vacancyRate: "3.2",
        propertyCount: 1245,
        monthlyChangePercent: "2.1",
        recordDate: new Date("2024-06-01"),
      },
      {
        region: "東京都新宿区",
        averagePricePerSqm: "720000",
        vacancyRate: "4.1",
        propertyCount: 987,
        monthlyChangePercent: "1.8",
        recordDate: new Date("2024-06-01"),
      },
      {
        region: "東京都港区",
        averagePricePerSqm: "950000",
        vacancyRate: "2.8",
        propertyCount: 756,
        monthlyChangePercent: "3.2",
        recordDate: new Date("2024-06-01"),
      },
      {
        region: "東京都世田谷区",
        averagePricePerSqm: "520000",
        vacancyRate: "5.3",
        propertyCount: 1432,
        monthlyChangePercent: "0.9",
        recordDate: new Date("2024-06-01"),
      },
      {
        region: "神奈川県横浜市",
        averagePricePerSqm: "450000",
        vacancyRate: "3.7",
        propertyCount: 2156,
        monthlyChangePercent: "-0.3",
        recordDate: new Date("2024-06-01"),
      },
    ];

    sampleMarketData.forEach(data => {
      this.createMarketData(data);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperties(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      property => property.userId === userId
    );
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(property: InsertProperty & { userId: number }): Promise<Property> {
    const id = this.currentPropertyId++;
    const newProperty: Property = { ...property, id };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;

    const updated: Property = { ...existing, ...property };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Market data methods
  async getMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketData.values());
  }

  async getMarketDataByRegion(region: string): Promise<MarketData[]> {
    return Array.from(this.marketData.values()).filter(
      data => data.region === region
    );
  }

  async createMarketData(data: InsertMarketData): Promise<MarketData> {
    const id = this.currentMarketDataId++;
    const newData: MarketData = { ...data, id };
    this.marketData.set(id, newData);
    return newData;
  }

  // Activity methods
  async getActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createActivity(activity: InsertActivity & { userId: number }): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = { 
      ...activity, 
      id, 
      createdAt: new Date() 
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }
}

export const storage = new MemStorage();
