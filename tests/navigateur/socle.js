// Socle commun des tests navigateur : isole le site d'Internet pour des résultats stables.
// - Polices Google et bibliothèque de carte Leaflet : servies localement, à l'identique (même version).
// - Tout autre domaine externe (reCAPTCHA, tuiles de carte…) : bloqué.
// - Erreurs JavaScript et ressources locales manquantes : collectées pour faire échouer le test.
const base = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const MODULES = path.join(__dirname, "..", "node_modules");
const POLICES = {
  "Jost": ["jost", ["300", "400", "500", "600", "700"]],
  "Josefin Sans": ["josefin-sans", ["300"]],
  "Cormorant Garamond": ["cormorant-garamond", ["500-italic"]],
};

function cssPolices() {
  let css = "";
  for (const [paquet, variantes] of Object.values(POLICES))
    for (const v of variantes) css += fs.readFileSync(path.join(MODULES, "@fontsource", paquet, `${v}.css`), "utf8");
  return css.replace(/url\(\.\/files\//g, "url(https://fonts.gstatic.com/fontsource/");
}

function fichierPolice(nom) {
  for (const [paquet] of Object.values(POLICES)) {
    const f = path.join(MODULES, "@fontsource", paquet, "files", nom);
    if (fs.existsSync(f)) return f;
  }
  return null;
}

async function isoler(page) {
  await page.route(/^https?:\/\/(?!localhost)/, async (route) => {
    const url = new URL(route.request().url());
    if (url.host === "fonts.googleapis.com")
      return route.fulfill({ contentType: "text/css", body: cssPolices() });
    if (url.host === "fonts.gstatic.com") {
      const f = fichierPolice(path.basename(url.pathname));
      return f ? route.fulfill({ path: f, contentType: "font/woff2" }) : route.abort();
    }
    return route.abort("blockedbyclient");
  });
}

const test = base.test.extend({
  problemes: [
    async ({ page }, use) => {
      const problemes = [];
      page.on("pageerror", (e) => problemes.push(`Erreur JavaScript : ${e.message}`));
      page.on("console", (m) => {
        if (m.type() !== "error") return;
        const lieu = m.location()?.url || "";
        if (/^https?:\/\/localhost/.test(lieu) || !lieu) {
          if (!/net::ERR_BLOCKED_BY_CLIENT|Failed to load resource/.test(m.text())) problemes.push(`Console : ${m.text()}`);
        }
      });
      page.on("response", (r) => {
        if (r.url().startsWith("http://localhost") && r.status() >= 400) problemes.push(`Ressource introuvable (${r.status()}) : ${r.url()}`);
      });
      await use(problemes);
    },
    { auto: true },
  ],
  page: async ({ page }, use) => {
    await isoler(page);
    await use(page);
  },
});

// Attend que la page soit stable : polices chargées, images visibles décodées.
async function attendreRendu(page) {
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const delai = (ms) => new Promise((r) => setTimeout(r, ms));
    const images = [...document.images].filter((img) => !img.complete);
    await Promise.race([Promise.all(images.map((img) => img.decode().catch(() => null))), delai(3000)]);
  });
}

// Fait défiler toute la page pour déclencher les images en chargement différé (loading="lazy").
async function defilerToutLePage(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await attendreRendu(page);
}

module.exports = { test, expect: base.expect, attendreRendu, defilerToutLePage };
