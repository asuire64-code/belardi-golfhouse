#!/usr/bin/env python3
"""BELARDI Golf House — génère les pages légales et synchronise le pied de page.

Usage (depuis la racine du dépôt) :  python3 _outils/construire.py

- _outils/footer.html          : pied de page unique, recopié dans toutes les pages
- _outils/pages/<slug>.html    : contenu de chaque page légale (sections <h2 id="...">)
- PAGES ci-dessous             : titre, description et date de mise à jour

Le dossier _outils n'est pas publié par GitHub Pages (préfixe « _ »).
"""
import html
import re
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
OUTILS = RACINE / "_outils"
SITE = "https://belardi-golfhouse.fr"

# slug, titre H1, surtitre, description, date de mise à jour, sommaire ?
PAGES = [
    ("mentions-legales", "Mentions légales", "Informations légales",
     "Mentions légales de BELARDI Golf House : éditeur, hébergeur, immatriculation, garantie financière et propriété intellectuelle.",
     "29 octobre 2026", True),
    ("cgv", "Conditions générales de vente", "Réservation",
     "Conditions générales de vente des séjours golf BELARDI Golf House : réservation, paiement, annulation, assurances et droits du voyageur.",
     "29 octobre 2026", True),
    ("cgu", "Conditions générales d'utilisation", "Informations légales",
     "Conditions générales d'utilisation du site belardi-golfhouse.fr.",
     "29 octobre 2026", True),
    ("confidentialite", "Politique de confidentialité", "Vos données",
     "Comment BELARDI Golf House collecte, utilise et protège vos données personnelles, et comment exercer vos droits.",
     "29 octobre 2026", True),
    ("cookies", "Politique cookies", "Vos données",
     "Les traceurs utilisés sur belardi-golfhouse.fr : aucun cookie publicitaire ni de mesure d'audience.",
     "29 octobre 2026", True),
    ("securite", "Sécurité", "Vos données",
     "Comment BELARDI Golf House protège vos données et vos paiements, et comment reconnaître une tentative de fraude.",
     "29 octobre 2026", True),
    ("accessibilite", "Accessibilité", "Informations légales",
     "Engagement d'accessibilité numérique du site BELARDI Golf House.",
     "29 octobre 2026", True),
    ("plan-du-site", "Plan du site", "Navigation",
     "Plan du site BELARDI Golf House : toutes les pages du séjour et les informations légales.",
     "29 octobre 2026", False),
]

# Liste latérale des documents (ordre d'affichage)
DOCS = [("mentions-legales", "footer.mentions", "Mentions légales"),
        ("cgv", "footer.cgv", "Conditions de vente"),
        ("cgu", "footer.cgu.long", "Conditions d'utilisation"),
        ("confidentialite", "footer.confidentialite", "Confidentialité"),
        ("cookies", "footer.cookies", "Cookies"),
        ("securite", "footer.securite", "Sécurité"),
        ("accessibilite", "footer.accessibilite", "Accessibilité"),
        ("plan-du-site", "footer.plan", "Plan du site")]

POLICES = """<link rel="preload" href="/assets/fonts/jost-latin-300-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts/fonts.css">"""

