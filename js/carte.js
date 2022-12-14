    class Carte {

    constructor(valeur, couleur) {
        this.setValeur(valeur);
        this.setCouleur(couleur);
    }

    setValeur(maValeur) {
        maValeur = parseInt(maValeur);
        if ((maValeur > 0) && (maValeur < 14)) {
            this.valeur = maValeur;
                console.log("Valeur " + maValeur + " initialisée");
        } else {
                console.debug("/!\ -- Erreur, valeur " + maValeur + " non autorisée dans carte.js");
        }
    }

    getValeur() {
        return this.valeur;
    }

    isEquivalent(carte) {
        if (this==null || carte === null)
            return false;
        return this.valeur === carte.valeur && this.couleur.toLowerCase() === carte.couleur.toLowerCase();
    }

    setCouleur(maCouleur) {
        let couleursPermises = "CPKT";
        if (couleursPermises.includes(maCouleur)) {
            this.couleur = maCouleur;
        }
    }

    getCouleur() {
        return this.couleur;
    }

    getCouleurNumero() {
        switch (this.couleur) {
            case "K":
                return 3;
            case "C":
                return 2;
            case "P":
                return 1;
            case "T":
                return 4;
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
            case 1:
                this.couleur = "P";
                break;
            case 2:
                this.couleur = "C";
                break;
            case 3:
                this.couleur = "K";
                break;
            case 4:
                this.couleur = "T";
                break;
        }
    }

    getCouleurParNumero(numero) {
        let couleur;
        switch (numero) {
            case 1:
                couleur = "P";
                break;
            case 2:
                couleur = "C";
                break;
            case 3:
                couleur = "K";
                break;
            case 4:
                couleur = "T";
                break;
        }
        console.debug("Couleur du numéro " + numero + " = " + couleur);
        return couleur;
    }

    getNomFigure() {
        switch (this.valeur) {
            case 11:
                return "Valet";
            case 12:
                return "Dame";
            case 13:
                return "Roi";
            case 1:
                return "As";
            default:
                return "" + this.valeur;
        }
    }

    getNomCourtFigure() {
        switch (this.valeur) {
            case 11:
                return "V";
            case 12:
                return "D";
            case 13:
                return "R";
            case 1:
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
        if( ! ( this.valeur > 0 && this.valeur < 14) ){
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
