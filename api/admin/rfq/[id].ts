import { storage } from "../../../server/storage";

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
}
