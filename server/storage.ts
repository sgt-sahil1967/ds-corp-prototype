import {
  type Rfq,
  type InsertRfq,
  type Product,
  type InsertProduct,
  type AdminUser,
  type InsertAdminUser,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // RFQ operations
  createRfq(rfq: InsertRfq): Promise<Rfq>;
  getRfq(id: string): Promise<Rfq | undefined>;
  getAllRfqs(): Promise<Rfq[]>;
  updateRfq(id: string, updates: Partial<Rfq>): Promise<Rfq | undefined>;

  // Product operations
  createProduct(product: InsertProduct & { rfqId: string }): Promise<Product>;
  getProductsByRfqId(rfqId: string): Promise<Product[]>;

  // Admin operations
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
}

export class MemStorage implements IStorage {
  private rfqs: Map<string, Rfq>;
  private products: Map<string, Product>;
  private admins: Map<string, AdminUser>;
  private rfqCounter: number;

  constructor() {
    this.rfqs = new Map();
    this.products = new Map();
    this.admins = new Map();
    this.rfqCounter = 1;

    // Create default admin user
    this.createAdmin({
      username: "admin",
      password: "ds2025", // In production, this should be hashed
    });
  }

  // RFQ operations
  async createRfq(insertRfq: InsertRfq): Promise<Rfq> {
    const id = randomUUID();
    const rfqNumber = `RFQ2025-${String(this.rfqCounter).padStart(3, "0")}`;
    this.rfqCounter++;

    const rfq: Rfq = {
      ...insertRfq,
      id,
      rfqNumber,
      status: "new",
      quotePrice: insertRfq.quotePrice || null,
      quoteShipping: insertRfq.quoteShipping || null,
      quoteTotal: insertRfq.quoteTotal || null,
      quoteNotes: insertRfq.quoteNotes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.rfqs.set(id, rfq);
    return rfq;
  }

  async getRfq(id: string): Promise<Rfq | undefined> {
    return this.rfqs.get(id);
  }

  async getAllRfqs(): Promise<Rfq[]> {
    return Array.from(this.rfqs.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async updateRfq(id: string, updates: Partial<Rfq>): Promise<Rfq | undefined> {
    const rfq = this.rfqs.get(id);
    if (!rfq) return undefined;

    const updatedRfq = {
      ...rfq,
      ...updates,
      updatedAt: new Date(),
    };

    this.rfqs.set(id, updatedRfq);
    return updatedRfq;
  }

  // Product operations
  async createProduct(productData: InsertProduct & { rfqId: string }): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...productData,
      id,
    };

    this.products.set(id, product);
    return product;
  }

  async getProductsByRfqId(rfqId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.rfqId === rfqId);
  }

  // Admin operations
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.admins.values()).find((admin) => admin.username === username);
  }

  async createAdmin(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const admin: AdminUser = {
      ...insertAdmin,
      id,
    };

    this.admins.set(id, admin);
    return admin;
  }
}

export const storage = new MemStorage();
