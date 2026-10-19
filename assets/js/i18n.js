/* BELARDI Golf House — sélecteur de langue FR / EN / ES (traduction côté client) */
(function(){
  var FLAGS = {
    fr: '<rect width="24" height="16" fill="#fff"/><rect width="8" height="16" fill="#002654"/><rect x="16" width="8" height="16" fill="#CE1126"/>',
    en: '<rect width="24" height="16" fill="#012169"/><path d="M0 0L24 16M24 0L0 16" stroke="#fff" stroke-width="3"/><path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" stroke-width="1.4"/><path d="M12 0V16M0 8H24" stroke="#fff" stroke-width="5"/><path d="M12 0V16M0 8H24" stroke="#C8102E" stroke-width="2.6"/>',
    es: '<rect width="24" height="16" fill="#AA151B"/><rect y="4" width="24" height="8" fill="#F1BF00"/>'
  };
  var DICT = {
    fr: {
      "meta.title": "BELARDI Golf House — Séjour golf tout compris au Pays Basque",
      "meta.description": "Une semaine de golf tout compris au Pays Basque : coaching, 5 parcours d'exception, hébergement et gastronomie basque. Petits groupes de 6 golfeurs maximum.",
      "pc.meta.title": "Les parcours — BELARDI Golf House",
      "pc.meta.description": "Les dix golfs joués depuis la BELARDI Golf House : Chiberta, Le Phare, Chantaco, la Nivelle, Arcangues, Ilbarritz, Makila, Epherra, Hossegor et Seignosse. Carte, caractère et fiche technique de chaque parcours.",

      "nav.accueil": "Accueil",
      "nav.origines": "Les origines",
      "nav.sejour": "Le séjour",
      "nav.programme": "Programme",
      "nav.parcours": "Parcours",
      "nav.tarifs": "Tarifs",
      "nav.faq": "FAQ",
      "nav.apropos": "À propos",
      "nav.contact": "Contact",
      "nav.reserver": "Réserver",
      "logo.aria": "BELARDI Golf House — accueil",
      "burger.aria": "Ouvrir le menu",
      "menu.aria": "Afficher le menu",

      "hero.eyebrow": "Séjours golf · 7 jours · Pays Basque",
      "hero.h1": "Une semaine pour jouer mieux, entre océan et montagnes.",
      "hero.lead": "Coaching personnalisé, cinq parcours d'exception de la Côte Basque, une maison de caractère et la table basque. Vous n'apportez que vos clubs.",
      "hero.cta1": "Demander les prochaines dates",
      "hero.cta2": "Voir le programme",
      "hero.stat1.n": "7 j / 6 n", "hero.stat1.l": "Séjour tout compris",
      "hero.stat2.n": "5", "hero.stat2.l": "Parcours joués",
      "hero.stat3.n": "20 h", "hero.stat3.l": "De coaching",
      "hero.stat4.n": "6 max", "hero.stat4.l": "Golfeurs par groupe",

      "origines.eyebrow": "Aux origines de Belardi",
      "origines.h2": "Une idée née sur les greens du Pays Basque.",
      "origines.p1": "Tout a commencé par des parties jouées l'une après l'autre, sur les plus beaux parcours de la région : les links balayés par le vent de Chiberta, les greens posés sur la falaise d'Ilbarritz, les fairways centenaires du Phare de Biarritz, les collines basques d'Arcangues face aux Pyrénées. En un même week-end, on passe d'un links en bord d'océan à un parcours vallonné dans l'arrière-pays — un éventail de jeu qu'on ne retrouve nulle part ailleurs en France, sur un territoire grand comme un mouchoir de poche.",
      "origines.p2": "De ces parcours est née une évidence : pourquoi ne pas transformer cette richesse en une semaine à part entière ? Une semaine où l'on ne choisit pas un seul golf, mais où l'on en découvre un nouveau chaque jour, encadré par un professionnel, en partageant repas et soirées avec quelques golfeurs passionnés — dans une même maison, comme entre amis.",
      "origines.accent": "« Belardi » signifie prairie en basque : le terrain de jeu qui a tout déclenché.",
      "origines.img.alt": "Illustration d'un golfeur en plein élan sur un parcours du Pays Basque, collines et Pyrénées en arrière-plan",

      "concept.eyebrow": "Le séjour",
      "concept.h2": "Le golf comme on le vit en surf camp.",
      "concept.p1": "Belardi signifie « prairie » en basque. C'est le nom de notre maison : un lieu où l'on vit au rythme du jeu, entre entraînement le matin, parcours l'après-midi et longues tablées le soir.",
      "concept.p2": "Nous accueillons de petits groupes de golfeurs amateurs passionnés qui veulent franchir un cap, sans la pression de la compétition. Chacun repart avec un swing travaillé, un plan de progression et quelques souvenirs de parcours inoubliables.",
      "concept.p3": "Tout est organisé : transferts, green fees, coaching, hébergement, repas.",
      "concept.accent": "« Vous jouez, on s'occupe du reste. »",
      "concept.img.alt": "Illustration de la maison Belardi et de son green face à l'océan",

      "piliers.eyebrow": "Ce qui nous distingue",
      "piliers.h2": "Trois piliers, une semaine.",
      "piliers.1.h3": "Progresser vraiment",
      "piliers.1.p": "Bilan vidéo le premier jour, objectifs personnels, séances techniques chaque matin et parcours coachés. Un compte rendu écrit vous est remis en fin de séjour.",
      "piliers.2.h3": "Découvrir la Côte Basque",
      "piliers.2.p": "Des links face à l'océan aux parcours vallonnés de l'arrière-pays : cinq golfs aux caractères très différents, à moins de 30 minutes de la maison.",
      "piliers.3.h3": "Partager",
      "piliers.3.p": "Six golfeurs maximum, des dîners en commun, des cidreries et des tables locales. On arrive seul ou entre amis, on repart avec des partenaires de jeu.",

      "programme.eyebrow": "Programme type",
      "programme.h2": "Votre semaine, jour par jour.",
      "programme.lead": "Programme indicatif, adapté à la météo et au niveau du groupe.",
      "jour.label": "Jour",
      "j1.lieu": "Arrivée · Belardi", "j1.h3": "Bienvenue au Pays Basque",
      "j1.p": "Accueil à l'aéroport de Biarritz ou à la gare. Installation, apéritif de bienvenue, présentation de la semaine et dîner basque à la maison.",
      "j2.lieu": "Golf de Chiberta · Anglet", "j2.h3": "Bilan et premier parcours",
      "j2.p": "Analyse vidéo du swing et définition de vos objectifs. Déjeuner au club-house, puis parcours coaché entre pinède et dunes.",
      "j3.lieu": "Golf d'Ilbarritz · Bidart", "j3.h3": "Petit jeu face à l'océan",
      "j3.p": "Matinée consacrée au chipping et au putting sur l'un des plus beaux centres d'entraînement d'Europe. Après-midi sur le parcours, dîner en cidrerie.",
      "j4.lieu": "Libre · Côte Basque", "j4.h3": "Journée découverte",
      "j4.p": "Au choix : initiation au surf, randonnée à la Rhune, visite de Saint-Jean-de-Luz ou de San Sebastián. Séance putting facultative en fin de journée.",
      "j5.lieu": "Golf de Chantaco · Saint-Jean-de-Luz", "j5.h3": "Stratégie de parcours",
      "j5.p": "Gestion de parcours et choix de clubs sur un tracé exigeant au pied des montagnes. Dîner dans une table du port.",
      "j6.lieu": "Golf d'Arcangues", "j6.h3": "Le parcours final",
      "j6.p": "Parcours 18 trous en conditions réelles, puis bilan individuel et plan de progression personnalisé. Dîner de clôture.",
      "j7.lieu": "Départ", "j7.h3": "À bientôt",
      "j7.p": "Petit-déjeuner, dernière balade sur la plage ou neuf trous pour les plus motivés, puis transfert retour.",

      "golfs.eyebrow": "Les parcours",
      "golfs.h2": "Dix golfs à moins d'une heure.",
      "golfs.lead": "Cinq d'entre eux sont joués pendant la semaine, choisis selon le niveau du groupe et la météo.",
      "golf.chiberta.d": "Anglet · links et pinède",
      "golf.ilbarritz.d": "Bidart · vue océan",
      "golf.chantaco.d": "Saint-Jean-de-Luz · historique",
      "golf.arcangues.d": "Vallonné · vue Pyrénées",
      "golf.phare.d": "Biarritz · centenaire",
      "golfs.cta": "Découvrir les dix parcours",

      "tarifs.eyebrow": "Tarifs 2027",
      "tarifs.h2": "Tout compris, sans surprise.",
      "offre1.h3": "Essentiel",
      "offre1.saison": "Basse saison (oct. – mars) · 2 890 € en haute saison",
      "offre1.li1": "6 nuits en chambre partagée",
      "offre1.li2": "Petits-déjeuners et 4 dîners",
      "offre1.li3": "4 green fees",
      "offre1.li4": "16 h de coaching en groupe",
      "offre1.li5": "Transferts aéroport et golfs",
      "offre.cta": "Je suis intéressé",
      "offre2.badge": "Le plus choisi",
      "offre2.h3": "Signature",
      "offre2.saison": "Basse saison (oct. – mars) · 3 790 € en haute saison",
      "offre2.li1": "6 nuits en chambre individuelle",
      "offre2.li2": "Pension complète, vins inclus",
      "offre2.li3": "5 green fees",
      "offre2.li4": "20 h de coaching dont 2 h en individuel",
      "offre2.li5": "Analyse vidéo et plan de progression écrit",
      "offre2.li6": "Journée découverte encadrée",
      "offre2.li7": "Transferts aéroport et golfs",
      "tarifs.note": "Accompagnant non golfeur possible sur demande. Groupes constitués et séminaires : devis sur mesure.",

      "faq.eyebrow": "Questions fréquentes",
      "faq.h2": "Avant de venir.",
      "faq1.q": "Quel niveau faut-il avoir ?",
      "faq1.r": "Le séjour s'adresse aux golfeurs déjà autonomes sur un parcours, idéalement avec un index entre 10 et 36. Les groupes sont constitués par niveau pour que chacun progresse à son rythme.",
      "faq2.q": "Puis-je venir seul ?",
      "faq2.r": "Oui, la majorité de nos participants viennent seuls ou à deux. Les groupes de six maximum et les repas partagés rendent l'intégration naturelle.",
      "faq3.q": "Faut-il apporter son matériel ?",
      "faq3.r": "Nous recommandons vos propres clubs. Une location est possible sur demande si vous voyagez léger.",
      "faq4.q": "Qu'est-ce qui n'est pas inclus ?",
      "faq4.r": "Le transport jusqu'au Pays Basque, les boissons hors repas, les activités optionnelles payantes de la journée découverte et l'assurance annulation.",
      "faq5.q": "Quelles sont les conditions d'annulation ?",
      "faq5.r": "Remboursement intégral jusqu'à 60 jours avant le départ. Entre 60 et 30 jours, avoir valable 12 mois. Moins de 30 jours, la place peut être cédée à une autre personne.",

      "contact.eyebrow": "Prochaines sessions",
      "contact.h2": "Rejoignez la liste des premiers golfeurs.",
      "contact.p": "Les premières sessions ouvriront au printemps 2027 avec un nombre de places très limité. Laissez-nous vos coordonnées : vous serez prévenu en priorité et bénéficierez d'un tarif de lancement.",
      "contact.accent": "« Le green au réveil, la maison le soir. »",
      "form.prenom": "Prénom", "form.nom": "Nom", "form.email": "E-mail",
      "form.index": "Index approximatif",
      "form.index.o1": "Moins de 10", "form.index.o2": "10 à 20", "form.index.o3": "20 à 36", "form.index.o4": "Plus de 36",
      "form.formule": "Formule envisagée",
      "form.formule.o1": "Essentiel", "form.formule.o2": "Signature", "form.formule.o3": "Je ne sais pas encore",
      "form.periode": "Période souhaitée",
      "form.periode.ph": "Ex. : mai 2027, automne…",
      "form.message": "Message",
      "form.message.ph": "Vos attentes, vos questions…",
      "form.rgpd": "J'accepte que mes données soient utilisées uniquement pour être recontacté au sujet des séjours BELARDI Golf House.",
      "form.submit": "Je m'inscris sur la liste",

      "footer.baseline": "Séjours golf tout compris au Pays Basque",
      "footer.mentions": "Mentions légales",
      "footer.confidentialite": "Confidentialité",

      "pc.intro.eyebrow": "Les parcours",
      "pc.intro.h1": "Dix golfs entre les Landes et la frontière.",
      "pc.intro.lead": "De l'un des plus anciens parcours d'Europe continentale aux links dessinés dans les dunes, en passant par les tracés vallonnés face aux Pyrénées : la Côte Basque concentre en une heure de route une variété de jeu qu'on trouve rarement ailleurs. Cinq de ces parcours sont joués pendant votre semaine, choisis selon le niveau du groupe et la météo.",
      "pc.reperes1.l": "Parcours accessibles", "pc.reperes2.l": "Joués dans la semaine",
      "pc.reperes3.l": "Le plus ancien", "pc.reperes4.l": "De route au plus loin",
      "pc.filtres.lbl": "Filtrer",
      "pc.filtre.tous": "Tous", "pc.filtre.ocean": "Face à l'océan", "pc.filtre.foret": "Dans les pins",
      "pc.filtre.collines": "Collines basques", "pc.filtre.histoire": "Parcours historiques",
      "pc.carte.note": "Cliquez un repère pour ouvrir la fiche du parcours. Emplacements indicatifs.",
      "pc.vide": "Aucun parcours ne correspond à ce filtre.",
      "pc.rappel.eyebrow": "Votre semaine", "pc.rappel.h2": "Cinq parcours, choisis pour vous.",
      "pc.rappel.p": "Nous composons le programme de la semaine en fonction du niveau du groupe, de la météo et des disponibilités des clubs. Les green fees de ces cinq parcours sont compris dans le séjour.",
      "pc.rappel.cta": "Demander les prochaines dates",
      "pc.sources": "Données des parcours (trous, par, longueur, architecte, année) relevées auprès des fiches publiques des clubs et des annuaires Golfstars, 1golf.eu et Where2Golf. Les longueurs varient selon les départs : elles sont données ici depuis les repères arrière. Fond de carte © contributeurs OpenStreetMap.",
      "pc.menu.origines": "Retour à l'accueil",
      "pc.footer.faq": "Questions fréquentes"
    },

    en: {
      "meta.title": "BELARDI Golf House — All-inclusive golf stays in the Basque Country",
      "meta.description": "An all-inclusive week of golf in the Basque Country: coaching, 5 outstanding courses, accommodation and Basque cuisine. Small groups of 6 golfers maximum.",
      "pc.meta.title": "The courses — BELARDI Golf House",
      "pc.meta.description": "The ten golf courses played from BELARDI Golf House: Chiberta, Le Phare, Chantaco, La Nivelle, Arcangues, Ilbarritz, Makila, Epherra, Hossegor and Seignosse. Map, character and fact sheet for each course.",

      "nav.accueil": "Home",
      "nav.origines": "Our story",
      "nav.sejour": "The stay",
      "nav.programme": "Itinerary",
      "nav.parcours": "The courses",
      "nav.tarifs": "Rates",
      "nav.faq": "FAQ",
      "nav.apropos": "About",
      "nav.contact": "Contact",
      "nav.reserver": "Book now",
      "logo.aria": "BELARDI Golf House — home",
      "burger.aria": "Open menu",
      "menu.aria": "Show menu",

      "hero.eyebrow": "Golf stays · 7 days · Basque Country",
      "hero.h1": "A week to play better, between ocean and mountains.",
      "hero.lead": "Personalised coaching, five outstanding courses on the Basque Coast, a characterful house and Basque cuisine. All you bring are your clubs.",
      "hero.cta1": "Ask about upcoming dates",
      "hero.cta2": "See the itinerary",
      "hero.stat1.n": "7 d / 6 n", "hero.stat1.l": "All-inclusive stay",
      "hero.stat2.n": "5", "hero.stat2.l": "Courses played",
      "hero.stat3.n": "20 h", "hero.stat3.l": "Of coaching",
      "hero.stat4.n": "6 max", "hero.stat4.l": "Golfers per group",

      "origines.eyebrow": "The origins of Belardi",
      "origines.h2": "An idea born on the greens of the Basque Country.",
      "origines.p1": "It all began with round after round on the region's finest courses: the wind-swept links of Chiberta, the clifftop greens of Ilbarritz, the century-old fairways of Le Phare in Biarritz, the Basque hills of Arcangues facing the Pyrenees. In a single weekend you can go from an oceanfront links to a hilly inland course — a range of golf you won't find anywhere else in France, packed into an area no bigger than a pocket handkerchief.",
      "origines.p2": "From these courses came an obvious idea: why not turn this richness into a week of its own? A week where you don't pick a single club, but discover a new one every day, guided by a professional, sharing meals and evenings with a handful of passionate golfers — under one roof, like old friends.",
      "origines.accent": "“Belardi” means meadow in Basque: the playing field that started it all.",
      "origines.img.alt": "Illustration of a golfer at address on a course in the Basque Country, hills and the Pyrenees in the background",

      "concept.eyebrow": "The stay",
      "concept.h2": "Golf the way you'd live a surf camp.",
      "concept.p1": "Belardi means “meadow” in Basque. It's the name of our house: a place that lives to the rhythm of the game, between morning training, afternoon rounds and long dinners at night.",
      "concept.p2": "We welcome small groups of keen amateur golfers who want to break through a plateau, without the pressure of competition. Everyone leaves with a refined swing, a progression plan and a few unforgettable rounds.",
      "concept.p3": "Everything is arranged: transfers, green fees, coaching, accommodation, meals.",
      "concept.accent": "“You play, we take care of the rest.”",
      "concept.img.alt": "Illustration of the Belardi house and its green facing the ocean",

      "piliers.eyebrow": "What sets us apart",
      "piliers.h2": "Three pillars, one week.",
      "piliers.1.h3": "Real progress",
      "piliers.1.p": "Video assessment on day one, personal goals, technical sessions every morning and coached rounds. A written report is handed to you at the end of the stay.",
      "piliers.2.h3": "Discover the Basque Coast",
      "piliers.2.p": "From oceanfront links to hilly inland courses: five very different golfs, all less than 30 minutes from the house.",
      "piliers.3.h3": "Share",
      "piliers.3.p": "Six golfers maximum, shared dinners, cider houses and local tables. You arrive alone or with friends, you leave with playing partners.",

      "programme.eyebrow": "Sample itinerary",
      "programme.h2": "Your week, day by day.",
      "programme.lead": "Indicative itinerary, adapted to the weather and the group's level.",
      "jour.label": "Day",
      "j1.lieu": "Arrival · Belardi", "j1.h3": "Welcome to the Basque Country",
      "j1.p": "Pick-up from Biarritz airport or the train station. Check-in, welcome drinks, presentation of the week and a Basque dinner at the house.",
      "j2.lieu": "Golf de Chiberta · Anglet", "j2.h3": "Assessment and first round",
      "j2.p": "Video swing analysis and setting your goals. Lunch at the clubhouse, then a coached round between pines and dunes.",
      "j3.lieu": "Golf d'Ilbarritz · Bidart", "j3.h3": "Short game facing the ocean",
      "j3.p": "A morning devoted to chipping and putting at one of Europe's finest practice facilities. Afternoon on the course, dinner at a cider house.",
      "j4.lieu": "Free day · Basque Coast", "j4.h3": "Discovery day",
      "j4.p": "Your choice: a surf lesson, a hike up La Rhune, or a visit to Saint-Jean-de-Luz or San Sebastián. Optional putting session in the evening.",
      "j5.lieu": "Golf de Chantaco · Saint-Jean-de-Luz", "j5.h3": "Course strategy",
      "j5.p": "Course management and club selection on a demanding layout at the foot of the mountains. Dinner at a table by the harbour.",
      "j6.lieu": "Golf d'Arcangues", "j6.h3": "The final round",
      "j6.p": "18 holes under real conditions, followed by an individual review and a personalised progression plan. Closing dinner.",
      "j7.lieu": "Departure", "j7.h3": "See you soon",
      "j7.p": "Breakfast, one last walk on the beach or nine holes for the most motivated, then transfer back.",

      "golfs.eyebrow": "The courses",
      "golfs.h2": "Ten golf courses, all under an hour away.",
      "golfs.lead": "Five of them are played during the week, chosen according to the group's level and the weather.",
      "golf.chiberta.d": "Anglet · links and pines",
      "golf.ilbarritz.d": "Bidart · ocean view",
      "golf.chantaco.d": "Saint-Jean-de-Luz · historic",
      "golf.arcangues.d": "Hilly · Pyrenees views",
      "golf.phare.d": "Biarritz · century-old",
      "golfs.cta": "Discover all ten courses",

      "tarifs.eyebrow": "2027 rates",
      "tarifs.h2": "All-inclusive, no surprises.",
      "offre1.h3": "Essential",
      "offre1.saison": "Low season (Oct.–Mar.) · €2,890 in high season",
      "offre1.li1": "6 nights in a shared room",
      "offre1.li2": "Breakfasts and 4 dinners",
      "offre1.li3": "4 green fees",
      "offre1.li4": "16 h of group coaching",
      "offre1.li5": "Airport and golf course transfers",
      "offre.cta": "I'm interested",
      "offre2.badge": "Most popular",
      "offre2.h3": "Signature",
      "offre2.saison": "Low season (Oct.–Mar.) · €3,790 in high season",
      "offre2.li1": "6 nights in a private room",
      "offre2.li2": "Full board, wine included",
      "offre2.li3": "5 green fees",
      "offre2.li4": "20 h of coaching, including 2 h one-to-one",
      "offre2.li5": "Video analysis and a written progression plan",
      "offre2.li6": "Guided discovery day",
      "offre2.li7": "Airport and golf course transfers",
      "tarifs.note": "A non-golfing companion can be accommodated on request. Private groups and corporate retreats: tailor-made quotes.",

      "faq.eyebrow": "Frequently asked questions",
      "faq.h2": "Before you come.",
      "faq1.q": "What level do I need?",
      "faq1.r": "The stay is designed for golfers who are already comfortable playing a full round, ideally with a handicap between 10 and 36. Groups are formed by level so everyone can progress at their own pace.",
      "faq2.q": "Can I come alone?",
      "faq2.r": "Yes, most of our guests come alone or as a pair. Groups of six maximum and shared meals make it easy to fit right in.",
      "faq3.q": "Do I need to bring my own equipment?",
      "faq3.r": "We recommend bringing your own clubs. Rental is available on request if you're travelling light.",
      "faq4.q": "What isn't included?",
      "faq4.r": "Travel to the Basque Country, drinks outside of meals, optional paid activities on the discovery day, and cancellation insurance.",
      "faq5.q": "What are the cancellation terms?",
      "faq5.r": "Full refund up to 60 days before departure. Between 60 and 30 days, a credit valid for 12 months. Less than 30 days out, your place can be transferred to someone else.",

      "contact.eyebrow": "Upcoming sessions",
      "contact.h2": "Join the list of first golfers.",
      "contact.p": "The first sessions open in spring 2027 with very limited places. Leave us your details: you'll be notified first and get a launch rate.",
      "contact.accent": "“The green at sunrise, the house by night.”",
      "form.prenom": "First name", "form.nom": "Last name", "form.email": "Email",
      "form.index": "Approximate handicap",
      "form.index.o1": "Under 10", "form.index.o2": "10 to 20", "form.index.o3": "20 to 36", "form.index.o4": "Over 36",
      "form.formule": "Preferred package",
      "form.formule.o1": "Essential", "form.formule.o2": "Signature", "form.formule.o3": "Not sure yet",
      "form.periode": "Preferred period",
      "form.periode.ph": "E.g.: May 2027, autumn…",
      "form.message": "Message",
      "form.message.ph": "Your expectations, your questions…",
      "form.rgpd": "I agree that my data will only be used to contact me about BELARDI Golf House stays.",
      "form.submit": "Add me to the list",

      "footer.baseline": "All-inclusive golf stays in the Basque Country",
      "footer.mentions": "Legal notice",
      "footer.confidentialite": "Privacy",

      "pc.intro.eyebrow": "The courses",
      "pc.intro.h1": "Ten golf courses between the Landes and the border.",
      "pc.intro.lead": "From one of continental Europe's oldest courses to links carved into the dunes, by way of hilly layouts facing the Pyrenees: within an hour's drive, the Basque Coast packs in a variety of golf rarely found elsewhere. Five of these courses are played during your week, chosen according to the group's level and the weather.",
      "pc.reperes1.l": "Courses within reach", "pc.reperes2.l": "Played during the week",
      "pc.reperes3.l": "The oldest", "pc.reperes4.l": "Drive to the furthest",
      "pc.filtres.lbl": "Filter",
      "pc.filtre.tous": "All", "pc.filtre.ocean": "Facing the ocean", "pc.filtre.foret": "Among the pines",
      "pc.filtre.collines": "Basque hills", "pc.filtre.histoire": "Historic courses",
      "pc.carte.note": "Click a marker to open the course's profile. Locations are approximate.",
      "pc.vide": "No course matches this filter.",
      "pc.rappel.eyebrow": "Your week", "pc.rappel.h2": "Five courses, chosen for you.",
      "pc.rappel.p": "We build the week's itinerary based on the group's level, the weather and club availability. Green fees for these five courses are included in the stay.",
      "pc.rappel.cta": "Ask about upcoming dates",
      "pc.sources": "Course data (holes, par, length, architect, year) sourced from clubs' public fact sheets and the Golfstars, 1golf.eu and Where2Golf directories. Lengths vary by tee: figures here are given from the back tees. Map data © OpenStreetMap contributors.",
      "pc.menu.origines": "Back to home",
      "pc.footer.faq": "Frequently asked questions"
    },

    es: {
      "meta.title": "BELARDI Golf House — Estancias de golf todo incluido en el País Vasco",
      "meta.description": "Una semana de golf todo incluido en el País Vasco: coaching, 5 recorridos de excepción, alojamiento y gastronomía vasca. Grupos reducidos de 6 golfistas como máximo.",
      "pc.meta.title": "Los recorridos — BELARDI Golf House",
      "pc.meta.description": "Los diez campos de golf que se juegan desde BELARDI Golf House: Chiberta, Le Phare, Chantaco, La Nivelle, Arcangues, Ilbarritz, Makila, Epherra, Hossegor y Seignosse. Mapa, carácter y ficha técnica de cada recorrido.",

      "nav.accueil": "Inicio",
      "nav.origines": "Los orígenes",
      "nav.sejour": "La estancia",
      "nav.programme": "Programa",
      "nav.parcours": "Los recorridos",
      "nav.tarifs": "Tarifas",
      "nav.faq": "FAQ",
      "nav.apropos": "Sobre nosotros",
      "nav.contact": "Contacto",
      "nav.reserver": "Reservar",
      "logo.aria": "BELARDI Golf House — inicio",
      "burger.aria": "Abrir el menú",
      "menu.aria": "Mostrar el menú",

      "hero.eyebrow": "Estancias de golf · 7 días · País Vasco",
      "hero.h1": "Una semana para mejorar tu juego, entre el océano y las montañas.",
      "hero.lead": "Coaching personalizado, cinco recorridos de excepción de la Costa Vasca, una casa con carácter y la gastronomía vasca. Solo traes tus palos.",
      "hero.cta1": "Consultar las próximas fechas",
      "hero.cta2": "Ver el programa",
      "hero.stat1.n": "7 d / 6 n", "hero.stat1.l": "Estancia todo incluido",
      "hero.stat2.n": "5", "hero.stat2.l": "Recorridos jugados",
      "hero.stat3.n": "20 h", "hero.stat3.l": "De coaching",
      "hero.stat4.n": "6 máx.", "hero.stat4.l": "Golfistas por grupo",

      "origines.eyebrow": "Los orígenes de Belardi",
      "origines.h2": "Una idea nacida en los greens del País Vasco.",
      "origines.p1": "Todo empezó jugando una partida tras otra en los recorridos más bellos de la región: los links azotados por el viento de Chiberta, los greens sobre el acantilado de Ilbarritz, los fairways centenarios de Le Phare en Biarritz, las colinas vascas de Arcangues frente a los Pirineos. En un mismo fin de semana se pasa de un links junto al océano a un recorrido ondulado en el interior: una variedad de juego que no se encuentra en ningún otro lugar de Francia, en un territorio del tamaño de un pañuelo.",
      "origines.p2": "De estos recorridos nació una evidencia: ¿por qué no convertir esta riqueza en toda una semana? Una semana en la que no se elige un solo campo, sino que se descubre uno nuevo cada día, acompañados por un profesional, compartiendo comidas y veladas con unos pocos golfistas apasionados, bajo el mismo techo, como entre amigos.",
      "origines.accent": "«Belardi» significa prado en euskera: el terreno de juego que lo desencadenó todo.",
      "origines.img.alt": "Ilustración de un golfista en posición de salida en un recorrido del País Vasco, con colinas y los Pirineos al fondo",

      "concept.eyebrow": "La estancia",
      "concept.h2": "El golf como se vive en un surf camp.",
      "concept.p1": "Belardi significa «prado» en euskera. Es el nombre de nuestra casa: un lugar que vive al ritmo del juego, entre el entrenamiento por la mañana, el recorrido por la tarde y largas cenas por la noche.",
      "concept.p2": "Recibimos a pequeños grupos de golfistas aficionados y apasionados que quieren dar un salto de nivel, sin la presión de la competición. Cada uno se va con un swing trabajado, un plan de progresión y recuerdos inolvidables.",
      "concept.p3": "Todo está organizado: traslados, green fees, coaching, alojamiento, comidas.",
      "concept.accent": "«Tú juegas, nosotros nos ocupamos del resto.»",
      "concept.img.alt": "Ilustración de la casa Belardi y su green frente al océano",

      "piliers.eyebrow": "Lo que nos distingue",
      "piliers.h2": "Tres pilares, una semana.",
      "piliers.1.h3": "Progresar de verdad",
      "piliers.1.p": "Análisis en vídeo el primer día, objetivos personales, sesiones técnicas cada mañana y recorridos con coaching. Al final de la estancia se entrega un informe escrito.",
      "piliers.2.h3": "Descubrir la Costa Vasca",
      "piliers.2.p": "De los links frente al océano a los recorridos ondulados del interior: cinco campos de carácter muy distinto, a menos de 30 minutos de la casa.",
      "piliers.3.h3": "Compartir",
      "piliers.3.p": "Seis golfistas como máximo, cenas en común, sidrerías y mesas locales. Se llega solo o con amigos, se vuelve con compañeros de juego.",

      "programme.eyebrow": "Programa tipo",
      "programme.h2": "Tu semana, día a día.",
      "programme.lead": "Programa orientativo, adaptado al tiempo y al nivel del grupo.",
      "jour.label": "Día",
      "j1.lieu": "Llegada · Belardi", "j1.h3": "Bienvenido al País Vasco",
      "j1.p": "Recogida en el aeropuerto de Biarritz o en la estación. Instalación, aperitivo de bienvenida, presentación de la semana y cena vasca en la casa.",
      "j2.lieu": "Golf de Chiberta · Anglet", "j2.h3": "Evaluación y primer recorrido",
      "j2.p": "Análisis de swing en vídeo y definición de tus objetivos. Almuerzo en la casa club y recorrido con coaching entre el pinar y las dunas.",
      "j3.lieu": "Golf de Ilbarritz · Bidart", "j3.h3": "Juego corto frente al océano",
      "j3.p": "Mañana dedicada al approach y al putt en uno de los mejores centros de entrenamiento de Europa. Por la tarde, recorrido; por la noche, cena en una sidrería.",
      "j4.lieu": "Libre · Costa Vasca", "j4.h3": "Jornada de descubrimiento",
      "j4.p": "A elegir: iniciación al surf, excursión a La Rhune, visita a Saint-Jean-de-Luz o a San Sebastián. Sesión de putt opcional al final del día.",
      "j5.lieu": "Golf de Chantaco · Saint-Jean-de-Luz", "j5.h3": "Estrategia de recorrido",
      "j5.p": "Gestión del recorrido y elección de palos en un trazado exigente al pie de las montañas. Cena en una mesa del puerto.",
      "j6.lieu": "Golf de Arcangues", "j6.h3": "El recorrido final",
      "j6.p": "18 hoyos en condiciones reales, seguidos de un balance individual y un plan de progresión personalizado. Cena de clausura.",
      "j7.lieu": "Salida", "j7.h3": "Hasta pronto",
      "j7.p": "Desayuno, último paseo por la playa o nueve hoyos para los más motivados, y traslado de vuelta.",

      "golfs.eyebrow": "Los recorridos",
      "golfs.h2": "Diez campos a menos de una hora.",
      "golfs.lead": "Cinco de ellos se juegan durante la semana, elegidos según el nivel del grupo y el tiempo.",
      "golf.chiberta.d": "Anglet · links y pinar",
      "golf.ilbarritz.d": "Bidart · vistas al océano",
      "golf.chantaco.d": "Saint-Jean-de-Luz · histórico",
      "golf.arcangues.d": "Ondulado · vistas a los Pirineos",
      "golf.phare.d": "Biarritz · centenario",
      "golfs.cta": "Descubrir los diez recorridos",

      "tarifs.eyebrow": "Tarifas 2027",
      "tarifs.h2": "Todo incluido, sin sorpresas.",
      "offre1.h3": "Esencial",
      "offre1.saison": "Temporada baja (oct.–mar.) · 2.890 € en temporada alta",
      "offre1.li1": "6 noches en habitación compartida",
      "offre1.li2": "Desayunos y 4 cenas",
      "offre1.li3": "4 green fees",
      "offre1.li4": "16 h de coaching en grupo",
      "offre1.li5": "Traslados al aeropuerto y a los campos",
      "offre.cta": "Estoy interesado",
      "offre2.badge": "La más elegida",
      "offre2.h3": "Signature",
      "offre2.saison": "Temporada baja (oct.–mar.) · 3.790 € en temporada alta",
      "offre2.li1": "6 noches en habitación individual",
      "offre2.li2": "Pensión completa, vino incluido",
      "offre2.li3": "5 green fees",
      "offre2.li4": "20 h de coaching, de las cuales 2 h individuales",
      "offre2.li5": "Análisis en vídeo y plan de progresión por escrito",
      "offre2.li6": "Jornada de descubrimiento guiada",
      "offre2.li7": "Traslados al aeropuerto y a los campos",
      "tarifs.note": "Acompañante no golfista posible bajo petición. Grupos cerrados y eventos de empresa: presupuesto a medida.",

      "faq.eyebrow": "Preguntas frecuentes",
      "faq.h2": "Antes de venir.",
      "faq1.q": "¿Qué nivel se necesita?",
      "faq1.r": "La estancia está pensada para golfistas ya autónomos en un recorrido, idealmente con un hándicap entre 10 y 36. Los grupos se forman por nivel para que cada uno progrese a su ritmo.",
      "faq2.q": "¿Puedo venir solo?",
      "faq2.r": "Sí, la mayoría de nuestros participantes vienen solos o en pareja. Los grupos de seis como máximo y las comidas compartidas facilitan la integración.",
      "faq3.q": "¿Hay que traer el propio equipo?",
      "faq3.r": "Recomendamos traer tus propios palos. Es posible alquilarlos bajo petición si viajas ligero de equipaje.",
      "faq4.q": "¿Qué no está incluido?",
      "faq4.r": "El transporte hasta el País Vasco, las bebidas fuera de las comidas, las actividades opcionales de pago de la jornada de descubrimiento y el seguro de cancelación.",
      "faq5.q": "¿Cuáles son las condiciones de cancelación?",
      "faq5.r": "Reembolso íntegro hasta 60 días antes de la salida. Entre 60 y 30 días, bono válido durante 12 meses. Con menos de 30 días, la plaza puede cederse a otra persona.",

      "contact.eyebrow": "Próximas sesiones",
      "contact.h2": "Únete a la lista de los primeros golfistas.",
      "contact.p": "Las primeras sesiones abrirán en primavera de 2027 con un número de plazas muy limitado. Déjanos tus datos: serás avisado con prioridad y tendrás una tarifa de lanzamiento.",
      "contact.accent": "«El green al despertar, la casa al anochecer.»",
      "form.prenom": "Nombre", "form.nom": "Apellidos", "form.email": "Correo electrónico",
      "form.index": "Hándicap aproximado",
      "form.index.o1": "Menos de 10", "form.index.o2": "De 10 a 20", "form.index.o3": "De 20 a 36", "form.index.o4": "Más de 36",
      "form.formule": "Formato previsto",
      "form.formule.o1": "Esencial", "form.formule.o2": "Signature", "form.formule.o3": "Aún no lo sé",
      "form.periode": "Periodo deseado",
      "form.periode.ph": "Ej.: mayo 2027, otoño…",
      "form.message": "Mensaje",
      "form.message.ph": "Tus expectativas, tus preguntas…",
      "form.rgpd": "Acepto que mis datos se utilicen únicamente para que me contacten sobre las estancias de BELARDI Golf House.",
      "form.submit": "Apuntarme a la lista",

      "footer.baseline": "Estancias de golf todo incluido en el País Vasco",
      "footer.mentions": "Aviso legal",
      "footer.confidentialite": "Privacidad",

      "pc.intro.eyebrow": "Los recorridos",
      "pc.intro.h1": "Diez campos de golf entre las Landas y la frontera.",
      "pc.intro.lead": "De uno de los recorridos más antiguos de la Europa continental a links trazados entre dunas, pasando por recorridos ondulados frente a los Pirineos: la Costa Vasca concentra, en una hora de carretera, una variedad de juego poco frecuente en otros lugares. Cinco de estos recorridos se juegan durante tu semana, elegidos según el nivel del grupo y el tiempo.",
      "pc.reperes1.l": "Recorridos accesibles", "pc.reperes2.l": "Jugados durante la semana",
      "pc.reperes3.l": "El más antiguo", "pc.reperes4.l": "De carretera al más lejano",
      "pc.filtres.lbl": "Filtrar",
      "pc.filtre.tous": "Todos", "pc.filtre.ocean": "Frente al océano", "pc.filtre.foret": "Entre pinares",
      "pc.filtre.collines": "Colinas vascas", "pc.filtre.histoire": "Recorridos históricos",
      "pc.carte.note": "Haz clic en un marcador para abrir la ficha del recorrido. Ubicaciones orientativas.",
      "pc.vide": "Ningún recorrido corresponde a este filtro.",
      "pc.rappel.eyebrow": "Tu semana", "pc.rappel.h2": "Cinco recorridos, elegidos para ti.",
      "pc.rappel.p": "Componemos el programa de la semana según el nivel del grupo, el tiempo y la disponibilidad de los clubes. Los green fees de estos cinco recorridos están incluidos en la estancia.",
      "pc.rappel.cta": "Consultar las próximas fechas",
      "pc.sources": "Datos de los recorridos (hoyos, par, longitud, arquitecto, año) obtenidos de las fichas públicas de los clubes y de los directorios Golfstars, 1golf.eu y Where2Golf. Las longitudes varían según las salidas: aquí se indican desde las salidas traseras. Mapa © colaboradores de OpenStreetMap.",
      "pc.menu.origines": "Volver al inicio",
      "pc.footer.faq": "Preguntas frecuentes"
    }
  };

  var LANGS = ["fr", "en", "es"];
  var STORAGE_KEY = "belardi-lang";

  function detectLang(){
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && DICT[saved]) return saved;
    } catch(e){}
    return "fr";
  }

  function applyLang(lang){
    if (!DICT[lang]) lang = "fr";
    var dict = DICT[lang];

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function(el){
      var key = el.getAttribute("data-i18n-aria");
      if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function(el){
      var key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function(el){
      var key = el.getAttribute("data-i18n-alt");
      if (dict[key] !== undefined) el.setAttribute("alt", dict[key]);
    });

    var isParcours = window.BELARDI_PAGE === "parcours";
    var titleKey = isParcours ? "pc.meta.title" : "meta.title";
    var descKey = isParcours ? "pc.meta.description" : "meta.description";
    if (dict[titleKey]) document.title = dict[titleKey];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict[descKey]) metaDesc.setAttribute("content", dict[descKey]);

    document.querySelectorAll(".langues button[data-lang]").forEach(function(btn){
      btn.setAttribute("aria-current", String(btn.dataset.lang === lang));
    });
    document.querySelectorAll(".lang-menu button[data-lang]").forEach(function(btn){
      btn.setAttribute("aria-selected", String(btn.dataset.lang === lang));
    });
    document.querySelectorAll(".lang-current").forEach(function(el){
      el.textContent = lang.toUpperCase();
    });
    document.querySelectorAll(".lang-flag").forEach(function(el){
      el.innerHTML = FLAGS[lang] || FLAGS.fr;
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch(e){}
  }

  function closeAllSwitches(except){
    document.querySelectorAll(".lang-switch[data-open='true']").forEach(function(sw){
      if (sw !== except){
        sw.setAttribute("data-open", "false");
        sw.querySelector(".lang-trigger").setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    var lang = detectLang();
    applyLang(lang);

    document.querySelectorAll(".langues button[data-lang], .lang-menu button[data-lang]").forEach(function(btn){
      btn.addEventListener("click", function(){
        applyLang(btn.dataset.lang);
        closeAllSwitches();
      });
    });

    document.querySelectorAll(".lang-switch").forEach(function(sw){
      var trigger = sw.querySelector(".lang-trigger");
      trigger.addEventListener("click", function(e){
        e.stopPropagation();
        var isOpen = sw.getAttribute("data-open") === "true";
        closeAllSwitches();
        sw.setAttribute("data-open", String(!isOpen));
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    document.addEventListener("click", function(){ closeAllSwitches(); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeAllSwitches(); });

    // Pilule glissante du menu principal : suit le lien survolé
    document.querySelectorAll(".nav-liens").forEach(function(wrapper){
      var pilule = wrapper.querySelector(".nav-pilule");
      if (!pilule) return;
      var links = Array.prototype.slice.call(wrapper.querySelectorAll("a"));

      function moveTo(link, instantane){
        if (instantane){
          pilule.style.transition = "none";
          // force le navigateur à appliquer le style sans transition avant de la réactiver
          // eslint-disable-next-line no-unused-expressions
          pilule.offsetWidth;
        }
        pilule.style.width = link.offsetWidth + "px";
        pilule.style.transform = "translateX(" + link.offsetLeft + "px)";
        if (instantane){
          pilule.offsetWidth;
          pilule.style.transition = "";
        }
      }

      // Position de départ silencieuse sur la page active, sans transition ni survol visible
      var actif = wrapper.querySelector('a[aria-current="page"]');
      if (actif) moveTo(actif, true);

      links.forEach(function(link){
        link.addEventListener("mouseenter", function(){
          var premierSurvol = !wrapper.classList.contains("is-active");
          wrapper.classList.add("is-active");
          // Si la pilule n'était pas déjà visible, on la fait apparaître directement
          // sous le curseur plutôt que de la laisser glisser depuis une ancienne position.
          moveTo(link, premierSurvol);
        });
      });

      wrapper.addEventListener("mouseleave", function(){
        wrapper.classList.remove("is-active");
        var current = wrapper.querySelector('a[aria-current="page"]');
        if (current) moveTo(current);
      });
    });
  });
})();
