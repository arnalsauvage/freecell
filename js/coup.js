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

    setOrigine(origine) {
        // COL pour colonne , CEL pour cellule, PIL pour Pile

        if (origine==null){
            this.origine = "";
            return;
        }

        let trigramme = origine.slice(0, 3);
        switch (trigramme){
            case "COL":
                let numcol = origine.slice(3, 4);
                if (numcol > 0 && numcol < 9) {
                    this.origine = origine.slice(0, 4);
                }
                break;
            case "CEL":
                let numcel = origine.slice(3, 4);
                if (numcel > 0 && numcel < 5) {
                    this.origine = origine.slice(0, 4);
                }
                break;
            case "PIL":
                let numpil = origine.slice(3, 4);
                if (numpil > 0 && numpil < 5) {
                    this.origine = origine.slice(0, 4);
                }
                break;
            default:
                this.origine = "";
                break;
        }

    }

    setDestination(destination) {
        // COL pour colonne , CEL pour cellule, PIL pour Pile
        if (destination==null){
            this.destination = "";
            return;
        }
        switch (destination.slice(0, 3)) {
            case "COL":
                let numcol = destination.slice(3, 4);
                if (numcol > 0 && numcol < 9) {
                    this.destination = destination.slice(0, 4);
                }
                break;
            case "CEL":
                let numcel = destination.slice(3, 4);
                if (numcel > 0 && numcel < 5) {
                    this.destination = destination.slice(0, 4);

                }
                break;
            case "PIL":
                let numpil = destination.slice(3, 4);
                if (numpil > 0 && numpil < 5) {
                    this.destination = destination.slice(0, 4);
                }
                break;
            default:
                this.destination = "";
                break;
        }

    }

    getOrigine() {
        return this.origine;
    }

    getDestination() {
        return this.destination;
    }

    coupValable(partie) {
        let carteJouee = this.recupCarteJouee(partie);

        // Si la destination est une colonne, on récupère la colonne visée
        if (this.destination.slice(0, 3) == "COL") {
            let colonneDestination = this.destination.slice(3, 4);
            let carteDestination = partie.getColonne(colonneDestination).getCarte();

            // Si la carte peut se poser sur l'autre carte, le coup est valide

            return carteJouee.peutPoserSur(carteDestination);
        }

        // Si la destination est une cellule, on récupère la cellule visée
        if (this.destination.slice(0, 3) == "CEL") {
            let numeroCelluleDest = this.destination.slice(3, 4);
            let carteDestination = partie.getCaseLibre(numeroCelluleDest).getCarte();

            // Si la carte peut se poser sur l'autre carte, le coup est valide
            return carteJouee.peutPoserSur(carteDestination);

            //            colonneDestination = partie.getCellule(this.destination.slice(3, 4));
            // Si la carte peut se poser sur l'autre carte, le coup est valide
            //          return carteJouee.peutPoserSur(colonneDestination.getCarte());
        }

        // Si la destination est une pile
        if (this.destination.slice(0, 3) == "PIL") {
            let carte = new Carte("Coeur", "Roi");
            // On vérifie que la carte est une carte de la couleur de la pile
            let numeroPile = this.destination.slice(3, 4);
            let couleurPile = carte.getCouleurParNumero(parseInt(numeroPile));
            console.log("Couleur de la pile : " + couleurPile + " carte jouée : " + carteJouee.getNom() + "numero pile : " + numeroPile);
            if (carteJouee.getCouleur() != couleurPile) {
                console.log("Refus du coup : couleur attendue : " + carteJouee.getCouleur());
                return false;
            }
            // Si la pile est vide, on vérifie que la carte est un 1
            if (partie.getPile(this.destination.slice(3, 4)).estVide()) {
                console.log("Pile vide");
                return carteJouee.getValeur() == 1;
            }
            // Si la pile n'est pas vide, on vérifie que la carte est la suivante de la carte du dessus de la pile
            return carteJouee.getValeur() == partie.getPile(this.destination.slice(3, 4)).getCarte().getValeur() + 1;
        }
    }

    recupCarteJouee(partie) {
        let carteJouee = this.carte;
        this.carte = null;
        if (this.origine.slice(0, 3) == "COL") {
            let colonneOrigine = this.origine.slice(3, 4);
            if (partie.getColonne(colonneOrigine).estVide()) {
                console.log("Colonne vide");
                return null;
            }
            if (partie.getColonne(colonneOrigine).contientCarte(carteJouee) ) {
                this.carte = carteJouee;
                }
            console.debug("Carte jouée : " + carteJouee.getNom() + "colonne " + colonneOrigine);
        }
        if (this.origine.slice(0, 3) == "CEL") {
            let numeroCellule = this.origine.slice(3, 4);
            carteJouee = partie.getCaseLibre(numeroCellule).getCarte();
            if (this.carte.isEquivalent( carteJouee)){
                this.carte = carteJouee;
            }
            console.log("Carte jouée : " + carteJouee.getNom() + "cellule " + numeroCellule);
        }
        return this.carte;
    }

    jouer(partie) {
        if (this.coupValable(partie)) {
            let carteJouee = null;
            console.log("Coup joué : carte " + this.carte + " de " + this.getOrigine() + " vers " + this.getDestination());
            partie.listeDesCoups.addCoup(this);
            if (this.origine.slice(0, 3) == "COL") {
                let colonneOrigine = this.origine.slice(3, 4);
                carteJouee = partie.getColonne(colonneOrigine).prendCarte();
                console.log("Carte jouée : " + carteJouee);
            }
            if (this.origine.slice(0, 3) == "CEL") {
                let celluleOrigine = this.origine.slice(3, 4);
                carteJouee = partie.getCaseLibre(celluleOrigine).prendCarte();
                console.log("Carte jouée : " + carteJouee);
            }
            if (this.destination.slice(0, 3) == "COL") {
                let colonneDestination = this.destination.slice(3, 4);
                partie.getColonne(colonneDestination).ajouteCarte(carteJouee);
                console.log("Carte posée sur la colonne " + colonneDestination);
            }
            if (this.destination.slice(0, 3) == "CEL") {
                let celluleDestination = this.destination.slice(3, 4);
                partie.getCaseLibre(celluleDestination).poseCarte(carteJouee);
            }
            if (this.destination.slice(0, 3) == "PIL") {
                let pileDestination = this.destination.slice(3, 4);
                partie.getPile(pileDestination).ajouteCarte(carteJouee);
            }
            partie.verifieVictoire();
        }
    }

    annuler(partie) {
        // Si la carte vient d'une colonne, on la remet dans la colonne
        if (this.destination.slice(0, 3) == "COL") {
            this.carte = partie.getColonne(this.destination.slice(3, 4)).prendCarte();
        }
        // Si la carte vient d'une cellule, on la prend dans la cellule
        if (this.destination.slice(0, 3) == "CEL") {
            this.carte = partie.getCaseLibre(this.destination.slice(3, 4)).prendCarte();
        }
        // Si la carte vient d'une pile, on la prend dans la pile
        if (this.destination.slice(0, 3) == "PIL") {
            this.carte = partie.getPile(this.destination.slice(3, 4)).prendCarte();
        }
        // Si la carte vient d'une colonne, on la remet dans la colonne
        if (this.origine.slice(0, 3) == "COL") {
            partie.getColonne(this.origine.slice(3, 4)).ajouteCarte(this.carte);
        }
        // Si la carte vient d'une cellule, on la remet dans la cellule
        if (this.origine.slice(0, 3) == "CEL") {
            partie.getCaseLibre(this.origine.slice(3, 4)).poseCarte(this.carte);
        }
        // Si la carte vient d'une pile, on la remet dans la pile
        if (this.origine.slice(0, 3) == "PIL") {
            partie.getPile(this.origine.slice(3, 4)).ajouteCarte(this.carte);
        }
    }

}
