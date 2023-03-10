const NOMBRE_CARTES_PAR_COULEUR = 13;

class JeuDeCartes {

    constructor() {
        // init an array with a for
        this.jeuDeCartes = new PileDeCartes();
        let valeurCarteDebut = 1;
        this.ajouteCartesCouleur("P", valeurCarteDebut);
        this.ajouteCartesCouleur("C", valeurCarteDebut);
        this.ajouteCartesCouleur("K", valeurCarteDebut);
        this.ajouteCartesCouleur("T", valeurCarteDebut);
        console.log("Longueur du jeu : " + this.jeuDeCartes.getNbCartes());
    }

    ajouteCartesCouleur(couleur, nombre) {
        for (let i = nombre; i <= NOMBRE_CARTES_PAR_COULEUR; i++) {
            let maCarte = new Carte(i, couleur);
            this.jeuDeCartes.ajouteCarte(maCarte);
        }
    }

    melanger() {
        this.jeuDeCartes.melanger();
    }

    prendCarte() {
        return this.jeuDeCartes.prendCarte();
    }

    getNbCartes() {
        return this.jeuDeCartes.getNbCartes();
    }
}
