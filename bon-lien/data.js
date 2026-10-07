/* ============================================================
   Le Bon Lien : données
   Trois grandes demandes : faire un dossier, trouver une aide
   financière, être aidé (remplir un document, s'informer).
   Tous les liens mènent vers des sites officiels et gratuits.
   k = mots-clés pour la recherche (synonymes, mots courants).
   ============================================================ */

const SP = "https://www.service-public.gouv.fr/particuliers/recherche?keyword=";
function sp(mots) { return SP + encodeURIComponent(mots); }

const DEMANDES = [
  {
    id: "dossiers", icone: "📄", nom: "Faire un dossier administratif",
    court: "Papiers, logement, travail, impôts, voiture…",
    themes: [
      { id: "identite", icone: "🪪", nom: "Papiers d'identité" },
      { id: "famille", icone: "👨‍👩‍👧", nom: "Famille" },
      { id: "logement", icone: "🏠", nom: "Logement" },
      { id: "travail", icone: "💼", nom: "Travail et chômage" },
      { id: "sante", icone: "🩺", nom: "Santé" },
      { id: "impots", icone: "🧾", nom: "Impôts" },
      { id: "retraite", icone: "👵", nom: "Retraite" },
      { id: "voiture", icone: "🚗", nom: "Voiture et permis" },
      { id: "handicap", icone: "♿", nom: "Handicap" },
      { id: "justice", icone: "⚖️", nom: "Justice et plaintes" },
      { id: "autres", icone: "📌", nom: "Autres démarches" }
    ]
  },
  {
    id: "aides", icone: "💶", nom: "Trouver une aide financière",
    court: "Allocations, RSA, logement, santé, famille…",
    themes: [
      { id: "simuler", icone: "🧮", nom: "Savoir à quoi j'ai droit" },
      { id: "revenus", icone: "💸", nom: "Petits revenus" },
      { id: "famille", icone: "👶", nom: "Famille et enfants" },
      { id: "logement", icone: "🏠", nom: "Logement et énergie" },
      { id: "sante", icone: "🩺", nom: "Santé" },
      { id: "autonomie", icone: "♿", nom: "Handicap et autonomie" },
      { id: "jeunes", icone: "🎓", nom: "Jeunes et étudiants" },
      { id: "emploi", icone: "💼", nom: "Emploi et formation" },
      { id: "argent", icone: "💰", nom: "Récupérer de l'argent" }
    ]
  },
  {
    id: "aide", icone: "🤝", nom: "Être aidé pour remplir ou s'informer",
    court: "Quelqu'un pour vous aider, formulaires, informations…",
    themes: [
      { id: "pres", icone: "📍", nom: "Être aidé près de chez moi" },
      { id: "telephone", icone: "📞", nom: "Être aidé par téléphone" },
      { id: "remplir", icone: "✍️", nom: "Remplir un document" },
      { id: "infos", icone: "🔎", nom: "Trouver une information" },
      { id: "recours", icone: "📨", nom: "Une demande sans réponse" },
      { id: "arnaques", icone: "🛡️", nom: "Arnaques et sécurité" }
    ]
  }
];

