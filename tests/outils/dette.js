// Registre de dette technique (« cliquet ») : les défauts déjà présents sont tolérés,
// mais aucun nouveau défaut ne peut entrer, et le registre ne peut que diminuer.
const fs = require("fs");
const path = require("path");

const FICHIER = path.join(__dirname, "..", "dette-connue.json");

function lire(fichier = FICHIER) {
  if (!fs.existsSync(fichier)) return {};
  const contenu = JSON.parse(fs.readFileSync(fichier, "utf8"));
  delete contenu._explication;
  return contenu;
}

function ecrireCategorie(categorie, constats) {
  const tout = fs.existsSync(FICHIER) ? JSON.parse(fs.readFileSync(FICHIER, "utf8")) : {};
  tout._explication =
    "Défauts qui existaient avant la mise en place des garde-fous. Ils sont tolérés, mais leur nombre ne peut que baisser. Corriger un défaut puis lancer `npm run dette:maj` pour l'enlever d'ici.";
  tout[categorie] = Object.fromEntries(Object.entries(constats).sort());
  const ordonne = { _explication: tout._explication };
  for (const cle of Object.keys(tout).filter((c) => c !== "_explication").sort()) ordonne[cle] = tout[cle];
  fs.writeFileSync(FICHIER, JSON.stringify(ordonne, null, 2) + "\n");
}

// Compare les constats actuels au registre. Retourne la liste des régressions (texte lisible).
function comparer(categorie, constats) {
  const tolere = lire()[categorie] || {};
  const regressions = [];
  const ameliorations = [];
  for (const [cle, n] of Object.entries(constats)) {
    const max = tolere[cle] || 0;
    if (n > max) regressions.push(`${cle} : ${n} (toléré : ${max})`);
  }
  for (const [cle, max] of Object.entries(tolere)) {
    const n = constats[cle] || 0;
    if (n < max) ameliorations.push(`${cle} : ${n} au lieu de ${max}`);
  }
  return { regressions, ameliorations };
}

function compter(liste) {
  const out = {};
  for (const cle of liste) out[cle] = (out[cle] || 0) + 1;
  return out;
}

const total = (registre) =>
  Object.values(registre).reduce((s, cat) => s + Object.values(cat).reduce((a, b) => a + b, 0), 0);

// Pour les tests navigateur : vérifie un groupe de constats (ex. une page), ou met à jour
// le registre pour ce groupe quand DETTE_MAJ=1 (lancer alors avec --workers=1).
function verifierGroupe(categorie, prefixe, compte) {
  const registre = lire()[categorie] || {};
  const regressions = Object.keys(compte).filter((c) => compte[c] > (registre[c] || 0));
  if (process.env.DETTE_MAJ) {
    if (regressions.length && !process.env.DETTE_INIT)
      throw new Error(`Impossible d'ajouter de la dette (${regressions.join(", ")}) : corrigez plutôt.`);
    const nouveau = Object.fromEntries(Object.entries(registre).filter(([c]) => !c.startsWith(prefixe)));
    ecrireCategorie(categorie, { ...nouveau, ...compte });
    return [];
  }
  return regressions;
}

module.exports = { lire, ecrireCategorie, comparer, compter, total, verifierGroupe, FICHIER };
