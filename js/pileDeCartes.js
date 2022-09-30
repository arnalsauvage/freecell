class PileDeCartes {
    constructor() {
        // init an array with a for
        this.pileDeCartes = new Array(0);
    }

    prendCarte() {
        return this.pileDeCartes.pop();
    }

    estVide() {
        return this.pileDeCartes.length === 0;
    }

    getCarte() {
        return this.pileDeCartes[this.pileDeCartes.length - 1];
    }

    ajouteCarte(maCarte) {
        this.pileDeCartes.push(maCarte);
    }

    melanger() {
        for (let i = this.pileDeCartes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.pileDeCartes[i];
            this.pileDeCartes[i] = this.pileDeCartes[j];
            this.pileDeCartes[j] = temp;
        }
    }

    getNbCartes() {
        return this.pileDeCartes.length;
    }

    getCarteN(index) {
        return this.pileDeCartes[index];
    }

    toString() {
        // display all cards in jeuDeCartes
        let retour = "";
        retour += "Longueur de la pile : " + this.pileDeCartes.length;
        let carte;

        for (let i = 0; i <= this.pileDeCartes.length - 1; i++) {
            carte = this.pileDeCartes[i];
            retour += " - " + carte.getNom();
        }
        return retour;
    }

    contientCarte(carte) {
        // parcourt la pile pour chercher la carte
        if (this.estVide()) {
            return false;
        }
        console.debug("contientCarte :  cherche carte "  + carte.getNom());
        for (let i = 0; i <= this.pileDeCartes.length - 1; i++) {
            console.debug("element  " + i + " " + this.pileDeCartes[i].getNom());
            if ( carte.isEquivalent(this.pileDeCartes[i])) {
                console.debug("contientCarte :  carte trouvée !");
                return true;
            }
        }
        return false;
    }

    isEquivalent(autrePile) {

        // If number of properties is different,
        // objects are not equivalent
        if (autrePile.pileDeCartes.length !== this.pileDeCartes.length) {
            return false;
        }
        console.log("Longueur des piles : " + autrePile.pileDeCartes.length + " - " + this.pileDeCartes.length);
        for (let i = 0; i < autrePile.pileDeCartes.length; i++) {
            if (!autrePile.pileDeCartes[i].isEquivalent(this.pileDeCartes[i])) {
                console.log("cartes " + i + " différentes : " + autrePile.pileDeCartes[i].getNom() + " - " + this.pileDeCartes[i].getNom());
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
}
