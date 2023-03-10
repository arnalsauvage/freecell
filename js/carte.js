class Carte {

    // class static properties

    static get COULEUR_PIQUE() {
        return 0;
    }

    static get COULEUR_COEUR() {
        return 1;
    }

    static get COULEUR_CARREAU() {
        return 2;
    }

    static get COULEUR_TREFLE() {
        return 3;
    }

    static get VALEUR_MIN() {
        return 1;
    }

    static get VALEUR_MAX() {
        return 13;
    }

    static get VALEUR_VALET() {
        return 11;
    }

    static get VALEUR_DAME() {
        return 12;

    }

    static get VALEUR_ROI() {
        return 13;

    }

    static get VALEUR_AS() {
        return 1;
    }

    constructor(valeur, couleur) {
        this.setValeur(valeur);
        this.setCouleur(couleur);
    }

    setValeur(maValeur) {
        maValeur = parseInt(maValeur);
        // if maValeur is a number and between VALEUR_MIN and VALEUR_MAX

        if (isNaN(maValeur) || maValeur < Carte.VALEUR_MIN || maValeur > Carte.VALEUR_MAX) {
            console.error("/!\ -- Erreur, valeur " + maValeur + " non autorisée dans carte.js");
        } else {
            this.valeur = maValeur;
            // console.log("Valeur " + maValeur + " initialisée");
        }
    }

    getValeur() {
        return this.valeur;
    }

    isEquivalent(carte) {
        if (this == null || carte === null)
            return false;
        // console.log("this.valeur = " + this.valeur + " carte.valeur = " + carte.valeur + " this.couleur = " + this.couleur + " carte.couleur = " + carte.couleur);
        return this.valeur === carte.valeur && this.couleur.toLowerCase() === carte.couleur.toLowerCase();
    }

    setCouleur(maCouleur) {
        let couleursPermises = "CPKT";
        if (couleursPermises.includes(maCouleur)) {
            this.couleur = maCouleur;
            // console.log("Couleur " + maCouleur + " initialisée");
        }
        else
        {
            console.warn("Erreur carte.js , couleur " + maCouleur + " non autorisée");
        }
    }

    getCouleur() {
        return this.couleur;
    }

    getCouleurNumero() {
        switch (this.couleur) {
            case "K":
                return Carte.COULEUR_CARREAU;
            case "C":
                return Carte.COULEUR_COEUR;
            case "P":
                return Carte.COULEUR_PIQUE;
            case "T":
                return Carte.COULEUR_TREFLE;
            default:
                console.warn("Erreur carte.js , couleur " + this.couleur + " non autorisée");
                return "erreur carte.js !!!";
        }
    }

    getNomCouleur() {
        switch (this.couleur) {
            case "K":
                return "Carreau";
            case "C":
                return "Coeur";
            case "P":
                return "Pique";
            case "T":
                return "Trèfle";
            default:
                console.warn("Erreur carte.js , couleur '" + this.couleur + "' non autorisée");
                return "erreur carte.js !!!";
        }
    }

    getIconeCouleur() {
        switch (this.couleur) {
            case "K":
                return "♦";
            case "C":
                return "♥";
            case "P":
                return "♠";
            case "T":
                return "♣";
            default:
                console.warn("Erreur carte.js , couleur " + this.couleur + " non autorisée");
                return " ";
        }
    }

    setCouleurParNumero(numero) {
        switch (numero) {
            case Carte.COULEUR_PIQUE:
                this.couleur = "P";
                break;
            case Carte.COULEUR_COEUR:
                this.couleur = "C";
                break;
            case Carte.COULEUR_CARREAU:
                this.couleur = "K";
                break;
            case Carte.COULEUR_TREFLE:
                this.couleur = "T";
                break;

                default:
                console.error("Erreur carte.js , couleur " + this.couleur + " non autorisée");
                return "erreur carte.js !!!";
        }
    }

    getCouleurParNumero(numero) {
        let couleur;
        switch (numero) {
            case Carte.COULEUR_PIQUE:
                couleur = "P";
                break;
            case Carte.COULEUR_COEUR:
                couleur = "C";
                break;
            case Carte.COULEUR_CARREAU:
                couleur = "K";
                break;
            case Carte.COULEUR_TREFLE:
                couleur = "T";
                break;
        }
        console.debug("Couleur du numéro " + numero + " = " + couleur);
        return couleur;
    }

    getNomFigure() {
        switch (this.valeur) {
            case Carte.VALEUR_VALET:
                return "Valet";
            case Carte.VALEUR_DAME:
                return "Dame";
            case Carte.VALEUR_ROI:
                return "Roi";
            case Carte.VALEUR_AS:
                return "As";
            default:
                return "" + this.valeur;
        }
    }

    getNomCourtFigure() {
        switch (this.valeur) {
            case Carte.VALEUR_VALET:
                return "V";
            case Carte.VALEUR_DAME:
                return "D";
            case Carte.VALEUR_ROI:
                return "R";
            case Carte.VALEUR_AS:
                return "A";
            default:
                return "" + this.valeur;
        }
    }

    estRouge() {
        return (this.couleur === "K" || this.couleur === "C");
    }

    estNoir() {
        return (this.couleur === "P" || this.couleur === "T");
    }

    estValide() {
        if (!(this.valeur >= Carte.VALEUR_MIN && this.valeur <= Carte.VALEUR_MAX)) {
            return false
        }
        return !(this.couleur !== "K" && this.couleur !== "C" && this.couleur !== "P" && this.couleur !== "T");
    }

    peutPoserSur(autreCarte) {
        if (autreCarte == null) {
            return true;
        }
        // Si valeur autre carte = maValeur + 1 
        if (this.valeur !== autreCarte.valeur - 1)
            return false;
        return this.estNoir() !== autreCarte.estNoir();
    }

    getNom() {
        return "" + this.getNomFigure() + " de " + this.getNomCouleur();
    }

    getNomCourt() {
        return this.getNomCourtFigure() + " " + this.getIconeCouleur();
    }

    getNomCourtTxt() {
        return this.getNomCourtFigure() + this.getCouleur();
    }
}
