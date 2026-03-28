import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");
const indexPath = path.join(distDir, "index.html");
const notFoundPath = path.join(distDir, "404.html");

if (!fs.existsSync(indexPath)) {
  throw new Error("dist/index.html is missing; build must run before prepare-pages-spa.");
}

fs.copyFileSync(indexPath, notFoundPath);
console.log("Prepared dist/404.html for GitHub Pages SPA routing.");
