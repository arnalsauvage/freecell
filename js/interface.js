// Récupérer le bouton aide 1
const button1 = document.getElementById("button-aide-1");
let partie = new Partie();
partie.demarrePartie();

function demarrePartie() {
    partie = new Partie();
    partie.demarrePartie();
}


// Récupérer le bouton
const button = document.getElementById("btnNouvellePartie");

// Assigner l'événement click à la function vérifier
button.addEventListener("click", demarrePartie);