import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import products data for AI context
import { PRODUCTS } from "./src/data/products";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize NVIDIA NIM API parameters
const nvidiaApiKey = process.env.NVIDIA_API_KEY;
const nvidiaModelName = process.env.NVIDIA_MODEL_NAME || "meta/llama-3.1-8b-instruct";

// Prepare a condensed product reference to keep context concise but highly accurate
const condensedProducts = PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  category: p.category,
  subcategory: p.subcategory,
  brand: p.brand,
  price: p.price,
  originalPrice: p.originalPrice,
  rating: p.rating,
  isBestSeller: p.isBestSeller,
  inStock: p.stock > 0,
  stockCount: p.stock,
  specs: p.specs?.slice(0, 3).map(s => `${s.label}: ${s.value}`).join(", ") || "",
  description: p.description,
}));

// API endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, activeCategory } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid or missing messages array" });
      return;
    }

    if (!nvidiaApiKey) {
      // Return a graceful error message indicating the key is missing in Settings > Secrets or .env file
      res.json({
        response: "Hello! I am your AI Shopping Assistant. It looks like the `NVIDIA_API_KEY` environment variable has not been configured in your `.env` file or **Settings > Secrets** panel yet. Please add your key there to activate live AI answers! \n\nIn the meantime, I can tell you about our Luxe Market categories, checkouts, and premium features.",
        error: "Missing NVIDIA_API_KEY in environment",
      });
      return;
    }

    // Design system instructions for a high-end, premium concierge shopping assistant
    const systemInstruction = `You are "Luxe Market Assistant", an elegant, ultra-professional, and highly helpful AI personal shopping assistant and concierge for Luxe Market.
Luxe Market is an elite e-commerce platform offering premium curated electronics, fashion, home decor, beauty, and sports goods.

Your personality:
- Courteous, welcoming, articulate, and refined (Apple-concierge-inspired).
- Objective and extremely helpful, with a subtle high-end touch.
- Conversational but precise. Use bullet points and bold text where helpful.

Your capabilities:
1. Product lookup & recommendation: Recommend products from our real catalog below. Use specific names and prices.
2. Product comparison: Compare prices, reviews, specs, and rating of products in our catalog.
3. Search helper: Guide users to find the exact brand, category, or subcategory.
4. Navigation: Help users navigate. You can tell them to view a product using links.
5. Provide delivery & return policies: Deliveries are free for VIP/Gold tiers, standard delivery is $9.99 (or free on orders over $150). Returns are free and accepted within 30 days.

STRICT INSTRUCTIONS ON FORMATTING & MARKDOWN:
- When recommending a product, ALWAYS mention its price and rating.
- To make a product clickable and interactive in the user's chat, format it as a markdown link using this custom scheme: [Product Name](product:id)
  Example: [Aurum Wireless Headphones](product:elec-1)
- NEVER make up or hallucinate products outside our official inventory.
- Keep responses relatively concise but fully helpful and engaging.
- NEVER use Markdown tables! If comparison, features, or specifications are requested, list them using descriptive bullet points or clean key-value text paragraphs, as tables do not render or adapt properly in the chat panel.
- Ensure all markdown formatting is pristine. Avoid stray asterisks, double asterisks, or formatting errors. Do not output raw markdown tags or unclosed bold tags. Use standard lists with clear hyphens (e.g., "- Feature: details").

Our official product inventory:
${JSON.stringify(condensedProducts, null, 2)}

Active page context: The user is currently browsing the "${activeCategory || "General Catalog"}" category.`;

    // Map history to OpenAI compatible format
    const payloadMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }))
    ];

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${nvidiaApiKey}`
      },
      body: JSON.stringify({
        model: nvidiaModelName,
        messages: payloadMessages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`NVIDIA API response error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No reply from NVIDIA NIM model.";
    res.json({ response: reply });
  } catch (error: any) {
    console.error("NVIDIA API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with NVIDIA API" });
  }
});

