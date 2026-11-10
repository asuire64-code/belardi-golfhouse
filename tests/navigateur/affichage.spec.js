// Affichage : mise en page cohérente à toutes les tailles d'écran, et captures comparées à la référence.
const { test, expect, attendreRendu, defilerToutLePage } = require("./socle");
const { PAGES } = require("../config-site");
const dette = require("../outils/dette");

const LARGEURS = [320, 375, 768, 1024, 1280, 1920];

for (const p of PAGES) {
  test(`${p.nom} · aucun débordement horizontal (${LARGEURS.join(", ")} px)`, async ({ page, browserName, isMobile }) => {
    test.skip(isMobile || browserName !== "chromium", "largeurs testées une fois, sur Chrome");
    const fautifs = [];
    for (const largeur of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto(p.chemin);
      await attendreRendu(page);
      const deborde = await page.evaluate(() => {
        const largeurPage = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth <= largeurPage + 1) return null;
        const coupable = [...document.querySelectorAll("body *")].find((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > largeurPage + 1 && getComputedStyle(el).position !== "fixed";
        });
        return coupable ? `<${coupable.tagName.toLowerCase()} class="${coupable.className}">` : "élément inconnu";
      });
      if (deborde) fautifs.push({ cle: `${p.nom} · debordement-${largeur}px`, detail: `${largeur} px : ${deborde} dépasse de l'écran` });
    }
    const regressions = dette.verifierGroupe("affichage", `${p.nom} · debordement`, dette.compter(fautifs.map((f) => f.cle)));
    expect(fautifs.filter((f) => regressions.includes(f.cle)).map((f) => f.detail), "débordement horizontal (la page bouge sur le côté)").toEqual([]);
  });

  test(`${p.nom} · texte lisible sur mobile`, async ({ page, isMobile, browserName }) => {
    test.skip(!isMobile || browserName !== "chromium", "vérifié une fois, sur Android");
    await page.goto(p.chemin);
    await attendreRendu(page);
    const trop_petit = await page.evaluate(() =>
      [...document.querySelectorAll("p, li, a, button, label, td")]
        .filter((el) => !el.closest(".leaflet-control-attribution")) // mention imposée par OpenStreetMap
        .filter((el) => el.offsetParent && el.textContent.trim() && parseFloat(getComputedStyle(el).fontSize) < 11)
        .map((el) => `${el.tagName.toLowerCase()} « ${el.textContent.trim().slice(0, 30)} » (${getComputedStyle(el).fontSize})`));
    const cle = `${p.nom} · texte-trop-petit`;
    const regressions = dette.verifierGroupe("affichage", cle, trop_petit.length ? { [cle]: trop_petit.length } : {});
    expect(regressions.length ? trop_petit : [], "texte trop petit pour être lu sur mobile (< 11 px)").toEqual([]);
  });

  test(`${p.nom} · capture identique à la référence`, async ({ page }) => {
    await page.goto(p.chemin);
    await defilerToutLePage(page);
    await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
    await expect(page).toHaveScreenshot(`${p.nom}.png`, { fullPage: true, timeout: 20_000 });
  });
}
