// Contrôle qualité du code source : HTML (structure), CSS et JavaScript (bugs).
// Usage : node outils/verifier-code.js          → vérifie (échoue si nouveau défaut)
//         node outils/verifier-code.js --maj    → réécrit le registre de dette (après correction)
const path = require("path");
const fs = require("fs");
const { RACINE, PAGES, fichierDePage } = require("../config-site");
const dette = require("./dette");

const MAJ = process.argv.includes("--maj");
const INIT = process.argv.includes("--init"); // création initiale du registre uniquement
const rel = (f) => path.relative(RACINE, f).split(path.sep).join("/");
const fichiersHtml = PAGES.map((p) => fichierDePage(p.chemin));

async function html() {
  const { HtmlValidate } = require("html-validate");
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", ".htmlvalidate.json"), "utf8"));
  const hv = new HtmlValidate(config);
  const constats = [];
  for (const f of fichiersHtml) {
    const rapport = await hv.validateFile(f);
    for (const r of rapport.results)
      for (const m of r.messages) constats.push({ cle: `${rel(f)} · ${m.ruleId}`, detail: `${rel(f)}:${m.line} ${m.message}` });
  }
  return constats;
}

async function css() {
  const stylelint = (await import("stylelint")).default;
  const res = await stylelint.lint({
    // assets/vendor/ = bibliothèques tierces copiées telles quelles (Leaflet…) : jamais modifiées à la main.
    files: ["assets/**/*.css", "!assets/vendor/**", ...fichiersHtml.map(rel)],
    cwd: RACINE,
    configFile: path.join(__dirname, "..", ".stylelintrc.json"),
  });
  const constats = [];
  for (const r of res.results)
    for (const w of r.warnings)
      constats.push({ cle: `${rel(r.source)} · ${w.rule}`, detail: `${rel(r.source)}:${w.line} ${w.text}` });
  return constats;
}

async function js() {
  const { ESLint } = require("eslint");
  const eslint = new ESLint({ cwd: RACINE, overrideConfigFile: path.join(__dirname, "..", "eslint.config.js") });
  const res = await eslint.lintFiles(["assets/js/**/*.js", ...fichiersHtml.map(rel)]);
  const constats = [];
  for (const r of res)
    for (const m of r.messages)
      if (m.severity === 2)
        constats.push({ cle: `${rel(r.filePath)} · ${m.ruleId || "syntaxe"}`, detail: `${rel(r.filePath)}:${m.line} ${m.message}` });
  return constats;
}

// Risques de sécurité déjà présents : gestionnaires d'événements inline (bloquent une future CSP stricte)
// et ressources tierces chargées sans empreinte d'intégrité SRI (risque de code tiers modifié).
async function securite() {
  const { parse } = require("node-html-parser");
  const constats = [];
  for (const f of fichiersHtml) {
    const dom = parse(fs.readFileSync(f, "utf8"));
    for (const el of dom.querySelectorAll("*"))
      for (const attr of Object.keys(el.attributes))
        if (/^on[a-z]+$/.test(attr)) constats.push({ cle: `${rel(f)} · gestionnaire-inline`, detail: `${rel(f)} : ${attr} sur <${el.rawTagName}>` });
    for (const el of dom.querySelectorAll("script[src], link[href]")) {
      const url = el.getAttribute("src") || el.getAttribute("href");
      const executable = el.rawTagName === "script" || el.getAttribute("rel") === "stylesheet";
      // Exceptions exactes (hôte + chemin) : Google Fonts et reCAPTCHA ne publient pas d'empreinte SRI stable.
      let tiers = false;
      try {
        const u = new URL(url);
        tiers = /^https?:$/.test(u.protocol) &&
          !(u.host === "fonts.googleapis.com" || (u.host === "www.google.com" && u.pathname.startsWith("/recaptcha/")));
      } catch {}
      if (executable && tiers && !el.getAttribute("integrity"))
        constats.push({ cle: `${rel(f)} · ressource-tierce-sans-integrity`, detail: `${rel(f)} : ${url} sans attribut integrity` });
    }
  }
  return constats;
}

async function seo() {
  const { toutesLesPages } = require("../statique/outils-html");
  const { ecartsSeo } = require("../statique/regles-seo");
  return toutesLesPages().flatMap(ecartsSeo);
}

(async () => {
  let echec = false;
  for (const [categorie, analyse] of Object.entries({ html, css, js, securite, seo })) {
    const constats = await analyse();
    const compte = dette.compter(constats.map((c) => c.cle));
    if (MAJ) {
      const { regressions } = dette.comparer(categorie, compte);
      if (regressions.length && !INIT) {
        console.error(`✗ ${categorie} : impossible d'ajouter de la dette :\n  ${regressions.join("\n  ")}`);
        echec = true;
        continue;
      }
      dette.ecrireCategorie(categorie, compte);
      console.log(`✓ ${categorie} : registre mis à jour`);
      continue;
    }
    const { regressions, ameliorations } = dette.comparer(categorie, compte);
    if (regressions.length) {
      echec = true;
      console.error(`\n✗ ${categorie.toUpperCase()} — nouveaux défauts :`);
      const cles = new Set(regressions.map((r) => r.split(" : ")[0]));
      for (const c of constats.filter((c) => cles.has(c.cle))) console.error(`  - ${c.detail}`);
    } else {
      console.log(`✓ ${categorie.toUpperCase()} : aucun nouveau défaut`);
    }
    if (ameliorations.length)
      console.log(`  ↓ dette réduite (lancer \`npm run dette:maj\`) : ${ameliorations.join(", ")}`);
  }
  process.exit(echec ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
