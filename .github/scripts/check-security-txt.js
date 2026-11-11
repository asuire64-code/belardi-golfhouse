#!/usr/bin/env node
// Vérifie .well-known/security.txt (RFC 9116) : champs obligatoires présents,
// et date d'expiration non déjà passée (fichier pas oublié / périmé).
const fs = require("fs");
const path = require("path");

const p = path.join(process.cwd(), ".well-known", "security.txt");
if (!fs.existsSync(p)) {
  console.log("[ERREUR] .well-known/security.txt est introuvable.");
  process.exit(1);
}

const txt = fs.readFileSync(p, "utf8");
const champs = {};
for (const ligne of txt.split(/\r?\n/)) {
  const m = ligne.match(/^([A-Za-z-]+):\s*(.+)$/);
  if (m) champs[m[1]] = m[2].trim();
}

let erreurs = 0;
if (!champs.Contact) {
  console.log("[ERREUR] Champ 'Contact' manquant.");
  erreurs++;
}
if (!champs.Expires) {
  console.log("[ERREUR] Champ 'Expires' manquant.");
  erreurs++;
} else {
  const expire = new Date(champs.Expires);
  if (Number.isNaN(expire.getTime())) {
    console.log(`[ERREUR] 'Expires' n'est pas une date valide : ${champs.Expires}`);
    erreurs++;
  } else if (expire.getTime() < Date.now()) {
    console.log(`[ERREUR] security.txt a expiré le ${champs.Expires} — à renouveler.`);
    erreurs++;
  } else {
    console.log(`OK : security.txt valide jusqu'au ${champs.Expires}.`);
  }
}

process.exit(erreurs ? 1 : 0);
