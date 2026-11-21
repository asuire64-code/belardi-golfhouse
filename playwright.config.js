// Config Playwright pour les tests « Navigateurs » (CI). Sert le site statique
// tel quel (aucun build) et exécute les mêmes specs sur Chromium, Firefox et
// WebKit, pour vérifier affichage, fonctionnement et accessibilité de base.
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./.github/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx http-server . -p 4173 -c-1 -s",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
