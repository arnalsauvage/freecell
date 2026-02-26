import { PileDeCartes } from './PileDeCartes.js';
import { Carte } from './Carte.js';

export class PileDeCouleur extends PileDeCartes {
    constructor(couleur) {
        super();
        this.couleur = couleur;
    }

    ajouteCarte(carte) {
        if (!(carte instanceof Carte)) {
            console.error("Pas une instance de Carte");
            return false;
        }
        if (carte.couleur !== this.couleur) {
            return false;
        }

        const sommet = this.getCarte();
        if (!sommet) {
            if (carte.valeur === 1) {
                super.ajouteCarte(carte);
                return true;
            }
            return false;
        }

        if (carte.valeur === sommet.valeur + 1) {
            super.ajouteCarte(carte);
            return true;
        }
        return false;
    }

    getCouleur() {
        return this.couleur;
    }

    estRouge() {
        return ["C", "K"].includes(this.couleur);
    }
}
