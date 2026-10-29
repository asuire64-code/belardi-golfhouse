// Référencement : chaque page doit rester correctement décrite pour Google et les réseaux sociaux.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { toutesLesPages, RACINE } = require("./outils-html");
const { ecartsSeo, meta } = require("./regles-seo");
const { DOMAINE, PAGES, GOOGLE_SITE_VERIFICATION } = require("../config-site");
const dette = require("../outils/dette");

const pages = toutesLesPages();

test("SEO · aucune régression sur les pages (titre, description, canonique, h1, partage…)", () => {
  const ecarts = pages.flatMap(ecartsSeo);
  const { regressions } = dette.comparer("seo", dette.compter(ecarts.map((e) => e.cle)));
  const cles = new Set(regressions.map((r) => r.split(" : ")[0]));
  assert.deepEqual(ecarts.filter((e) => cles.has(e.cle)).map((e) => e.detail), []);
});

test("SEO · titres et descriptions uniques entre pages", () => {
  const titres = pages.map((p) => p.dom.querySelector("title")?.text.trim());
  const descriptions = pages.map((p) => meta(p.dom, 'meta[name="description"]'));
  assert.equal(new Set(titres).size, titres.length, "deux pages ont le même titre");
  assert.equal(new Set(descriptions).size, descriptions.length, "deux pages ont la même description");
});

test("SEO · balise de vérification Google Search Console présente sur l'accueil", () => {
  const accueil = pages.find((p) => p.chemin === "/");
  assert.equal(meta(accueil.dom, 'meta[name="google-site-verification"]'), GOOGLE_SITE_VERIFICATION,
    "NE PAS RETIRER : cette balise valide la propriété du site dans Google Search Console");
});

test("SEO · sitemap.xml liste exactement les pages du site", () => {
  const sitemap = fs.readFileSync(path.join(RACINE, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
  assert.deepEqual(urls, PAGES.map((p) => DOMAINE + p.chemin).sort());
});

test("SEO · robots.txt autorise l'indexation et pointe vers le sitemap", () => {
  const robots = fs.readFileSync(path.join(RACINE, "robots.txt"), "utf8");
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m, "robots.txt bloque tout le site");
  assert.match(robots, new RegExp(`Sitemap: ${DOMAINE}/sitemap.xml`));
});

test("Domaine · fichier CNAME intact", () => {
  assert.equal(fs.readFileSync(path.join(RACINE, "CNAME"), "utf8").trim(), new URL(DOMAINE).host);
});

test("PWA · site.webmanifest valide et icônes présentes", () => {
  const manifeste = JSON.parse(fs.readFileSync(path.join(RACINE, "site.webmanifest"), "utf8"));
  for (const icone of manifeste.icons) assert.ok(fs.existsSync(path.join(RACINE, icone.src)), `icône absente : ${icone.src}`);
});
