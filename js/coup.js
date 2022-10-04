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

    setDestination(destination) {
        // COL pour colonnes, CEL pour cellule, PIL pour Pile
        this.destination = this.verifieOrigineDest(destination);
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

    getOrigine() {
        return this.origine;
    }

    getDestination() {
        return this.destination;
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
                return this.carte.peutPoserSur(carteDestination);

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

    controleCarteJoueeEtOrigine(partie) {
        if (this.carte == null || this.origine.length < 4) {
            return false;
        }
        if (this.origine.slice(0, 3) === "COL") {
            let colonneOrigine = this.origine.slice(3, 4);
            if (!partie.getColonne(colonneOrigine).contientCarte(this.carte)) {
                return false;
            }
            console.debug("Carte jouée : " + this.carte.getNom() + "colonnes " + colonneOrigine);
        }
        if (this.origine.slice(0, 3) === "CEL") {
            let numeroCellule = this.origine.slice(3, 4);
            let carteJouee = partie.getCaseLibre(numeroCellule).getCarte();
            if (!this.carte.isEquivalent(carteJouee)) {
                return false;
            }
            console.log("Carte jouée : " + carteJouee.getNom() + "cellule " + numeroCellule);
        }
        return (partie.isCarteCliquable(this.carte));
    }

    jouer(partie) {
        if (!this.coupValable(partie)) {
            console.log("Coup invalide !!!");
            return;
        }

        let carteJouee = this.carte;
        console.log("! ! ! ! ! ! ! ! Coup joué : carte " + this.carte.getNom() + " de " + this.getOrigine() + " vers " + this.getDestination());
        partie.listeDesCoups.addCoup(this);
        let pileCartesJouees = new PileDeCartes();

        if (this.origine.slice(0, 3) === "COL") {
            let colonneOrigine = this.origine.slice(3, 4);
            pileCartesJouees = this.recupPileCartesJouees(partie, colonneOrigine);

            console.log("Carte jouée : " + carteJouee.getNom() + "colonnes " + colonneOrigine);
        }
        if (this.origine.slice(0, 3) === "CEL") {
            let celluleOrigine = this.origine.slice(3, 4);
            pileCartesJouees.ajouteCarte(partie.getCaseLibre(celluleOrigine).prendCarte());
            console.log("Carte jouée : " + carteJouee + "cellule " + celluleOrigine);
        }
        if (this.destination.slice(0, 3) === "COL") {
            let colonneDestination = this.destination.slice(3, 4);
            while (!pileCartesJouees.estVide()) {
                partie.getColonne(colonneDestination).ajouteCarte(pileCartesJouees.prendCarte());
            }
            console.log("Carte " + carteJouee.getNom() + " posée sur la colonnes " + colonneDestination);
        }
        if (this.destination.slice(0, 3) === "CEL") {
            let celluleDestination = this.destination.slice(3, 4);
            partie.getCaseLibre(celluleDestination).poseCarte(pileCartesJouees.prendCarte());
            console.log("Carte " + carteJouee.getNom() + " posée sur la cellule " + celluleDestination);
        }
        if (this.destination.slice(0, 3) === "PIL") {
            let pileDestination = this.destination.slice(3, 4);
            partie.getPile(pileDestination).ajouteCarte(pileCartesJouees.prendCarte());
            console.log("Carte " + carteJouee.getNom() + " posée sur la pile " + pileDestination);
        }

    }

    recupPileCartesJouees(partie, colonneOrigine) {
        // TODO ici on va gérer s'il y a plusieurs cartes
        let n = 1;
        let pileCartesJouees = new PileDeCartes();
        do {
            pileCartesJouees.ajouteCarte(partie.getColonne(colonneOrigine).prendCarte());
            if (typeof (pileCartesJouees.getCarte()) !== 'undefined') {
                console.debug("Carte " + n + " : ajoutée " + pileCartesJouees.getCarte().getNom() + "colonnes " + colonneOrigine);
            }
            n++;
        }
        while (!pileCartesJouees.getCarte().isEquivalent(this.carte) && n < 50)
        return pileCartesJouees;
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

        let elementOrigine = this.origine.slice(0, 3);
        let numeroOrigine = this.origine.slice(3, 4);

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

    isEquivalent(coup) {
        return this.carte.isEquivalent(coup.carte) && this.origine === coup.origine && this.destination === coup.destination;
    }

    toString() {
        let carte = " pas de carte";
        if (typeof this.carte !== 'undefined') {
            carte = this.carte.getNom();
        }
        return "Coup : " + carte + " de " + this.origine + " vers " + this.destination;
    }
}