app.post("/api/gemini/product-summary", async (req, res) => {
  try {
    const { messages, product } = req.body;

    if (!product || !product.id) {
      res.status(400).json({ error: "Missing product details" });
      return;
    }

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid or missing messages array" });
      return;
    }

    if (!nvidiaApiKey) {
      res.json({
        response: "### [OVERVIEW]\nHello! I am your AI Product Assistant. The `NVIDIA_API_KEY` has not been configured in your `.env` file or **Settings > Secrets** yet. Please add it there to activate live AI-driven analysis for the **" + product.name + "**!\n\n### [HIGHLIGHTS]\n* Live product intelligence\n* Fast Q&A replies\n* Specification lookup\n\n### [PRICE_INSIGHT]\nPlease configure your API key to unlock detailed valuation insights.",
        error: "Missing NVIDIA_API_KEY in environment",
      });
      return;
    }

    // Design system instructions specifically for a context-aware single product summary assistant
    const systemInstruction = `You are "Luxe Concierge - Product Summary Expert", an elegant, ultra-professional, and highly knowledgeable AI personal concierge for Luxe Market.
Your objective is to provide expert summaries, highlights, valuation, and answer specific questions about the single product provided in the context below.

Product Context:
- ID: ${product.id}
- Name: ${product.name}
- Brand: ${product.brand}
- Category: ${product.category}
- Subcategory: ${product.subcategory}
- Price: $${product.price}
- Original Price: ${product.originalPrice ? `$${product.originalPrice}` : "N/A"}
- Discount: ${product.discount ? `${product.discount}%` : "N/A"}
- Rating: ${product.rating} stars (based on ${product.reviewsCount} reviews)
- Stock Availability: ${product.stock > 0 ? `In Stock (${product.stock} units left)` : "Out of Stock"}
- Eco Friendly: ${product.ecoFriendly ? "Yes" : "No"}
- Membership Points Earned: ${product.points} points
- Best Seller status: ${product.isBestSeller ? "Yes" : "No"}
- Available Colors: ${product.colors ? product.colors.map((c: any) => c.name).join(", ") : "N/A"}
- Available Sizes: ${product.sizes ? product.sizes.join(", ") : "N/A"}
- Description: ${product.description}
- Specifications: ${product.specs ? product.specs.map((s: any) => `${s.label}: ${s.value}`).join("; ") : "N/A"}
- Customer Reviews Summary: ${product.reviews ? product.reviews.slice(0, 5).map((r: any) => `[${r.rating}★ by ${r.author}]: "${r.comment}"`).join(" | ") : "N/A"}
- FAQ / Q&As: ${product.qas ? product.qas.map((q: any) => `Q: ${q.question} - A: ${q.answer}`).join(" | ") : "N/A"}

Our general store policies for reference:
- Shipping: Free for VIP/Gold tier members, or free on any order above $150. Otherwise, standard priority shipping is $15.00.
- Return Policy: Free returns accepted within 30 days of delivery.
- Warranty: Complimentary 2-year Luxe Protection Warranty covers all luxury electronics and sports gear.

Strict formatting rules:
1. When asked to summarize (or for the first message), you MUST generate a beautifully structured response with these EXACT section tags so the client can parse them into elegant cards:
   
   ### [OVERVIEW]
   A concise, sophisticated summary of what the product is, its design, and who it is best suited for.
   
   ### [HIGHLIGHTS]
   The standout key features, premium materials, and unique advantages of this item. Use bullet points.
   
   ### [PROS]
   * Bulleted list of benefits and strengths of choosing this premium item.
   
   ### [CONSIDERATIONS]
   * Bulleted list of trade-offs, limitations, or things to keep in mind (e.g. price, specific use constraints, sizing).
   
   ### [BEST_FOR]
   * Highly specific list of suitable use-cases (e.g. Travel, Office work, Fitness, High-fidelity listening).
   
   ### [PRICE_INSIGHT]
   Current price, discount status, potential savings, and overall value-for-money verdict.

2. When the user asks general questions about the product:
   - Answer directly and politely.
   - NEVER use Markdown tables! If the user asks for comparison or feature tables, present them as clean key-value bullet points or paragraph blocks instead. Tables do not fit or adapt properly in our panel.
   - Keep markdown pristine and simple. Do not output raw markdown tags or unclosed bold tags. Ensure there are no stray double asterisks (**) or single asterisks (*) that might clutter the output.
   - Maintain the premium concierge persona.
   - Refuse to answer questions about other products unless directly comparing specs of this product with alternatives. Keep all context focused on helping the buyer make an informed choice about this product.`;

    const payloadMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }))
    ];

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${nvidiaApiKey}`
      },
      body: JSON.stringify({
        model: nvidiaModelName,
        messages: payloadMessages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`NVIDIA API response error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No reply from NVIDIA NIM model.";
    res.json({ response: reply });
  } catch (error: any) {
    console.error("NVIDIA Product Summary Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with NVIDIA API" });
  }
});

// Setup Vite middleware or serve static files
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
