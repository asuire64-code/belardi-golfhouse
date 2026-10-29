// Garde-fou anti-triche : le registre de dette d'une PR ne peut pas tolérer plus de défauts que celui de main.
// Usage : node outils/dette-ne-monte-pas.js <registre-de-main.json>
const dette = require("./dette");

const reference = process.argv[2];
const avant = dette.lire(reference);
const apres = dette.lire();
const hausses = [];
for (const [cat, cles] of Object.entries(apres))
  for (const [cle, n] of Object.entries(cles)) {
    const ancien = (avant[cat] || {})[cle] || 0;
    if (n > ancien) hausses.push(`${cat} / ${cle} : ${ancien} → ${n}`);
  }

if (hausses.length) {
  console.error("✗ Le registre de dette a été augmenté pour faire passer des défauts. Corrigez-les plutôt :");
  for (const h of hausses) console.error("  - " + h);
  process.exit(1);
}
console.log(`✓ Dette : ${dette.total(avant)} → ${dette.total(apres)} défauts tolérés`);
