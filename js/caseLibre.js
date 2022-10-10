class CaseLibre {
    constructor() {
        this.carte = null;
    }

    poseCarte(maCarte) {
        if (this.carte == null) {
            this.carte = maCarte;
            return true;
        } else
            return false;
    }

    getCarte() {
        return this.carte;
    }

    prendCarte() {
        let laCarte = this.carte;
        this.carte = null;
        return laCarte;
    }
}
