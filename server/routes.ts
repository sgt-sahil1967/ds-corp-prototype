import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import * as cheerio from "cheerio";
import { insertRfqSchema, insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Link Preview API - Extracts Open Graph metadata
  app.post("/api/preview", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ success: false, manual_required: true });
      }

      // Fetch the webpage
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        timeout: 10000,
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extract Open Graph metadata
      const title =
        $('meta[property="og:title"]').attr("content") ||
        $('meta[name="twitter:title"]').attr("content") ||
        $("title").text() ||
        "";

      const image =
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        "";

      const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        $('meta[name="twitter:description"]').attr("content") ||
        "";

      // Try to extract price from common e-commerce patterns
      let price = "";
      const priceSelectors = [
        ".price",
        ".product-price",
        '[data-price]',
        ".a-price-whole",
        ".priceblock",
        "#priceblock_ourprice",
      ];

      for (const selector of priceSelectors) {
        const priceText = $(selector).first().text().trim();
        if (priceText && priceText.match(/[₹$€£]/)) {
          price = priceText;
          break;
        }
      }

      if (!title) {
        return res.json({ success: false, manual_required: true });
      }

      return res.json({
        success: true,
        title: title.trim(),
        image: image || undefined,
        description: description.trim() || undefined,
        price: price || undefined,
        url,
      });
    } catch (error) {
      console.error("Preview error:", error);
      return res.json({ success: false, manual_required: true });
    }
  });

  // Create RFQ with products
  app.post("/api/rfq", async (req, res) => {
    try {
      const { products, ...rfqData } = req.body;

      // Validate RFQ data
      const validatedRfq = insertRfqSchema.parse(rfqData);

      // Create RFQ
      const rfq = await storage.createRfq(validatedRfq);

      // Create products
      if (products && Array.isArray(products)) {
        for (const product of products) {
          const validatedProduct = insertProductSchema.parse(product);
          await storage.createProduct({
            ...validatedProduct,
            rfqId: rfq.id,
          });
        }
      }

      return res.json({
        rfqId: rfq.id,
        rfqNumber: rfq.rfqNumber,
      });
    } catch (error) {
      console.error("RFQ creation error:", error);
      return res.status(400).json({ error: "Failed to create RFQ" });
    }
  });

  // Get RFQ by ID (with products)
  app.get("/api/rfq/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const rfq = await storage.getRfq(id);

      if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
      }

      const products = await storage.getProductsByRfqId(id);

      return res.json({
        ...rfq,
        products,
      });
    } catch (error) {
      console.error("Get RFQ error:", error);
      return res.status(500).json({ error: "Failed to fetch RFQ" });
    }
  });

  // Accept quote (customer action)
  app.post("/api/rfq/:id/accept", async (req, res) => {
    try {
      const { id } = req.params;
      const rfq = await storage.updateRfq(id, { status: "paid" });

      if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Accept quote error:", error);
      return res.status(500).json({ error: "Failed to accept quote" });
    }
  });

  // Reject quote (customer action)
  app.post("/api/rfq/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const rfq = await storage.updateRfq(id, { status: "rejected" });

      if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Reject quote error:", error);
      return res.status(500).json({ error: "Failed to reject quote" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const admin = await storage.getAdminByUsername(username);

      if (!admin || admin.password !== password) {
        return res.status(401).json({ success: false, error: "Invalid credentials" });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ success: false, error: "Login failed" });
    }
  });

  // Get all RFQs (admin)
  app.get("/api/admin/rfqs", async (req, res) => {
    try {
      const rfqs = await storage.getAllRfqs();

      // Attach products to each RFQ
      const rfqsWithProducts = await Promise.all(
        rfqs.map(async (rfq) => {
          const products = await storage.getProductsByRfqId(rfq.id);
          return {
            ...rfq,
            products,
          };
        })
      );

      return res.json(rfqsWithProducts);
    } catch (error) {
      console.error("Get RFQs error:", error);
      return res.status(500).json({ error: "Failed to fetch RFQs" });
    }
  });

  // Update RFQ (admin)
  app.patch("/api/admin/rfq/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const rfq = await storage.updateRfq(id, updates);

      if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
      }

      return res.json({ success: true, rfq });
    } catch (error) {
      console.error("Update RFQ error:", error);
      return res.status(500).json({ error: "Failed to update RFQ" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
