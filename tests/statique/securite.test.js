// Sécurité du code du site : domaines tiers maîtrisés, pas de contenu non chiffré, pas de code dangereux.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { toutesLesPages, RACINE } = require("./outils-html");
const { DOMAINES_AUTORISES } = require("../config-site");

const pages = toutesLesPages();
const sourcesJs = fs.readdirSync(path.join(RACINE, "assets/js")).map((f) => ({
  nom: "assets/js/" + f,
  source: fs.readFileSync(path.join(RACINE, "assets/js", f), "utf8"),
}));
const toutesSources = [...pages.map((p) => ({ nom: p.nom, source: p.source })), ...sourcesJs];

// Ce que la page charge ou exécute (scripts, styles, images, iframes, formulaires, URLs dans le JavaScript)
// ne peut venir que d'un domaine autorisé. Les simples liens <a href> vers d'autres sites restent libres.
test("Sécurité · seuls les domaines autorisés fournissent des ressources chargées par le site", () => {
  const SELECTEURS = [["script[src]", "src"], ["link[href]", "href"], ["img[src]", "src"], ["iframe[src]", "src"],
    ["source[src]", "src"], ["video[src]", "src"], ["audio[src]", "src"], ["embed[src]", "src"], ["object[data]", "data"], ["form[action]", "action"]];
  const hote = (url) => { try { return new URL(url).host.toLowerCase(); } catch { return null; } };
  const inconnus = new Set();
  for (const p of pages) {
    for (const [sel, attr] of SELECTEURS)
      for (const el of p.dom.querySelectorAll(sel)) {
        if (sel === "link[href]" && /canonical|alternate/.test(el.getAttribute("rel") || "")) continue;
        const h = hote(el.getAttribute(attr));
        if (h && !DOMAINES_AUTORISES.includes(h)) inconnus.add(`${h} (${sel} dans ${p.nom})`);
      }
    for (const script of p.dom.querySelectorAll("script:not([src]):not([type='application/ld+json'])"))
      for (const [, h] of script.text.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi))
        if (!DOMAINES_AUTORISES.includes(h.toLowerCase())) inconnus.add(`${h} (script dans ${p.nom})`);
  }
  for (const { nom, source } of sourcesJs)
    for (const [, h] of source.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi))
      if (!DOMAINES_AUTORISES.includes(h.toLowerCase())) inconnus.add(`${h} (dans ${nom})`);
  assert.deepEqual([...inconnus], [],
    "Domaine tiers non déclaré. S'il est voulu, l'ajouter à DOMAINES_AUTORISES dans tests/config-site.js");
});

test("Sécurité · aucune ressource chargée en http:// non chiffré", () => {
  const fautifs = [];
  for (const { nom, source } of toutesSources)
    for (const [m] of source.matchAll(/(src|href|action)\s*=\s*["']http:\/\/[^"']+/gi)) fautifs.push(`${nom} : ${m}`);
  assert.deepEqual(fautifs, []);
});

test("Sécurité · liens target=_blank protégés (rel=noopener)", () => {
  const fautifs = [];
  for (const p of pages)
    for (const a of p.dom.querySelectorAll('a[target="_blank"]'))
      if (!/noopener|noreferrer/.test(a.getAttribute("rel") || "")) fautifs.push(`${p.nom} : ${a.getAttribute("href")}`);
  assert.deepEqual(fautifs, []);
});

test("Sécurité · aucune fonction JavaScript dangereuse (eval, document.write, new Function)", () => {
  const fautifs = [];
  for (const { nom, source } of toutesSources)
    for (const [m] of source.matchAll(/\beval\s*\(|document\.write\s*\(|new\s+Function\s*\(|javascript:/g)) fautifs.push(`${nom} : ${m}`);
  assert.deepEqual(fautifs, []);
});

test("Sécurité · aucun secret ou clé privée dans le code", () => {
  const motifs = [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, /\bAKIA[0-9A-Z]{16}\b/, /\bgh[pousr]_[A-Za-z0-9]{36,}\b/, /\bsk-[A-Za-z0-9_-]{20,}\b/, /\bxox[baprs]-[A-Za-z0-9-]{10,}/];
  const fautifs = [];
  for (const { nom, source } of toutesSources) for (const m of motifs) if (m.test(source)) fautifs.push(`${nom} : ${m}`);
  assert.deepEqual(fautifs, []);
});
