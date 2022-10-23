
class Partie {

    // Carte disparue ? partie.colonnes[2].ajouteCarte(new Carte(4,"C"))

    constructor() {

        this.coup = new Coup();
        this.listeDesCoups = new ListeCoups();

        this.colonnes = [];
        this.colonnes[1] = new PileDeCartes();
        this.colonnes[2] = new PileDeCartes();
        this.colonnes[3] = new PileDeCartes();
        this.colonnes[4] = new PileDeCartes();
        this.colonnes[5] = new PileDeCartes();
        this.colonnes[6] = new PileDeCartes();
        this.colonnes[7] = new PileDeCartes();
        this.colonnes[8] = new PileDeCartes();

        this.pileDePique = new PileDeCouleur("P");
        this.pileDeTrefle = new PileDeCouleur("T");
        this.pileDeCoeur = new PileDeCouleur("C");
        this.pileDeCarreau = new PileDeCouleur("K");
        this.pile = [];
        this.pile[1] = this.pileDePique;
        this.pile[2] = this.pileDeCoeur;
        this.pile[3] = this.pileDeCarreau;
        this.pile[4] = this.pileDeTrefle;

        this.casesLibres = [];
        this.casesLibres[1] = new CaseLibre();
        this.casesLibres[2] = new CaseLibre();
        this.casesLibres[3] = new CaseLibre();
        this.casesLibres[4] = new CaseLibre();
    }

    distribue(melanger = true) {
        let jeu52cartes = new JeuDeCartes();
        if (melanger) {
            jeu52cartes.melanger();
        }
        this.distribueColonne(jeu52cartes, this.colonnes[1], 7);
        this.distribueColonne(jeu52cartes, this.colonnes[2], 7);
        this.distribueColonne(jeu52cartes, this.colonnes[3], 7);
        this.distribueColonne(jeu52cartes, this.colonnes[4], 7);
        this.distribueColonne(jeu52cartes, this.colonnes[5], 6);
        this.distribueColonne(jeu52cartes, this.colonnes[6], 6);
        this.distribueColonne(jeu52cartes, this.colonnes[7], 6);
        this.distribueColonne(jeu52cartes, this.colonnes[8], 6);
    }

    distribueColonne(jeu, colonne, nombre) {
        for (let i = 1; i <= nombre; i++) {
            colonne.ajouteCarte(jeu.prendCarte());
        }
    }

    getColonne(numero) {
        if (numero >= 1 && numero < 9) {
            return this.colonnes[numero];
        }
        return null;
    }

    getPile(numero) {
        if (numero >= 1 && numero < 5) {
            return this.pile[numero];
        }
        return null;
    }

    getCaseLibre(numero) {
        if (numero >= 1 && numero < 5) {
            return this.casesLibres[numero];
        }
        return null;
    }

    getNbCasesLibres() {
        let nbCasesLibres = 4;
        for (let i = 1; i < 5; i++) {
            if (this.casesLibres[i].getCarte() !== null) {
                nbCasesLibres--;
            }
        }
        return nbCasesLibres;
    }

    getNbColonnesVides() {
        let nbColonnesVides = 0;
        for (let i = 1; i <= 8; i++) {
            if (this.colonnes[i].getNbCartes() === 0) {
                nbColonnesVides++;
            }
        }
        return nbColonnesVides;
    }

    // trouve la pile de la meme couleur que la carte
    getPileCouleurCarte(carte) {
        let pile = null;
        for (let i = 1; i <= 4; i++) {
            pile = this.getPile(i);
            if (pile.getCouleur() === carte.couleur) {
                console.log("pile de couleur " + carte.couleur + " trouvee");
                return i;
            }
        }
        console.log("pas de pile de couleur " + carte.couleur);
        return null;
    }

    // Une carte est cliquable si elle est dans une cellule
    // Si elle est dans une colonne, tout en bas de la colonne
    // ou si elle s'enchaine avec des alternances de couleur et de valeur.

    isCarteCliquable(carteAjuger) {

        if (carteAjuger == null) {
            console.warn("Partie.js - isCarteCliquable - carte a juger null");
            return false;
        }
        console.debug("Partie.js - isCarteCliquable - carte a juger " + carteAjuger.getNom());
        let position = new Position(this.chercheCarte(carteAjuger));
        if (position == null) {
            console.warn("Partie.js -  isCarteCliquable - carte a juger non trouvee");
            return false;
        }

        switch (position.getPile()) {
            case "COL" :
                // si la carte est dans une colonne, elle est cliquable si elle est en bas de la colonne
                let colonne = this.getColonne(position.getNumero());
                if (colonne.getCarte() === carteAjuger) {
                    console.debug("Partie.js - isCarteCliquable -  carte a juger en bas de la colonnes" + position.getNumero());
                    return true;
                }
                // Sinon s'il y a une alternance de couleur et de valeur
                console.debug("Partie.js - isCarteCliquable - carte a juger en colonne " + position.getNumero());
                let cartesCliquablesColonne = this.cartesCliquablesColonne(colonne);
                if (cartesCliquablesColonne.contientCarte(carteAjuger)) {
                    console.debug("Partie.js - isCarteCliquable ------------- carte a juger ok dans la col  " + position.getNumero());
                    return true;
                }

                break;
            case "CEL" :
                /*
                // TODO a bouger dans fonction isMagicCliquable
                if (this.cartePeutMonterDansLaPile(carteAjuger)) {
                    console.debug("Partie.js -  isCarteCliquable - carte a juger peut monter dans la pile");
                    return true;
                }
                if (this.cartePeutMonterSurUneColonne(carteAjuger)) {
                    console.debug("Partie.js -  isCarteCliquable - carte a juger peut monter dans une colonne");
                    return true;
                }
                console.debug("Partie.js - isCarteCliquable -  carte a juger ne peut pas monter dans une colonne ou dans une pile");
                return true;
*/
                return true;
                break;
        }

        return  false;
    }

