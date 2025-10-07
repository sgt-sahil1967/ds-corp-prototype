import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product schema for items in an RFQ
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfqId: varchar("rfq_id").notNull(),
  url: text("url"),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  price: text("price"),
  quantity: integer("quantity").default(1),
  isManual: integer("is_manual").default(0), // 0 = auto-fetched, 1 = manual entry
});

// RFQ status enum
export const rfqStatuses = ["new", "quoted", "paid", "shipped", "delivered", "rejected"] as const;
export type RfqStatus = typeof rfqStatuses[number];

// Main RFQ schema
export const rfqs = pgTable("rfqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfqNumber: text("rfq_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerCompany: text("customer_company"),
  customerCountry: text("customer_country"),
  status: text("status").notNull().default("new"),
  quotePrice: text("quote_price"),
  quoteShipping: text("quote_shipping"),
  quoteTotal: text("quote_total"),
  quoteNotes: text("quote_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin user schema
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Insert schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  rfqId: true,
});

export const insertRfqSchema = createInsertSchema(rfqs).omit({
  id: true,
  rfqNumber: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
});

// Types
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertRfq = z.infer<typeof insertRfqSchema>;
export type Rfq = typeof rfqs.$inferSelect;

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Frontend-specific types
export interface ProductPreview {
  success: boolean;
  title?: string;
  image?: string;
  price?: string;
  description?: string;
  url?: string;
  manual_required?: boolean;
}

export interface RfqWithProducts extends Rfq {
  products: Product[];
}
