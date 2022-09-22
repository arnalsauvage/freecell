class PileDeCouleur extends PileDeCartes {
    constructor() {
        super();
        // this.pileDeCartes = new Array(0);
        // console.log("Longueur de la pile : " + this.pileDeCartes.length);
    }

    ajouteCarte(carte) {
        if (carte.couleur != this.couleur) {
            console.log("La couleur de la carte n'est pas la même que la couleur de la pile");
            return false;
        }
        if (this.estVide()) {
            if (carte.getValeur() == 1) {
                super.ajouteCarte(carte);
                return true;
            } else {
                console.log("La carte n'est pas un as");
                return false;
            }
        }
        if (carte.getValeur() == this.getCarteN().getValeur() + 1) {
            super.ajouteCarte(carte);
            return true;
        } else {
            console.log("La carte n'est pas la bonne valeur");
            return false;
        }
    }

    ajouteCarte(maCarte) {
        if (maCarte.peutPoserSur(this.getCarteN())) {
            this.pileDeCartes.push(maCarte);
            return true;
        } else {
            return false;
        }
    }

    prendCarte() {
        return this.pileDeCartes.pop();
    }

    getNbCartes() {
        return this.pileDeCartes.length;
    }
}