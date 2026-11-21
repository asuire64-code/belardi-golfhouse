# Guide du dépôt — à quoi correspond chaque fichier

Ce guide explique, en langage simple, le rôle de chaque dossier et fichier du
projet. Il ne remplace rien et ne change rien au code : c'est une carte pour
s'y retrouver.

> Rien n'a été renommé. Les dossiers comme `cgu/`, `cgv/`, `contact/`...
> correspondent aux adresses web du site (ex. `belardi-golfhouse.fr/contact/`)
> — les renommer casserait ces adresses, donc on documente plutôt qu'on
> renomme.

## 1. Les pages du site (ce que voit un visiteur)

Chaque dossier ci-dessous contient un `index.html` = une page du site.

| Dossier/fichier | Page du site | Contenu |
|---|---|---|
| `index.html` | `/` (accueil) | Page principale : origines, concept, programme, parcours, tarifs, FAQ, contact |
| `parcours/` | `/parcours/` | Détail des golfs joués pendant le séjour |
| `pricing/` | `/pricing/` | Page tarifs détaillée (formules) |
| `contact/` | `/contact/` | Formulaire de contact |
| `plan-du-site/` | `/plan-du-site/` | Plan du site (liste de toutes les pages) |
| `mentions-legales/` | `/mentions-legales/` | Mentions légales (obligatoire en France) |
| `cgv/` | `/cgv/` | **C**onditions **G**énérales de **V**ente (règles de réservation/annulation) |
| `cgu/` | `/cgu/` | **C**onditions **G**énérales d'**U**tilisation (règles d'usage du site) |
| `confidentialite/` | `/confidentialite/` | Politique de confidentialité (RGPD, données personnelles) |
| `cookies/` | `/cookies/` | Politique sur les cookies/traceurs |
| `securite/` | `/securite/` | Page sécurité (paiements, anti-fraude) |
| `accessibilite/` | `/accessibilite/` | Déclaration d'accessibilité numérique |

**Astuce mémo** : `cgu` et `cgv` sont des abréviations juridiques très
courantes en France — c'est le seul endroit un peu "codé" du nom des pages.

## 2. `assets/` — toutes les ressources partagées par les pages

