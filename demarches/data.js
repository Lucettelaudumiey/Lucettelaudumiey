/* ============================================================
   Mes Démarches Facile — données (démarches, aides, astuces,
   recours pour les demandes non honorées, dates repères)
   Les liens pointent vers les sites officiels. Chaque démarche
   propose aussi une recherche automatique sur service-public.
   ============================================================ */

const SP_RECHERCHE = "https://www.service-public.gouv.fr/particuliers/recherche?keyword=";

const CATEGORIES = [
  {
    id: "identite", icone: "🪪", nom: "Papiers & identité",
    demarches: [
      { t: "Carte d'identité (CNI)", d: "Première demande, renouvellement, perte ou vol. Pré-demande en ligne puis rendez-vous en mairie équipée.", l: [["ANTS", "https://ants.gouv.fr"]], p: "Faites la pré-demande en ligne et prenez rendez-vous tôt : les délais peuvent dépasser 2 mois avant l'été." },
      { t: "Passeport", d: "Demande ou renouvellement. Timbre fiscal à acheter en ligne, rendez-vous en mairie.", l: [["ANTS", "https://ants.gouv.fr"], ["Timbre fiscal", "https://timbres.impots.gouv.fr"]] },
      { t: "Identité numérique (France Identité)", d: "Application officielle pour prouver votre identité en ligne avec la nouvelle carte d'identité.", l: [["France Identité", "https://france-identite.gouv.fr"]] },
      { t: "FranceConnect", d: "Un seul identifiant pour accéder à plus de 1 000 services publics (impôts, Ameli, CAF…).", l: [["FranceConnect", "https://franceconnect.gouv.fr"]] },
      { t: "Acte de naissance, mariage, décès", d: "Demande gratuite de copie ou d'extrait d'acte d'état civil.", l: [["Service-public", SP_RECHERCHE + "acte%20de%20naissance"]], p: "C'est gratuit : méfiez-vous des sites qui font payer cette demande." },
      { t: "Changement de nom ou de prénom", d: "Changement de prénom en mairie ; changement de nom d'usage ou par décret.", l: [["Service-public", SP_RECHERCHE + "changement%20de%20nom"]] },
      { t: "Casier judiciaire (bulletin n°3)", d: "Demande gratuite en ligne, reçu sous quelques jours.", l: [["Casier judiciaire", "https://casier-judiciaire.justice.gouv.fr"]] },
      { t: "Déclarer une perte ou un vol de papiers", d: "Déclaration de perte en ligne lors de la nouvelle demande, ou plainte en cas de vol.", l: [["ANTS", "https://ants.gouv.fr"], ["Pré-plainte en ligne", "https://www.pre-plainte-en-ligne.gouv.fr"]] }
    ]
  },
  {
    id: "famille", icone: "👨‍👩‍👧", nom: "Famille",
    demarches: [
      { t: "Déclarer une naissance", d: "À faire en mairie du lieu de naissance dans les 5 jours.", l: [["Service-public", SP_RECHERCHE + "declaration%20de%20naissance"]] },
      { t: "Se marier / se pacser", d: "Dossier de mariage en mairie ; PACS en mairie ou chez un notaire.", l: [["Service-public", SP_RECHERCHE + "pacs"]] },
      { t: "Divorce / séparation", d: "Divorce par consentement mutuel ou judiciaire, garde des enfants, pension alimentaire.", l: [["Justice.fr", "https://www.justice.fr"]] },
      { t: "Pension alimentaire impayée", d: "L'ARIPA (CAF/MSA) peut verser l'allocation de soutien familial et récupérer les impayés.", l: [["Pension alimentaire", "https://www.pension-alimentaire.caf.fr"]], p: "L'intermédiation financière évite les retards : la CAF collecte et reverse la pension." },
      { t: "Mode de garde (crèche, assistante maternelle)", d: "Trouver une assistante maternelle, déclarer la garde avec Pajemploi, aide CMG.", l: [["Mon enfant", "https://monenfant.fr"], ["Pajemploi", "https://www.pajemploi.urssaf.fr"]] },
      { t: "Inscription à l'école / cantine", d: "Inscription en mairie puis admission à l'école ; tarifs de cantine selon quotient familial.", l: [["Service-public", SP_RECHERCHE + "inscription%20ecole"]] },
      { t: "Adoption", d: "Demande d'agrément auprès du département.", l: [["Service-public", SP_RECHERCHE + "adoption"]] }
    ]
  },
  {
    id: "logement", icone: "🏠", nom: "Logement",
    demarches: [
      { t: "Demande de logement social", d: "Une seule demande en ligne, valable dans tout le département.", l: [["Demande logement social", "https://www.demande-logement-social.gouv.fr"]], p: "Renouvelez la demande chaque année à la date anniversaire, sinon elle est supprimée." },
      { t: "Aide au logement (APL, ALS, ALF)", d: "Demande auprès de la CAF ou de la MSA, simulation possible.", l: [["CAF", "https://www.caf.fr"], ["MSA", "https://www.msa.fr"]] },
      { t: "Déménagement : signaler son changement d'adresse", d: "Un seul formulaire pour prévenir CAF, impôts, Assurance maladie, France Travail, fournisseurs d'énergie…", l: [["Service-public", SP_RECHERCHE + "changement%20d%27adresse"]] },
      { t: "Garantie Visale (caution gratuite)", d: "Caution gratuite d'Action Logement pour les jeunes et les salariés.", l: [["Visale", "https://www.visale.fr"]] },
      { t: "Rénovation énergétique (MaPrimeRénov')", d: "Aides aux travaux d'isolation, chauffage. Accompagnement gratuit par France Rénov'.", l: [["France Rénov'", "https://france-renov.gouv.fr"]] },
      { t: "Litige avec le propriétaire / locataire", d: "Dépôt de garantie non rendu, réparations, charges : commission de conciliation et ADIL gratuites.", l: [["ANIL / ADIL", "https://www.anil.org"]] },
      { t: "Logement indécent ou insalubre", d: "Signalement à la mairie, à la CAF ou à l'ARS.", l: [["Service-public", SP_RECHERCHE + "logement%20indecent"]] },
      { t: "Impayés de loyer / expulsion", d: "Fonds de solidarité logement (FSL), commission de surendettement, ADIL.", l: [["ANIL / ADIL", "https://www.anil.org"]] }
    ]
  },
  {
    id: "travail", icone: "💼", nom: "Travail & emploi",
    demarches: [
      { t: "S'inscrire à France Travail", d: "Inscription comme demandeur d'emploi et demande d'allocation chômage (ARE).", l: [["France Travail", "https://www.francetravail.fr"]] },
      { t: "Actualisation mensuelle", d: "À faire chaque mois pour continuer à percevoir vos allocations.", l: [["France Travail", "https://www.francetravail.fr"]], p: "Ajoutez un rappel mensuel dans le calendrier pour ne jamais l'oublier." },
      { t: "Compte personnel de formation (CPF)", d: "Consulter vos droits et vous inscrire à une formation.", l: [["Mon Compte Formation", "https://www.moncompteformation.gouv.fr"]], p: "Attention aux arnaques par téléphone ou SMS : l'administration ne vous appelle jamais pour votre CPF." },
      { t: "Litige avec l'employeur", d: "Salaires impayés, licenciement : inspection du travail, conseil de prud'hommes.", l: [["Code du travail numérique", "https://code.travail.gouv.fr"]] },
      { t: "Arrêt de travail / accident du travail", d: "Envoyer l'arrêt sous 48 h à l'Assurance maladie et à l'employeur.", l: [["Ameli", "https://www.ameli.fr"]] },
      { t: "Rupture conventionnelle", d: "Demande d'homologation en ligne.", l: [["TéléRC", "https://www.telerc.travail.gouv.fr"]] },
      { t: "Emploi à domicile (CESU)", d: "Déclarer un salarié à domicile, avec crédit d'impôt immédiat.", l: [["CESU", "https://www.cesu.urssaf.fr"]] },
      { t: "Créer son entreprise / micro-entreprise", d: "Guichet unique pour les formalités d'entreprise.", l: [["Guichet unique", "https://formalites.entreprises.gouv.fr"], ["Autoentrepreneur Urssaf", "https://www.autoentrepreneur.urssaf.fr"]] }
    ]
  },
  {
    id: "sante", icone: "🩺", nom: "Santé",
    demarches: [
      { t: "Compte Ameli", d: "Remboursements, attestation de droits, carte Vitale, arrêts de travail.", l: [["Ameli", "https://www.ameli.fr"]] },
      { t: "Déclarer son médecin traitant", d: "Indispensable pour être bien remboursé. Le médecin fait la déclaration en ligne.", l: [["Ameli", "https://www.ameli.fr"]] },
      { t: "Complémentaire santé solidaire (C2S)", d: "Mutuelle gratuite ou à moins de 1 € par jour selon vos revenus.", l: [["Ameli", "https://www.ameli.fr"]], p: "Souvent non demandée alors qu'on y a droit : faites la simulation." },
      { t: "Mon espace santé", d: "Carnet de santé numérique : ordonnances, résultats d'analyses, vaccins.", l: [["Mon espace santé", "https://www.monespacesante.fr"]] },
      { t: "Carte Vitale (perte, mise à jour, appli)", d: "Commander une nouvelle carte ou activer l'appli carte Vitale.", l: [["Ameli", "https://www.ameli.fr"]] },
      { t: "Carte européenne d'assurance maladie", d: "Pour être soigné lors d'un séjour dans l'UE. Gratuite, commande en ligne.", l: [["Ameli", "https://www.ameli.fr"]] },
      { t: "Bilans prévention gratuits", d: "« Mon bilan prévention » aux âges clés (18-25, 45-50, 60-65, 70-75 ans) pris en charge à 100 %.", l: [["Santé.fr", "https://www.sante.fr"]] },
      { t: "Trouver un professionnel de santé", d: "Annuaire officiel avec tarifs et secteur de conventionnement.", l: [["Annuaire santé Ameli", "https://annuairesante.ameli.fr"]] }
    ]
  },
  {
    id: "handicap", icone: "♿", nom: "Handicap & autonomie",
    demarches: [
      { t: "Dossier MDPH", d: "AAH, carte mobilité inclusion (CMI), PCH, RQTH : un seul dossier à la MDPH.", l: [["Mon parcours handicap", "https://www.monparcourshandicap.gouv.fr"]] },
      { t: "Allocation aux adultes handicapés (AAH)", d: "Versée par la CAF ou la MSA après décision de la MDPH.", l: [["CAF", "https://www.caf.fr"]] },
      { t: "Allocation personnalisée d'autonomie (APA)", d: "Pour les plus de 60 ans en perte d'autonomie, à domicile ou en établissement.", l: [["Pour les personnes âgées", "https://www.pour-les-personnes-agees.gouv.fr"]] },
      { t: "Proche aidant", d: "Congé de proche aidant, allocation journalière (AJPA), droit au répit.", l: [["Service-public", SP_RECHERCHE + "proche%20aidant"]] },
      { t: "Adapter son logement (MaPrimeAdapt')", d: "Aide aux travaux d'adaptation pour les personnes âgées ou handicapées.", l: [["France Rénov'", "https://france-renov.gouv.fr"]] }
    ]
  },
  {
    id: "impots", icone: "💶", nom: "Impôts",
    demarches: [
      { t: "Déclaration de revenus", d: "Chaque année au printemps, en ligne sur impots.gouv.fr.", l: [["Impots.gouv", "https://www.impots.gouv.fr"]], p: "Vérifiez les cases pré-remplies : frais réels, dons, emploi à domicile, pension versée… peuvent réduire l'impôt." },
      { t: "Prélèvement à la source (modifier le taux)", d: "Moduler son taux en cas de baisse de revenus, de mariage, de naissance.", l: [["Impots.gouv", "https://www.impots.gouv.fr"]] },
      { t: "Taxe foncière / taxe d'habitation", d: "Payer, mensualiser, demander un dégrèvement.", l: [["Impots.gouv", "https://www.impots.gouv.fr"]] },
      { t: "Déclarer ses biens immobiliers", d: "Obligation de déclarer occupation et loueurs dans « Gérer mes biens immobiliers ».", l: [["Impots.gouv", "https://www.impots.gouv.fr"]] },
      { t: "Difficultés de paiement", d: "Demander un délai ou une remise gracieuse via la messagerie sécurisée.", l: [["Impots.gouv", "https://www.impots.gouv.fr"]] },
      { t: "Réclamation / corriger une déclaration", d: "Correction en ligne, puis réclamation contentieuse si besoin (jusqu'au 31 décembre de la 2e année).", l: [["Impots.gouv", "https://www.impots.gouv.fr"]] }
    ]
  },
  {
    id: "retraite", icone: "👵", nom: "Retraite",
    demarches: [
      { t: "Consulter son relevé de carrière", d: "Vérifier que toutes vos périodes sont bien enregistrées (tous régimes).", l: [["Info-retraite", "https://www.info-retraite.fr"]], p: "Signalez vite les trimestres manquants : chômage, service militaire, enfants, petits boulots…" },
      { t: "Demander sa retraite en ligne", d: "Une seule demande pour tous les régimes, au moins 6 mois avant la date souhaitée.", l: [["Info-retraite", "https://www.info-retraite.fr"]] },
      { t: "Pension de réversion", d: "Pour le conjoint survivant, demande unique en ligne.", l: [["Info-retraite", "https://www.info-retraite.fr"]] },
      { t: "Minimum vieillesse (ASPA)", d: "Allocation de solidarité aux personnes âgées à faibles ressources.", l: [["L'Assurance retraite", "https://www.lassuranceretraite.fr"]] },
      { t: "Retraite complémentaire Agirc-Arrco", d: "Points, relevé et demande de retraite complémentaire.", l: [["Agirc-Arrco", "https://www.agirc-arrco.fr"]] }
    ]
  },
  {
    id: "vehicule", icone: "🚗", nom: "Véhicule & transports",
    demarches: [
      { t: "Carte grise (certificat d'immatriculation)", d: "Changement de titulaire, d'adresse, duplicata. Uniquement en ligne.", l: [["ANTS", "https://immatriculation.ants.gouv.fr"]], p: "Passez par le site officiel : les sites privés facturent des frais en plus." },
      { t: "Permis de conduire", d: "Inscription, renouvellement, perte, vol, permis international.", l: [["ANTS", "https://permisdeconduire.ants.gouv.fr"]] },
      { t: "Consulter ses points de permis", d: "Solde de points en ligne via FranceConnect.", l: [["Télépoints", "https://www.telepoints.info"]] },
      { t: "Payer ou contester une amende", d: "Paiement et contestation en ligne.", l: [["ANTAI", "https://www.antai.gouv.fr"]] },
      { t: "Historique d'un véhicule d'occasion", d: "Vérifier un véhicule avant achat (HistoVec).", l: [["HistoVec", "https://histovec.interieur.gouv.fr"]] },
      { t: "Contrôle technique", d: "Tous les 2 ans après les 4 ans du véhicule. Tarifs comparables en ligne.", l: [["Prix contrôle technique", "https://www.prix-controle-technique.gouv.fr"]] },
      { t: "Carburant moins cher", d: "Comparer les prix des stations en temps réel.", l: [["Prix carburants", "https://www.prix-carburants.gouv.fr"]] }
    ]
  },
  {
    id: "etudes", icone: "🎓", nom: "Études & jeunesse",
    demarches: [
      { t: "Parcoursup", d: "Vœux d'études supérieures après le bac.", l: [["Parcoursup", "https://www.parcoursup.gouv.fr"]] },
      { t: "Bourse et logement étudiant (DSE)", d: "Dossier social étudiant : bourse sur critères sociaux et logement CROUS.", l: [["Messervices.etudiant", "https://www.messervices.etudiant.gouv.fr"]] },
      { t: "Aides pour les jeunes", d: "Toutes les aides, emplois, stages et formations pour les 15-30 ans.", l: [["1jeune1solution", "https://www.1jeune1solution.gouv.fr"]] },
      { t: "Recensement citoyen (16 ans)", d: "Obligatoire à 16 ans, en mairie ou en ligne.", l: [["Majdc", "https://www.majdc.fr"]] },
      { t: "Pass Culture", d: "Crédit pour la culture pour les jeunes.", l: [["Pass Culture", "https://pass.culture.fr"]] },
      { t: "Bourses collège / lycée", d: "Demande auprès de l'établissement ou en ligne via EduConnect.", l: [["Service-public", SP_RECHERCHE + "bourse%20college"]] }
    ]
  },
  {
    id: "argent", icone: "🏦", nom: "Argent & consommation",
    demarches: [
      { t: "Surendettement", d: "Dossier gratuit à la Banque de France pour rééchelonner ou effacer des dettes.", l: [["Banque de France", "https://particuliers.banque-france.fr"]] },
      { t: "Point conseil budget", d: "Accompagnement gratuit et confidentiel pour gérer son budget.", l: [["Mes questions d'argent", "https://www.mesquestionsdargent.fr"]] },
      { t: "Droit au compte bancaire", d: "Si une banque vous refuse un compte, la Banque de France en désigne une.", l: [["Banque de France", "https://particuliers.banque-france.fr"]] },
      { t: "Comptes et assurances vie oubliés", d: "Retrouver l'argent de comptes inactifs ou de proches décédés.", l: [["Ciclade", "https://ciclade.caissedesdepots.fr"]] },
      { t: "Signaler un problème avec une entreprise", d: "Signal Conso : l'entreprise est prévenue et peut corriger.", l: [["Signal Conso", "https://signal.conso.gouv.fr"]] },
      { t: "Refuser le démarchage téléphonique", d: "Inscription gratuite sur la liste d'opposition.", l: [["Bloctel", "https://www.bloctel.gouv.fr"]] },
      { t: "Arnaque en ligne / fraude à la carte", d: "Signaler, porter plainte, faire opposition.", l: [["Cybermalveillance", "https://www.cybermalveillance.gouv.fr"], ["Perceval (fraude carte)", "https://www.service-public.gouv.fr/particuliers/vosdroits/R46526"]] }
    ]
  },
  {
    id: "energie", icone: "⚡", nom: "Énergie & télécoms",
    demarches: [
      { t: "Chèque énergie", d: "Envoyé automatiquement selon vos revenus ; utilisable pour électricité, gaz, fioul, bois.", l: [["Chèque énergie", "https://chequeenergie.gouv.fr"]] },
      { t: "Comparer les offres d'énergie", d: "Comparateur officiel et indépendant.", l: [["Énergie-info", "https://www.energie-info.fr"]] },
      { t: "Litige énergie", d: "Médiateur national de l'énergie, gratuit.", l: [["Énergie-info", "https://www.energie-info.fr"]] },
      { t: "Litige téléphone / internet", d: "Médiateur des communications électroniques, gratuit.", l: [["Médiateur télécom", "https://www.mediateur-telecom.fr"]] },
      { t: "Tester son débit / couverture", d: "Cartes officielles de couverture mobile et internet.", l: [["Mon réseau mobile", "https://monreseaumobile.arcep.fr"]] }
    ]
  },
  {
    id: "justice", icone: "⚖️", nom: "Justice & droits",
    demarches: [
      { t: "Porter plainte", d: "Pré-plainte en ligne ou en commissariat / gendarmerie.", l: [["Pré-plainte", "https://www.pre-plainte-en-ligne.gouv.fr"]] },
      { t: "Aide juridictionnelle", d: "Prise en charge des frais d'avocat selon vos ressources.", l: [["Justice.fr", "https://www.justice.fr"]] },
      { t: "Accès au droit gratuit", d: "Consultations juridiques gratuites (points-justice).", l: [["Justice.fr", "https://www.justice.fr"]] },
      { t: "Défenseur des droits", d: "Litige avec un service public, discrimination, droits de l'enfant.", l: [["Défenseur des droits", "https://www.defenseurdesdroits.fr"]] },
      { t: "Victimes de violences", d: "Numéros d'urgence et accompagnement : 3919, 119, 17.", l: [["Arrêtons les violences", "https://arretonslesviolences.gouv.fr"]] }
    ]
  },
  {
    id: "citoyen", icone: "🗳️", nom: "Citoyenneté",
    demarches: [
      { t: "S'inscrire sur les listes électorales", d: "Inscription en ligne, vérification de sa situation électorale.", l: [["Service-public", SP_RECHERCHE + "inscription%20listes%20electorales"]] },
      { t: "Faire une procuration", d: "Procuration en ligne puis vérification d'identité.", l: [["Ma procuration", "https://www.maprocuration.gouv.fr"]] },
      { t: "Nationalité française", d: "Naturalisation, certificat de nationalité.", l: [["Service-public", SP_RECHERCHE + "naturalisation"]] },
      { t: "Titre de séjour (étrangers)", d: "Démarches en ligne auprès de l'administration numérique pour les étrangers (ANEF).", l: [["ANEF", "https://administration-etrangers-en-france.interieur.gouv.fr"]] }
    ]
  },
  {
    id: "deces", icone: "🕊️", nom: "Décès & succession",
    demarches: [
      { t: "Démarches après un décès", d: "Déclaration, banques, organismes sociaux, obsèques : la liste pas à pas.", l: [["Service-public", SP_RECHERCHE + "deces%20demarches"]] },
      { t: "Capital décès", d: "Versé par l'Assurance maladie aux proches d'un salarié ou chômeur décédé.", l: [["Ameli", "https://www.ameli.fr"]] },
      { t: "Succession", d: "Notaire, déclaration de succession, droits à payer.", l: [["Impots.gouv", "https://www.impots.gouv.fr"]] },
      { t: "Contrats obsèques et assurances vie", d: "Rechercher un contrat souscrit par le défunt (AGIRA).", l: [["AGIRA", "https://www.agira.asso.fr"]] }
    ]
  },
  {
    id: "animaux", icone: "🐾", nom: "Animaux & divers",
    demarches: [
      { t: "Identification d'un animal", d: "Puce obligatoire pour chiens et chats, changement de propriétaire.", l: [["I-CAD", "https://www.i-cad.fr"]] },
      { t: "Chasse, pêche", d: "Permis de chasser, carte de pêche.", l: [["Service-public", SP_RECHERCHE + "permis%20de%20chasser"]] },
      { t: "Urbanisme : permis de construire", d: "Déclaration préalable, permis de construire, en mairie ou en ligne.", l: [["Service-public", SP_RECHERCHE + "permis%20de%20construire"]] },
      { t: "Déposer une demande en ligne à l'administration", d: "Plateforme utilisée par de nombreux services publics.", l: [["Démarches simplifiées", "https://www.demarches-simplifiees.fr"]] }
    ]
  }
];