STYLE_LEGAL = """<style>
  .doc-legal{padding:var(--e5) 0 var(--e6);background:var(--bg)}
  .doc-grille{display:grid;grid-template-columns:220px minmax(0,1fr);gap:var(--e6);align-items:start}
  .doc-aside{position:sticky;top:calc(var(--h-entete) + var(--e3))}
  .doc-aside-titre,.doc .surtitre{margin:0 0 var(--e2);font-size:11px;font-weight:400;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;color:var(--accent)}
  .doc-aside ul{list-style:none;margin:0;padding:0;border-left:1px solid var(--bord)}
  .doc-aside a{display:block;padding:7px 0 7px var(--e2);margin-left:-1px;border-left:1px solid transparent;font-size:14px;color:var(--texte-doux-auto);text-decoration:none;transition:color .2s ease,border-color .2s ease}
  .doc-aside a:hover{color:var(--fg)}
  .doc-aside a[aria-current="page"]{color:var(--fg);font-weight:400;border-left-color:var(--accent)}
  .doc{max-width:740px;min-width:0}
  .doc h1{margin:0;font-weight:500;font-size:clamp(32px,4.4vw,var(--fs-h1));line-height:var(--lh-h1);color:var(--fg)}
  .doc .maj{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;margin:var(--e2) 0 var(--e4);font-size:13px;color:var(--texte-doux-auto)}
  .doc .imprimer{background:none;border:0;padding:0;font:inherit;color:var(--accent);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
  .legal-avis{margin:0 0 var(--e4);padding:var(--e2) var(--e3);border-left:2px solid var(--accent);background:var(--surface);font-size:14px;color:var(--texte-doux-auto)}
  .legal-avis:empty{display:none}
  .doc .chapo{font-size:17px;line-height:1.7;color:var(--fg);margin:0 0 var(--e4)}
  .sommaire{margin:0 0 var(--e5);border-top:1px solid var(--bord);border-bottom:1px solid var(--bord)}
  .sommaire summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;padding:var(--e2) 0;font-size:11px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;color:var(--fg)}
  .sommaire summary::-webkit-details-marker{display:none}
  .sommaire summary::after{content:"";width:8px;height:8px;border-right:1px solid currentColor;border-bottom:1px solid currentColor;transform:rotate(45deg) translateY(-3px);transition:transform .2s ease}
  .sommaire[open] summary::after{transform:rotate(-135deg) translateY(-2px)}
  .doc .sommaire ol{list-style:none;margin:0;padding:0 0 var(--e2);columns:2;column-gap:var(--e4)}
  .doc .sommaire li{break-inside:avoid;padding:4px 0;margin:0}
  .sommaire a{font-size:14px;color:var(--texte-doux-auto);text-decoration:none}
  .sommaire a:hover{color:var(--accent)}
  .doc h2{scroll-margin-top:calc(var(--h-entete) + var(--e2));font-size:20px;font-weight:500;line-height:1.3;margin:var(--e5) 0 var(--e2);color:var(--fg)}
  .doc p,.doc li,.doc dd{color:var(--texte-doux-auto);line-height:1.75;font-size:16px}
  .doc p{margin:0 0 var(--e2)}
  .doc strong{font-weight:500;color:var(--fg)}
  .doc ul,.doc ol{padding-left:1.2rem;margin:0 0 var(--e2)}
  .doc li{margin:.4rem 0}
  .doc li::marker{color:var(--accent)}
  .doc a{color:var(--accent);text-underline-offset:3px;overflow-wrap:anywhere}
  .doc dl{margin:var(--e2) 0 var(--e3);border-top:1px solid var(--bord)}
  .doc dt{font-weight:400;color:var(--fg);padding-top:var(--e2);font-size:14px;letter-spacing:.02em}
  .doc dd{margin:2px 0 0;padding-bottom:var(--e2);border-bottom:1px solid var(--bord)}
  .doc code{font-size:.92em;background:var(--surface);padding:1px 6px}
  .essentiel{margin:0 0 var(--e4);padding:var(--e3) var(--e4);background:var(--surface);border-top:2px solid var(--accent)}
  .essentiel-titre{margin:0 0 var(--e1)!important;font-size:11px!important;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;color:var(--accent)!important}
  .essentiel ul{margin:0}
  .tableau{overflow-x:auto;margin:var(--e2) 0 var(--e3);border:1px solid var(--bord)}
  .tableau table{border-collapse:collapse;width:100%;min-width:560px;font-size:14px}
  .tableau th{text-align:left;font-weight:400;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg);background:var(--surface);padding:12px 14px;border-bottom:1px solid var(--bord)}
  .tableau td{vertical-align:top;padding:12px 14px;border-bottom:1px solid var(--bord);color:var(--texte-doux-auto);line-height:1.55}
  .tableau tr:last-child td{border-bottom:0}
  .annexe-ref{font-size:13px!important;font-style:italic}
  .formulaire{padding:var(--e3) var(--e4);border:1px solid var(--bord)}
  .formulaire p,.formulaire li{font-size:14.5px}
  .todo{background:rgba(160,87,58,.12);border:1px dashed rgba(160,87,58,.6);color:var(--fg);padding:0 .35rem;font-size:.92em;border-radius:0}
  .plan{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--e4) var(--e5)}
  .plan h2{margin-top:0!important}
  .plan ul{list-style:none;padding:0}
  @media(max-width:900px){
    .doc-grille{grid-template-columns:1fr;gap:0}
    .doc-aside{display:none}
    .doc .sommaire ol{columns:1}
    .doc-legal{padding-top:var(--e4)}
  }
  @media(max-width:600px){
    .essentiel,.formulaire{padding:var(--e2) var(--e3)}
    .plan{grid-template-columns:1fr}
  }
  @media print{
    .entete,.menu-mobile,.burger-ctrl,.pied,.doc-aside,.sommaire,.imprimer,.legal-avis{display:none!important}
    .doc-legal{padding:0}
    .doc-grille{display:block}
    .doc p,.doc li,.doc dd,.tableau td{color:#000}
  }
</style>"""


def lire(p):
    return Path(p).read_text(encoding="utf-8")


def entete_sous_page():
    """En-tête et menu mobile de l'accueil, liens rendus absolus."""
    src = lire(RACINE / "index.html")
    debut = src.index('<input type="checkbox" id="menu"')
    fin = src.index("</nav>", src.index('<nav class="menu-mobile"')) + len("</nav>")
    bloc = src[debut:fin]
    bloc = bloc.replace('class="logo notranslate" href="#"', 'class="logo notranslate" href="/"')
    bloc = re.sub(r'href="#(programme|origines|contact)"', r'href="/#\1"', bloc)
    bloc = bloc.replace(' aria-current="page"', "")
    return bloc


