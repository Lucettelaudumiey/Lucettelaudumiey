# 🎱 Loto Bingo Automatique — Lucette Laudumiey du 64

Une application web de **loto traditionnel français** (numéros 1 à 90), simple,
colorée et sans installation. Parfaite pour animer une partie de loto en famille
ou entre amis dans les Pyrénées-Atlantiques !

## ✨ Fonctionnalités

- **Tirage des numéros** (1 à 90) avec une belle boule animée
- **Annonce vocale** en français + surnoms rigolos (« 22, v'là les flics ! »)
- **Tirage automatique** réglable (lent / normal / rapide)
- **Tableau des 90 numéros** qui se cochent au fur et à mesure
- **Génération de cartons** de loto valides (3 lignes × 9 colonnes, 15 numéros)
- **Détection automatique** des gains :
  - 🔵 **Quine** (une ligne complète)
  - 🟣 **Double quine** (deux lignes)
  - 🟢 **Carton plein** (les 15 numéros)
- **Nom du joueur** modifiable sur chaque carton
- **Téléchargement** de tous les cartons en une **image PNG** (noms + numéros), même hors-ligne
- **Export CSV** (Excel) de tous les cartons
- **Vue « Tout-en-un »** : sur un seul écran, le tirage compact + le tableau des
  90 numéros à gauche et les 6 premiers cartons à droite
- **Mode deux écrans** : un écran de tirage + un *écran de suivi* synchronisé en direct
- **Impression** des cartons
- **Sauvegarde automatique** de la partie (reprend où vous en étiez)

## 🖥️ Mode deux écrans

Pour animer une vraie partie : gardez le **tirage** sur un écran et affichez les
**cartons (les bingos)** sur l'écran d'à côté.

1. Ouvrez l'onglet **Mes cartons** puis cliquez sur **🖥️ Écran de suivi**.
2. Une nouvelle fenêtre s'ouvre : déplacez-la sur le second écran (plein écran
   conseillé).
3. Tirez les numéros depuis l'écran principal : la fenêtre de suivi se met à jour
   toute seule (numéros cochés, quines, double quines, cartons pleins).

La synchronisation passe par le navigateur (aucun réseau requis) et fonctionne
même en ouvrant le fichier en local. L'écran de suivi est en lecture seule.

## 📱 Suivre un loto sur tablette / téléphone

L'application sert aussi à **suivre un loto animé par quelqu'un d'autre** : vous
pointez les numéros annoncés et l'appli surveille vos plaques.

1. Onglet **Tirage** → **tapez sur un numéro du tableau** pour le cocher quand
   l'animateur l'annonce (tapez à nouveau pour corriger une erreur).
2. Onglet **Mes cartons** → **➕ Saisir une plaque achetée** : recopiez les
   numéros de chaque plaque que vous avez achetée.
3. L'appli vous prévient automatiquement : **Quine**, **Double quine**,
   **Carton plein**.

### Ouvrir l'appli sur la tablette (lien internet)

Le plus simple est de publier le site avec **GitHub Pages** :

1. Sur GitHub, ouvrez le dépôt → **Settings** → **Pages**.
2. *Source* : **Deploy from a branch**.
3. *Branch* : `claude/loto-quine-lulu-titine-xNogo`, dossier `/ (root)`, puis
   **Save**.
4. Au bout d'une minute, GitHub affiche une **adresse** (du type
   `https://<votre-compte>.github.io/<dépôt>/`). Ouvrez-la dans le navigateur de
   la tablette — vous pouvez l'ajouter à l'écran d'accueil.

### Icône sur l'écran d'accueil

L'appli fournit une **icône** (boule de loto « 64 ») et un manifeste, donc en
faisant **« Ajouter à l'écran d'accueil »** sur la tablette, elle s'installe
comme une vraie application (icône dédiée, ouverture en plein écran).

## ▶️ Utilisation

Aucune installation, aucune dépendance. Il suffit d'ouvrir le fichier
`index.html` dans un navigateur.

Pour le tirage à voix haute, laissez l'option « 🔊 Annonce vocale » cochée
(le navigateur doit prendre en charge la synthèse vocale en français).

### Lancer un petit serveur local (optionnel)

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## ⌨️ Astuces

- Touche **Espace** : tirer un numéro (dans l'onglet *Tirage*)
- Onglet **Mes cartons** : générez vos cartons, ils se cochent tout seuls

## 🗂️ Structure

```
index.html   → la page et la structure
style.css    → le thème et la mise en page
script.js    → la logique du jeu (tirage, cartons, détection des quines)
```

Fait avec ❤️ par Lucette Laudumiey — département **64**.
