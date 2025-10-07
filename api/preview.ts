import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
