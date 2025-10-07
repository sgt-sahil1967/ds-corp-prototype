import { storage } from "../../../server/storage";

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rfq = await storage.updateRfq(id, { status: "rejected" });

    if (!rfq) {
      return res.status(404).json({ error: "RFQ not found" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Reject quote error:", error);
    return res.status(500).json({ error: "Failed to reject quote" });
  }
}
