import path from "path";
import { createServer as createViteServer } from "vite";
import app from "./server-app";

const PORT = 3000;

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
    app.use(expressStatic(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

// Inline helper for serving static files in production to avoid express import redundancy
function expressStatic(dir: string) {
  const express = require("express");
  return express.static(dir);
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

