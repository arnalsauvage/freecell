class PileDeCouleur extends PileDeCartes {
    constructor(couleur) {
        super();
        this.couleur = couleur;
    }

    ajouteCarte(carte) {
        if (carte.couleur !== this.couleur) {
            console.log("La couleur de la carte n'est pas la même que la couleur de la pile");
            return false;
        }
        if (this.estVide()) {
            if (carte.getValeur() === 1) {
                super.ajouteCarte(carte);
                return true;
            } else {
                console.log("La carte n'est pas un as");
                return false;
            }
        }
        if (carte.getValeur() === super.getCarte().getValeur() + 1) {
            super.ajouteCarte(carte);
            return true;
        } else {
            console.log("La carte n'est pas la bonne valeur");
            return false;
        }
    }

    prendCarte() {
        return this.pileDeCartes.pop();
    }

    getNbCartes() {
        return this.pileDeCartes.length;
    }

    getCouleur() {
        return this.couleur;
    }
}
