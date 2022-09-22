class Coup {

    constructor(carte, origine, destination) {
        this.setCarte(carte);
        this.setOrigine(origine);
        this.setDestination(destination);
        this.log = 4; // 1 : debug , 2: info, 3 : warning , 4 : error
    }

    setCarte(carte) {
        this.carte = carte;
    }

    getCarte() {
        return this.carte;
    }

    setOrigine(origine) {
        // COL pour colonne , CEL pour cellule, PIL pour Pile
        this.origine = "";
        if (this.origine.slice(0, 3) == "COL") {
            let numcol = this.origine.slice(3, 4);
            if (numcol > 0 && numcol < 9) {
                this.origine = this.origine.slice(0, 4);
            }
        }

        if (this.origine.slice(0, 3) == "CEL") {
            let numcel = this.origine.slice(3, 4);
            if (numcel > 0 && numcel < 5) {
                this.origine = this.origine.slice(0, 4);
            }
        }
    }

    setDestination(destination) {
        // COL pour colonne , CEL pour cellule, PIL pour Pile   
        this.destination = "";
        if (this.destination.slice(0, 3) == "COL") {
            let numcol = this.destination.slice(3, 4);
            if (numcol > 0 && numcol < 9) {
                this.destination = this.destination.slice(0, 4);
                return true;
            }
        }

        if (this.destination.slice(0, 3) == "CEL") {
            let numcel = this.destination.slice(3, 4);
            if (numcel > 0 && numcel < 5) {
                this.destination = this.destination.slice(0, 4);
                return true;
            }
        }

        if (this.destination.slice(0, 3) == "PIL") {
            let numpil = this.destination.slice(3, 4);
            if (numpil > 0 && numpil < 5) {
                this.destination = this.destination.slice(0, 4);
                return true;
            }
        }
        return false;
    }

    getOrigine() {
        return this.origine;
    }

    getDestination() {
        return this.destination;
    }

    coupValable(partie) {
        let carteJouee = null;

        if (this.origine.slice(0, 3) == "COL") {
            let colonneOrigine = this.origine.slice(3, 4);
            carteJouee = partie.getColonne(colonneOrigine).getCarte();
            this.carte = carteJouee;
            console.log("Carte jouée : " + carteJouee.getNom() + "colonne " + colonneOrigine);
        }
        if (this.origine.slice(0, 3) == "CEL") {
            let numeroCellule = this.origine.slice(3, 4);
            carteJouee = partie.getCaseLibre(numeroCellule).getCarte();
            this.carte = carteJouee;
            console.log("Carte jouée : " + carteJouee.getNom() + "cellule " + numeroCellule);
        }
        if (carteJouee == null) {
            console.log("Pas de carte à jouer");
            return false;
        }

        let colonneDestination = null;

        // Si la destination est une colonne, on récupère la colonne visée
        if (this.destination.slice(0, 3) == "COL") {
            colonneDestination = this.destination.slice(3, 4);
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
            console.log("Couleur attendue : " + carteJouee.getCouleur());
            if (carteJouee.getCouleur() != couleurPile) {
                return false;
            }

            if (carteJouee.getCouleur() == this.destination.slice(3, 4)) {

                // Si la pile est vide, on vérifie que la carte est un 1
                if (partie.getPile(this.destination.slice(3, 4)).estVide()) {
                    return carteJouee.getValeur() == 1;
                }
                // Si la pile n'est pas vide, on vérifie que la carte est la suivante de la carte du dessus de la pile
                return carteJouee.getValeur() == partie.getPile(this.destination.slice(3, 4)).getCarte().getValeur() + 1;
            }
        }
    }

    annuler(partie) {
        let carte;

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

    jouer(partie) {
        if (this.coupValable(partie)) {
            let carteJouee = null;
            partie.listeDesCoups.addCoup(this);
            console.log("Coup joué : carte " + this.carte + " de " + this.getOrigine() + " vers " + this.getDestination());
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
}