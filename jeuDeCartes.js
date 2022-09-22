class JeuDeCartes {

    constructor() {
        // init an array with a for
        this.jeuDeCartes = new PileDeCartes();
        let valeurCarteDebut = 1;
        this.ajouteCartesCouleur("P", valeurCarteDebut);
        this.ajouteCartesCouleur("C", valeurCarteDebut);
        this.ajouteCartesCouleur("K", valeurCarteDebut);
        this.ajouteCartesCouleur("T", valeurCarteDebut);
        console.log("Longueur du jeu : " + this.jeuDeCartes.length);
    }

    ajouteCartesCouleur(couleur, nombre) {
        for (let i = 1; i <= 13; i++) {
            let maCarte = new Carte(i, couleur);
            this.jeuDeCartes.ajouteCarte(maCarte);
        }
    }

    melanger() {
        this.jeuDeCartes.melanger();
    }

    displayCards() {
        this.jeuDeCartes.displayCards();
    }

    prendCarte() {
        return this.jeuDeCartes.prendCarte();
    }
}