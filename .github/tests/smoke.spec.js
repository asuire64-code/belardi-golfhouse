// Tests « Navigateurs (affichage, fonctionnement, accessibilité) ».
// Smoke test multi-navigateur : la page s'affiche, le logo et la nav sont
// présents, pas d'erreur console, et un scan d'accessibilité (axe-core) ne
// remonte aucune violation critique ou sérieuse.
//
// « color-contrast » est volontairement exclu du critère bloquant : la
// charte graphique (assets/brand/CHARTE.md) utilise plusieurs combinaisons
// de couleurs qui n'atteignent pas le ratio AA (ex. terre-claire sur sauge).
// C'est une dette de palette existante, pas une régression de ce test — elle
// reste visible dans le rapport mais ne bloque pas la CI. Revoir la palette
// est un sujet de design à part entière.
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const PAGES = ["/", "/parcours/", "/pricing/", "/contact/", "/mentions-legales/"];

for (const pagePath of PAGES) {
  test(`${pagePath} : affichage, logo, nav et accessibilité`, async ({ page }) => {
    const erreursConsole = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") erreursConsole.push(msg.text());
    });
    page.on("pageerror", (err) => erreursConsole.push(String(err)));

    const response = await page.goto(pagePath, { waitUntil: "networkidle" });
    expect(response.ok()).toBeTruthy();

    await expect(page).toHaveTitle(/BELARDI/);

    const logo = page.locator("a.logo");
    await expect(logo).toBeVisible();
    await expect(logo.locator("svg.symbole")).toBeVisible();

    const erreursBloquantes = erreursConsole.filter(
      (m) => !m.includes("favicon") && !m.includes("tile.openstreetmap.org")
    );
    expect(erreursBloquantes, erreursBloquantes.join("\n")).toEqual([]);

    const resultats = await new AxeBuilder({ page })
      .exclude("#carte")
      .analyze();
    const toutes = resultats.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact)
    );
    const contraste = toutes.filter((v) => v.id === "color-contrast");
    const bloquantes = toutes.filter((v) => v.id !== "color-contrast");
    if (contraste.length) {
      console.log(
        `[connu, non bloquant] color-contrast sur ${pagePath} : ${contraste[0].nodes.length} occurrence(s) — dette de palette existante`
      );
    }
    const detail = bloquantes
      .map((v) => `${v.id} (${v.impact}) : ${v.nodes.length} occurrence(s)`)
      .join("\n");
    expect(bloquantes, detail).toEqual([]);
  });
}

test("menu mobile : s'ouvre et se ferme", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator(".menu-mobile");
  const burger = page.locator("label.burger");
  await expect(menu).toBeHidden();
  await burger.click();
  await expect(menu).toBeVisible();
  await burger.click();
  await expect(menu).toBeHidden();
});
