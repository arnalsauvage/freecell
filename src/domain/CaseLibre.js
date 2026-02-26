export class CaseLibre {
    constructor() {
        this.carte = null;
    }

    poseCarte(maCarte) {
        if (this.carte === null) {
            this.carte = maCarte;
            return true;
        }
        return false;
    }

    getCarte() {
        return this.carte;
    }

    prendCarte() {
        const laCarte = this.carte;
        this.carte = null;
        return laCarte;
    }

    contientCarte(maCarte) {
        return this.carte === maCarte;
    }

    estLibre() {
        return this.carte === null;
    }
}
