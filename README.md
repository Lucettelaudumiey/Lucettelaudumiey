# 📖 Les Histoires de Mamie

Une petite application toute simple pour raconter de jolies histoires à vos
petits-enfants… avec **leur prénom à l'intérieur** !

## Comment l'utiliser

1. Ouvrez le fichier **`index.html`** dans votre navigateur (double-cliquez dessus).
2. Entrez le ou les **prénoms** des enfants (le bouton **« ＋ Ajouter un enfant »**
   permet d'en mettre autant que vous voulez). Les prénoms de Maddy, Alba, Lou-Ann
   et Léonie sont déjà pré-remplis.
3. Pour chaque enfant, indiquez si c'est une fille ou un garçon.
4. Choisissez l'**animal préféré** et **l'histoire**.
5. Cliquez sur **« ✨ Créer l'histoire »**.

Et voilà, l'histoire apparaît, écrite spécialement pour les enfants 💛

### Une seule enfant ou toute la bande ?

- Avec **un seul prénom**, l'enfant est la vedette de sa propre histoire.
- Avec **deux prénoms ou plus**, tout le monde vit l'aventure **ensemble** ! Vous
  pouvez alors préciser si ce sont des *sœurs*, des *cousines*, des *amis*…
  Chaque enfant a son petit moment dans l'histoire.

## Les petits boutons pratiques

- **🔊 Lire à voix haute** : l'ordinateur lit l'histoire tout seul (pratique pour les petits).
- **A− / A+** : pour écrire le texte en plus petit ou en plus gros.
- **🖨 Imprimer** : pour garder l'histoire sur papier ou en faire un joli livret.
- **↩ Nouvelle histoire** : pour recommencer avec un autre prénom ou une autre histoire.

## Les histoires disponibles

**Pour une seule enfant :**

- 🌙 *… et l'étoile qui ne voulait pas dormir* (histoire du soir)
- 🌳 *… et le secret de la forêt enchantée*
- 🌊 *… et le voyage au fond de la mer*
- 🎂 *Le merveilleux anniversaire de …*
- ☁️ *… et le château dans les nuages*

**Pour plusieurs enfants ensemble :**

- 🏡 *La cabane secrète de …*
- 🗺️ *… et la chasse au trésor*
- 🧺 *Le pique-nique magique de …*
- ✨ *… et la nuit des lucioles* (histoire du soir)

## Pour les curieux : ajouter ses propres histoires

Toutes les histoires se trouvent dans le fichier **`stories.js`**.
Chaque histoire a un titre et une liste de paragraphes. On peut y glisser des
petits « marqueurs » qui seront remplacés automatiquement :

| Marqueur | Devient… |
|----------|----------|
| `{prenom}` | le prénom de l'enfant |
| `{animal}` | l'animal choisi |
| `{il}` / `{Il}` | « il / elle » (ou « Il / Elle ») |
| `{e}` | « e » pour une fille, rien pour un garçon (ex. `content{e}`) |
| `{x}` | accorde « heureu{x} » → heureux / heureuse |
| `{petit}` / `{Petit}` | petit / petite |
| `{ami}` | ami / amie |
| `{héros}` | héros / héroïne |
| `{un}` | un / une |

Aucune installation n'est nécessaire : c'est une simple page web qui fonctionne
même sans connexion internet.
