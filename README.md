# BELARDI Golf House

Site vitrine de [belardi-golfhouse.fr](https://belardi-golfhouse.fr).

## Comment une modification arrive sur le site

```
modification → pull request → contrôles automatiques → tout est vert ? → fusion → site mis à jour
                                                      → un contrôle rouge ? → bloqué, rien n'est publié
```

Personne ne peut publier directement : chaque changement passe par une *pull request* (PR) et doit réussir
les 5 contrôles ci-dessous. Une PR verte est fusionnée automatiquement, et le site se met à jour en 1 à 2 minutes.

| Contrôle | En clair |
|---|---|
| **Code et contenu** | Le code est bien formé, les liens marchent, chaque texte existe en français, anglais et espagnol, Google comprend chaque page. |
| **Navigateurs** | Le site est ouvert dans Chrome, Firefox, Safari, sur Android et iPhone : rien ne casse, rien ne déborde, l'apparence est identique à la référence au pixel près. |
| **Performance** | Le site reste rapide et stable au chargement. |
| **Sécurité** | Aucun mot de passe publié, aucune dépendance vulnérable. |
| **CodeQL** | Analyse de sécurité du code par GitHub. |

## Si un contrôle est rouge

Ouvrir la PR, onglet **Checks** : le message indique ce qui ne va pas, en français.
Le plus simple : demander à Claude « corrige la PR n°X ».

Cas particulier : si l'apparence du site change **volontairement** (nouvelle couleur, nouveau bloc), le contrôle
*Navigateurs* sera rouge car les captures diffèrent. Après avoir vérifié les images avant/après, lancer
**Actions → Mettre à jour les captures → Run workflow** sur la branche de la PR.

## Organisation

- Le site : `index.html`, les dossiers de pages, `assets/`.
- Les garde-fous : `tests/` (jamais publiés sur le site).
- Les règles pour Claude : `CLAUDE.md`.
