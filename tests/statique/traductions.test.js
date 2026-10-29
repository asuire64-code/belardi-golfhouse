// Traductions FR / EN / ES : chaque texte affiché doit exister dans les trois langues.
const test = require("node:test");
const assert = require("node:assert/strict");
const { toutesLesPages, lireDictionnaire } = require("./outils-html");
const { LANGUES } = require("../config-site");

const DICT = lireDictionnaire();

test("Traductions · les trois langues sont présentes", () => {
  assert.deepEqual(Object.keys(DICT).sort(), [...LANGUES].sort());
});

test("Traductions · mêmes clés dans les trois langues", () => {
  const ref = Object.keys(DICT.fr);
  for (const langue of LANGUES) {
    const cles = Object.keys(DICT[langue]);
    const manquantes = ref.filter((c) => !cles.includes(c));
    const enTrop = cles.filter((c) => !ref.includes(c));
    assert.deepEqual(manquantes, [], `${langue} : clés absentes par rapport au français`);
    assert.deepEqual(enTrop, [], `${langue} : clés qui n'existent pas en français`);
  }
});

test("Traductions · aucun texte vide", () => {
  for (const langue of LANGUES) {
    const vides = Object.entries(DICT[langue]).filter(([, v]) => typeof v !== "string" || !v.trim()).map(([c]) => c);
    assert.deepEqual(vides, [], `${langue} : traductions vides`);
  }
});

for (const p of toutesLesPages()) {
  test(`Traductions · chaque clé utilisée dans la page « ${p.nom} » existe`, () => {
    const utilisees = new Set();
    for (const el of p.dom.querySelectorAll("*"))
      for (const [attr, valeur] of Object.entries(el.attributes))
        if (/^data-i18n(-[a-z-]+)?$/.test(attr) && valeur) utilisees.add(valeur);
    const absentes = [];
    for (const cle of utilisees) for (const langue of LANGUES) if (!(cle in DICT[langue])) absentes.push(`${langue}:${cle}`);
    assert.deepEqual(absentes, [], "clés de traduction utilisées dans la page mais absentes du dictionnaire");
  });
}
