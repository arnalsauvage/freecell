
const button1 = document.getElementById("button-aide-1");
let partie = new Partie();
partie.demarrePartie();

function demarrePartie() {
    partie = new Partie();
    partie.demarrePartie();
}

function chercheCarte() {
    let txt = document.getElementById("chercheCarte").value;
    let carte = new Carte(txt.slice(0, 1), txt.slice(1, txt.length));
    partie.chercheCarte(carte);
    partie.metEnSurbrillance(carte);
}


// Récupérer le bouton
const button = document.getElementById("btnNouvellePartie");

// Assigner l'événement click à la function vérifier
button.addEventListener("click", demarrePartie);
