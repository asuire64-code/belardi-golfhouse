# BELARDI Golf House — identité visuelle

Référence rapide pour toute évolution du site. Charte graphique édition 1 (2026).

## Couleurs

| Nom | Code | Usage |
|---|---|---|
| Sauge | `#8A9A7B` | Signature · fonds, icône |
| Sauge ombre | `#788A6A` | Ombre portée, survols |
| Lin | `#E6DCC8` | Fond clair · papier, site |
| Lin ombre | `#D2C5AA` | Ombre sur fond lin, filets |
| Terre | `#A0573A` | Accent · boucle du B, boutons |
| Terre claire | `#D9A487` | Accent du texte en mode sombre |
| Olive | `#3E4A33` | Texte, fond foncé |
| Blanc balle | `#FAF8F2` | Balle, texte sur sauge |
| Sombre | `#1F251B` | Fond du mode sombre |
| Surface sombre | `#2A3122` | Surfaces du mode sombre |

Proportions : sauge 40 % · lin 30 % · olive 15 % · terre 10 % · blanc 5 %.
**Aplats mats uniquement** : aucun dégradé, aucune brillance, aucun angle arrondi (`--rayon: 0`).

## Typographie (Google Fonts)

- **Jost** 300 / 400 / 500 — site, textes et titres.
- **Josefin Sans** 300 — réservée au mot BELARDI dans le logo (capitales, interlettrage 0,5 em).
- **Cormorant Garamond** italique 500 — « Golf House » et accents.
- Secours : Helvetica, Arial / Georgia.

Échelle : H1 48 / 1,1 · H2 28 / 1,2 · texte 16 / 1,65 (Jost 300) · surtitre 12 capitales 0,3 em · accent 26.
Espacements : 8 · 16 · 24 · 40 · 64 · 96 px.

## Logo

- **Symbole** : le B en trois pièces (fût olive, boucle terre, balle blanche), séparées par un joint de 3 unités **à la couleur du fond**. Dans `index.html` le symbole est en SVG inline et le joint suit la variable `--b-joint`, ce qui le rend automatiquement correct en clair, en sombre et sur le menu mobile sauge.
- **Ombre portée** : seulement au-dessus de 48 px.
- **Sous 48 px** : symbole sans ombre. **Sous 40 px** : retirer aussi les alvéoles (c'est le cas de l'en-tête mobile, géré en CSS).
- **Zone de protection** : la largeur du fût tout autour.
- **Tailles minimales** : symbole 16 px · logo empilé 120 px.
- **Interdits** : déformer, pivoter, recolorer hors palette, poser sur un fond chargé.

## Fichiers du dépôt

| Chemin | Contenu |
|---|---|
| `assets/logo/` | Logos SVG : empilé (20h), horizontal (20a), symbole — versions lin, sauge, sombre, monochromes |
| `assets/app-icon/` | Icônes iOS (standard / sombre / teintée), Android adaptatif, Google Play |
| `assets/brand/tokens.css` | Variables CSS de la charte, réutilisables pour tout autre document |
| `assets/brand/motif-b.svg` | Motif « B en quinconce » de la charte (section 12) — disponible, non utilisé sur le site |
| `favicon.*`, `apple-touch-icon.png`, `android-chrome-*.png`, `maskable-512.png`, `safari-pinned-tab.svg`, `site.webmanifest` | Jeu de favicons complet, à la racine |
| `og-image.png` | Image de partage 1200 × 630 |

Les métadonnées C2PA ont été retirées des SVG (≈ 8 Ko par fichier).

## À faire ensuite

- Remplacer les aplats par de vraies photos : le hero (`.hero`, voir le commentaire dans le CSS), le visuel du concept et les cinq vignettes de parcours. En attendant, ces zones sont des aplats neutres (lin / lin ombre) : le sauge ne subsiste que sur le menu mobile, l'olive sur la section « piliers » et le pied de page.
- Brancher le formulaire (`<form action="#">` → Formspree, Tally ou équivalent).
- Rédiger les pages Mentions légales et Confidentialité (liens `#` dans le pied de page).