/* Aides : profil = tags utilisés pour le filtre « Pour moi » */
const AIDES = [
  { t: "Revenu de solidarité active (RSA)", o: "CAF / MSA", profil: ["faibles", "emploi"], d: "Revenu minimum pour les personnes sans ressources ou à faibles ressources, dès 25 ans (ou moins avec enfant).", url: "https://www.caf.fr" },
  { t: "Prime d'activité", o: "CAF / MSA", profil: ["faibles", "emploi", "jeune"], d: "Complément de revenus pour les travailleurs modestes, dès 18 ans. Une des aides les moins réclamées !", url: "https://www.caf.fr" },
  { t: "Aides au logement (APL / ALF / ALS)", o: "CAF / MSA", profil: ["logement", "faibles", "jeune", "etudiant"], d: "Réduisent le loyer ou les mensualités d'emprunt.", url: "https://www.caf.fr" },
  { t: "Allocations familiales", o: "CAF / MSA", profil: ["famille"], d: "Dès 2 enfants à charge, versées automatiquement si vous êtes connu de la CAF.", url: "https://www.caf.fr" },
  { t: "Allocation de rentrée scolaire (ARS)", o: "CAF / MSA", profil: ["famille", "faibles"], d: "Versée fin août pour les enfants de 6 à 18 ans scolarisés, sous conditions de ressources.", url: "https://www.caf.fr" },
  { t: "Prestation d'accueil du jeune enfant (PAJE)", o: "CAF / MSA", profil: ["famille"], d: "Prime de naissance, allocation de base, complément mode de garde (CMG).", url: "https://www.caf.fr" },
  { t: "Allocation de soutien familial (ASF)", o: "CAF / MSA", profil: ["famille", "faibles"], d: "Pour le parent seul qui ne reçoit pas de pension alimentaire.", url: "https://www.caf.fr" },
  { t: "Complément familial", o: "CAF / MSA", profil: ["famille", "faibles"], d: "Pour les familles d'au moins 3 enfants de 3 à 21 ans.", url: "https://www.caf.fr" },
  { t: "Complémentaire santé solidaire (C2S)", o: "Assurance maladie", profil: ["sante", "faibles", "senior"], d: "Mutuelle gratuite ou à petit prix selon les ressources.", url: "https://www.ameli.fr" },
  { t: "Allocation aux adultes handicapés (AAH)", o: "MDPH + CAF", profil: ["handicap"], d: "Revenu minimum pour les personnes handicapées.", url: "https://www.monparcourshandicap.gouv.fr" },
  { t: "Allocation d'éducation de l'enfant handicapé (AEEH)", o: "MDPH + CAF", profil: ["handicap", "famille"], d: "Pour compenser les frais liés au handicap d'un enfant.", url: "https://www.monparcourshandicap.gouv.fr" },
  { t: "Prestation de compensation du handicap (PCH)", o: "Département", profil: ["handicap"], d: "Aide humaine, technique, aménagement du logement ou du véhicule.", url: "https://www.monparcourshandicap.gouv.fr" },
  { t: "Allocation personnalisée d'autonomie (APA)", o: "Département", profil: ["senior", "handicap"], d: "Pour les 60 ans et plus en perte d'autonomie.", url: "https://www.pour-les-personnes-agees.gouv.fr" },
  { t: "Minimum vieillesse (ASPA)", o: "Caisse de retraite", profil: ["senior", "faibles"], d: "Complète les petites retraites.", url: "https://www.lassuranceretraite.fr" },
  { t: "Allocation chômage (ARE)", o: "France Travail", profil: ["emploi"], d: "Pour les personnes ayant perdu involontairement leur emploi.", url: "https://www.francetravail.fr" },
  { t: "Allocation de solidarité spécifique (ASS)", o: "France Travail", profil: ["emploi", "faibles"], d: "Après la fin des droits au chômage, sous conditions.", url: "https://www.francetravail.fr" },
  { t: "Aide à la mobilité (France Travail)", o: "France Travail", profil: ["emploi"], d: "Frais de transport, repas, hébergement pour un entretien ou une formation.", url: "https://www.francetravail.fr" },
  { t: "Chèque énergie", o: "État", profil: ["logement", "faibles", "senior"], d: "Aide au paiement des factures d'énergie, envoyée automatiquement.", url: "https://chequeenergie.gouv.fr" },
  { t: "MaPrimeRénov'", o: "Anah", profil: ["logement"], d: "Aide aux travaux de rénovation énergétique.", url: "https://france-renov.gouv.fr" },
  { t: "MaPrimeAdapt'", o: "Anah", profil: ["logement", "senior", "handicap"], d: "Adaptation du logement à la perte d'autonomie.", url: "https://france-renov.gouv.fr" },
  { t: "Fonds de solidarité logement (FSL)", o: "Département", profil: ["logement", "faibles"], d: "Aide pour dépôt de garantie, impayés de loyer, factures d'énergie ou d'eau.", url: SP_RECHERCHE + "fonds%20de%20solidarite%20logement" },
  { t: "Garantie Visale", o: "Action Logement", profil: ["logement", "jeune", "etudiant"], d: "Caution locative gratuite.", url: "https://www.visale.fr" },
  { t: "Bourse sur critères sociaux", o: "CROUS", profil: ["etudiant", "jeune"], d: "Bourse pour les études supérieures.", url: "https://www.messervices.etudiant.gouv.fr" },
  { t: "Contrat d'engagement jeune (CEJ)", o: "France Travail / Mission locale", profil: ["jeune", "emploi"], d: "Accompagnement intensif et allocation pour les 16-25 ans (29 ans si handicap).", url: "https://www.1jeune1solution.gouv.fr" },
  { t: "Pass Sport", o: "État", profil: ["jeune", "famille"], d: "Aide à l'inscription dans un club sportif pour les jeunes éligibles.", url: SP_RECHERCHE + "pass%20sport" },
  { t: "Pass Culture", o: "État", profil: ["jeune"], d: "Crédit pour des activités et biens culturels.", url: "https://pass.culture.fr" },
  { t: "Crédit d'impôt emploi à domicile", o: "Impôts / Urssaf", profil: ["famille", "senior", "handicap"], d: "50 % des dépenses de ménage, garde d'enfant, jardinage, aide à domicile, avec avance immédiate possible.", url: "https://www.cesu.urssaf.fr" },
  { t: "Aide juridictionnelle", o: "Justice", profil: ["faibles"], d: "Frais d'avocat et de procédure pris en charge.", url: "https://www.justice.fr" },
  { t: "Allocation journalière du proche aidant (AJPA)", o: "CAF / MSA", profil: ["handicap", "senior"], d: "Indemnise les jours de congé pris pour aider un proche.", url: "https://www.caf.fr" },
  { t: "Aides de votre CCAS / mairie", o: "Mairie", profil: ["faibles", "famille", "senior", "logement"], d: "Secours d'urgence, bons alimentaires, aides locales : renseignez-vous auprès du CCAS.", url: SP_RECHERCHE + "ccas" }
];

