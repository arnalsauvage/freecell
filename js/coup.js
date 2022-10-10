class Coup {
    constructor(carte, origine, destination) {
        this.setCarte(carte);
        this.setOrigine(origine);
        this.setDestination(destination);
    }

    setCarte(carte) {
        this.carte = carte;
    }

    getCarte() {
        return this.carte;
    }

    // Format origine : COL / CEL / PIL pour colonne celluleLibre ou pile
    // 1 caractère : n° de la colonne cel ou pile

    setOrigine(origine) {
        this.origine = this.verifieOrigineDest(origine);
    }

    getOrigine() {
        return this.origine;
    }

    setDestination(destination) {
        // COL pour colonnes, CEL pour cellule, PIL pour Pile
        this.destination = this.verifieOrigineDest(destination);
    }

    getDestination() {
        return this.destination;
    }

    verifieOrigineDest(origineDest) {
        // COL pour colonnes, CEL pour cellule, PIL pour Pile
        if (origineDest == null || origineDest.length !== 4) {
            return "";
        }
        let trigramme = origineDest.slice(0, 3);
        let numero = origineDest.slice(3, 4);
        let max;

        switch (trigramme) {
            case "COL":
                max = 8;
                break;
            case "CEL":
            case "PIL":
                max = 4;
                break;
            default :
                numero = 0;
        }
        if (numero > 0 && numero <= max) {
            return origineDest.slice(0, 4);
        } else {
            return "";
        }
    }

    getTypeOrigineOuDest(origineOuDest) {
        let typeOrigineOuDest;
        if (origineOuDest.length === 4) {
            typeOrigineOuDest = origineOuDest.slice(0, 3);
        } else {
            typeOrigineOuDest = "";
        }
        return typeOrigineOuDest
    }

    getTypeOrigine() {
        return this.getTypeOrigineOuDest(this.getOrigine());
    }

    getTypeDestination() {
        return this.getTypeOrigineOuDest(this.getDestination());
    }

    getNum(origineOuDest) {
        let numOrigineOuDest;
        if (origineOuDest.length === 4) {
            numOrigineOuDest = parseInt(origineOuDest.slice(3, 4));
        } else {
            numOrigineOuDest = null;
        }
        return numOrigineOuDest;
    }

    getNumOrigine() {
        return this.getNum(this.origine);
    }

    getNumDestination() {
        return this.getNum(this.destination);
    }

    isEquivalent(coup) {
        return (this.carte.isEquivalent(coup.carte) && this.origine === coup.origine && this.destination === coup.destination);
    }

    toString() {
        let carte = " pas de carte";
        if (typeof this.carte !== 'undefined') {
            carte = this.carte.getNom();
        }
        return "Coup : " + carte + " de " + this.origine + " vers " + this.destination;
    }

    // evalue le nombre de cartes deplacables selon la colonne jouée
    // (sans tenir compte des cartes dans la colonne jouée)
    evalueNombreDeCartesDeplacablesSelonColonneJouee(partie) {
        let casesLibres = partie.getNbCasesLibres();
        console.log("casesLibres : " + casesLibres);
        let nbCartesDeplacables = casesLibres;
        let nbColonnesLibresHorsDeplacement = partie.getNbColonnesVides();
        console.log("nbColonnesLibresHorsDeplacement : " + nbColonnesLibresHorsDeplacement);
        if (this.getTypeOrigine() === "COL") {
            let isCarteDeplaceeSurColonneVide = partie.getColonne(this.getNumOrigine()) === null;
            console.log("isCarteDeplaceeSurColonneVide : " + isCarteDeplaceeSurColonneVide);
            if (isCarteDeplaceeSurColonneVide) {
                nbColonnesLibresHorsDeplacement--;
            }
            console.log('nbColonnesLibresHorsDeplacement : ' + nbColonnesLibresHorsDeplacement);
            let compteurColonnes = 1;
            while (compteurColonnes <= nbColonnesLibresHorsDeplacement) {
                nbCartesDeplacables += nbCartesDeplacables + compteurColonnes;
                compteurColonnes++;
            }
            nbCartesDeplacables++;
        }
        return nbCartesDeplacables;
    }

    recupPileCartesJouees(partie, enleverVraimentLEsCartesDeLaColonne) {

        let pileCartesJouees = new PileDeCartes();
        if (this.carte == null)
            return pileCartesJouees;
        if (this.getTypeOrigine() !== "COL") {
            return pileCartesJouees;
        }
        let carteParcourue;
        let n = 1;
        console.log("Coup.js - recupePileCartesJouees - carte jouée : " + this.carte.getNom());
        do {
            carteParcourue = partie.getColonne(this.getNumOrigine()).prendCarte();
            pileCartesJouees.ajouteCarte(carteParcourue);
            if (typeof (pileCartesJouees.getCarte()) !== 'undefined') {
                console.debug("Carte " + n + " : ajoutée " + carteParcourue.getNom() + "colonnes " + this.getNumOrigine());
            }
            n++;
        }
        while (typeof carteParcourue !== 'undefined' && !carteParcourue.isEquivalent(this.carte) && n < 50)

        if (!enleverVraimentLEsCartesDeLaColonne) {
            for (let i = pileCartesJouees.getNbCartes()-1; i >=0 ; i--) {
                partie.getColonne(this.getNumOrigine()).ajouteCarte(pileCartesJouees.getCarteN(i));
            }
        }
        return pileCartesJouees;
    }

    controleCarteJoueeEtOrigine(partie) {
        if (this.carte == null || this.origine.length < 4) {
            return false;
        }

        if (this.getTypeOrigine() === "COL") {
            if (!partie.getColonne(this.getNumOrigine()).contientCarte(this.carte)) {
                return false;
            }
            console.debug("Carte jouée : " + this.carte.getNom() + "colonnes " + this.getNumOrigine());
        }
        if (this.getTypeOrigine() ===  "CEL") {
            let carteJouee = partie.getCaseLibre(this.getNumOrigine()).getCarte();
            if (!this.carte.isEquivalent(carteJouee)) {
                return false;
            }
            console.log("Carte jouée : " + carteJouee.getNom() + "cellule " + this.getNumOrigine());
        }
        return (partie.isCarteCliquable(this.carte));
    }

    coupValable(partie) {
        // on controle deja la validité de la carte jouée et l'origine
        if (!this.controleCarteJoueeEtOrigine(partie)) {
            return false;
        }
        let destination = this.destination.slice(0, 3);
        let carteDestination;
        let numeroDest = parseInt(this.destination.slice(3, 4));

        // Si la destination est une colonne, on récupère la colonne visée
        switch (destination) {
            case "COL" :
                carteDestination = partie.getColonne(numeroDest).getCarte();
                // Si la carte peut se poser sur l'autre carte, le coup est valide
                return (this.carte.peutPoserSur(carteDestination) &&
                    this.evalueNombreDeCartesDeplacablesSelonColonneJouee(partie) >= this.recupPileCartesJouees(partie,false).getNbCartes());

            // Si la destination est une cellule, on récupère la cellule visée
            case "CEL":
                carteDestination = partie.getCaseLibre(numeroDest).getCarte();
                // Si la carte peut se poser sur l'autre carte, le coup est valide
                return this.carte.peutPoserSur(carteDestination);
            //            colonneDestination = partie.getCellule(this.destination.slice(3, 4));
            // Si la carte peut se poser sur l'autre carte, le coup est valide
            //          return carteJouee.peutPoserSur(colonneDestination.getCarte());
            case "PIL" :
                // On vérifie que la carte est une carte de la couleur de la pile
                let couleurPile = this.carte.getCouleurParNumero(numeroDest);
                console.log("Couleur de la pile : " + couleurPile + " carte jouée : " + this.carte.getNom() + "numero pile : " + numeroDest);
                if (this.carte.getCouleur() !== couleurPile) {
                    console.log("Refus du coup : couleur attendue : " + this.carte.getCouleur());
                    return false;
                }
                // Si la pile est vide, on vérifie que la carte est un 1
                if (partie.getPile(numeroDest).estVide()) {
                    console.log("Pile vide");
                    return this.carte.getValeur() === 1;
                }
                // Si la pile n'est pas vide, on vérifie que la carte est la suivante de la carte du dessus de la pile.
                return (this.carte.getValeur() === partie.getPile(numeroDest).getCarte().getValeur() + 1);
        }
    }

    jouer(partie) {
        if (!this.coupValable(partie)) {
            console.log("Coup.js - jouer - Coup invalide !!!");
            return;
        }
        let carteJouee = this.carte;
        console.log("Coups.js - jouer - ! ! ! ! ! ! ! ! Coup joué : carte " + this.carte.getNom() + " de " + this.getOrigine() + " vers " + this.getDestination());
        let pileCartesJouees = new PileDeCartes();

        if (this.getTypeOrigine() === "COL") {
            pileCartesJouees = this.recupPileCartesJouees(partie, true);
            console.log("Coups.js - jouer - Carte jouée : " + carteJouee.getNom() + "colonne " + this.origine);
        }
        if (this.getTypeOrigine() === "CEL") {
            pileCartesJouees.ajouteCarte(partie.getCaseLibre(this.getNumOrigine()).prendCarte());
            console.log("Coups.js - jouer - Carte jouée : " + carteJouee + "cellule " + this.getNumOrigine());
        }
        if (this.getTypeDestination() === "COL") {
            console.log(("Coups.js - jouer - ajout des cartes"));
            while (!pileCartesJouees.estVide()) {
                partie.getColonne(this.getNumDestination()).ajouteCarte(pileCartesJouees.prendCarte());
            }
            console.log("Coups.js - jouer - Carte " + carteJouee.getNom() + " posée sur la colonnes " + this.getNumDestination());
        }
        if (this.getTypeDestination() === "CEL") {
            partie.getCaseLibre(this.getNumDestination()).poseCarte(pileCartesJouees.prendCarte());
            console.log("Coups.js - jouer - Carte " + carteJouee.getNom() + " posée sur la cellule " + this.getNumDestination());
        }
        if (this.getTypeDestination() === "PIL") {
            partie.getPile(this.getNumDestination()).ajouteCarte(pileCartesJouees.prendCarte());
            console.log("Coups.js - jouer - Carte " + carteJouee.getNom() + " posée sur la pile " + this.getNumDestination());
        }
        partie.listeDesCoups.addCoup(this);
    }

    annuler(partie) {
        let elementDest = this.destination.slice(0, 3);
        let numeroDest = this.destination.slice(3, 4);
        // Si la carte est arrivée dans une colonne, on la reprend dans la colonne

        switch (elementDest) {
            case "COL" :
                this.carte = partie.getColonne(numeroDest).prendCarte();
                break;
            case "CEL":
                this.carte = partie.getCaseLibre(numeroDest).prendCarte();
                break;
            case "PIL" :
                this.carte = partie.getPile(numeroDest).prendCarte();
                break;
        }

        let elementOrigine = this.getTypeOrigine();
        let numeroOrigine = this.getNumOrigine();

        // Si la carte vient d'une colonne, on la remet dans la colonne
        switch (elementOrigine) {
            case "COL" :
                partie.getColonne(numeroOrigine).ajouteCarte(this.carte);
                break;
            case  "CEL" :
                partie.getCaseLibre(numeroOrigine).poseCarte(this.carte);
                break;
            case "PIL":
                partie.getPile(numeroOrigine).ajouteCarte(this.carte);
                break;
        }
    }

}
