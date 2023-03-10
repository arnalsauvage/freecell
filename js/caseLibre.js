class CaseLibre {
    constructor() {
        this.carte = null;
    }

    // Place une carte sur la case libre. Renvoie true si la carte a été posée, false sinon.
    poseCarte(maCarte) {
        if (this.carte === null) {
            this.carte = maCarte;
            return true;
        } else {
            return false;
        }
    }

    // Renvoie la carte qui se trouve sur la case.
    getCarte() {
        return this.carte;
    }

    // Enlève la carte de la case et la renvoie.
    prendCarte() {
        let laCarte = this.carte;
        this.carte = null;
        return laCarte;
    }

    // Vérifie si la case contient une carte donnée. Renvoie true si la carte est présente, false sinon.
    contientCarte(maCarte) {
        if (typeof maCarte !== "object" || this.carte === null) {
            return false;
        } else {
            return this.carte === maCarte;
        }
    }

    // Vérifie si la case est vide. Renvoie true si la case est vide, false sinon.
    estLibre() {
        return this.carte === null;
    }
}