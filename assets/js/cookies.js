/* BELARDI Golf House — bandeau de consentement cookies
   Fonctionnement :
   - "nécessaires" : toujours actifs (reCAPTCHA du formulaire de contact,
     sécurité). Rien à consentir pour ceux-ci.
   - "mesure" : catégorie prête pour un futur outil d'audience (Analytics,
     etc.). Tant que l'utilisateur n'a pas accepté cette catégorie, tout
     script qu'on voudra ajouter plus tard doit être déclaré en
     <script type="text/plain" data-cookiecat="mesure" data-src="...">
     dans le HTML : ce fichier se charge alors de l'activer (ou pas) selon
     le choix enregistré, sans jamais le lancer avant consentement.
   Le choix est mémorisé dans localStorage (clé "belardi-cookies") et
   redemandé si l'utilisateur ne s'est encore jamais prononcé. */
(function(){
  var CLE = 'belardi-cookies';

  function lire(){
    try{
      var v = JSON.parse(localStorage.getItem(CLE));
      if(v && typeof v === 'object' && typeof v.mesure === 'boolean') return v;
    }catch(e){}
    return null;
  }

  function ecrire(choix){
    try{ localStorage.setItem(CLE, JSON.stringify(choix)); }catch(e){}
  }

  function activerScriptsConsentis(choix){
    document.querySelectorAll('script[data-cookiecat]').forEach(function(tpl){
      var cat = tpl.getAttribute('data-cookiecat');
      if(cat === 'necessaires' || choix[cat]){
        var s = document.createElement('script');
        if(tpl.src || tpl.getAttribute('data-src')) s.src = tpl.getAttribute('data-src') || tpl.src;
        else s.textContent = tpl.textContent;
        document.head.appendChild(s);
      }
    });
  }

  function texte(cle){
    var dict = window.BELARDI_DICT;
    return (dict && dict[cle] !== undefined) ? dict[cle] : null;
  }

  function traduireRacine(racine){
    var dict = window.BELARDI_DICT;
    if(!dict) return;
    racine.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if(dict[key] !== undefined) el.textContent = dict[key];
    });
    racine.querySelectorAll('[data-i18n-aria]').forEach(function(el){
      var key = el.getAttribute('data-i18n-aria');
      if(dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
    });
  }

  function construireBandeau(){
    var racine = document.createElement('div');
    racine.className = 'cookies-bandeau';
    racine.setAttribute('role', 'dialog');
    racine.setAttribute('aria-modal', 'false');
    racine.setAttribute('aria-label', texte('cookies.titre') || 'Les cookies');

    racine.innerHTML =
      '<div class="cookies-carte cookies-vue-simple">' +
        '<h2 data-i18n="cookies.titre">Les cookies</h2>' +
        '<p data-i18n="cookies.texte">Nous utilisons des cookies pour assurer le bon fonctionnement du site (comme le reCAPTCHA de notre formulaire de contact) et, avec votre accord, pour mesurer notre audience. Vous pouvez accepter, refuser ou personnaliser votre choix à tout moment.</p>' +
        '<div class="cookies-actions">' +
          '<button type="button" class="cookies-btn cookies-btn--ligne" data-action="refuser" data-i18n="cookies.btn.refuser">Tout refuser</button>' +
          '<button type="button" class="cookies-btn cookies-btn--ligne" data-action="parametres" data-i18n="cookies.btn.parametres">Paramètres</button>' +
          '<button type="button" class="cookies-btn cookies-btn--plein" data-action="accepter" data-i18n="cookies.btn.accepter">Tout accepter</button>' +
        '</div>' +
      '</div>' +
      '<div class="cookies-carte cookies-vue-param" hidden>' +
        '<h2 data-i18n="cookies.param.titre">Paramètres des cookies</h2>' +
        '<div class="cookies-ligne-param">' +
          '<div class="cookies-param-texte">' +
            '<strong data-i18n="cookies.param.necessaires.titre">Cookies nécessaires</strong>' +
            '<span data-i18n="cookies.param.necessaires.texte">Indispensables au fonctionnement du site (formulaire de contact, sécurité). Toujours actifs.</span>' +
          '</div>' +
          '<span class="cookies-toggle cookies-toggle--fige" aria-hidden="true"><span></span></span>' +
        '</div>' +
        '<div class="cookies-ligne-param">' +
          '<div class="cookies-param-texte">' +
            '<strong data-i18n="cookies.param.mesure.titre">Mesure d’audience</strong>' +
            '<span data-i18n="cookies.param.mesure.texte">Nous aide à comprendre comment le site est utilisé, de façon anonyme, pour l’améliorer.</span>' +
          '</div>' +
          '<button type="button" class="cookies-toggle" data-toggle="mesure" role="switch" aria-checked="false"><span></span></button>' +
        '</div>' +
        '<div class="cookies-actions">' +
          '<button type="button" class="cookies-btn cookies-btn--ligne" data-action="retour" data-i18n="cookies.param.retour">Retour</button>' +
          '<button type="button" class="cookies-btn cookies-btn--plein" data-action="enregistrer" data-i18n="cookies.param.enregistrer">Enregistrer mes choix</button>' +
        '</div>' +
      '</div>';

    return racine;
  }

  function construireBouton(){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cookies-gerer';
    b.setAttribute('aria-label', texte('cookies.gerer.aria') || 'Gérer mes cookies');
    b.setAttribute('data-i18n-aria', 'cookies.gerer.aria');
    // Symbole BELARDI sur pastille sauge (géométrie du favicon, centré sur sa masse visuelle)
    b.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" fill="#8A9A7B"/><g transform="translate(51.9 50) scale(.92) translate(-45.5 -50)"><rect x="30" y="20" width="12" height="60" fill="#E6DCC8" stroke="#8A9A7B" stroke-width="3"/><path d="M42 20 A15 15 0 0 1 42 50 Z" fill="#A0573A" stroke="#8A9A7B" stroke-width="3"/><circle cx="46" cy="65" r="15" fill="#FAF8F2" stroke="#8A9A7B" stroke-width="3"/></g></svg>';
    return b;
  }

  function init(){
    var bandeau = construireBandeau();
    var boutonGerer = construireBouton();
    document.body.appendChild(bandeau);
    document.body.appendChild(boutonGerer);
    traduireRacine(bandeau);
    traduireRacine(boutonGerer);
    document.addEventListener('belardi:langchange', function(){
      traduireRacine(bandeau);
      traduireRacine(boutonGerer);
    });

    var vueSimple = bandeau.querySelector('.cookies-vue-simple');
    var vueParam = bandeau.querySelector('.cookies-vue-param');
    var toggleMesure = bandeau.querySelector('[data-toggle="mesure"]');

    function ouvrir(onParam){
      bandeau.classList.add('est-visible');
      document.body.classList.add('cookies-ouvert');
      if(onParam) basculerVue(true);
    }
    function fermer(){
      bandeau.classList.remove('est-visible');
      document.body.classList.remove('cookies-ouvert');
    }
    function basculerVue(verParam){
      vueSimple.hidden = verParam;
      vueParam.hidden = !verParam;
    }

    var choixActuel = lire();
    if(choixActuel){
      activerScriptsConsentis(choixActuel);
      toggleMesure.setAttribute('aria-checked', String(!!choixActuel.mesure));
      toggleMesure.classList.toggle('est-actif', !!choixActuel.mesure);
      document.body.classList.add('cookies-choisi');
    } else {
      ouvrir(false);
    }

    toggleMesure.addEventListener('click', function(){
      var actif = toggleMesure.getAttribute('aria-checked') === 'true';
      toggleMesure.setAttribute('aria-checked', String(!actif));
      toggleMesure.classList.toggle('est-actif', !actif);
    });

    bandeau.addEventListener('click', function(ev){
      var action = ev.target.closest('[data-action]');
      if(!action) return;
      var choix;
      switch(action.getAttribute('data-action')){
        case 'accepter':
          choix = {necessaires:true, mesure:true};
          ecrire(choix); activerScriptsConsentis(choix); document.body.classList.add('cookies-choisi'); fermer();
          break;
        case 'refuser':
          choix = {necessaires:true, mesure:false};
          ecrire(choix); activerScriptsConsentis(choix); document.body.classList.add('cookies-choisi'); fermer();
          break;
        case 'parametres':
          basculerVue(true);
          break;
        case 'retour':
          basculerVue(false);
          break;
        case 'enregistrer':
          choix = {necessaires:true, mesure: toggleMesure.getAttribute('aria-checked') === 'true'};
          ecrire(choix); activerScriptsConsentis(choix); document.body.classList.add('cookies-choisi'); fermer();
          break;
      }
    });

    boutonGerer.addEventListener('click', function(){ ouvrir(true); });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
