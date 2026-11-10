# BELARDI Golf House — guide de travail pour Claude

Site vitrine statique (HTML/CSS/JS, aucun build), publié par GitHub Pages depuis `main` sur https://belardi-golfhouse.fr.
Propriétaire : Antoine, débutant en technique → expliquer simplement, ne jamais lui demander de taper des commandes.

## Carte du dépôt (inutile de tout relire)

| Chemin | Rôle |
|---|---|
| `index.html`, `<page>/index.html` | Les 12 pages : accueil, parcours, pricing (tarifs), contact, mentions-legales, confidentialite, cgv, cgu, cookies, securite, accessibilite, plan-du-site. Chaque page a son `<style>` propre. |
| `assets/css/belardi.css` | Socle commun (en-tête, menu, pied de page). Couleurs : `assets/brand/tokens.css`, charte : `assets/brand/CHARTE.md`. |
| `assets/js/i18n.js` | Traductions FR/EN/ES (`DICT.fr`, `DICT.en`, `DICT.es`) + sélecteur de langue. ~840 lignes : chercher une clé avec Grep, ne pas lire en entier. |
| `assets/logo/`, `assets/illustrations/`, icônes à la racine | Images (ne pas renommer : URLs publiques). |
| `assets/vendor/` | Bibliothèques tierces copiées telles quelles (Leaflet). Ne jamais modifier à la main ; exclues des contrôles CSS. |
| `sitemap.xml`, `robots.txt`, `CNAME`, `site.webmanifest` | SEO et domaine. |
| `tests/` | Garde-fous qualité (jamais publiés, voir `_config.yml`). |
| `.github/workflows/` | Contrôles automatiques sur chaque pull request. |

## Règles absolues

1. **Jamais de push direct sur `main`** (bloqué de toute façon). Toujours : branche → pull request → contrôles verts → fusion automatique.
2. **Ne jamais affaiblir un test pour le faire passer** : corriger le site. Supprimer un test, baisser un seuil ou ajouter un domaine tiers exige l'accord d'Antoine et l'étiquette `modif-garde-fous` sur la PR.
3. **`tests/dette-connue.json` ne peut que baisser.** Après avoir corrigé un défaut listé : `npm run dette:maj`.
4. Ne jamais retirer `<meta name="google-site-verification">` de l'accueil (Search Console).
5. Tout texte visible porte un `data-i18n="cle"` et la clé existe dans les **trois** langues de `i18n.js`.
6. Nouvelle page : l'ajouter dans `tests/config-site.js` (PAGES) **et** `sitemap.xml`.
7. Nouveau service externe (script, police, iframe) : l'ajouter à `DOMAINES_AUTORISES` dans `tests/config-site.js`, avec un attribut `integrity` (SRI) pour les scripts.

## Faire une modification en économisant les tokens

1. `git checkout -b <type>/<sujet>` (types : `contenu`, `style`, `correctif`, `seo`).
2. Localiser avec Grep (clé i18n, classe CSS, id) ; lire seulement les lignes utiles (Read avec offset/limit) ; modifier avec Edit.
3. Dans `tests/` : `npm ci` (une fois), puis `npm run test:rapide` (≈5 s : HTML, CSS, JS, SEO, liens, traductions, sécurité).
4. Ne pas lancer les tests navigateurs en local (lents, captures dépendantes de l'environnement) : la CI s'en charge.
5. Pousser la branche, ouvrir la PR avec `gh pr create`, activer la fusion automatique :
   `gh api -X PUT repos/asuire64-code/belardi-golfhouse/pulls/<n>/ccr/auto_merge -f merge_method=squash`.
6. Si un contrôle échoue : lire uniquement le résumé d'échec (`gh run view <id> --log-failed | tail -60`).
   - **Captures** : différence d'apparence. Voulue ? Montrer l'avant/après à Antoine (artefact `rapport-navigateurs`), puis lancer « Mettre à jour les captures » sur la branche (`gh workflow run captures.yml --ref <branche>`).
   - **Dette / garde-fous** : un défaut nouveau a été introduit → le corriger.

## Les contrôles (tous obligatoires pour fusionner)

| Contrôle | Vérifie |
|---|---|
| Code et contenu | HTML valide, CSS et JS sans bug, SEO (titre, description, canonique, h1, sitemap), liens et ancres, traductions complètes, sécurité du code |
| Navigateurs | Chrome, Firefox, Safari, Android, iPhone : pages sans erreur, langues, menu, formulaire, débordements (320→1920 px), accessibilité WCAG AA, captures au pixel près |
| Performance | Lighthouse : performance, accessibilité, bonnes pratiques, SEO, stabilité de mise en page |
| Sécurité | Secrets dans l'historique, dépendances vulnérables |
| CodeQL | Failles dans le JavaScript et dans les workflows |

## Dette connue à résorber (par priorité)

Le détail exact est dans `tests/dette-connue.json`.

1. Contraste de couleurs insuffisant (WCAG AA) : l'essentiel de la dette, surtout dans l'en-tête/pied de page communs → corriger une couleur dans `assets/brand/tokens.css` ou `assets/css/belardi.css` fait baisser toutes les pages d'un coup.
2. `onclick` inline dans les menus et pieds de page (bloque une future politique CSP stricte).
3. Liens dans le texte distingués uniquement par la couleur (`link-in-text-block`) et menu de langue sans `<select>` natif.
4. Repères (`<nav>`, `<header>`) sans nom accessible unique sur les pages secondaires.
