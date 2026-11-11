#!/usr/bin/env node
// Vérifie que tous les liens internes (href="/..." et src="/...") pointent
// vers un fichier existant du dépôt. Ignore le contenu des commentaires HTML.
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const skipDirs = new Set([".git", "node_modules", "_outils", ".github", ".impeccable"]);

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function resolveTarget(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "") return true;
  let p = path.join(root, clean);
  if (clean.endsWith("/")) p = path.join(p, "index.html");
  if (fs.existsSync(p)) return true;
  if (fs.existsSync(p + ".html")) return true;
  if (!clean.endsWith("/") && fs.existsSync(path.join(root, clean, "index.html"))) return true;
  return false;
}

const files = walk(root, []);
const attrRe = /\b(?:href|src)="(\/[^"]*)"/g;
let problems = 0;

for (const file of files) {
  const src = fs.readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  let m;
  attrRe.lastIndex = 0;
  while ((m = attrRe.exec(src))) {
    const href = m[1];
    if (href.startsWith("//")) continue;
    if (!resolveTarget(href)) {
      problems++;
      console.log(`[BROKEN] ${path.relative(root, file)} -> ${href}`);
    }
  }
}

if (problems === 0) {
  console.log(`OK: ${files.length} fichiers HTML, aucun lien interne cassé.`);
  process.exit(0);
} else {
  console.log(`${problems} lien(s) interne(s) cassé(s).`);
  process.exit(1);
}
