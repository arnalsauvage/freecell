class PileDeCouleur extends PileDeCartes {
    // une pile de couleur est une pile de cartes de la même couleur
// qui doit être ordonnée par valeur croissante
    constructor(couleur) {
        super();
        this.couleur = couleur;
    }

    // Une carte ajoutée à une pile de couleur doit être de la même couleur
    // et de valeur supérieure à la carte au sommet de la pile
    ajouteCarte(carte) {
        if (!(carte instanceof Carte)) {
            console.error("La carte n'est pas une instance de la classe Carte");
            return false;
        }
        if (carte.couleur !== this.couleur) {
            console.debug(`La carte ${carte} n'est pas de la même couleur que la pile ${this}`);
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
            console.log("La carte n'a pas la valeur attendue : " + (super.getCarte().getValeur() + 1));
            return false;
        }
    }

    // Retourne la carte au sommet de la pile et la retire de la pile
    prendCarte() {
        if (this.estVide()) {
            console.error("La pile est vide");
            return null;
        }
        return this.pileDeCartes.pop();
    }

    // Retourne le nombre de cartes dans la pile
    getNbCartes() {
        return this.pileDeCartes.length;
    }

    // Retourne la couleur de la pile
    getCouleur() {
        return this.couleur;
    }

    // Indique si la pile est vide
    estVide() {
        return this.pileDeCartes.length === 0;
    }

    // Indique si c'est une pile rouge
    estRouge() {
        const couleursRouges = ["C", "K"];
        return couleursRouges.includes(this.couleur);
    }
}