def tete_html(slug, titre, desc):
    src = lire(RACINE / "index.html")
    icones = "\n".join(l for l in src.splitlines()
                       if re.search(r'<link rel="(icon|apple-touch-icon|mask-icon|manifest)"|name="theme-color"', l))
    url = f"{SITE}/{slug}/"
    t = html.escape(f"{titre} — BELARDI Golf House")
    d = html.escape(desc)
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t}</title>
<meta name="description" content="{d}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="BELARDI Golf House">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/og-image.png">

{icones}

{POLICES}
<link rel="stylesheet" href="/assets/css/belardi.css">
{STYLE_LEGAL}
</head>"""


def sommaire(corps):
    items = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', corps)
    lis = "\n".join(f'      <li><a href="#{i}">{re.sub("<[^>]+>", "", t)}</a></li>' for i, t in items)
    return f"""<details class="sommaire" open>
    <summary data-i18n="legal.sommaire">Sommaire</summary>
    <ol>
{lis}
    </ol>
  </details>"""


def pied(slug_courant=None):
    f = lire(OUTILS / "footer.html").strip()
    if slug_courant:
        f = f.replace(f'href="/{slug_courant}/" data-i18n', f'href="/{slug_courant}/" aria-current="page" data-i18n')
    return f


def page_legale(slug, titre, surtitre, desc, maj, avec_sommaire):
    corps = lire(OUTILS / "pages" / f"{slug}.html").strip()
    aside = "\n".join(
        f'        <li><a href="/{s}/"{" aria-current=\"page\"" if s == slug else ""} data-i18n="{k}">{lib}</a></li>'
        for s, k, lib in DOCS)
    som = sommaire(corps) if avec_sommaire else ""
    return f"""{tete_html(slug, titre, desc)}
<body>

{entete_sous_page()}

<main class="doc-legal">
  <div class="wrap doc-grille">
    <aside class="doc-aside" aria-labelledby="aside-titre">
      <p class="doc-aside-titre" id="aside-titre" data-i18n="legal.docs">Informations légales</p>
      <ul>
{aside}
      </ul>
    </aside>

    <article class="doc">
      <p class="surtitre">{surtitre}</p>
      <h1>{titre}</h1>
      <p class="maj"><span>Dernière mise à jour : {maj}</span><button type="button" class="imprimer" onclick="window.print()" data-i18n="legal.imprimer">Imprimer</button></p>
      <p class="legal-avis" data-i18n="legal.avis"></p>
      {som}

{corps}
    </article>
  </div>
</main>

{pied(slug)}

<script>
  window.BELARDI_PAGE = "{slug}";
  if (window.matchMedia("(max-width: 900px)").matches) document.querySelectorAll(".sommaire").forEach(function(d){{ d.open = false; }});
</script>
<script src="/assets/js/i18n.js" defer></script>
</body>
</html>
"""


def synchroniser(page):
    """Pied de page, polices locales et Leaflet local sur une page existante."""
    src = lire(page)
    slug = page.parent.name if page.parent != RACINE else None
    src = re.sub(r"<footer[\s\S]*?</footer>", lambda m: pied(slug), src, count=1)
    src = re.sub(r'<link rel="preconnect" href="https://fonts\.googleapis\.com">\s*'
                 r'<link rel="preconnect" href="https://fonts\.gstatic\.com" crossorigin>\s*'
                 r'<link href="https://fonts\.googleapis\.com/css2[^"]*" rel="stylesheet">',
                 POLICES, src)
    src = src.replace("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "/assets/vendor/leaflet/leaflet.css")
    src = src.replace("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "/assets/vendor/leaflet/leaflet.js")
    page.write_text(src, encoding="utf-8")


def sitemap():
    p = RACINE / "sitemap.xml"
    s = lire(p)
    ajouts = ""
    for slug, *_ in PAGES:
        loc = f"{SITE}/{slug}/"
        if loc not in s:
            ajouts += f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>2026-10-29</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.3</priority>\n  </url>\n"
    if ajouts:
        s = s.replace("</urlset>", ajouts + "</urlset>")
        p.write_text(s, encoding="utf-8")


if __name__ == "__main__":
    for slug, *meta in PAGES:
        d = RACINE / slug
        d.mkdir(exist_ok=True)
        (d / "index.html").write_text(page_legale(slug, *meta), encoding="utf-8")
    legales = {s for s, *_ in PAGES}
    for page in [RACINE / "index.html", *RACINE.glob("*/index.html")]:
        if page.parent.name not in legales:
            synchroniser(page)
    sitemap()
    print("Pages légales générées :", ", ".join(sorted(legales)))