const PROFILS = [
  ["faibles", "💸 Petits revenus"], ["famille", "👨‍👩‍👧 Famille"], ["logement", "🏠 Logement"],
  ["emploi", "💼 Emploi / chômage"], ["jeune", "🧑 Jeune"], ["etudiant", "🎓 Étudiant"],
  ["senior", "👵 Senior / retraite"], ["handicap", "♿ Handicap"], ["sante", "🩺 Santé"]
];

const ASTUCES = [
  // Récupérer de l'argent
  { c: "recuperer", t: "Simulez toutes vos aides en 10 minutes", d: "Le simulateur officiel teste plus de 60 aides d'un coup. Beaucoup de droits ne sont jamais réclamés.", url: "https://www.mesdroitssociaux.gouv.fr" },
  { c: "recuperer", t: "Retrouvez l'argent oublié", d: "Comptes bancaires inactifs, livrets, assurances vie : Ciclade vous rend l'argent gratuitement.", url: "https://ciclade.caissedesdepots.fr" },
  { c: "recuperer", t: "Vérifiez votre relevé de carrière", d: "Un trimestre oublié, c'est une retraite plus faible à vie. Corrigez-le dès maintenant.", url: "https://www.info-retraite.fr" },
  { c: "recuperer", t: "Retard ou annulation de vol", d: "Le règlement européen 261/2004 prévoit de 250 à 600 € d'indemnisation. Faites la réclamation directement auprès de la compagnie.", url: SP_RECHERCHE + "retard%20avion%20indemnisation" },
  { c: "recuperer", t: "Retard de train", d: "Les compagnies remboursent une partie du billet en cas de retard important. Réclamez en ligne.", url: SP_RECHERCHE + "retard%20train" },
  { c: "recuperer", t: "Dépôt de garantie non rendu", d: "Le propriétaire a 1 mois (état des lieux conforme) ou 2 mois pour le rendre, sinon des pénalités de 10 % du loyer par mois de retard s'appliquent.", url: "https://www.anil.org" },
  { c: "recuperer", t: "Frais bancaires abusifs", d: "Les frais d'incident sont plafonnés, et encore plus pour les clients fragiles. Demandez un remboursement à votre conseiller puis au médiateur.", url: "https://www.mesquestionsdargent.fr" },
  { c: "recuperer", t: "Déclarez les bonnes cases aux impôts", d: "Frais de garde, dons, emploi à domicile, pension alimentaire versée, frais réels : chaque oubli se paie.", url: "https://www.impots.gouv.fr" },
  { c: "recuperer", t: "Garantie légale de 2 ans", d: "Un produit neuf en panne dans les 2 ans ? Le vendeur doit le réparer ou le remplacer gratuitement.", url: SP_RECHERCHE + "garantie%20legale%20de%20conformite" },
  // Dépenser moins
  { c: "economiser", t: "Résiliez en 3 clics", d: "Abonnements, assurances, box : le bouton « résilier en ligne » est obligatoire. Les assurances se résilient à tout moment après 1 an.", url: SP_RECHERCHE + "resiliation%20en%20trois%20clics" },
  { c: "economiser", t: "Changez d'assurance emprunteur", d: "Possible à tout moment : l'économie peut atteindre plusieurs milliers d'euros sur la durée du prêt.", url: SP_RECHERCHE + "assurance%20emprunteur" },
  { c: "economiser", t: "Comparez l'électricité et le gaz", d: "Utilisez le comparateur officiel du médiateur de l'énergie, gratuit et sans publicité.", url: "https://www.energie-info.fr" },
  { c: "economiser", t: "Carburant au meilleur prix", d: "Le site officiel compare les stations autour de chez vous.", url: "https://www.prix-carburants.gouv.fr" },
  { c: "economiser", t: "Le LEP plutôt que le livret A", d: "Si vos revenus sont modestes, le Livret d'épargne populaire rapporte plus que le livret A, sans impôt.", url: SP_RECHERCHE + "livret%20epargne%20populaire" },
  { c: "economiser", t: "Faites le tri dans vos abonnements", d: "Listez tous les prélèvements dans le calendrier : les abonnements oubliés apparaissent tout de suite.", url: "" },
  { c: "economiser", t: "Anti-gaspi alimentaire", d: "Liste de courses, menus de la semaine, produits de saison et applis anti-gaspi réduisent fortement la facture.", url: "" },
  { c: "economiser", t: "Stop au démarchage", d: "Inscrivez-vous sur Bloctel pour réduire les appels commerciaux… et les achats impulsifs.", url: "https://www.bloctel.gouv.fr" },
  { c: "economiser", t: "Délai de rétractation de 14 jours", d: "Pour un achat en ligne, vous pouvez changer d'avis sans justification pendant 14 jours.", url: SP_RECHERCHE + "droit%20de%20retractation" },
  // Santé
  { c: "sante", t: "Déclarez un médecin traitant", d: "Sans médecin traitant, vous êtes moins bien remboursé.", url: "https://www.ameli.fr" },
  { c: "sante", t: "Lunettes et dentaire 100 % Santé", d: "Des lunettes, prothèses dentaires et aides auditives sans reste à charge : demandez l'offre 100 % Santé.", url: SP_RECHERCHE + "100%25%20sante" },
  { c: "sante", t: "Bilans prévention gratuits", d: "Aux âges clés, un bilan complet est pris en charge à 100 %.", url: "https://www.sante.fr" },
  { c: "sante", t: "Dépistages gratuits", d: "Cancer du sein, colorectal, col de l'utérus : les invitations de l'Assurance maladie sont gratuites.", url: "https://www.ameli.fr" },
  { c: "sante", t: "Consultez les tarifs avant", d: "L'annuaire santé indique si le praticien pratique des dépassements d'honoraires.", url: "https://annuairesante.ameli.fr" },
  { c: "sante", t: "Bougez 30 minutes par jour", d: "La marche quotidienne réduit les risques cardiovasculaires, le stress et améliore le sommeil. C'est gratuit !", url: "https://www.mangerbouger.fr" },
  { c: "sante", t: "Manger mieux sans dépenser plus", d: "Légumineuses, fruits et légumes de saison, fait maison : des recettes simples et économiques.", url: "https://www.mangerbouger.fr" },
  // Bien vivre
  { c: "vivre", t: "Point conseil budget gratuit", d: "Un conseiller vous aide gratuitement à y voir clair dans vos comptes.", url: "https://www.mesquestionsdargent.fr" },
  { c: "vivre", t: "Une épargne de précaution", d: "Même 10 € par mois mis de côté automatiquement évitent les découverts et le stress.", url: "" },
  { c: "vivre", t: "Un dossier « papiers » unique", d: "Rangez vos documents par catégorie (comme dans cette appli) et scannez-les : vous gagnerez un temps précieux.", url: "" },
  { c: "vivre", t: "France Services près de chez vous", d: "Des agents vous aident gratuitement pour toutes vos démarches en ligne.", url: SP_RECHERCHE + "france%20services" },
  { c: "vivre", t: "Aide au numérique", d: "Des conseillers numériques forment gratuitement à l'usage d'internet et des démarches en ligne.", url: SP_RECHERCHE + "conseiller%20numerique" }
];

