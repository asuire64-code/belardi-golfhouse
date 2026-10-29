// Empêche d'affaiblir les garde-fous en douce : moins de tests, seuils abaissés, fichiers supprimés.
// Un changement volontaire des garde-fous exige l'étiquette « modif-garde-fous » sur la pull request.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const RACINE = path.resolve(__dirname, "../..");
const ETIQUETTE = "modif-garde-fous";

function etiquettes() {
  try {
    const evenement = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
    return (evenement.pull_request?.labels || []).map((l) => l.name);
  } catch {
    return [];
  }
}

function surMain(fichier) {
  try {
    return execSync(`git show origin/main:${fichier}`, { cwd: RACINE, stdio: ["ignore", "pipe", "ignore"] }).toString();
  } catch {
    return null;
  }
}

const ici = (fichier) => (fs.existsSync(path.join(RACINE, fichier)) ? fs.readFileSync(path.join(RACINE, fichier), "utf8") : null);

function fichiersDeTest(lire) {
  const out = {};
  for (const dossier of ["tests/statique", "tests/navigateur"]) {
    const liste = lire === ici
      ? (fs.existsSync(path.join(RACINE, dossier)) ? fs.readdirSync(path.join(RACINE, dossier)) : [])
      : (() => { try { return execSync(`git ls-tree --name-only origin/main ${dossier}/`, { cwd: RACINE }).toString().split("\n").map((f) => path.basename(f)); } catch { return []; } })();
    for (const f of liste.filter((f) => /\.(test|spec)\.js$/.test(f))) out[`${dossier}/${f}`] = lire(`${dossier}/${f}`) || "";
  }
  return out;
}

const compterTests = (fichiers) => Object.values(fichiers).reduce((n, src) => n + (src.match(/\btest\(/g) || []).length, 0);
const seuils = (src) => (src ? [...src.matchAll(/"(categories:[a-z-]+)"[^}]*"minScore":\s*([\d.]+)/g)].map(([, c, v]) => [c, +v]) : []);

const problemes = [];

const OBLIGATOIRES = [
  ".github/workflows/controle-qualite.yml",
  ".github/workflows/codeql.yml",
  "tests/config-site.js",
  "tests/playwright.config.js",
  "tests/dette-connue.json",
  "tests/lighthouserc.json",
];
for (const f of OBLIGATOIRES) if (!ici(f)) problemes.push(`fichier de garde-fou supprimé : ${f}`);

if (surMain("tests/config-site.js")) {
  const avant = compterTests(fichiersDeTest(surMain));
  const apres = compterTests(fichiersDeTest(ici));
  if (apres < avant) problemes.push(`nombre de tests en baisse : ${avant} → ${apres}`);

  const seuilsAvant = Object.fromEntries(seuils(surMain("tests/lighthouserc.json")));
  for (const [c, v] of seuils(ici("tests/lighthouserc.json")))
    if (seuilsAvant[c] !== undefined && v < seuilsAvant[c]) problemes.push(`seuil Lighthouse abaissé : ${c} ${seuilsAvant[c]} → ${v}`);

  const tolerance = (src) => +((src || "").match(/maxDiffPixelRatio:\s*([\d.]+)/) || [])[1];
  const tAvant = tolerance(surMain("tests/playwright.config.js"));
  const tApres = tolerance(ici("tests/playwright.config.js"));
  if (tApres > tAvant) problemes.push(`tolérance des captures augmentée : ${tAvant} → ${tApres}`);

  const domaines = (src) => new Set([...(src || "").matchAll(/^\s*"([a-z0-9.-]+)",/gm)].map((m) => m[1]));
  const nouveaux = [...domaines(ici("tests/config-site.js"))].filter((d) => !domaines(surMain("tests/config-site.js")).has(d));
  if (nouveaux.length) problemes.push(`nouveau domaine tiers autorisé : ${nouveaux.join(", ")}`);
}

if (problemes.length && etiquettes().includes(ETIQUETTE)) {
  console.log(`⚠ Garde-fous modifiés, accepté car la PR porte l'étiquette « ${ETIQUETTE} » :\n  - ${problemes.join("\n  - ")}`);
} else if (problemes.length) {
  console.error(`✗ Cette modification affaiblit les garde-fous :\n  - ${problemes.join("\n  - ")}`);
  console.error(`Si c'est voulu et validé par Antoine, ajouter l'étiquette « ${ETIQUETTE} » à la pull request.`);
  process.exit(1);
} else {
  console.log("✓ Garde-fous intacts");
}
