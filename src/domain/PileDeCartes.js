export class PileDeCartes {
    constructor() {
        this.pileDeCartes = [];
    }

    prendCarte() {
        return this.pileDeCartes.pop();
    }

    estVide() {
        return this.pileDeCartes.length === 0;
    }

    getCarte() {
        return this.pileDeCartes[this.pileDeCartes.length - 1] || null;
    }

    ajouteCarte(maCarte) {
        this.pileDeCartes.push(maCarte);
    }

    intervertitCartes(index1, index2) {
        const temp = this.pileDeCartes[index1];
        this.pileDeCartes[index1] = this.pileDeCartes[index2];
        this.pileDeCartes[index2] = temp;
    }

    melanger() {
        // Algorithme de Fisher-Yates pour un vrai mélange aléatoire
        for (let i = this.pileDeCartes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.pileDeCartes[i], this.pileDeCartes[j]] = [this.pileDeCartes[j], this.pileDeCartes[i]];
        }
    }

    getNbCartes() {
        return this.pileDeCartes.length;
    }

    getCarteN(index) {
        return this.pileDeCartes[index];
    }

    toString() {
        return `Longueur de la pile : ${this.pileDeCartes.length} - ` + 
               this.pileDeCartes.map(c => c.getNom()).join(" - ");
    }

    contientCarte(carte) {
        if (this.estVide() || !carte) return false;
        return this.pileDeCartes.some(c => carte.isEquivalent(c));
    }

    isEquivalent(autrePile) {
        if (autrePile.getNbCartes() !== this.getNbCartes()) return false;
        return this.pileDeCartes.every((c, i) => c.isEquivalent(autrePile.getCarteN(i)));
    }

    vider() {
        this.pileDeCartes = [];
    }

    compteCartes(carte) {
        return this.pileDeCartes.filter(c => carte.isEquivalent(c)).length;
    }

    retireCarte(carte) {
        const index = this.pileDeCartes.findIndex(c => carte.isEquivalent(c));
        if (index !== -1) {
            this.pileDeCartes.splice(index, 1);
            return true;
        }
        return false;
    }
}
