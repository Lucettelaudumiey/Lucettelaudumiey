/*
 * Bibliothèque d'histoires personnalisables.
 *
 * Dans chaque texte, on peut utiliser des marqueurs qui seront remplacés
 * automatiquement par les informations de l'enfant :
 *
 *   {prenom}   → le prénom de l'enfant
 *   {animal}   → l'animal préféré choisi
 *   {il}       → « il » ou « elle »
 *   {Il}       → « Il » ou « Elle » (début de phrase)
 *   {e}        → accord du féminin (« » pour un garçon, « e » pour une fille)
 *   {petit}    → « petit » ou « petite »
 *   {Petit}    → « Petit » ou « Petite »
 *   {ami}      → « ami » ou « amie »
 *   {héros}    → « héros » ou « héroïne »
 *
 * Chaque paragraphe est une entrée du tableau "paragraphs".
 */

const STORIES = [
  {
    id: "etoile",
    title: "{prenom} et l'étoile qui ne voulait pas dormir",
    description: "Une histoire douce du soir, parfaite avant le dodo. 🌙",
    paragraphs: [
      "Il était une fois {un} {petit} {héros} qui s'appelait {prenom}. Chaque soir, quand la lune montait dans le ciel, {prenom} se blottissait sous une grosse couverture toute douce et regardait les étoiles par la fenêtre.",
      "Mais une nuit, une petite étoile toute brillante refusait de s'endormir. Elle clignotait, clignotait, et faisait « pssst, pssst » pour appeler {prenom}.",
      "« Pourquoi ne dors-tu pas, petite étoile ? » demanda {prenom} en bâillant. « J'ai peur du noir ! » répondit l'étoile en tremblant de toutes ses pointes.",
      "Alors {prenom} eut une merveilleuse idée. {Il} prit son {animal} en peluche préféré et le montra à l'étoile. « Regarde, quand on a un {ami} près de soi, on n'a plus jamais peur. »",
      "L'étoile sourit de toute sa lumière. Elle se sentit beaucoup mieux, et tout doucement, ses paupières scintillantes se fermèrent.",
      "Et c'est ainsi que {prenom} et la petite étoile s'endormirent en même temps, l'un dans son lit, l'autre dans le grand ciel bleu. Bonne nuit, {prenom}. Fais de beaux rêves."
    ]
  },
  {
    id: "foret",
    title: "{prenom} et le secret de la forêt enchantée",
    description: "Une aventure pleine de courage et de gentillesse. 🌳",
    paragraphs: [
      "Par un joli matin ensoleillé, {prenom} décida d'aller se promener au bord de la forêt. {Il} mit ses bottes, prit un petit panier, et partit en chantonnant.",
      "Au pied d'un grand chêne, {prenom} entendit un petit cri : « Couic, couic ! » C'était un {animal} tout tremblant qui s'était perdu et ne retrouvait plus son chemin.",
      "« N'aie pas peur, je vais t'aider », dit gentiment {prenom}. {Il} prit le {animal} dans ses bras et le réchauffa contre son cœur.",
      "Ensemble, ils suivirent un chemin de fleurs lumineuses qui s'allumaient une à une sous leurs pas. La forêt était magique : les arbres murmuraient des « bravo » et les oiseaux chantaient pour les encourager.",
      "Enfin, ils arrivèrent devant la maison du {animal}, où toute sa famille les attendait. Tout le monde sauta de joie et remercia {prenom} mille fois.",
      "Pour la remercier, la forêt offrit à {prenom} une jolie clochette dorée. « Quand tu la feras tinter, nous saurons que tu as besoin d'amis. » Et depuis ce jour, {prenom} sut que la gentillesse est le plus beau des trésors."
    ]
  },
  {
    id: "mer",
    title: "{prenom} et le voyage au fond de la mer",
    description: "Une plongée magique parmi les poissons multicolores. 🌊",
    paragraphs: [
      "{prenom} adorait la mer. Un jour, en ramassant des coquillages sur la plage, {il} en trouva un tout rose qui brillait comme une perle.",
      "{Il} l'approcha de son oreille et… surprise ! Une petite voix chuchota : « Bonjour {prenom} ! Veux-tu visiter mon royaume sous les vagues ? »",
      "Aussitôt, une bulle magique entoura {prenom}, et hop ! {Il} se mit à descendre, descendre, tout doucement vers le fond de la mer, sans même être mouillé{e}.",
      "Là-bas, un {animal} des mers tout rigolo vint le saluer. Ensemble, ils dansèrent avec les poissons-clowns et glissèrent sur le dos des tortues géantes.",
      "Mais soudain, un petit poisson pleurait : il s'était coincé dans une algue. Sans hésiter, {prenom} nagea jusqu'à lui et le libéra délicatement. « Merci {prenom} ! » fit le poisson, le sourire jusqu'aux nageoires.",
      "Quand le soleil commença à se coucher, la bulle ramena doucement {prenom} sur la plage. {Il} garda précieusement le coquillage rose, pour se souvenir à jamais de son extraordinaire voyage au fond de la mer."
    ]
  },
  {
    id: "anniversaire",
    title: "Le merveilleux anniversaire de {prenom}",
    description: "Une fête surprise remplie de rires et de gâteaux. 🎂",
    paragraphs: [
      "C'était un jour très spécial : aujourd'hui, c'était l'anniversaire de {prenom} ! {Il} se réveilla tout content{e}, le cœur plein de joie.",
      "Mais en descendant l'escalier, quelle surprise : la maison était toute silencieuse… « Il n'y a personne ? » se demanda {prenom}.",
      "Et puis, d'un seul coup : « SURPRISE ! » Toute la famille, tous les amis, et même son {animal} bondirent de derrière le canapé avec des ballons de mille couleurs !",
      "Il y avait un énorme gâteau au chocolat avec des bougies qui scintillaient. {prenom} ferma les yeux, fit un vœu très secret, et souffla toutes les bougies d'un seul coup. Bravo !",
      "On dansa, on chanta, on joua à cache-cache dans le jardin. Le {animal} courait partout en remuant la queue, et tout le monde riait aux éclats.",
      "Le soir venu, fatigué{e} mais heureu{x}, {prenom} se coucha en pensant : « C'était le plus bel anniversaire du monde. » Et c'était bien vrai. Joyeux anniversaire, {prenom} !"
    ]
  },
  {
    id: "nuages",
    title: "{prenom} et le château dans les nuages",
    description: "Un rêve tout doux pour s'envoler vers le pays des câlins. ☁️",
    paragraphs: [
      "Un après-midi, allongé{e} dans l'herbe, {prenom} regardait les nuages passer. L'un d'eux ressemblait à un mouton, un autre à un bateau… et le plus gros ressemblait à un magnifique château !",
      "Tout à coup, un escalier de coton descendit du ciel jusqu'à {prenom}. « Monte donc ! » dit une voix toute douce. Curieu{x}, {prenom} grimpa marche après marche.",
      "Tout en haut l'attendait un {animal} aux ailes de plumes blanches. « Bienvenue au château des nuages, {prenom} ! Ici, tout est moelleux comme un câlin. »",
      "Ils sautèrent sur des trampolines de brume, glissèrent sur des arcs-en-ciel, et burent du jus d'étoile dans des tasses en nuage. C'était doux, doux, doux comme un oreiller.",
      "Le {animal} montra à {prenom} un grand coffre. À l'intérieur, il n'y avait pas d'or, mais des milliers de jolis rêves bien rangés. « Choisis celui que tu veux pour cette nuit. »",
      "{prenom} choisit le plus brillant de tous. Puis l'escalier de coton le ramena tout doucement dans l'herbe verte. Et ce soir-là, {prenom} fit le plus joli rêve de toute sa vie."
    ]
  }
];