| Sous-dossier | Contenu |
|---|---|
| `assets/css/belardi.css` | La feuille de style principale : couleurs, mise en page, tout le visuel |
| `assets/js/i18n.js` | Le script qui gère les traductions FR/EN/ES et le menu de langue (voir l'explication donnée plus haut dans la conversation) |
| `assets/brand/` | La charte graphique : `CHARTE.md` (règles de marque écrites), `tokens.css` (les couleurs/polices sous forme de variables réutilisables), `motif-b.svg` (motif décoratif) |
| `assets/logo/` | Tous les logos BELARDI, en plusieurs variantes de couleur et de mise en page |
| `assets/illustrations/` | Les dessins/illustrations utilisés sur le site (maison, golfs...) |
| `assets/app-icon/` | Icônes pour l'installation du site comme application mobile (iOS/Android) |
| `assets/fonts/` | Les fichiers de polices de caractères (Jost, Playfair Display, Cormorant Garamond) hébergées localement, + `fonts.css` qui les déclare |
| `assets/vendor/leaflet/` | Bibliothèque externe **Leaflet** (cartes interactives), copiée en local pour ne pas dépendre d'un site tiers |

## 3. `_outils/` — le générateur des pages légales (invisible sur le site)

Le `_` au début du nom indique à GitHub Pages de ne jamais publier ce dossier :
il sert uniquement en coulisses.

| Fichier | Rôle |
|---|---|
| `_outils/construire.py` | Script Python à lancer (`python3 _outils/construire.py`) qui **génère automatiquement** les pages `mentions-legales/`, `cgv/`, `cgu/`, `confidentialite/`, `cookies/`, `securite/`, `accessibilite/`, `plan-du-site/` à partir des modèles ci-dessous, et remet à jour le pied de page partout |
| `_outils/footer.html` | Le pied de page (footer) unique, source de vérité — recopié par le script sur toutes les pages |
| `_outils/pages/*.html` | Le contenu texte de chaque page légale (un fichier par page, ex. `cgv.html`) |

**Règle à retenir** : si vous voulez changer un texte légal ou le pied de
page, modifiez les fichiers ici, puis relancez le script — ne touchez pas
directement `cgv/index.html` etc., ils seraient réécrits au prochain lancement.

## 4. Fichiers de configuration à la racine

| Fichier | Rôle |
|---|---|
| `README.md` | Nom du projet (très sommaire actuellement) |
| `PRODUCT.md` | Description du concept business (cible, offre, positionnement) — utile pour comprendre le "pourquoi", pas le code |
| `GUIDE.md` | **Ce fichier** |
| `CNAME` | Indique à GitHub Pages le nom de domaine personnalisé (`belardi-golfhouse.fr`) |
| `_config.yml` | Configuration de GitHub Pages (quels dossiers inclure/exclure de la publication) |
| `robots.txt` | Instructions pour les robots des moteurs de recherche |
| `sitemap.xml` | Liste de toutes les pages, pour aider les moteurs de recherche à les indexer |
| `site.webmanifest` | Déclare le site comme "installable" en app mobile (nom, icônes, couleurs) |
| `favicon*.png/.ico/.svg`, `apple-touch-icon.png`, `android-chrome-*.png`, `maskable-512.png`, `safari-pinned-tab.svg`, `og-image.png` | Les petites icônes affichées dans l'onglet du navigateur, sur mobile, ou en aperçu quand le lien est partagé (réseaux sociaux) |
| `.well-known/security.txt` | Fichier standardisé indiquant comment signaler une faille de sécurité trouvée sur le site |
| `.htmlvalidate.json` | Règles utilisées par l'outil `html-validate` pour vérifier que le HTML est valide |
| `package.json` / `package-lock.json` | Liste des outils de développement utilisés (tests, validateur HTML, serveur local) — **pas un vrai "build"**, le site n'a pas besoin d'être compilé |
| `playwright.config.js` | Configuration des tests automatiques multi-navigateurs (Playwright) |

## 5. `.github/` — l'automatisation (CI)

Des contrôles qui se lancent automatiquement sur GitHub à chaque modification.

| Fichier | Rôle |
|---|---|
| `.github/workflows/code-et-contenu.yml` | Vérifie le HTML, les liens, le contenu |
| `.github/workflows/navigateurs.yml` | Lance les tests Playwright sur plusieurs navigateurs |
| `.github/workflows/lighthouse.yml` | Audit de performance/accessibilité/SEO (Google Lighthouse) |
| `.github/workflows/securite.yml` | Vérifications de sécurité |
| `.github/workflows/codeql.yml` | Scan de sécurité du code (outil GitHub CodeQL) |
| `.github/scripts/check-links.js` | Script qui vérifie qu'aucun lien interne n'est cassé |
| `.github/scripts/check-security-txt.js` | Vérifie que `.well-known/security.txt` est valide |
| `.github/tests/smoke.spec.js` | Test "de fumée" : vérifie que les pages principales se chargent bien |
| `.github/lighthouserc.json` | Configuration du Lighthouse CI ci-dessus |

## 6. Dossiers techniques à ignorer en tant que débutant

- `.git/` — la mémoire de Git (historique des versions), jamais à modifier à la main
- `node_modules/` — bibliothèques téléchargées automatiquement par `npm install`, jamais à éditer
- `.claude/`, `.impeccable/` — configuration des outils d'assistance IA utilisés sur ce projet

---

### En une phrase

**Les pages que voit un visiteur** sont les dossiers à la racine (`contact/`,
`pricing/`, etc.) ; **leur apparence commune** vient de `assets/` ; **les
pages légales** sont fabriquées par `_outils/` plutôt qu'écrites à la main ;
et **`.github/`** fait tourner des contrôles automatiques à chaque changement.
