import { storage } from "../server/storage";
import { insertRfqSchema, insertProductSchema } from "../shared/schema";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
