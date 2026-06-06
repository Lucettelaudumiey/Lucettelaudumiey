# 🎱 Loto Quine — Lulu & Titine du 64

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
- **Impression** des cartons
- **Sauvegarde automatique** de la partie (reprend où vous en étiez)

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

Fait avec ❤️ pour Lulu & Titine — département **64**.
