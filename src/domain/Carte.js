export class Carte {
    static COULEUR_PIQUE = 0;
    static COULEUR_COEUR = 1;
    static COULEUR_CARREAU = 2;
    static COULEUR_TREFLE = 3;

    static VALEUR_MIN = 1;
    static VALEUR_MAX = 13;
    static VALEUR_VALET = 11;
    static VALEUR_DAME = 12;
    static VALEUR_ROI = 13;
    static VALEUR_AS = 1;

    constructor(valeur, couleur) {
        this.valeur = parseInt(valeur);
        this.couleur = couleur.toUpperCase();
        this.validate();
    }

    validate() {
        if (isNaN(this.valeur) || this.valeur < Carte.VALEUR_MIN || this.valeur > Carte.VALEUR_MAX) {
            throw new Error(`Valeur ${this.valeur} non autorisée`);
        }
        if (!"CPKT".includes(this.couleur)) {
            throw new Error(`Couleur ${this.couleur} non autorisée`);
        }
    }

    isEquivalent(carte) {
        if (!carte) return false;
        return this.valeur === carte.valeur && this.couleur === carte.couleur;
    }

    getCouleurNumero() {
        const mapping = { "K": Carte.COULEUR_CARREAU, "C": Carte.COULEUR_COEUR, "P": Carte.COULEUR_PIQUE, "T": Carte.COULEUR_TREFLE };
        return mapping[this.couleur];
    }

    getNomCouleur() {
        const noms = { "K": "Carreau", "C": "Coeur", "P": "Pique", "T": "Trèfle" };
        return noms[this.couleur];
    }

    getIconeCouleur() {
        const icones = { "K": "♦", "C": "♥", "P": "♠", "T": "♣" };
        return icones[this.couleur];
    }

    getNomFigure() {
        const figures = { [Carte.VALEUR_VALET]: "Valet", [Carte.VALEUR_DAME]: "Dame", [Carte.VALEUR_ROI]: "Roi", [Carte.VALEUR_AS]: "As" };
        return figures[this.valeur] || this.valeur.toString();
    }

    getNomCourtFigure() {
        const figures = { [Carte.VALEUR_VALET]: "V", [Carte.VALEUR_DAME]: "D", [Carte.VALEUR_ROI]: "R", [Carte.VALEUR_AS]: "A" };
        return figures[this.valeur] || this.valeur.toString();
    }

    estRouge() {
        return "KC".includes(this.couleur);
    }

    estNoir() {
        return "PT".includes(this.couleur);
    }

    peutPoserSur(autreCarte) {
        if (!autreCarte) return true;
        return this.valeur === autreCarte.valeur - 1 && this.estNoir() !== autreCarte.estNoir();
    }

    getNom() {
        return `${this.getNomFigure()} de ${this.getNomCouleur()}`;
    }

    getNomCourt() {
        return `${this.getNomCourtFigure()} ${this.getIconeCouleur()}`;
    }

    getNomCourtTxt() {
        return `${this.getNomCourtFigure()}${this.couleur}`;
    }
}
