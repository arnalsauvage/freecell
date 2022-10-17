const button1 = document.getElementById("button-aide-1");
let partie = new Partie();
let affichagePartie = new AffichagePartie(partie);
partie.demarrePartie();
affichagePartie.affiche();

const COULEUR_CARTE_RECHERCHEE = "red"; // Couleur de la carte recherchée

function demarrePartie() {
    partie = new Partie();
    partie.demarrePartie();
    affichagePartie = new AffichagePartie(partie);
    affichagePartie.affiche();
}

function chercheCarte() {
    let txt = document.getElementById("chercheCarte").value;
    let valeur = txt.slice(0, 1);
    switch (valeur.toUpperCase()) {
        case "V":
            valeur = 11;
            break;
        case "D":
            valeur = 12;
            break;
        case "R":
            valeur = 13;
            break;
        case "A":
            valeur = 1;
            break;
        case "X":
            valeur = 10;
            break;

        default:
            valeur = parseInt(valeur);
            break;
    }
    let couleur = txt.slice(1, txt.length).toUpperCase();
    let carte = new Carte(valeur, couleur);

    switch (couleur) {
        case "N" :
            carte = new Carte(valeur, "T");
            affichagePartie.metEnSurbrillance(carte, COULEUR_CARTE_RECHERCHEE);
            carte = new Carte(valeur, "P");
            affichagePartie.metEnSurbrillance(carte, COULEUR_CARTE_RECHERCHEE);
            break;

        case "R" :
            carte = new Carte(valeur, "K");
            affichagePartie.metEnSurbrillance(carte, COULEUR_CARTE_RECHERCHEE);
            carte = new Carte(valeur, "C");
            affichagePartie.metEnSurbrillance(carte, COULEUR_CARTE_RECHERCHEE);
            break;
        default :
            affichagePartie.metEnSurbrillance(carte, COULEUR_CARTE_RECHERCHEE);
    }
}

function metCarteEnSurbrillance(carte) {
    console.log("Carte recherchée : " + carte.getNom());
    partie.chercheCarte(carte);
    affichagePartie.metEnSurbrillance(carte, COULEUR_CARTE_RECHERCHEE);
}

function nouvellePartieNonMelangee() {
    let txt = document.getElementById("chercheCarte").value;
    partie = new Partie();
    partie.distribue(false);
    affichagePartie = new AffichagePartie(partie);
    affichagePartie.affiche();
}

// Récupérer le bouton
const button = document.getElementById("btnNouvellePartie");

// Assigner l'événement click à la function vérifier
button.addEventListener("click", demarrePartie);