/*
 * Histoires "de groupe" : pour plusieurs enfants ensemble (sœurs, cousines, amis…).
 *
 * Marqueurs disponibles :
 *   {prenoms}   → la liste des prénoms ("Maddy, Alba, Lou-Ann et Léonie")
 *   {prenom1}   → le 1er enfant   (les numéros tournent en boucle s'il y a
 *   {prenom2}   → le 2e enfant     moins d'enfants que de marqueurs)
 *   {prenom3}   → le 3e enfant
 *   {prenom4}   → le 4e enfant
 *   {lien}      → le lien choisi ("cousines", "sœurs", "amies"…)
 *   {animal}    → l'animal préféré
 *   {elles}/{Elles} → "elles / ils" (selon le groupe)
 *   {toutes}/{Toutes} → "toutes / tous"
 *   {es}        → accord pluriel : "fatigué{es}" → fatiguées / fatigués
 *   {ses}       → accord pluriel : "heureu{ses}" → heureuses / heureux
 */

const GROUP_STORIES = [
  {
    id: "cabane",
    title: "La cabane secrète de {prenoms}",
    description: "Toute la bande construit la plus belle des cabanes. 🏡",
    paragraphs: [
      "Un grand soleil brillait sur le jardin, et {prenoms} avaient une idée formidable : construire la plus belle cabane du monde !",
      "{prenom1} ramassa de jolies branches bien solides, pendant que {prenom2} cherchait des feuilles toutes larges pour faire le toit.",
      "{prenom3} apporta une vieille couverture toute douce, et {prenom4} décora l'entrée avec des fleurs de mille couleurs.",
      "Leur {animal} les observait en remuant la tête, très impressionné par tout ce remue-ménage.",
      "Quand la cabane fut enfin prête, les {lien} se serrèrent à l'intérieur, bien au chaud. « C'est notre cabane secrète, rien qu'à nous ! » dirent-{elles} en éclatant de rire.",
      "{Elles} y partagèrent des biscuits, se racontèrent mille histoires, et se promirent de revenir jouer ensemble dès le lendemain. Car rien n'est plus précieux que des {lien} qui s'aiment très fort."
    ]
  },
  {
    id: "tresor",
    title: "{prenoms} et la chasse au trésor",
    description: "Une vraie chasse au trésor dans le jardin. 🗺️",
    paragraphs: [
      "Ce matin-là, {prenom1} trouva une vieille carte toute froissée, cachée sous un caillou du jardin. « Un trésor ! Il y a un trésor caché tout près ! »",
      "Aussitôt, {prenom2} attrapa une loupe, {prenom3} enfila un grand chapeau, et {prenom4} prit la tête de l'expédition en suivant les flèches de la carte.",
      "Les {lien} comptèrent leurs pas à voix haute : un, deux, trois… jusqu'au vieux pommier, puis tournèrent près du rosier piquant.",
      "Leur fidèle {animal} reniflait le sol et, soudain, se mit à gratter la terre avec entrain. « Par ici ! Il a trouvé quelque chose ! »",
      "{Toutes} ensemble, {elles} creusèrent doucement… et une petite boîte dorée apparut, brillant au soleil comme un vrai trésor de pirates !",
      "À l'intérieur les attendaient des pièces en chocolat pour tout le monde. {prenoms} les partagèrent en parts bien égales, car entre {lien}, on partage toujours tout."
    ]
  },
  {
    id: "piquenique",
    title: "Le pique-nique magique de {prenoms}",
    description: "Un goûter au parc avec une petite surprise à poils. 🧺",
    paragraphs: [
      "Par une belle après-midi, {prenoms} préparèrent un grand pique-nique sous le plus grand arbre du parc.",
      "{prenom1} étala une nappe à carreaux, {prenom2} sortit les sandwichs, {prenom3} versa le jus de fruits, et {prenom4} disposa des fraises bien rouges dans un joli panier.",
      "Mais voilà qu'un {animal} curieux s'approcha sur la pointe des pattes, attiré par toutes ces bonnes odeurs.",
      "« Viens, n'aie pas peur ! » dit doucement {prenom1}. Et le {animal} vint s'asseoir au beau milieu des {lien}, tout content d'être invité.",
      "{Elles} partagèrent leur goûter avec lui, puis jouèrent à chat perché, firent des rondes et cueillirent des pâquerettes jusqu'au soir.",
      "Quand le soleil se coucha, {prenoms} rentrèrent main dans la main, fatigué{es} mais heureu{ses}, le cœur rempli de jolis souvenirs."
    ]
  },
  {
    id: "lucioles",
    title: "{prenoms} et la nuit des lucioles",
    description: "Une douce histoire du soir sous les étoiles. ✨",
    paragraphs: [
      "La nuit était douce et le ciel tout étoilé. Blotti{es} ensemble dans le jardin, {prenoms} regardaient briller les premières lucioles.",
      "« Regardez comme elles dansent ! » chuchota {prenom1}. Une luciole se posa délicatement sur le nez de {prenom2}, qui éclata de rire tout doucement.",
      "{prenom3} tendit la main, et une autre petite lumière vint s'y poser, comme une minuscule étoile tombée du ciel. {prenom4}, les yeux grands ouverts, n'osait plus bouger.",
      "Leur {animal} bâillait paisiblement, roulé en boule tout près d'elles, prêt à s'endormir.",
      "Les lucioles formaient comme une guirlande magique au-dessus des {lien}, veillant sur elles telles de gentilles petites gardiennes de la nuit.",
      "Peu à peu, les yeux des {lien} se fermèrent. Et {toutes} ensemble, {elles} s'endormirent en rêvant de lumières dansantes. Bonne nuit, {prenoms}."
    ]
  }
];

// Permet d'utiliser les histoires depuis app.js
if (typeof module !== "undefined") {
  module.exports = { STORIES: STORIES, GROUP_STORIES: GROUP_STORIES };
}
