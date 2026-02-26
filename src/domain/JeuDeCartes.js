import { PileDeCartes } from './PileDeCartes.js';
import { Carte } from './Carte.js';

export class JeuDeCartes {
    static NOMBRE_CARTES_PAR_COULEUR = 13;

    constructor() {
        this.jeuDeCartes = new PileDeCartes();
        ["P", "C", "K", "T"].forEach(couleur => {
            for (let val = 1; val <= JeuDeCartes.NOMBRE_CARTES_PAR_COULEUR; val++) {
                this.jeuDeCartes.ajouteCarte(new Carte(val, couleur));
            }
        });
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

    getCarteN(index) {
        return this.jeuDeCartes.getCarteN(index);
    }
}
