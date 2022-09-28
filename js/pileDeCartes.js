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

    displayCards() {
        // display all cards in jeuDeCartes
        console.log("Longueur de la pile : " + this.pileDeCartes.length);
        let carte;
        for (let i = 0; i <= this.pileDeCartes.length - 1; i++) {
            carte = this.pileDeCartes[i];
            console.log(i + " - " + carte.getNom());
        }
    }

    contientCarte(carte) {
        // parcourt la pile pour chercher la carte
        for (let i = 0; i <= this.pileDeCartes.length - 1; i++) {
            if ( carte.isEquivalent(this.pileDeCartes[i])) {
                return true;
            }
        }
        return false;
    }
}
