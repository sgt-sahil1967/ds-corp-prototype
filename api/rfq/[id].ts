import { storage } from "../../server/storage";

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
}
