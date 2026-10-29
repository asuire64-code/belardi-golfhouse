// Règles de référencement appliquées à chaque page. Renvoie la liste des écarts constatés.
const { DOMAINE } = require("../config-site");

const meta = (dom, sel) => dom.querySelector(sel)?.getAttribute("content")?.trim() || "";

function ecartsSeo(page) {
  const { dom, nom, chemin } = page;
  const ecarts = [];
  const ajouter = (regle, detail) => ecarts.push({ cle: `${nom} · ${regle}`, detail: `${nom} : ${detail}` });

  if (dom.querySelector("html")?.getAttribute("lang") !== "fr") ajouter("lang", 'attribut lang="fr" manquant');
  if (!dom.querySelector("meta[charset]")) ajouter("charset", "meta charset manquante");
  if (!/width=device-width/.test(meta(dom, 'meta[name="viewport"]'))) ajouter("viewport", "meta viewport (mobile) manquante");

  const titre = dom.querySelector("title")?.text.trim() || "";
  if (titre.length < 10 || titre.length > 70) ajouter("longueur-titre", `titre de ${titre.length} caractères (attendu 10–70)`);

  const description = meta(dom, 'meta[name="description"]');
  if (description.length < 50 || description.length > 170)
    ajouter("longueur-description", `meta description de ${description.length} caractères (attendu 50–170, Google coupe au-delà)`);

  if (dom.querySelector('link[rel="canonical"]')?.getAttribute("href") !== DOMAINE + chemin) ajouter("canonique", "URL canonique absente ou incorrecte");
  if (dom.querySelectorAll("h1").length !== 1) ajouter("h1-unique", "il faut exactement un titre <h1>");
  if (!meta(dom, 'meta[property="og:title"]')) ajouter("og-title", "og:title manquant (aperçu lors des partages)");
  if (!meta(dom, 'meta[property="og:image"]')) ajouter("og-image", "og:image manquant (aperçu lors des partages)");

  for (const bloc of dom.querySelectorAll('script[type="application/ld+json"]')) {
    try { JSON.parse(bloc.text); } catch { ajouter("json-ld", "données structurées JSON-LD invalides"); }
  }
  return ecarts;
}

module.exports = { ecartsSeo, meta };