const CAT_ASTUCES = [
  ["recuperer", "💰 Récupérer de l'argent"], ["economiser", "✂️ Dépenser moins"],
  ["sante", "❤️ Santé"], ["vivre", "🌿 Bien vivre"]
];

/* Recours pour les demandes non honorées (escalade) */
const RECOURS = {
  administration: {
    nom: "Administration / service public",
    etapes: [
      { apres: 0, t: "Garder une preuve", d: "Accusé de réception, capture d'écran, numéro de dossier. Notez tout ici." },
      { apres: 15, t: "Relance écrite", d: "Relancez par la messagerie de l'organisme (espace personnel) en citant le numéro de dossier." },
      { apres: 30, t: "Relance par lettre recommandée", d: "Lettre recommandée avec accusé de réception : elle fait courir les délais." },
      { apres: 60, t: "Silence de l'administration", d: "En règle générale, sans réponse au bout de 2 mois, la demande est considérée comme acceptée ou rejetée selon les cas. Vous pouvez alors contester." },
      { apres: 60, t: "Médiateur de l'organisme", d: "CAF, Assurance maladie, France Travail, impôts, retraite ont chacun un médiateur gratuit." },
      { apres: 75, t: "Défenseur des droits", d: "Saisine gratuite en ligne ou via un délégué près de chez vous.", url: "https://www.defenseurdesdroits.fr" },
      { apres: 90, t: "Tribunal administratif", d: "Recours possible, souvent dans les 2 mois suivant la décision.", url: "https://www.telerecours.fr" }
    ]
  },
  entreprise: {
    nom: "Entreprise / achat sur internet",
    etapes: [
      { apres: 0, t: "Garder une preuve", d: "Numéro de commande, e-mails, conversations avec le service client." },
      { apres: 7, t: "Relance au service client", d: "Par écrit (e-mail ou formulaire), en demandant un numéro de ticket." },
      { apres: 15, t: "Signal Conso", d: "Signalement officiel : l'entreprise est prévenue et répond souvent rapidement.", url: "https://signal.conso.gouv.fr" },
      { apres: 21, t: "Mise en demeure", d: "Lettre recommandée qui fixe un délai (8 à 15 jours) avant action." },
      { apres: 30, t: "Opposition / rétrofacturation bancaire", d: "Produit non livré payé par carte : votre banque peut demander le remboursement (chargeback)." },
      { apres: 45, t: "Médiateur de la consommation", d: "Gratuit et obligatoire pour les entreprises : ses coordonnées figurent dans les CGV.", url: "https://www.economie.gouv.fr/mediation-conso" },
      { apres: 60, t: "Conciliateur de justice puis tribunal", d: "Conciliation gratuite, puis tribunal judiciaire (sans avocat en dessous de 10 000 €).", url: "https://www.conciliateurs.fr" }
    ]
  },
  logement: {
    nom: "Propriétaire / bailleur / syndic",
    etapes: [
      { apres: 0, t: "Garder une preuve", d: "Bail, état des lieux, photos, échanges écrits." },
      { apres: 15, t: "Relance écrite", d: "Courrier ou e-mail rappelant la demande et la date initiale." },
      { apres: 30, t: "Lettre recommandée", d: "Mise en demeure avec accusé de réception." },
      { apres: 45, t: "ADIL (conseil gratuit)", d: "Juristes spécialisés dans le logement, gratuits.", url: "https://www.anil.org" },
      { apres: 60, t: "Commission départementale de conciliation", d: "Gratuite, pour les litiges locataire / propriétaire." },
      { apres: 90, t: "Tribunal (juge des contentieux de la protection)", d: "Saisine possible sans avocat.", url: "https://www.justice.fr" }
    ]
  },
  employeur: {
    nom: "Employeur",
    etapes: [
      { apres: 0, t: "Garder une preuve", d: "Contrat, fiches de paie, e-mails." },
      { apres: 8, t: "Demande écrite", d: "Réclamation écrite à l'employeur ou aux RH." },
      { apres: 15, t: "Représentants du personnel", d: "CSE, délégués syndicaux peuvent intervenir." },
      { apres: 30, t: "Inspection du travail", d: "Renseignements et intervention gratuits.", url: "https://code.travail.gouv.fr" },
      { apres: 45, t: "Conseil de prud'hommes", d: "Pour les salaires impayés, référé possible.", url: "https://www.justice.fr" }
    ]
  }
};

