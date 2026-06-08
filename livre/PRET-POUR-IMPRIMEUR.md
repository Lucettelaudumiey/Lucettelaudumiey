# Fichiers prêts pour l'imprimeur (impression à la demande)

Format de référence : **6 × 9 pouces** (152,4 × 228,6 mm), standard pour
l'impression à la demande (KDP, Lulu, BoD…).

Générés par `python3 build_print.py` :

## 1. Intérieur — `Interieur-Plus-haut-que-les-murs-6x9.pdf`
- **132 pages** (nombre pair), fond blanc, texte noir.
- Marges **en miroir** : reliure (intérieur) 0,8" · extérieur 0,55" · haut/bas 0,7".
- **Toutes les polices incorporées** (Liberation Serif, en sous-ensemble) — exigé
  par les imprimeurs ; aucune police de base non incorporée.
- Numéros de page, table des matières cliquable et signets PDF.
- Taille de page **exacte** au format rogné (pas de fond perdu : le texte ne
  touche jamais les bords).

## 2. Couverture — `Couverture-Plus-haut-que-les-murs-6x9.pdf`
- Un seul fichier d'un seul tenant : **4ᵉ de couverture + dos + 1ʳᵉ de couverture**.
- Dimensions : **12,547 × 9,25 pouces** (318,6 × 235 mm), **fond perdu de 0,125"**
  inclus sur les quatre bords (le fond bleu nuit déborde jusqu'au bord).
- **Dos calculé : 7,6 mm** pour 132 pages sur **papier blanc** (0,002252"/page).
- Titre au dos (lisible car le dos dépasse 0,0625").

## En cas d'impression sur papier crème
L'épaisseur passe à 0,0025"/page : le dos devient ~8,4 mm et la couverture
s'élargit d'autant. Il suffit de changer `PAGE_THICK` dans `build_print.py` et de
relancer pour régénérer une couverture adaptée.

## Conseils d'envoi
- Vérifier auprès de l'imprimeur le **fond perdu** demandé (souvent 3 mm ou 0,125").
- Pour une colorimétrie parfaite, certains imprimeurs préfèrent du **CMJN** : le
  fichier est en RVB (accepté par la plupart des plateformes POD, converti
  automatiquement). Sur demande, une version CMJN peut être préparée.