    cartePeutMonterSurUneColonne(carte) {
        console.debug("carte peut monter sur une colonne ? " + carte.valeur + " " + carte.couleur);
        for (let i = 1; i <= 8; i++) {
            let colonne = this.getColonne(i);
            if (colonne.getCarte() == null || carte.peutPoserSur(colonne.getCarte())) {
                return i;
            }
        }
        return 0;
    }

    cartePeutMonterDansLaPile(carte) {
        let indexMaPile = this.getPileCouleurCarte(carte);
        let clickMagiqueOk = true;
        // Si on n'a pas l'index de la pile, c'est loupé !
        if (indexMaPile == null) {
            clickMagiqueOk = false;
        }
        // Si la pile est vide, et qu'on n'a pas un as, c'est loupé !
        if (this.getPile(indexMaPile).getNbCartes() === 0) {
            if (carte.valeur !== 1) {
                clickMagiqueOk = false;
            }
        } else
            // Si la pile n'est pas vide, et que la carte n'est pas la suivante, c'est loupé !
        if (carte.valeur !== this.getPile(indexMaPile).getCarte().valeur + 1) {
            clickMagiqueOk = false;
        }
        return clickMagiqueOk;
    }

    arriere() {
        let coup = this.listeDesCoups.deleteLastCoup();
        coup.annuler(this);
    }

    verifieVictoire() {
        let victoire = true;
        for (let i = 1; i <= 4; i++) {
            let pile = this.getPile(i);
            {
                if (pile.getNbCartes() !== 13) {
                    victoire = false;
                    console.log("Pile " + i + " non complète");
                }
            }
        }
        return victoire;
    }

    demarrePartie() {
        this.distribue();
    }

// On compte les cases libres piles et colonnes
    compteCasesLibres() {
        let nbCasesLibres = 0;
        for (let i = 1; i <= 4; i++) {
            let caseLibre = this.getCaseLibre(i);
            if (caseLibre.getCarte() == null) {
                nbCasesLibres++;
            }
        }
        for (let i = 1; i <= 8; i++) {
            let colonne = this.getColonne(i);
            if (colonne.getNbCartes() === 0) {
                nbCasesLibres++;
            }
        }
        return nbCasesLibres;
    }

    chercheCarte(carte) {
        console.log("- Partie.js -- chercheCarte  " + carte.getNom());
        let trouve = false;
        let colonne = 1;
        let retourRecherche = null;
        while (!trouve && colonne <= 8) {
            retourRecherche = this.chercheDansColonne(carte, colonne);
            colonne++;
            if (retourRecherche !== -1) {
                console.log("Trouvé COL" + (colonne - 1) + " " + (retourRecherche));
                trouve = true;
                return "COL" + (colonne - 1) + (retourRecherche);
            }
        }
        let i = 1;
        while (!trouve && i <= 4) {
            let pile = this.getPile(i);
            if (pile.getCarte() === carte) {
                trouve = true;
            }
            i++;
        }
        if (trouve) {
            return "PIL" + i;
        }
        i = 1;
        while (!trouve && i <= 4) {
            let caseLibre = this.getCaseLibre(i);
            if (caseLibre.getCarte() === carte) {
                trouve = true;
            }
            i++;
        }
        if (trouve) {
            return "CEL" + i;
        } else {
            return null;
        }
    }

    chercheDansColonne(carte, numColonne) {
        let trouve = false;
        let numCarte = 0;
        let colonne = this.getColonne(numColonne);

        while (!trouve && numCarte < colonne.getNbCartes()) {
            if (colonne.getCarteN(numCarte).isEquivalent(carte)) {
                trouve = true;
            }
            numCarte++;
        }
        if (trouve) {
            return numCarte;
        } else {
            return -1;
        }
    }

    cartesCliquablesColonne(colonne) {
        let cartesCliquable = new PileDeCartes();
        if (colonne == null) {
            console.debug("colonne null dans PArtie.js.cartesCliquablesColonne");
            return cartesCliquable;
        }
        if (colonne.getNbCartes() === 0) return cartesCliquable;

        cartesCliquable.ajouteCarte(colonne.getCarte());
        let carteExaminee = null;
        let nbCartes = colonne.getNbCartes();
        for (let i = nbCartes - 2; i >= 0; i--) {
            carteExaminee = colonne.getCarteN(i);
            if (cartesCliquable.getCarte().peutPoserSur(carteExaminee)) {
                cartesCliquable.ajouteCarte(carteExaminee);
                console.log("carte cliquable : " + cartesCliquable.getNbCartes() + " : " + carteExaminee.getNom());

            } else {

                console.log("Dernière carte cliquable " + cartesCliquable.getNbCartes() + " : " + carteExaminee.getNom());
                break;
            }
        }
        return cartesCliquable;
    }

    compterLesCartesEnJeu() {
        let nbCartesEnJeu = 0;
        for (let i = 1; i <= 4; i++) {
            nbCartesEnJeu += this.getPile(i).getNbCartes();
        }
        for (let i = 1; i <= 8; i++) {
            nbCartesEnJeu += this.getColonne(i).getNbCartes();
        }
        for (let i = 1; i <= 4; i++) {
            if (this.getCaseLibre(i).getCarte() !== null) {
                nbCartesEnJeu++;
            }
        }
        return nbCartesEnJeu;
    }
    
}
