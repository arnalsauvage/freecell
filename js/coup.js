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

    shortDesc() {
        return this.carte.getNomCourtTxt() + "-" + this.origine + "-" + this.destination;
    }


    // evalue le nombre de cartes deplacables selon la colonne jouée
    // (sans tenir compte des cartes dans la colonne jouée)
    evalueNombreDeCartesDeplacablesSelonColonneJouee(partie) {
        let casesLibres = partie.getNbCasesLibres();
        console.log("Coup.js - evalueNombreDeCartesDeplacablesSelonColonneJouee - casesLibres : " + casesLibres);
        let nbCartesDeplacables = casesLibres;
        let nbColonnesLibresHorsDeplacement = partie.getNbColonnesVides();
        console.log("Coup.js - evalueNombreDeCartesDeplacablesSelonColonneJouee - nbColonnesLibresHorsDeplacement : " + nbColonnesLibresHorsDeplacement);
        if (this.getTypeOrigine() === "COL") {
            let isCarteDeplaceeSurColonneVide = partie.getColonne(this.getNumOrigine()) === null;
            console.log("Coup.js - evalueNombreDeCartesDeplacablesSelonColonneJouee - isCarteDeplaceeSurColonneVide : " + isCarteDeplaceeSurColonneVide);
            if (isCarteDeplaceeSurColonneVide) {
                nbColonnesLibresHorsDeplacement--;
            }
            console.log('Coup.js - evalueNombreDeCartesDeplacablesSelonColonneJouee - nbColonnesLibresHorsDeplacement : ' + nbColonnesLibresHorsDeplacement);
            let compteurColonnes = 1;
            while (compteurColonnes <= nbColonnesLibresHorsDeplacement) {
                nbCartesDeplacables += nbCartesDeplacables + compteurColonnes;
                compteurColonnes++;
            }
            nbCartesDeplacables++;
        }
        return nbCartesDeplacables;
    }

    // La méthode prend sur la colonne passe en parametre, la piles des cartes
    // jusqu'à la carte this.carte, un booléen indique si on enlève les cartes de la colonne.
    recupPileCartesJouees(partie, numeroColonne, enleverVraimentLEsCartesDeLaColonne) {
        let pileCartesJouees = new PileDeCartes();
        if (this.carte == null)
            return pileCartesJouees;
        let nombreDeCartesDansColonne = partie.getColonne(numeroColonne).getNbCartes();
        let carteParcourue;
        let n = 1;
        console.log("Coup.js - recupePileCartesJouees - carte jouée : " + this.carte.getNom() + ", colonne " + numeroColonne);
        do {
            console.debug("Coup.js - recupePileCartesJouees - N " + n + " et nbCartes :  " + nombreDeCartesDansColonne + ", colonne " + numeroColonne);
            if (enleverVraimentLEsCartesDeLaColonne) {
                carteParcourue = partie.getColonne(numeroColonne).prendCarte();
                console.debug("Coup.js - recupePileCartesJouees - Carte " + n + " : prise " + carteParcourue.getNom() + " colonne " + numeroColonne);
            } else {
                carteParcourue = partie.getColonne(numeroColonne).getCarteN(nombreDeCartesDansColonne - n);
                console.debug("Coup.js - recupePileCartesJouees - Carte " + n + " : copiée " + carteParcourue.getNom() + " colonne " + numeroColonne);
            }
            pileCartesJouees.ajouteCarte(carteParcourue);
            if (typeof (pileCartesJouees.getCarte()) !== 'undefined') {
                console.debug("Coup.js - recupePileCartesJouees - Carte " + n + " : ajoutée " + carteParcourue.getNom() + " colonne " + numeroColonne);
            }
            n++;
        }
        while (typeof carteParcourue !== 'undefined' && !carteParcourue.isEquivalent(this.carte) && n < 50)

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
            console.debug("Coup.js - controleCarteJoueeEtOrigine - Carte jouée : " + this.carte.getNom() + "colonnes " + this.getNumOrigine());
        }
        if (this.getTypeOrigine() === "CEL") {
            let carteJouee = partie.getCaseLibre(this.getNumOrigine()).getCarte();
            if (!this.carte.isEquivalent(carteJouee)) {
                return false;
            }
            console.log("Coup.js - controleCarteJoueeEtOrigineCarte jouée : " + carteJouee.getNom() + "cellule " + this.getNumOrigine());
        }
        return (partie.isCarteCliquable(this.carte));
    }

    coupValable(partie) {
        // on controle deja la validité de la carte jouée et l'origine
        if (!this.controleCarteJoueeEtOrigine(partie)) {
            return false;
        }
        let typeDestination = this.getTypeDestination();
        let carteDestination;
        let numeroDest = this.getNumDestination();

        let UneSeuleCarteEstBougee =  this.getTypeOrigine()=="COL" && partie.getColonne(this.getNumOrigine()).getCarte().isEquivalent(this.carte) ;

        // Si la destination est une colonne, on récupère la colonne visée
        switch (typeDestination) {
            case "COL" :
                carteDestination = partie.getColonne(numeroDest).getCarte();
                // Si la carte peut se poser sur l'autre carte, le coup est valide
                if (this.getTypeOrigine() === "CEL") {
                    return (this.carte.peutPoserSur(carteDestination));
                }
                if (this.getTypeOrigine() === "COL") {
                    if (UneSeuleCarteEstBougee) {
                        return (this.carte.peutPoserSur(carteDestination));
                    } else {
                        let nbCartesDeplaceesOk = this.evalueNombreDeCartesDeplacablesSelonColonneJouee(partie) >= this.recupPileCartesJouees(partie, this.getNumOrigine(), false).getNbCartes();
                        let cartePeutSePoserSur = this.carte.peutPoserSur(carteDestination);
                        return (nbCartesDeplaceesOk && cartePeutSePoserSur);
                    }
                }
            // Si la destination est une cellule,
            case "CEL":
                // Si une seule carte bougée, c'est ok si la case est libre
                if (UneSeuleCarteEstBougee) {
                    return (partie.getCaseLibre(numeroDest).getCarte()==null);
                }
                // Sinon ce n'est pas possible
                else {
                    return false;
                }
            //            colonneDestination = partie.getCellule(this.destination.slice(3, 4));
            // Si la carte peut se poser sur l'autre carte, le coup est valide
            //          return carteJouee.peutPoserSur(colonneDestination.getCarte());
            case "PIL" :
                // Si plusieurs cartes sont sélectionnées, ça ne marche pas
                if (!partie.getColonne(this.getNumOrigine()).getCarte().isEquivalent(this.carte) && this.getTypeOrigine()=="COL") {
                    return false;
                }
                // Si la carte jouee n'est pas de la couleur de la pile, c'est refusé
                let couleurPile = this.carte.getCouleurParNumero(numeroDest);
                console.log("Coup.js - coupValable - Couleur de la pile : " + couleurPile + " carte jouée : " + this.carte.getNom() + "numero pile : " + numeroDest);
                if (this.carte.getCouleur() !== couleurPile) {
                    console.log("Coup.js - coupValable - Refus du coup : couleur attendue : " + this.carte.getCouleur());
                    return false;
                }
                // Si la pile est vide, on vérifie que la carte est un 1
                if (partie.getPile(numeroDest).estVide()) {
                    console.log("Coup.js - coupValable - Pile vide");
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
            pileCartesJouees = this.recupPileCartesJouees(partie, this.getNumOrigine(), true);
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
        let elementDest = this.getTypeDestination();
        let numeroDest = this.getNumDestination();

        let elementOrigine = this.getTypeOrigine();
        let numeroOrigine = this.getNumOrigine();

        // Si le coup était colonne vers colonne
        // Si la carte n'est pas en bas de la colonne DEST,
        // Alors il s'agit d'un déplacement multiple.
        if (elementOrigine === "COL" && elementDest === "COL" && !partie.getColonne(numeroDest).getCarte().isEquivalent(this.getCarte())) {
            console.log("Coups.js - annuler - Cartes multiples de col à col ");
            let pileDeCartes = this.recupPileCartesJouees(partie, numeroDest, true);
            do {

                console.log("Coups.js - annuler - ajout carte  " + pileDeCartes.getCarte());
                partie.getColonne(numeroOrigine).ajouteCarte(pileDeCartes.prendCarte());
            }
            while (!pileDeCartes.estVide());
            return;
        }


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
