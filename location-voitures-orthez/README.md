# 🚗 Location auto Orthez · un mois · boîte automatique

Application web (un seul fichier, sans installation) pour trouver **une voiture
de location à Orthez (64300) pour un mois**, **boîte automatique**, **électrique
de préférence**, au **meilleur tarif**.

👉 En ligne : **https://lucettelaudumiey.github.io/Lucettelaudumiey/location-voitures-orthez/**

## Ce que fait l'application

1. **Ma recherche** : lieu, dates (30 jours par défaut), boîte automatique
   obligatoire, électrique de préférence ou uniquement, kilomètres prévus.
2. **Chercher chez tous les loueurs** : 20 loueurs classés (agences d'Orthez,
   plateformes entre particuliers, formules au mois, agences de Pau,
   comparateurs). Chaque bouton ouvre le site du loueur, avec vos dates déjà
   remplies quand le site l'accepte (Getaround, Turo, Kayak, Rentalcars,
   Leboncoin). Filtres : *À Orthez*, *Entre particuliers*, *Formules au mois*,
   *Pau et alentours*, *Comparateurs*, *Électrique confirmé*.
3. **Comparer les offres trouvées** : vous notez chaque proposition (site ou
   téléphone) et l'application calcule le **coût complet du mois** :
   loyer + kilomètres en supplément + énergie estimée (électricité ou
   carburant), puis classe les offres de la moins chère à la plus chère.
   Les boîtes manuelles sont écartées automatiquement. Export CSV (Excel),
   sauvegarde et import JSON. Les offres restent enregistrées dans le
   navigateur.
4. **À demander avant de signer** : la liste des questions utiles pour une
   location d'un mois (tarif mensuel, km inclus, câble de recharge, caution…).

## Pourquoi pas une recherche automatique des prix ?

Les sites de location (Getaround, Turo, ADA, Kayak…) ne publient pas d'accès
libre à leurs tarifs et interdisent la copie automatique de leurs pages. Les
prix changent aussi chaque jour. L'application fait donc le travail le plus
utile : elle ouvre chaque recherche déjà remplie, et compare ensuite les
offres réelles que vous relevez, avec le vrai coût sur un mois.

## Utilisation hors ligne

Ouvrez simplement `index.html` dans un navigateur. Aucune dépendance.

## Propriété

© 2026 Lucette Laudumiey (64). Tous droits réservés. Voir [PROPRIETE.md](../PROPRIETE.md).
