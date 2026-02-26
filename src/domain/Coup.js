import { PileDeCartes } from './PileDeCartes.js';
import { TYPES_PILE } from './Position.js';

export class Coup {
    constructor(carte, origine, destination) {
        this.carte = carte;
        this.origine = origine; // String format: "COL1", "CEL2", etc.
        this.destination = destination;
    }

    getCarte() { return this.carte; }
    getOrigine() { return this.origine; }
    getDestination() { return this.destination; }

    getType(str) { return str.slice(0, 3); }
    getNum(str) { return parseInt(str.slice(3, 4)); }

    getTypeOrigine() { return this.getType(this.origine); }
    getTypeDestination() { return this.getType(this.destination); }
    getNumOrigine() { return this.getNum(this.origine); }
    getNumDestination() { return this.getNum(this.destination); }

    toString() {
        return `Coup : ${this.carte?.getNom() || 'Inconnue'} de ${this.origine} vers ${this.destination}`;
    }

    jouer(partie) {
        if (!this.estValide(partie)) {
            console.warn(`Coup invalide : ${this.toString()}`);
            return false;
        }

        const pileCartesJouees = this.extraireCartes(partie);
        this.deposerCartes(partie, pileCartesJouees);
        
        partie.listeDesCoups.addCoup(this);
        return true;
    }

    estValide(partie) {
        if (!this.carte || !this.origine || !this.destination) return false;
        if (!partie.isCarteCliquable(this.carte)) return false;

        const typeDest = this.getTypeDestination();
        const numDest = this.getNumDestination();

        switch (typeDest) {
            case TYPES_PILE.COLONNE:
                return this.validerVersColonne(partie, numDest);
            case TYPES_PILE.CELLULE:
                return this.validerVersCellule(partie, numDest);
            case TYPES_PILE.PILE:
                return this.validerVersPile(partie, numDest);
            default:
                return false;
        }
    }

    validerVersColonne(partie, numDest) {
        const colDest = partie.getColonne(numDest);
        const sommetDest = colDest.getCarte();
        
        if (this.getTypeOrigine() === TYPES_PILE.CELLULE) {
            return this.carte.peutPoserSur(sommetDest);
        }
        
        // Plusieurs cartes ?
        const pileA = this.extrairePileVirtuelle(partie, this.getNumOrigine(), false);
        const nbCartesABouger = pileA.getNbCartes();
        
        const estDestVide = colDest.getNbCartes() === 0;
        const nbDeplacables = this.compteDeplacables(partie, estDestVide);
        
        return nbCartesABouger <= nbDeplacables && this.carte.peutPoserSur(sommetDest);
    }

    validerVersCellule(partie, numDest) {
        const caseLibre = partie.getCaseLibre(numDest);
        const uneSeuleCarte = this.getTypeOrigine() === TYPES_PILE.CELLULE || 
                            partie.getColonne(this.getNumOrigine()).getCarte().isEquivalent(this.carte);
        return uneSeuleCarte && caseLibre.estLibre();
    }

    validerVersPile(partie, numDest) {
        const pile = partie.getPile(numDest);
        // Une seule carte à la fois vers la pile
        if (this.getTypeOrigine() === TYPES_PILE.COLONNE && !partie.getColonne(this.getNumOrigine()).getCarte().isEquivalent(this.carte)) {
            return false;
        }
        
        // Couleur et ordre
        if (this.carte.couleur !== ["P", "C", "K", "T"][numDest]) return false;
        if (pile.estVide()) return this.carte.valeur === 1;
        return this.carte.valeur === pile.getCarte().valeur + 1;
    }

    compteDeplacables(partie, destinationEstVide) {
        const casesLibres = partie.getNbCasesLibres();
        let colonnesVides = partie.getNbColonnesVides();
        
        if (destinationEstVide) {
            colonnesVides--;
        }

        return (casesLibres + 1) * Math.pow(2, colonnesVides);
    }

    extraireCartes(partie) {
        const pile = new PileDeCartes();
        if (this.getTypeOrigine() === TYPES_PILE.COLONNE) {
            return this.extrairePileVirtuelle(partie, this.getNumOrigine(), true);
        } else if (this.getTypeOrigine() === TYPES_PILE.CELLULE) {
            pile.ajouteCarte(partie.getCaseLibre(this.getNumOrigine()).prendCarte());
        }
        return pile;
    }

    extrairePileVirtuelle(partie, numCol, vraimentRetirer) {
        const pileSource = partie.getColonne(numCol);
        const result = new PileDeCartes();
        const temp = [];
        
        let found = false;
        while (!found && !pileSource.estVide()) {
            const c = pileSource.prendCarte();
            temp.push(c);
            if (c.isEquivalent(this.carte)) found = true;
        }

        // Pour que deposerCartes (qui fait des pop()) les pose dans le bon ordre
        for (let i = 0; i < temp.length; i++) {
            result.ajouteCarte(temp[i]);
        }

        if (!vraimentRetirer) {
            for (let i = temp.length - 1; i >= 0; i--) {
                pileSource.ajouteCarte(temp[i]);
            }
        }
        return result;
    }

    deposerCartes(partie, pile) {
        const typeDest = this.getTypeDestination();
        const numDest = this.getNumDestination();

        while (!pile.estVide()) {
            const c = pile.prendCarte();
            if (typeDest === TYPES_PILE.COLONNE) partie.getColonne(numDest).ajouteCarte(c);
            else if (typeDest === TYPES_PILE.CELLULE) partie.getCaseLibre(numDest).poseCarte(c);
            else if (typeDest === TYPES_PILE.PILE) partie.getPile(numDest).ajouteCarte(c);
        }
    }

    toPositionString(type, numPile, numCarte) {
        const prefix = { col: TYPES_PILE.COLONNE, pile: TYPES_PILE.PILE, case: TYPES_PILE.CELLULE }[type];
        const cardIndex = (type === 'col') ? numCarte : '';
        return `${prefix}${numPile}${cardIndex}`;
    }

    export() {
        return {
            v: this.carte.valeur,
            c: this.carte.couleur,
            o: this.origine,
            d: this.destination
        };
    }

    annuler(partie) {
        // Logique inverse : on reprend à la destination et on remet à l'origine
        // Version simplifiée (peut être plus complexe pour les déplacements multiples)
        const typeDest = this.getTypeDestination();
        const numDest = this.getNumDestination();
        const typeOrig = this.getTypeOrigine();
        const numOrig = this.getNumOrigine();

        let pileAAnnuler = new PileDeCartes();
        
        if (typeDest === TYPES_PILE.COLONNE) {
            pileAAnnuler = this.extrairePileVirtuelle(partie, numDest, true);
        } else if (typeDest === TYPES_PILE.CELLULE) {
            pileAAnnuler.ajouteCarte(partie.getCaseLibre(numDest).prendCarte());
        } else if (typeDest === TYPES_PILE.PILE) {
            pileAAnnuler.ajouteCarte(partie.getPile(numDest).prendCarte());
        }

        while (!pileAAnnuler.estVide()) {
            const c = pileAAnnuler.prendCarte();
            if (typeOrig === TYPES_PILE.COLONNE) partie.getColonne(numOrig).ajouteCarte(c);
            else if (typeOrig === TYPES_PILE.CELLULE) partie.getCaseLibre(numOrig).poseCarte(c);
        }
    }
}
