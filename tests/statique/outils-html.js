// Fonctions partagées par les tests statiques : lecture des pages et du dictionnaire de traduction.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { parse } = require("node-html-parser");
const { RACINE, PAGES, fichierDePage } = require("../config-site");

const cache = new Map();
function lirePage(chemin) {
  if (!cache.has(chemin)) {
    const source = fs.readFileSync(fichierDePage(chemin), "utf8");
    cache.set(chemin, { source, dom: parse(source, { comment: false }) });
  }
  return cache.get(chemin);
}

const toutesLesPages = () => PAGES.map((p) => ({ ...p, ...lirePage(p.chemin) }));

// Extrait l'objet DICT de assets/js/i18n.js sans exécuter le reste du script.
function lireDictionnaire() {
  const source = fs.readFileSync(path.join(RACINE, "assets/js/i18n.js"), "utf8");
  const debut = source.indexOf("var DICT = ");
  const fin = source.indexOf("var LANGS", debut);
  if (debut < 0 || fin < 0) throw new Error("Structure de i18n.js inattendue (var DICT … var LANGS)");
  const objet = source.slice(debut + "var DICT = ".length, fin).trim().replace(/;$/, "");
  return vm.runInNewContext("(" + objet + ")");
}

// Convertit un lien interne en fichier sur disque (null si externe ou spécial).
function lienVersFichier(lien, cheminPage) {
  if (!lien || /^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(lien) || lien.startsWith("//")) return null;
  const [sansAncre] = lien.split("#");
  const [url] = sansAncre.split("?");
  const absolu = url.startsWith("/") ? url : path.posix.join(cheminPage, url);
  const fichier = path.join(RACINE, decodeURIComponent(absolu));
  return absolu.endsWith("/") ? path.join(fichier, "index.html") : fichier;
}

module.exports = { lirePage, toutesLesPages, lireDictionnaire, lienVersFichier, RACINE };
