# 📖 Les Histoires de Mamie

Une petite application toute simple pour raconter de jolies histoires à vos
petits-enfants… avec **leur prénom à l'intérieur** !

## Comment l'utiliser

1. Ouvrez le fichier **`index.html`** dans votre navigateur (double-cliquez dessus).
2. Tapez le **prénom** de l'enfant.
3. Choisissez si c'est une fille ou un garçon, son **animal préféré** et **l'histoire**.
4. Cliquez sur **« ✨ Créer l'histoire »**.

Et voilà, l'histoire apparaît, écrite spécialement pour l'enfant 💛

## Les petits boutons pratiques

- **🔊 Lire à voix haute** : l'ordinateur lit l'histoire tout seul (pratique pour les petits).
- **A− / A+** : pour écrire le texte en plus petit ou en plus gros.
- **🖨 Imprimer** : pour garder l'histoire sur papier ou en faire un joli livret.
- **↩ Nouvelle histoire** : pour recommencer avec un autre prénom ou une autre histoire.

## Les histoires disponibles

- 🌙 *… et l'étoile qui ne voulait pas dormir* (histoire du soir)
- 🌳 *… et le secret de la forêt enchantée*
- 🌊 *… et le voyage au fond de la mer*
- 🎂 *Le merveilleux anniversaire de …*
- ☁️ *… et le château dans les nuages*

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
