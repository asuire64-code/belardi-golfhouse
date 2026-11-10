// Liens et ressources : aucun lien interne cassé, aucune image ou feuille de style manquante, aucune ancre morte.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { toutesLesPages, lirePage, lienVersFichier, RACINE } = require("./outils-html");
const { PAGES } = require("../config-site");

const ATTRIBUTS = [["a", "href"], ["link", "href"], ["script", "src"], ["img", "src"], ["source", "srcset"], ["form", "action"]];

for (const p of toutesLesPages()) {
  test(`Liens · ${p.nom}`, () => {
    const casses = [];
    for (const [balise, attr] of ATTRIBUTS)
      for (const el of p.dom.querySelectorAll(`${balise}[${attr}]`)) {
        const valeur = el.getAttribute(attr).split(/\s+/)[0];
        const fichier = lienVersFichier(valeur, p.chemin);
        if (fichier && !fs.existsSync(fichier)) casses.push(`<${balise} ${attr}="${valeur}">`);

        // Ancre vers une autre page (ex. /#programme) : la section doit exister.
        const [cible, ancre] = valeur.split("#");
        if (ancre && balise === "a" && fichier) {
          const page = PAGES.find((x) => x.chemin === (cible || p.chemin));
          if (page && !lirePage(page.chemin).dom.getElementById(ancre)) casses.push(`ancre introuvable : ${valeur}`);
        }
      }
    // Ancres internes à la page (href="#...")
    for (const a of p.dom.querySelectorAll('a[href^="#"]')) {
      const id = a.getAttribute("href").slice(1);
      if (id && !p.dom.getElementById(id)) casses.push(`ancre introuvable : #${id}`);
    }
    assert.deepEqual(casses, [], `liens ou ressources cassés :\n  ${casses.join("\n  ")}`);
  });

  test(`IDs uniques · ${p.nom}`, () => {
    const ids = p.dom.querySelectorAll("[id]").map((e) => e.id);
    const doublons = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    assert.deepEqual(doublons, [], "un même id est utilisé plusieurs fois");
  });
}

test("CSS · les images référencées dans les feuilles de style existent", () => {
  const casses = [];
  const css = fs.readdirSync(path.join(RACINE, "assets/css")).map((f) => path.join("assets/css", f));
  for (const f of css) {
    const source = fs.readFileSync(path.join(RACINE, f), "utf8");
    for (const [, url] of source.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      const fichier = lienVersFichier(url, "/" + path.dirname(f) + "/");
      if (fichier && !fs.existsSync(fichier)) casses.push(`${f} → ${url}`);
    }
  }
  assert.deepEqual(casses, []);
});
