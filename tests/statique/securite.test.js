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

test("Sécurité · seuls les domaines externes autorisés sont utilisés", () => {
  const inconnus = new Set();
  for (const { nom, source } of toutesSources)
    for (const [, hote] of source.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi))
      if (!DOMAINES_AUTORISES.includes(hote.toLowerCase())) inconnus.add(`${hote} (dans ${nom})`);
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
