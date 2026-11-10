// Source de vérité unique pour tous les tests.
// Ajouter une page au site = ajouter une ligne dans PAGES (et dans sitemap.xml).
const path = require("path");

const RACINE = path.resolve(__dirname, "..");
const DOMAINE = "https://belardi-golfhouse.fr";

const PAGES = [
  { nom: "accueil", chemin: "/" },
  { nom: "parcours", chemin: "/parcours/" },
  { nom: "tarifs", chemin: "/pricing/" },
  { nom: "contact", chemin: "/contact/" },
  { nom: "mentions-legales", chemin: "/mentions-legales/" },
  { nom: "confidentialite", chemin: "/confidentialite/" },
  { nom: "cgv", chemin: "/cgv/" },
  { nom: "cgu", chemin: "/cgu/" },
  { nom: "cookies", chemin: "/cookies/" },
  { nom: "securite", chemin: "/securite/" },
  { nom: "accessibilite", chemin: "/accessibilite/" },
  { nom: "plan-du-site", chemin: "/plan-du-site/" },
];

const LANGUES = ["fr", "en", "es"];

// Textes volontairement vides dans une langue (ex. « document publié en français » inutile en français).
const TEXTES_VIDES_VOULUS = { fr: ["legal.avis"] };

// Seuls domaines externes autorisés dans le code du site.
// Ajouter un service tiers = l'ajouter ici, consciemment, dans une PR dédiée.
const DOMAINES_AUTORISES = [
  "belardi-golfhouse.fr",
  "fonts.googleapis.com", // polices
  "fonts.gstatic.com", // polices
  "tile.openstreetmap.org", // tuiles de la carte
  "www.openstreetmap.org", // mention de crédit carte
  "www.google.com", // reCAPTCHA
  "www.gstatic.com", // reCAPTCHA
  "www.instagram.com",
  "schema.org",
  "www.cnil.fr",
  "www.ovhcloud.com",
  "github.com",
];

// Balise qui valide la propriété du site dans Google Search Console : ne jamais la retirer.
const GOOGLE_SITE_VERIFICATION = "3xadOML6mGPBielIxzCiIlsYGVa-2bDMmBU36-tmChU";

const fichierDePage = (chemin) => path.join(RACINE, chemin, "index.html");

module.exports = {
  RACINE,
  DOMAINE,
  PAGES,
  LANGUES,
  TEXTES_VIDES_VOULUS,
  DOMAINES_AUTORISES,
  GOOGLE_SITE_VERIFICATION,
  fichierDePage,
};