/* Modèles de courriers (remplacement automatique des {champs}) */
const MODELES = {
  relance: `{nom}
{adresse}

À l'attention de : {organisme}

Objet : Relance – {objet}
Référence : {reference}

Madame, Monsieur,

Le {date}, je vous ai adressé une demande concernant : {objet}.

À ce jour, et malgré le temps écoulé, je n'ai reçu aucune réponse de votre part.

Je vous remercie de bien vouloir traiter ma demande dans les meilleurs délais et de m'informer de la suite qui lui sera donnée.

Vous trouverez ci-joint une copie de ma demande initiale.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Fait le {aujourdhui}
Signature`,
  miseendemeure: `{nom}
{adresse}

À l'attention de : {organisme}

LETTRE RECOMMANDÉE AVEC ACCUSÉ DE RÉCEPTION

Objet : Mise en demeure – {objet}
Référence : {reference}

Madame, Monsieur,

Le {date}, je vous ai adressé une demande concernant : {objet}. Malgré mes relances, celle-ci n'a jamais été honorée.

Par la présente, je vous mets en demeure d'y donner suite dans un délai de 15 jours à compter de la réception de ce courrier.

À défaut, je me réserve le droit de saisir le médiateur compétent, de signaler la situation aux autorités (Signal Conso / DGCCRF) et d'engager toute action utile pour faire valoir mes droits.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Fait le {aujourdhui}
Signature`,
  mediateur: `{nom}
{adresse}

À l'attention de : Monsieur ou Madame le Médiateur

Objet : Demande de médiation – litige avec {organisme}
Référence : {reference}

Madame, Monsieur le Médiateur,

Le {date}, j'ai adressé à {organisme} une demande concernant : {objet}.

Malgré mes relances écrites, cette demande n'a jamais été honorée et aucune solution satisfaisante ne m'a été proposée.

Je sollicite donc votre intervention afin de trouver une solution amiable à ce litige.

Vous trouverez ci-joint : copie de la demande initiale, des relances et des éventuelles réponses.

Je vous prie d'agréer, Madame, Monsieur le Médiateur, l'expression de ma considération distinguée.

Fait le {aujourdhui}
Signature`
};