/* d = demande, th = thème, t = titre, x = explication, url = lien */
const LIENS = [
  /* ---------- DOSSIERS : Papiers d'identité ---------- */
  { d: "dossiers", th: "identite", t: "Carte d'identité", x: "Première demande, renouvellement, perte ou vol. Pré-demande en ligne puis rendez-vous en mairie.", url: "https://ants.gouv.fr", k: "cni carte identite renouveler refaire perdu vole papiers" },
  { d: "dossiers", th: "identite", t: "Passeport", x: "Demande ou renouvellement, avec rendez-vous en mairie.", url: "https://ants.gouv.fr", k: "passeport voyage etranger renouveler" },
  { d: "dossiers", th: "identite", t: "Timbre fiscal", x: "Acheter en ligne le timbre pour un passeport ou un titre de séjour.", url: "https://timbres.impots.gouv.fr", k: "timbre fiscal passeport acheter" },
  { d: "dossiers", th: "identite", t: "Acte de naissance, de mariage ou de décès", x: "Demande gratuite d'une copie. Méfiez-vous des sites payants.", url: sp("acte de naissance"), k: "acte naissance mariage deces copie extrait etat civil livret" },
  { d: "dossiers", th: "identite", t: "Extrait de casier judiciaire", x: "Demande gratuite, reçue en quelques jours.", url: "https://casier-judiciaire.justice.gouv.fr", k: "casier judiciaire bulletin 3 extrait embauche" },
  { d: "dossiers", th: "identite", t: "FranceConnect", x: "Un seul identifiant pour les impôts, Ameli, la CAF et plus de 1 000 services.", url: "https://franceconnect.gouv.fr", k: "franceconnect identifiant mot de passe connexion compte" },
  { d: "dossiers", th: "identite", t: "Procuration pour voter", x: "Faire voter quelqu'un à votre place.", url: "https://www.maprocuration.gouv.fr", k: "procuration vote voter election" },

  /* ---------- DOSSIERS : Famille ---------- */
  { d: "dossiers", th: "famille", t: "Déclarer une naissance", x: "En mairie du lieu de naissance, dans les 5 jours.", url: sp("déclaration de naissance"), k: "naissance bebe declarer" },
  { d: "dossiers", th: "famille", t: "Se marier ou se pacser", x: "Dossier de mariage en mairie, PACS en mairie ou chez un notaire.", url: sp("pacs mariage"), k: "mariage marier pacs pacser" },
  { d: "dossiers", th: "famille", t: "Divorce et séparation", x: "Divorce, garde des enfants, pension alimentaire.", url: "https://www.justice.fr", k: "divorce separation garde enfants" },
  { d: "dossiers", th: "famille", t: "Pension alimentaire impayée", x: "La CAF peut verser une aide et récupérer les impayés.", url: "https://www.pension-alimentaire.caf.fr", k: "pension alimentaire impayee aripa" },
  { d: "dossiers", th: "famille", t: "Faire garder son enfant", x: "Trouver une crèche ou une assistante maternelle.", url: "https://monenfant.fr", k: "creche nounou assistante maternelle garde enfant" },
  { d: "dossiers", th: "famille", t: "Inscrire son enfant à l'école", x: "Inscription en mairie puis à l'école.", url: sp("inscription école"), k: "ecole inscription cantine maternelle primaire" },
  { d: "dossiers", th: "famille", t: "Après un décès", x: "Les démarches à faire après le décès d'un proche.", url: sp("démarches après un décès"), k: "deces mort succession obseques heritage" },

  /* ---------- DOSSIERS : Logement ---------- */
  { d: "dossiers", th: "logement", t: "Demande de logement social (HLM)", x: "Une seule demande en ligne pour tout le département. À renouveler chaque année.", url: "https://www.demande-logement-social.gouv.fr", k: "hlm logement social appartement demande" },
  { d: "dossiers", th: "logement", t: "Changement d'adresse", x: "Prévenir plusieurs organismes en une seule fois quand on déménage.", url: sp("changement d'adresse"), k: "demenagement changement adresse demenager" },
  { d: "dossiers", th: "logement", t: "Caution gratuite Visale", x: "Action Logement se porte garant pour votre location.", url: "https://www.visale.fr", k: "caution garant location visale" },
  { d: "dossiers", th: "logement", t: "Problème avec le propriétaire", x: "Conseils juridiques gratuits de l'ADIL près de chez vous.", url: "https://www.anil.org", k: "proprietaire locataire bail caution litige adil loyer" },

  /* ---------- DOSSIERS : Travail ---------- */
  { d: "dossiers", th: "travail", t: "S'inscrire à France Travail", x: "Inscription comme demandeur d'emploi et demande d'allocation chômage.", url: "https://www.francetravail.fr", k: "chomage pole emploi france travail inscription are actualisation" },
  { d: "dossiers", th: "travail", t: "Mon compte formation (CPF)", x: "Voir vos droits et choisir une formation.", url: "https://www.moncompteformation.gouv.fr", k: "cpf formation compte" },
  { d: "dossiers", th: "travail", t: "Rupture conventionnelle", x: "Demande d'homologation en ligne.", url: "https://www.telerc.travail.gouv.fr", k: "rupture conventionnelle quitter emploi" },
  { d: "dossiers", th: "travail", t: "Déclarer une aide à domicile (CESU)", x: "Déclarer un salarié à domicile, avec crédit d'impôt.", url: "https://www.cesu.urssaf.fr", k: "cesu aide domicile menage salarie" },
  { d: "dossiers", th: "travail", t: "Créer une micro-entreprise", x: "Guichet unique pour créer son entreprise.", url: "https://formalites.entreprises.gouv.fr", k: "entreprise micro auto entrepreneur creer siret" },

  /* ---------- DOSSIERS : Santé ---------- */
  { d: "dossiers", th: "sante", t: "Mon compte Ameli", x: "Remboursements, attestation, carte Vitale, arrêt de travail.", url: "https://www.ameli.fr", k: "ameli secu securite sociale carte vitale remboursement attestation arret maladie" },
  { d: "dossiers", th: "sante", t: "Mon espace santé", x: "Votre dossier médical en ligne, gratuit et sécurisé.", url: "https://www.monespacesante.fr", k: "dossier medical espace sante ordonnance" },
  { d: "dossiers", th: "sante", t: "Trouver un médecin ou un professionnel de santé", x: "Annuaire officiel avec les tarifs pratiqués.", url: "https://annuairesante.ameli.fr", k: "medecin docteur traitant generaliste specialiste dentiste kine infirmier trouver" },

  /* ---------- DOSSIERS : Impôts ---------- */
  { d: "dossiers", th: "impots", t: "Mon espace impots.gouv", x: "Déclaration de revenus, paiement, taxe foncière, réclamation.", url: "https://www.impots.gouv.fr", k: "impots declaration revenus taxe fonciere habitation prelevement source avis" },

  /* ---------- DOSSIERS : Retraite ---------- */
  { d: "dossiers", th: "retraite", t: "Demander sa retraite", x: "Une seule demande en ligne pour tous vos régimes.", url: "https://www.info-retraite.fr", k: "retraite demande pension depart carriere releve trimestres" },
  { d: "dossiers", th: "retraite", t: "L'Assurance retraite", x: "Votre retraite de base et vos attestations.", url: "https://www.lassuranceretraite.fr", k: "retraite cnav carsat attestation paiement" },
  { d: "dossiers", th: "retraite", t: "Retraite complémentaire Agirc-Arrco", x: "Pour les anciens salariés du privé.", url: "https://www.agirc-arrco.fr", k: "agirc arrco complementaire retraite" },

  /* ---------- DOSSIERS : Voiture ---------- */
  { d: "dossiers", th: "voiture", t: "Carte grise", x: "Changement de propriétaire ou d'adresse, duplicata.", url: "https://immatriculation.ants.gouv.fr", k: "carte grise immatriculation vehicule voiture certificat" },
  { d: "dossiers", th: "voiture", t: "Permis de conduire", x: "Inscription, renouvellement, perte ou vol.", url: "https://permisdeconduire.ants.gouv.fr", k: "permis conduire perdu renouveler" },
  { d: "dossiers", th: "voiture", t: "Payer ou contester une amende", x: "Site officiel des amendes, sans frais supplémentaires.", url: "https://www.antai.gouv.fr", k: "amende contravention pv radar contester payer" },
  { d: "dossiers", th: "voiture", t: "Consulter ses points de permis", x: "Connaître votre solde de points.", url: "https://www.telepoints.info", k: "points permis solde" },

  /* ---------- DOSSIERS : Handicap ---------- */
  { d: "dossiers", th: "handicap", t: "Dossier MDPH", x: "Carte mobilité inclusion, AAH, reconnaissance travailleur handicapé.", url: "https://www.monparcourshandicap.gouv.fr", k: "mdph handicap cmi rqth carte invalidite dossier" },

  /* ---------- DOSSIERS : Justice ---------- */
  { d: "dossiers", th: "justice", t: "Pré-plainte en ligne", x: "Préparer une plainte pour un vol ou une escroquerie avant d'aller au commissariat.", url: "https://www.pre-plainte-en-ligne.gouv.fr", k: "plainte vol escroquerie police gendarmerie" },
  { d: "dossiers", th: "justice", t: "Justice.fr", x: "Saisir un tribunal, aide juridictionnelle, conciliateur.", url: "https://www.justice.fr", k: "tribunal justice juge avocat proces" },
  { d: "dossiers", th: "justice", t: "Victime de violences", x: "Signaler des violences, de jour comme de nuit.", url: "https://arretonslesviolences.gouv.fr", k: "violence conjugale victime harcelement" },

  /* ---------- DOSSIERS : Autres ---------- */
  { d: "dossiers", th: "autres", t: "Titre de séjour", x: "Démarches en ligne pour les étrangers en France.", url: "https://administration-etrangers-en-france.interieur.gouv.fr", k: "titre sejour etranger visa naturalisation prefecture" },
  { d: "dossiers", th: "autres", t: "Démarches simplifiées", x: "Formulaires en ligne de nombreuses administrations.", url: "https://www.demarches-simplifiees.fr", k: "formulaire dossier en ligne demarche" },
  { d: "dossiers", th: "autres", t: "Identifier son chien ou son chat", x: "Fichier national des animaux identifiés.", url: "https://www.i-cad.fr", k: "chien chat animal puce identification" },

  /* ---------- AIDES : Savoir à quoi j'ai droit ---------- */
  { d: "aides", th: "simuler", t: "Simulateur officiel de toutes vos aides", x: "Testez plus de 60 aides en une seule fois, en 10 minutes environ.", url: "https://www.mesdroitssociaux.gouv.fr", k: "simulateur simulation droits aides allocations a quoi j'ai droit" },
  { d: "aides", th: "simuler", t: "Simulateur des aides pour les jeunes", x: "Toutes les aides pour les 15-30 ans.", url: "https://www.1jeune1solution.gouv.fr", k: "jeune simulateur aides" },
  { d: "aides", th: "simuler", t: "Aides de votre mairie (CCAS)", x: "Secours d'urgence, bons alimentaires, aides locales.", url: sp("CCAS"), k: "ccas mairie aide urgence alimentaire colis secours" },

  /* ---------- AIDES : Petits revenus ---------- */
  { d: "aides", th: "revenus", t: "RSA", x: "Revenu minimum pour les personnes sans ressources ou avec de faibles ressources.", url: "https://www.caf.fr", k: "rsa revenu solidarite minimum caf" },
  { d: "aides", th: "revenus", t: "Prime d'activité", x: "Complément de revenus pour les travailleurs modestes. Une des aides les moins demandées.", url: "https://www.caf.fr", k: "prime activite travail salaire complement caf" },
  { d: "aides", th: "revenus", t: "Minimum vieillesse (ASPA)", x: "Pour les retraités aux petites ressources.", url: "https://www.lassuranceretraite.fr", k: "aspa minimum vieillesse petite retraite" },
  { d: "aides", th: "revenus", t: "Aide juridictionnelle", x: "Frais d'avocat et de justice pris en charge.", url: "https://www.justice.fr", k: "aide juridictionnelle avocat gratuit" },
  { d: "aides", th: "revenus", t: "Dossier de surendettement", x: "La Banque de France aide quand on ne peut plus payer ses dettes.", url: "https://particuliers.banque-france.fr", k: "surendettement dettes credit banque de france" },

  /* ---------- AIDES : Famille ---------- */
  { d: "aides", th: "famille", t: "Allocations familiales", x: "Dès 2 enfants à charge.", url: "https://www.caf.fr", k: "allocations familiales enfants caf" },
  { d: "aides", th: "famille", t: "Allocation de rentrée scolaire", x: "Versée fin août pour les enfants de 6 à 18 ans.", url: "https://www.caf.fr", k: "rentree scolaire ars ecole fournitures" },
  { d: "aides", th: "famille", t: "Aides à la naissance et à la garde (PAJE)", x: "Prime de naissance, allocation de base, aide pour la nounou.", url: "https://www.caf.fr", k: "paje naissance bebe garde nounou cmg" },
  { d: "aides", th: "famille", t: "Parent seul : allocation de soutien familial", x: "Quand l'autre parent ne verse pas de pension.", url: "https://www.caf.fr", k: "asf parent seul isole mere celibataire pension" },
  { d: "aides", th: "famille", t: "Aides de la MSA (agriculteurs)", x: "Les mêmes aides pour les familles du monde agricole.", url: "https://www.msa.fr", k: "msa agricole agriculteur" },

  /* ---------- AIDES : Logement et énergie ---------- */
  { d: "aides", th: "logement", t: "APL et aides au logement", x: "Réduisent le loyer chaque mois.", url: "https://www.caf.fr", k: "apl als alf aide logement loyer payer caf" },
  { d: "aides", th: "logement", t: "Chèque énergie", x: "Aide pour payer l'électricité, le gaz ou le fioul. Envoyé automatiquement.", url: "https://chequeenergie.gouv.fr", k: "cheque energie electricite gaz fioul facture chauffage" },
  { d: "aides", th: "logement", t: "Aides aux travaux (MaPrimeRénov')", x: "Isolation, chauffage, avec un conseiller gratuit.", url: "https://france-renov.gouv.fr", k: "maprimerenov travaux isolation chauffage renovation" },
  { d: "aides", th: "logement", t: "Fonds de solidarité logement (FSL)", x: "Impayés de loyer, de factures d'énergie ou d'eau.", url: sp("fonds de solidarité logement"), k: "fsl impaye payer loyer facture eau aide urgence" },

  /* ---------- AIDES : Santé ---------- */
  { d: "aides", th: "sante", t: "Complémentaire santé solidaire", x: "Mutuelle gratuite ou à petit prix selon vos revenus.", url: "https://www.ameli.fr", k: "c2s cmu mutuelle gratuite complementaire sante" },
  { d: "aides", th: "sante", t: "Assurance quand on a une maladie (AERAS)", x: "Emprunter même avec un problème de santé.", url: "https://www.agira.asso.fr", k: "aeras emprunt assurance maladie credit" },

  /* ---------- AIDES : Handicap et autonomie ---------- */
  { d: "aides", th: "autonomie", t: "AAH, PCH, aides au handicap", x: "Toutes les aides liées au handicap, enfant ou adulte.", url: "https://www.monparcourshandicap.gouv.fr", k: "aah pch aeeh handicap allocation" },
  { d: "aides", th: "autonomie", t: "APA et aides aux personnes âgées", x: "Aide à domicile, maison de retraite, perte d'autonomie.", url: "https://www.pour-les-personnes-agees.gouv.fr", k: "apa personne agee autonomie ehpad maison retraite aide domicile" },
  { d: "aides", th: "autonomie", t: "Aidant d'un proche", x: "Allocation journalière du proche aidant, congé, soutien.", url: "https://www.caf.fr", k: "aidant proche ajpa conge parent malade" },

  /* ---------- AIDES : Jeunes ---------- */
  { d: "aides", th: "jeunes", t: "Bourse étudiante et logement CROUS", x: "Bourse sur critères sociaux et logement étudiant.", url: "https://www.messervices.etudiant.gouv.fr", k: "bourse crous etudiant logement etudiant" },
  { d: "aides", th: "jeunes", t: "Contrat d'engagement jeune", x: "Accompagnement et allocation pour les 16-25 ans.", url: "https://www.1jeune1solution.gouv.fr", k: "cej contrat engagement jeune mission locale" },
  { d: "aides", th: "jeunes", t: "Pass Culture", x: "Un crédit pour des livres, des places de cinéma, des cours.", url: "https://pass.culture.fr", k: "pass culture jeune livres cinema" },

  /* ---------- AIDES : Emploi ---------- */
  { d: "aides", th: "emploi", t: "Allocation chômage", x: "Demande et actualisation auprès de France Travail.", url: "https://www.francetravail.fr", k: "chomage allocation are france travail pole emploi" },
  { d: "aides", th: "emploi", t: "Financer une formation (CPF)", x: "Utiliser les droits acquis en travaillant.", url: "https://www.moncompteformation.gouv.fr", k: "cpf formation financer" },

  /* ---------- AIDES : Récupérer de l'argent ---------- */
  { d: "aides", th: "argent", t: "Argent oublié sur un compte ou une assurance vie", x: "Ciclade vous rend gratuitement l'argent qui dort.", url: "https://ciclade.caissedesdepots.fr", k: "argent oublie compte inactif assurance vie ciclade heritage" },
  { d: "aides", th: "argent", t: "Vérifier son relevé de carrière", x: "Un trimestre oublié, c'est une retraite plus faible à vie.", url: "https://www.info-retraite.fr", k: "releve carriere trimestres retraite verifier" },
  { d: "aides", th: "argent", t: "Frais bancaires et budget", x: "Conseils officiels pour gérer son argent et ses frais.", url: "https://www.mesquestionsdargent.fr", k: "banque frais bancaires budget argent" },

  /* ---------- ÊTRE AIDÉ : Près de chez moi ---------- */
  { d: "aide", th: "pres", t: "France Services près de chez vous", x: "Un agent vous aide gratuitement pour la CAF, les impôts, la retraite, Ameli, France Travail…", url: sp("France services"), k: "france services maison accueil agent aide guichet pres de chez moi" },
  { d: "aide", th: "pres", t: "Un conseiller numérique", x: "Pour apprendre à utiliser Internet et faire ses démarches en ligne.", url: sp("conseiller numérique"), k: "conseiller numerique internet ordinateur apprendre" },
  { d: "aide", th: "pres", t: "Votre mairie et son CCAS", x: "Aide pour les dossiers et les aides locales.", url: sp("CCAS"), k: "mairie ccas aide sociale" },
  { d: "aide", th: "pres", t: "Un écrivain public", x: "Quelqu'un rédige ou remplit vos courriers et dossiers.", url: sp("écrivain public"), k: "ecrivain public courrier lettre ecrire remplir" },
  { d: "aide", th: "pres", t: "ADIL : conseil logement gratuit", x: "Des juristes répondent à vos questions de logement.", url: "https://www.anil.org", k: "adil logement conseil juriste" },

  /* ---------- ÊTRE AIDÉ : Téléphone ---------- */
  { d: "aide", th: "telephone", t: "Allô Service Public : 39 39", x: "Une réponse à vos questions administratives. Prix d'un appel normal.", url: "tel:3939", k: "telephone appeler 3939 allo service public question" },
  { d: "aide", th: "telephone", t: "CAF : 32 30", x: "Allocations, RSA, APL, prime d'activité.", url: "tel:3230", k: "caf telephone appeler" },
  { d: "aide", th: "telephone", t: "Assurance maladie : 36 46", x: "Remboursements, carte Vitale, arrêt de travail.", url: "tel:3646", k: "ameli secu telephone appeler" },
  { d: "aide", th: "telephone", t: "France Travail : 39 49", x: "Inscription, allocation chômage.", url: "tel:3949", k: "pole emploi france travail chomage telephone" },
  { d: "aide", th: "telephone", t: "Retraite : 39 60", x: "L'Assurance retraite répond à vos questions.", url: "tel:3960", k: "retraite telephone appeler" },
  { d: "aide", th: "telephone", t: "Impôts : 0 809 401 401", x: "Questions sur votre déclaration ou votre paiement.", url: "tel:0809401401", k: "impots telephone appeler" },
  { d: "aide", th: "telephone", t: "Violences femmes : 39 19", x: "Écoute gratuite et anonyme, jour et nuit.", url: "tel:3919", k: "violence femme 3919 ecoute" },
  { d: "aide", th: "telephone", t: "Urgence hébergement : 115", x: "Pour une personne sans abri, gratuit, jour et nuit.", url: "tel:115", k: "115 sans abri sdf hebergement urgence dormir" },

  /* ---------- ÊTRE AIDÉ : Remplir un document ---------- */
  { d: "aide", th: "remplir", t: "Trouver un formulaire Cerfa", x: "Tous les formulaires officiels, avec leur notice pour bien les remplir.", url: sp("formulaire cerfa"), k: "cerfa formulaire imprime notice remplir document" },
  { d: "aide", th: "remplir", t: "Modèles de lettres gratuits", x: "Lettres prêtes à compléter : résiliation, réclamation, relance…", url: sp("modèle de lettre"), k: "modele lettre courrier resiliation reclamation ecrire" },
  { d: "aide", th: "remplir", t: "Se faire aider par un agent France Services", x: "Un agent remplit le dossier avec vous, gratuitement.", url: sp("France services"), k: "aide remplir dossier agent france services" },
  { d: "aide", th: "remplir", t: "Aide au téléphone pour la déclaration d'impôts", x: "Un agent vous guide pour remplir la déclaration.", url: "tel:0809401401", k: "declaration impots remplir aide" },

  /* ---------- ÊTRE AIDÉ : Trouver une information ---------- */
  { d: "aide", th: "infos", t: "Service-Public.fr", x: "Le site officiel qui explique toutes vos démarches et vos droits.", url: "https://www.service-public.gouv.fr", k: "information droits demarche service public explication" },
  { d: "aide", th: "infos", t: "Droit du travail", x: "Salaire, congés, licenciement : réponses officielles et simples.", url: "https://code.travail.gouv.fr", k: "droit travail salaire conges licenciement contrat" },
  { d: "aide", th: "infos", t: "Questions d'argent et de banque", x: "Banque, crédit, assurance, épargne.", url: "https://www.mesquestionsdargent.fr", k: "banque credit assurance epargne argent" },
  { d: "aide", th: "infos", t: "Questions de santé", x: "Informations santé officielles et adresses utiles.", url: "https://www.sante.fr", k: "sante information maladie vaccin" },

  /* ---------- ÊTRE AIDÉ : Demande sans réponse ---------- */
  { d: "aide", th: "recours", t: "Défenseur des droits", x: "Gratuit, quand une administration ne répond pas ou vous traite mal.", url: "https://www.defenseurdesdroits.fr", k: "defenseur droits administration reponse recours plainte discrimination" },
  { d: "aide", th: "recours", t: "Signaler un problème avec une entreprise", x: "Signal Conso prévient l'entreprise, qui répond souvent vite.", url: "https://signal.conso.gouv.fr", k: "signal conso entreprise commande colis livre livraison jamais recu remboursement litige achat vendeur" },
  { d: "aide", th: "recours", t: "Conciliateur de justice", x: "Gratuit, pour régler un litige sans aller au tribunal.", url: "https://www.conciliateurs.fr", k: "conciliateur litige voisin accord" },
  { d: "aide", th: "recours", t: "Médiateur de la consommation", x: "Gratuit, quand le service client ne règle pas votre problème.", url: "https://www.economie.gouv.fr/mediation-conso", k: "mediateur consommation service client" },

  /* ---------- ÊTRE AIDÉ : Arnaques ---------- */
  { d: "aide", th: "arnaques", t: "Victime d'arnaque sur Internet", x: "Conseils et aide gratuite en cas de piratage ou d'escroquerie.", url: "https://www.cybermalveillance.gouv.fr", k: "arnaque piratage escroquerie internet virus mail sms faux" },
  { d: "aide", th: "arnaques", t: "Info Escroqueries : 0 805 805 817", x: "Appel gratuit pour signaler ou se renseigner sur une arnaque.", url: "tel:0805805817", k: "escroquerie arnaque telephone sms appel signaler" },
  { d: "aide", th: "arnaques", t: "Stop au démarchage par téléphone (Bloctel)", x: "Inscription gratuite pour ne plus être appelé.", url: "https://www.bloctel.gouv.fr", k: "bloctel demarchage telephone appels publicite" }
];

/* Toujours une solution : ces liens s'affichent si la recherche ne trouve rien */
const SECOURS = [
  { t: "Chercher sur Service-Public.fr", x: "Le site officiel cherche votre demande pour vous.", recherche: true },
  { t: "Simulateur officiel de vos aides", x: "Savoir à quoi vous avez droit.", url: "https://www.mesdroitssociaux.gouv.fr" },
  { t: "Appeler le 39 39", x: "Allô Service Public répond à vos questions.", url: "tel:3939" }
];
