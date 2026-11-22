/* Script de la section « Les parcours » : hauteur réelle de l'en-tête,
   révélation douce au défilement, filtres de la grille, transition en fondu
   au clic sur une carte ou un lien marqué .fx-link. */
(function(){
  var corps = document.body;
  var entete = document.querySelector('.entete');
  function hauteurEntete(){ if (entete) corps.style.setProperty('--h-entete-reelle', entete.offsetHeight + 'px'); }
  hauteurEntete();
  if ('ResizeObserver' in window && entete) new ResizeObserver(hauteurEntete).observe(entete);

  /* Révélation douce au défilement : un seul observateur pour toute la page */
  var cibles = [].slice.call(document.querySelectorAll('[data-revele]'));
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  /* Filtres de la grille des parcours (page /parcours/ uniquement) */
  var grille = document.getElementById('pc-grille');
  if (grille){
    var cartes = [].slice.call(grille.querySelectorAll('.pc-carte'));
    var boutons = [].slice.call(document.querySelectorAll('.filtre'));
    var vide = document.getElementById('pc-vide');
    function filtrer(cle){
      boutons.forEach(function(b){ b.setAttribute('aria-pressed', String(b.dataset.f === cle)); });
      var visibles = 0;
      cartes.forEach(function(c){
        var ok = cle === 'tous' || (c.dataset.f || '').split(' ').indexOf(cle) !== -1;
        c.hidden = !ok;
        if (ok) visibles++;
      });
      if (vide) vide.hidden = visibles > 0;
    }
    boutons.forEach(function(b){ b.addEventListener('click', function(){ filtrer(b.dataset.f); }); });
  }

  /* Transition en fondu : au clic sur une carte de parcours ou un lien .fx-link,
     la page s'efface doucement avant de rejoindre la suivante. */
  document.documentElement.classList.add('fx-transition');
  document.addEventListener('click', function(e){
    var lien = e.target.closest('a.fx-link, .pc-carte a');
    if (!lien) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var href = lien.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    var cible;
    try { cible = new URL(href, location.href); } catch (err) { return; }
    if (cible.origin !== location.origin) return;
    e.preventDefault();
    document.documentElement.classList.add('fx-leaving');
    setTimeout(function(){ location.href = cible.href; }, 380);
  });
})();
