/* Section « Les parcours » : hauteur réelle de l'en-tête, révélation douce au
   défilement, rail des dix parcours piloté par le défilement (page /parcours/),
   descente « vue du ciel » (pages de détail), transition en fondu entre les pages. */
(function(){
  var racine = document.documentElement;
  var corps = document.body;
  var entete = document.querySelector('.entete');
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function borne(v, a, b){ return Math.max(a, Math.min(b, v)); }
  function hauteurEntete(){ if (entete) corps.style.setProperty('--h-entete-reelle', entete.offsetHeight + 'px'); }
  hauteurEntete();
  if ('ResizeObserver' in window && entete) new ResizeObserver(hauteurEntete).observe(entete);

  /* Révélation douce au défilement : un seul observateur pour toute la page */
  var cibles = [].slice.call(document.querySelectorAll('[data-revele]'));
  function revele(el){ el.classList.add('est-revele'); }
  if (reduit || !('IntersectionObserver' in window)){
    cibles.forEach(revele);
  } else {
    var io = new IntersectionObserver(function(entrees){
      entrees.forEach(function(e){ if (e.isIntersecting){ io.unobserve(e.target); revele(e.target); } });
    }, {threshold: 0.12, rootMargin: '0px 0px -8% 0px'});
    cibles.forEach(function(el){ io.observe(el); });
  }
  clearTimeout(window.__secoursRevele);

  /* Un seul passage par image affichée pour tout ce qui dépend du défilement */
  var abonnes = [];
  var attente = false;
  function surDefilement(){
    if (attente) return;
    attente = true;
    window.requestAnimationFrame(function(){ attente = false; abonnes.forEach(function(f){ f(); }); });
  }
  window.addEventListener('scroll', surDefilement, {passive: true});
  window.addEventListener('resize', function(){ hauteurEntete(); surDefilement(); });

  /* ---------------- Rail des dix parcours (page /parcours/) ----------------
     Sur ordinateur, la section se fige et la piste glisse vers la gauche pendant
     qu'on descend ; chaque carte se pose en entrant. Ailleurs : une grille. */
  var rail = document.querySelector('.pv-rail');
  if (rail){
    var scene = rail.querySelector('.pv-rail-scene');
    var piste = rail.querySelector('.pv-piste');
    var cartes = [].slice.call(piste.querySelectorAll('.pv-carte'));
    var compteur = rail.querySelector('[data-compteur]');
    var compteurNom = rail.querySelector('[data-compteur-nom]');
    var barre = rail.querySelector('.pv-rail-barre');
    var large = window.matchMedia('(min-width: 900px) and (min-height: 620px)');
    var debord = 0;
    function piloter(){
      var actif = large.matches && !reduit;
      rail.classList.toggle('est-pilote', actif);
      if (!actif){
        rail.style.height = '';
        piste.style.transform = '';
        cartes.forEach(function(c){ c.classList.add('est-arrivee'); });
        return;
      }
      piste.style.transform = '';
      debord = Math.max(0, piste.scrollWidth - window.innerWidth);
      rail.style.height = (scene.offsetHeight + debord) + 'px';
      majRail();
    }
    function majRail(){
      if (!rail.classList.contains('est-pilote')) return;
      var hEntete = entete ? entete.offsetHeight : 0;
      var p = debord ? borne((hEntete - rail.getBoundingClientRect().top) / debord, 0, 1) : 0;
      piste.style.transform = 'translate3d(' + (-p * debord).toFixed(1) + 'px,0,0)';
      if (barre) barre.style.setProperty('--avance', p.toFixed(4));
      var milieu = window.innerWidth / 2, proche = 0, ecart = Infinity;
      cartes.forEach(function(c, i){
        var r = c.getBoundingClientRect();
        if (r.left < window.innerWidth * 0.92) c.classList.add('est-arrivee');
        var d = Math.abs(r.left + r.width / 2 - milieu);
        if (d < ecart){ ecart = d; proche = i; }
      });
      if (compteur) compteur.textContent = String(proche + 1).padStart(2, '0');
      if (compteurNom){
        var nom = cartes[proche].querySelector('.pv-carte-nom');
        if (nom) compteurNom.textContent = nom.textContent;
      }
    }
    /* Au clavier : la carte qui reçoit le focus est amenée à l'écran */
    piste.addEventListener('focusin', function(e){
      if (!rail.classList.contains('est-pilote')) return;
      var carte = e.target.closest('.pv-carte');
      if (!carte) return;
      var hEntete = entete ? entete.offsetHeight : 0;
      var cible = borne((carte.offsetLeft - window.innerWidth * 0.3) / (debord || 1), 0, 1);
      var haut = rail.getBoundingClientRect().top + window.scrollY - hEntete;
      window.scrollTo(0, haut + cible * debord);
    });
    abonnes.push(majRail);
    if (large.addEventListener) large.addEventListener('change', piloter);
    window.addEventListener('resize', piloter);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(piloter);
    window.addEventListener('load', piloter);
    piloter();
  }

  /* ---------------- Descente « vue du ciel » (pages de détail) ----------------
     Sept vues IGN, du niveau 12 (toute la côte) au niveau 18 (le parcours de près),
     empilées au centre. Le défilement règle le zoom ; chaque vue plus fine apparaît
     quand elle devient assez grande, la précédente s'efface sous elle. */
  var vol = document.querySelector('.pv-vol');
  if (vol){
    var plan = vol.querySelector('.pv-vol-plan');
    var couches = [].slice.call(vol.querySelectorAll('.pv-vol-couche'));
    var lat = parseFloat(vol.getAttribute('data-lat')) || 43.5;
    var elAlt = vol.querySelector('[data-hud="alt"]');
    var elRegle = vol.querySelector('[data-hud="regle"]');
    var elRegleTxt = vol.querySelector('[data-hud="regle-txt"]');
    var Z0 = couches.length ? parseInt(couches[0].getAttribute('data-z'), 10) : 12;
    var NIV = couches.length - 1;
    var PX_IMAGE = 1100;
    function langue(){ return racine.lang || 'fr'; }
    function nombre(v){
      try { return v.toLocaleString(langue() === 'en' ? 'en-GB' : langue() === 'es' ? 'es-ES' : 'fr-FR'); }
      catch (e){ return String(v); }
    }
    function metres(m){
      if (m >= 1000) return nombre(Math.round(m / (m >= 10000 ? 1000 : 100)) * (m >= 10000 ? 1000 : 100)) + ' m';
      return nombre(Math.round(m / 10) * 10) + ' m';
    }
    function regleRonde(m){
      var p = Math.pow(10, Math.floor(Math.log(m) / Math.LN10)), n = m / p;
      return (n >= 5 ? 5 : n >= 2 ? 2 : 1) * p;
    }
    function texteRegle(m){
      if (m >= 1000) return nombre(m / 1000) + ' km';
      return nombre(m) + ' m';
    }
    /* Mesures affichées : largeur au sol visible, altitude d'une caméra fictive, règle de 120 px */
    function mesures(Z){
      var cote = Math.max(window.innerWidth, window.innerHeight) * 1.3;
      var mParPx = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, Z0) * PX_IMAGE / cote / Z;
      if (elAlt) elAlt.textContent = metres(mParPx * window.innerWidth * 0.9);
      if (elRegle && elRegleTxt){
        var m = regleRonde(mParPx * 120);
        elRegle.style.width = Math.round(m / mParPx) + 'px';
        elRegleTxt.textContent = texteRegle(m);
      }
    }
    var anime = !reduit && couches.length > 1;
    if (!anime){
      /* Mouvement réduit : une seule vue fixe, celle du parcours entier (niveau 16) */
      mesures(Math.pow(2, 16 - Z0) / 1.3);
    } else {
      vol.classList.add('est-anime');
      var majVol = function(){
        var r = vol.getBoundingClientRect();
        var course = vol.offsetHeight - window.innerHeight;
        var p = course > 0 ? borne(-r.top / course, 0, 1) : 0;
        racine.classList.toggle('pv-en-vol', r.top < -8 && r.bottom > window.innerHeight * 0.55);
        var q = borne((p - 0.03) / 0.9, 0, 1);
        var e = q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
        var Z = Math.pow(2, NIV * e);
        couches.forEach(function(c, i){
          var s = Z / Math.pow(2, i);
          var o = i === 0 ? 1 : borne((s - 0.16) / 0.3, 0, 1);
          var couverte = i < couches.length - 1 && Z / Math.pow(2, i + 1) > 2.4;
          c.style.transform = 'scale(' + s.toFixed(4) + ')';
          c.style.opacity = o.toFixed(3);
          c.style.visibility = (o <= 0 || couverte) ? 'hidden' : 'visible';
        });
        var inclinaison = 32 * Math.sin(Math.PI * e);
        var rotation = -16 * (1 - e);
        plan.style.transform = 'rotateX(' + inclinaison.toFixed(2) + 'deg) rotateZ(' + rotation.toFixed(2) + 'deg)';
        vol.style.setProperty('--descente', e.toFixed(4));
        vol.style.setProperty('--brume', Math.sin(Math.PI * e).toFixed(3));
        vol.style.setProperty('--visee', (58 - 30 * e).toFixed(2) + 'vmin');
        mesures(Z);
      };
      abonnes.push(majVol);
      majVol();
      /* Les textes changent de langue : on réécrit les mesures dans la bonne langue */
      new MutationObserver(majVol).observe(racine, {attributes: true, attributeFilter: ['lang']});
    }
  }

  /* ---------------- Transition en fondu entre les pages ---------------- */
  racine.classList.add('fx-transition');
  /* Retour arrière : le navigateur restaure la page telle qu'on l'a quittée,
     encore effacée. On la rend visible à chaque affichage. */
  window.addEventListener('pageshow', function(){
    racine.classList.remove('fx-leaving');
    surDefilement();
  });
  document.addEventListener('click', function(e){
    var lien = e.target.closest('a.fx-link');
    if (!lien) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var href = lien.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    var cible;
    try { cible = new URL(href, location.href); } catch (err) { return; }
    if (cible.origin !== location.origin) return;
    e.preventDefault();
    racine.classList.add('fx-leaving');
    setTimeout(function(){ location.href = cible.href; }, 380);
  });
})();
