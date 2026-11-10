// Fonctionnement : chaque page s'ouvre sans erreur, la navigation, les langues et le formulaire marchent.
const { test, expect, attendreRendu, defilerToutLePage } = require("./socle");
const { PAGES, LANGUES, TEXTES_VIDES_VOULUS } = require("../config-site");

for (const p of PAGES) {
  test(`${p.nom} · s'ouvre sans erreur ni ressource manquante`, async ({ page, problemes }) => {
    const reponse = await page.goto(p.chemin);
    expect(reponse.status()).toBe(200);
    await defilerToutLePage(page);
    await expect(page.locator("h1")).toBeVisible();
    const imagesCassees = await page.evaluate(() =>
      [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.src.startsWith(location.origin)).map((i) => i.src));
    expect(imagesCassees, "images locales qui ne s'affichent pas").toEqual([]);
    expect(problemes).toEqual([]);
  });

  test(`${p.nom} · aucun texte de traduction vide, dans les 3 langues`, async ({ page, problemes }) => {
    for (const langue of LANGUES) {
      await page.addInitScript((l) => { try { localStorage.setItem("belardi-lang", l); } catch {} }, langue);
      await page.goto(p.chemin);
      await attendreRendu(page);
      await expect(page.locator("html")).toHaveAttribute("lang", langue);
      const vides = (await page.$$eval("[data-i18n]", (els) => els.filter((e) => !e.textContent.trim()).map((e) => e.dataset.i18n)))
        .filter((cle) => !(TEXTES_VIDES_VOULUS[langue] || []).includes(cle));
      expect(vides, `textes vides en ${langue}`).toEqual([]);
    }
    expect(problemes).toEqual([]);
  });
}

test("Navigation · tous les liens du menu mènent à une page existante", async ({ page, request }) => {
  await page.goto("/");
  const liens = await page.$$eval("header a[href], footer a[href]", (as) => [...new Set(as.map((a) => a.href))]);
  for (const lien of liens.filter((l) => l.startsWith("http://localhost"))) {
    const r = await request.get(lien.split("#")[0]);
    expect(r.status(), lien).toBe(200);
  }
});

test("Langue · le sélecteur change la langue et elle est retenue d'une page à l'autre", async ({ page, isMobile }) => {
  await page.goto("/");
  await attendreRendu(page);
  const titreFr = await page.locator("h1").textContent();
  if (isMobile) {
    await page.locator("label.burger").click();
    await page.locator(".menu-mobile .langues button[data-lang='en']").click();
  } else {
    await page.locator(".entete .lang-trigger").click();
    const en = page.locator(".entete .lang-switch[data-open='true'] button[data-lang='en']");
    await expect(en).toBeVisible();
    await en.click();
  }
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await page.locator("h1").textContent()).not.toBe(titreFr);
  await page.goto("/pricing/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("Contact · un envoi vide est bloqué et les erreurs s'affichent", async ({ page }) => {
  await page.goto("/contact/");
  await attendreRendu(page);
  let envoye = false;
  page.on("request", (r) => { if (r.url().startsWith("mailto:")) envoye = true; });
  await page.locator('#formulaireContact [type="submit"]').click();
  await expect(page.locator("#formulaireContact .en-erreur").first()).toBeVisible();
  expect(envoye).toBe(false);
});

test("Mobile · le menu s'ouvre", async ({ page, isMobile }) => {
  test.skip(!isMobile, "spécifique au mobile");
  await page.goto("/");
  await page.locator("label.burger").click();
  await expect(page.locator("#menu")).toBeChecked();
  await expect(page.locator("nav.menu-mobile a").first()).toBeVisible();
});
