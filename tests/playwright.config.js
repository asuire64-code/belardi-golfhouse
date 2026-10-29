// Tests dans de vrais navigateurs : Chrome, Firefox, Safari (WebKit), sur ordinateur et sur mobile.
const { defineConfig, devices } = require("@playwright/test");

const PORT = 4173;
const CI = !!process.env.CI;

module.exports = defineConfig({
  testDir: "./navigateur",
  outputDir: "./resultats/artefacts",
  snapshotPathTemplate: "{testDir}/captures-de-reference/{projectName}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 2 : undefined,
  reporter: CI
    ? [["github"], ["html", { outputFolder: "./resultats/rapport", open: "never" }]]
    : [["list"], ["html", { outputFolder: "./resultats/rapport", open: "never" }]],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", caret: "hide", scale: "css" },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chrome-ordinateur", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "firefox-ordinateur", use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } } },
    { name: "safari-ordinateur", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } },
    { name: "android", use: { ...devices["Pixel 7"] } },
    { name: "iphone", use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    command: `http-server .. -p ${PORT} -c-1 --silent`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !CI,
    timeout: 30_000,
  },
});
