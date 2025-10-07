import { storage } from "../../server/storage";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
