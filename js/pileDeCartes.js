class PileDeCartes {
    constructor() {
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

    intervertitCartes(index1, index2) {
        let carte1 = this.getCarteN(index1);
        let carte2 = this.getCarteN(index2);
        this.pileDeCartes[index1] = carte2;
        this.pileDeCartes[index2] = carte1;
    }

    melanger() {
        // Cette méthode mélange les cartes dans le jeuDeCartes, mais bizarement n'est pas efficace sur mobile ?!?
        // this.pileDeCartes.sort(() => Math.random() - 0.5);


        let carte;
        let numeroCarte;
        // On va mélanger 2000 cartes
        for (let i = 0; i < 51; i++) {
        // tirer un numero au hasard entre 0 et 51
            numeroCarte = Math.floor(Math.random() * this.pileDeCartes.length);
            this.intervertitCartes(numeroCarte, i);
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

        for (let i = 0; i < this.pileDeCartes.length; i++) {
            carte = this.pileDeCartes[i];
            retour += " - " + carte.getNom();
        }
        return retour;
    }

    contientCarte(carte) {
        // parcourt la pile pour chercher la carte
        if (this.estVide() || carte === undefined) {
            return false;
        }
        console.debug("contientCarte :  cherche carte " + carte.getNom());
        for (let i = 0; i < this.pileDeCartes.length; i++) {
            console.debug("element  " + i + " " + this.pileDeCartes[i].getNom());
            if (carte.isEquivalent(this.pileDeCartes[i])) {
                console.debug("contientCarte :  carte trouvée !");
                return true;
            }
        }
        return false;
    }

    isEquivalent(autrePile) {

        if (autrePile.pileDeCartes.length !== this.pileDeCartes.length) {
            return false;
        }
        console.debug("Longueur des piles : " + autrePile.pileDeCartes.length + " - " + this.pileDeCartes.length);
        for (let i = 0; i < autrePile.pileDeCartes.length; i++) {
            if (!autrePile.pileDeCartes[i].isEquivalent(this.pileDeCartes[i])) {
                console.debug("cartes " + i + " différentes : " + autrePile.pileDeCartes[i].getNom() + " - " + this.pileDeCartes[i].getNom());
                return false;
            }
        }
        return true;
    }

    // Vide la pile
    vider() {
        this.pileDeCartes = new Array(0);
    }

// Compte le nombre de cartes de la pile qui sont équivalentes à la carte passée en paramètre
    compteCartes(carte) {
        let count = 0;
        for (let i = 0; i < this.pileDeCartes.length; i++) {
            if (carte.isEquivalent(this.pileDeCartes[i])) {
                count++;
            }
        }
        return count;
    }

//  retire la carte passée en paramètre de la pile

    retireCarte(carte) {
        for (let i = 0; i < this.pileDeCartes.length; i++) {
            if (carte.isEquivalent(this.pileDeCartes[i])) {
                this.pileDeCartes.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}
