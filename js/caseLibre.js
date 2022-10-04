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

    prendCarte() {
        let laCarte = this.carte;
        this.carte = null;
        return laCarte;
    }

    getCarte() {
        return this.carte;
    }
}
