# Freecell

ce jeu de freecell propose des aides graphiques à la résolution

## Todo 

- Permettre de déplacer plusieurs cartes d'un coup
    v compter le nombre de cases libres (colonne + freecell)
  - evaluer le nombre de cartes déplaçables 
    v détecter un clic sur une carte 'en dessous'
    v mettre en surbrillance une carte en dessous
    v définir si une série de cartes peut être déplacée
  - gérer le déplacement dans l'historique
- faire le drag'n drop

## Done
- gérer une carte
- gérer une pile de cartes
- gérer une case libre
- gérer un jeu de carte
- gérer une pile de couleurs
- gérer un coup
- gérer une partie
- afficher les cartes graphiquement
- gérer les clics
- Mettre en surbrillance la carte sélectionnée dans les colonnes
- gérer la liste des coups
- mettre en surbrillance la carte sélectionnée dans les freecells et la pile
- Permettre l'annulation de coup
- mettre un écran "CONGLATURATION" quand le 4è Roi est posé
- clic sur une carte lance la remontée vers la pile si possible ou autre colonne
- mettre en évidence les prochaines cartes à monter sur la pile
- faire un bouton pour montrer les 4 prochaines cartes à monter
- bug : le déplacement en deux clics n'est pas bien contrôlé : tous les mouvements sont permis !

## Carte.js
un objet pour coder une carte : 
valeur de 1 à 13 ( 1 2 3 4 5 6 7 8 9 10 V D R)
couleur parmi P C K T (pique, coeur, carreau, trefle)

### méthodes
- estRouge : dit si la carte est rouge (coeur ou carreau)
- estNoire : dit si la carte est noire (trefle ou pique)

- peutposersur (autreCarte)
indique si on peut poser cette carte sur une autre carte passée en paramètre
l'autre carte doit être de valeur directement supérieure et de couleur différente

- getNom donne le nom de la carte (ex "Valet de Carreau")
en s'appuyant sur 

-getNomValeur : 
donne le nom de la vauer de la carte

- getNomCouleur :
donne le nom de la couleur de la carte (pique coeur carreau trefle)

## Framework de test Jasmine

- pour installer : 

`npm install --save-dev jasmine`

- pour initialiser :
`npx jasmine init`

- pour lancer dans le navigateur web : 
lancer la page specRunner.html

Exemple de doc :
https://dev.to/aurelkurtula/unit-testing-with-vanilla-javascript-the-very-basics-7jm

