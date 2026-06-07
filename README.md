# 🎱 Loto Quine — Assistant de tirage

Petite application web pour animer une partie de **loto traditionnel** (le « loto quine », 90 numéros).
Fonctionne entièrement dans le navigateur, **hors-ligne**, sans aucune installation ni envoi de données.

## Fonctionnalités

- **Tirage aléatoire sans remise** des 90 numéros (générateur non biaisé via l'API `crypto`).
- **Tirage automatique** réglé sur un rythme régulier (bouton Stop pour interrompre).
- **Annonce vocale** du numéro tiré (synthèse vocale du navigateur, si disponible).
- **Grille des 90 numéros** mise à jour en temps réel ; clic possible pour corriger un tirage manuel.
- **Journal des annonces** : quine, double quine, carton plein (avec l'heure et le rang du tirage).
- **Vérification d'un carton** : collez les numéros d'un carton pour savoir s'il a la quine / le carton plein et quels numéros manquent.
- **Générateur de plaques** : crée une **plaque de 6 cartons** (les 90 numéros, chacun une fois) ou une **plaque de 12 cartons** (chaque numéro deux fois). Cartons numérotés, marqués automatiquement au fil du tirage, mise en évidence du carton plein, et **impression** sur une feuille.
- **Sauvegarde automatique** de la partie en cours (reprise après rechargement de la page).
- Raccourci clavier : **Espace** pour tirer un numéro.

## Utilisation

Ouvrez simplement `index.html` dans un navigateur.

Pour le servir localement :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Structure

| Fichier      | Rôle                                   |
|--------------|----------------------------------------|
| `index.html` | Structure de la page                   |
| `style.css`  | Mise en forme (thème sombre, responsive) |
| `app.js`     | Logique de tirage, annonces, vérification |
| `carton.js`  | Générateur de plaques de cartons valides |

## Règles rappelées

Le loto quine se joue avec des cartons de 3 lignes × 9 colonnes (5 numéros par ligne).
- **Quine** : une ligne complète.
- **Double quine** : deux lignes complètes.
- **Carton plein** : les 15 numéros du carton sont sortis.
