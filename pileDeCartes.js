class PileDeCartes {

    constructor() {
        // init an array with a for
        this.pileDeCartes = new Array(0);
        console.log("Longueur de la pile : " + this.pileDeCartes.length);
    }

    prendCarte() {
        return this.pileDeCartes.pop();
    }

    estVide() {
        return this.pileDeCartes.length == 0;
    }

    getCarte() {
        let getCarte = this.pileDeCartes[this.pileDeCartes.length - 1];
        return getCarte;
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

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    displayCards() {
        // display all cards in jeDeCartes
        console.log("Longueur de la pile : " + this.pileDeCartes.length);
        let carte;
        for (let i = 0; i <= this.pileDeCartes.length - 1; i++) {
            carte = this.pileDeCartes[i];
            console.log(carte.getNom());
        }
    }
}