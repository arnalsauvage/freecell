
const button1 = document.getElementById("button-aide-1");
let partie = new Partie();
partie.demarrePartie();

function demarrePartie() {
    partie = new Partie();
    partie.demarrePartie();
}

function chercheCarte() {
    let txt = document.getElementById("chercheCarte").value;
    let valeur = txt.slice(0, 1);
    switch (valeur) {
        case "V":   valeur = 11; break;
        case "D":   valeur = 12; break;
        case "R":   valeur = 13; break;
        case "A":   valeur = 1; break;
        default:    valeur = parseInt(valeur); break;
    }
    let couleur = txt.slice(1, txt.length).toUpperCase();
    let carte = new Carte(valeur, couleur);

    switch (couleur) {

        case "N" :

        carte = new Carte(valeur, "T");
        metCarteEnSurbrillance(carte);
        carte = new Carte(valeur, "P");
        metCarteEnSurbrillance(carte);
        break;

        case "R" :

        carte = new Carte(valeur, "K");
        metCarteEnSurbrillance(carte);
        carte = new Carte(valeur, "C");
        metCarteEnSurbrillance(carte);
        break;

        default :

            metCarteEnSurbrillance(carte);
    }

    if (couleur==="R"){
        let carte = new Carte(valeur, "K");
        metCarteEnSurbrillance(carte);
        carte = new Carte(valeur, "C");
        metCarteEnSurbrillance(carte);
    }
}

function metCarteEnSurbrillance(carte)
{
    console.log("Carte recherchée : " + carte.getNom() );
    partie.chercheCarte(carte);
    partie.metEnSurbrillance(carte);
}

function nouvellePartieNonMelangee() {
    let txt = document.getElementById("chercheCarte").value;
     partie = new Partie();
    partie.distribue(false);
    partie.affiche();
}

// Récupérer le bouton
const button = document.getElementById("btnNouvellePartie");

// Assigner l'événement click à la function vérifier
button.addEventListener("click", demarrePartie);
