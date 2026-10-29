// Accessibilité (normes WCAG 2.1 AA, base du RGAA) : contraste, textes alternatifs, clavier, libellés…
// Les défauts déjà présents sont tolérés via le registre de dette ; tout nouveau défaut fait échouer le test.
const { test, expect, attendreRendu } = require("./socle");
const AxeBuilder = require("@axe-core/playwright").default;
const { PAGES } = require("../config-site");
const dette = require("../outils/dette");

for (const p of PAGES) {
  test(`${p.nom} · accessibilité WCAG 2.1 AA`, async ({ page, browserName, isMobile }) => {
    test.skip(isMobile || browserName !== "chromium", "analyse faite une fois, sur Chrome");
    await page.goto(p.chemin);
    await attendreRendu(page);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();

    const compte = {};
    const details = {};
    for (const v of violations) {
      const cle = `${p.nom} · ${v.id}`;
      compte[cle] = v.nodes.length;
      details[cle] = `${v.help} (${v.nodes.length}) — ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`;
    }
    const regressions = dette.verifierGroupe("accessibilite", `${p.nom} · `, compte);
    expect(regressions.map((c) => details[c]), "nouveaux défauts d'accessibilité").toEqual([]);
  });
}