/* Dates repères (indicatives, à vérifier chaque année) */
const DATES_REPERES = [
  { mois: 0, jour: 1, t: "Revalorisation de nombreuses retraites et hausse de certains tarifs", type: "demarche" },
  { mois: 2, jour: 31, t: "Fin de la trêve hivernale (expulsions et coupures)", type: "demarche" },
  { mois: 3, jour: 1, t: "Revalorisation du RSA, de la prime d'activité et des allocations familiales", type: "demarche" },
  { mois: 3, jour: 10, t: "Ouverture de la déclaration de revenus en ligne (vers mi-avril, vérifier)", type: "demarche" },
  { mois: 4, jour: 20, t: "Dates limites de déclaration de revenus (fin mai / début juin selon département)", type: "demarche" },
  { mois: 5, jour: 1, t: "Vérifier ses droits à la bourse étudiante (dossier social étudiant)", type: "demarche" },
  { mois: 6, jour: 25, t: "Avis d'impôt sur le revenu disponible (fin juillet / début août)", type: "demarche" },
  { mois: 7, jour: 20, t: "Versement de l'allocation de rentrée scolaire (vers le 20 août)", type: "revenu" },
  { mois: 8, jour: 1, t: "Rentrée : bourses collège/lycée, assurance scolaire, cantine", type: "demarche" },
  { mois: 9, jour: 15, t: "Taxe foncière : date limite de paiement (vers mi-octobre)", type: "prelevement" },
  { mois: 10, jour: 1, t: "Début de la trêve hivernale", type: "demarche" },
  { mois: 10, jour: 15, t: "Taxe d'habitation résidence secondaire : date limite (vers mi-novembre)", type: "prelevement" },
  { mois: 11, jour: 15, t: "Prime de Noël (RSA, ASS…) versée vers mi-décembre", type: "revenu" },
  { mois: 11, jour: 31, t: "Dernier jour pour les dons déductibles et les réclamations fiscales de l'année N-2", type: "demarche" }
];
