import { storage } from "../../server/storage";

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
