const NB_COLONNES = 8;
const NB_PILES = 4;
const CARTES_PAR_COULEUR = 13;
const TAB_COULEURS = ["P", "C", "K", "T"];

class PartieSolitaire {

    // Carte disparue ? partie.colonnes[2].ajouteCarte(new Carte(4,"C"))

    constructor() {

        this.coup = new Coup();
        this.listeDesCoups = new ListeCoups();
        this.initColonnes();

        this.pile = [];
        for (let i = 0; i < NB_PILES; i++) {
            this.pile[i] = new PileDeCouleur(TAB_COULEURS[i]);
        }

        this.casesLibres = [];
        for (let i = 0; i < NB_PILES; i++) {
            this.casesLibres[i] = new CaseLibre();
        }
    }

    initColonnes() {
        this.colonnes = [];
        for (let colonne = 0; colonne < NB_COLONNES; colonne++) {
            this.colonnes[colonne] = new PileDeCartes();
        }
    }

    distribue(melanger = true) {
        let jeu52cartes = new JeuDeCartes();
        if (melanger) {
            jeu52cartes.melanger();
        }

        // distribue les cartes dans les colonnes

        // Boucle pour les colonnes 0 à 7, avec 7 cartes dans les 4 premières colonnes et 6 dans les 4 autres
        for (let colonne = 0; colonne < NB_COLONNES; colonne++) {
            this.distribueColonne(jeu52cartes, this.colonnes[colonne], colonne < 4 ? 7 : 6);
        }
    }

    distribueColonne(jeu, colonne, nombre) {
        for (let i = 0; i < nombre; i++) {
            colonne.ajouteCarte(jeu.prendCarte());
        }
    }

    getColonne(numero) {
        if (numero >= 0 && numero < NB_COLONNES) {
            return this.colonnes[numero];
        }
        return null;
    }

    getPile(numero) {
        if (numero >= 0 && numero < NB_PILES) {
            return this.pile[numero];
        }
        return null;
    }

    getCaseLibre(numero) {
        if (numero >= 0 && numero < NB_PILES) {
            return this.casesLibres[numero];
        }
        return null;
    }

    getNbCasesLibres() {
        let nbCasesLibres = NB_PILES;
        for (let i = 0; i < NB_PILES; i++) {
            if (this.casesLibres[i].getCarte() !== null) {
                nbCasesLibres--;
            }
        }
        return nbCasesLibres;
    }

    getNbColonnesVides() {
        let nbColonnesVides = 0;
        for (let i = 0; i < NB_COLONNES; i++) {
            if (this.colonnes[i].getNbCartes() === 0) {
                nbColonnesVides++;
            }
        }
        return nbColonnesVides;
    }

    // trouve l'index de la pile de la meme couleur que la carte
    getIndexPileCouleurCarte(carte) {
        // Cherche l'indice dans le tableau TABCOULEURS
        let indiceCouleur = TAB_COULEURS.indexOf(carte.couleur);
        if (indiceCouleur === -1) {
            console.warn("PartieSolitaire.js - getIndexPileCouleurCarte - couleur de carte inconnue");
            return null;
        }
        return indiceCouleur;
    }

    // Une carte est cliquable si elle est dans une cellule
    // Si elle est dans une colonne, tout en bas de la colonne
    // ou si elle s'enchaine avec des alternances de couleur et de valeur.

    isCarteCliquable(carteExaminee) {
        if (carteExaminee == null) {
            console.warn("PartieSolitaire.js - isCarteCliquable - carte examinee null !!!");
            return false;
        }
        console.debug("PartieSolitaire.js - isCarteCliquable - carte examinee " + carteExaminee.getNom());
        let texteCarte = this.chercheCarte(carteExaminee);
        console.debug("PartieSolitaire.js - isCarteCliquable - carte examinee trouvee en " + texteCarte);
        let position = new Position(texteCarte);
        if (position == null) {
            console.warn("PartieSolitaire.js -  isCarteCliquable - carte examinee non trouvee");
            return false;
        }
        switch (position.getTypeDePile()) {
            case "COL" :
                // si la carte est dans une colonne, elle est cliquable si elle est en bas de la colonne
                let colonne = this.getColonne(position.getNumero());
                if (colonne.getCarte() === carteExaminee) {
                    console.debug("PartieSolitaire.js - isCarteCliquable -  carte examinee en bas de la colonne " + position.getNumero());
                    return true;
                }
                // Sinon s'il y a une alternance de couleur et de valeur
                console.debug("PartieSolitaire.js - isCarteCliquable - carte a juger en colonne " + position.getNumero());
                let cartesCliquablesColonne = this.cartesCliquablesColonne(colonne);
                if (cartesCliquablesColonne.contientCarte(carteExaminee)) {
                    console.debug("PartieSolitaire.js - isCarteCliquable ------------- carte examinee ok dans la col  " + position.getNumero());
                    return true;
                }
                break;
            case "CEL" :
                console.debug("PartieSolitaire.js - isCarteCliquable -  carte examinee dans une cellule donc cliquable");
                return true;
        }
        return false;
    }

    // Cette fonction prend en entrée un objet carte et renvoie l'indice de la première colonne sur laquelle la
    // carte peut être posée. Si aucune colonne n'est trouvée pour la carte, la fonction renvoie -1.
    cartePeutMonterSurUneColonne(carte) {
        console.debug("carte peut monter sur une colonne ? " + carte.valeur + " " + carte.couleur);
        for (let i = 0; i < NB_COLONNES; i++) {
            let colonne = this.getColonne(i);
            if (colonne.getCarte() == null || carte.peutPoserSur(colonne.getCarte())) {
                return i;
            }
        }
        return -1;
    }

    cartePeutMonterDansLaPile(carte) {
        let indexMaPile = this.getIndexPileCouleurCarte(carte);
        let cartePeutMonterDansLaPile = true;
        // Si on n'a pas l'index de la pile, c'est loupé !
        if (indexMaPile == null) {
            cartePeutMonterDansLaPile = false;
            console.log("cartePeutMonterDansLaPile - indexMaPile null");
        }
        // Si la pile est vide, et que la carte n'est pas un as, c'est loupé !
        if (this.getPile(indexMaPile).getNbCartes() === 0) {
            if (carte.valeur !== 1) {
                cartePeutMonterDansLaPile = false;
                console.log("cartePeutMonterDansLaPile - pile vide et carte pas un as");
            }
        } else if (carte.valeur !== this.getPile(indexMaPile).getCarte().valeur + 1) {
            // Si la pile n'est pas vide, et que la carte n'est pas la suivante, c'est loupé !
            cartePeutMonterDansLaPile = false;
            console.log("cartePeutMonterDansLaPile - pile non vide et carte pas la suivante");
        }

        console.log("cartePeutMonterDansLaPile -  = " + cartePeutMonterDansLaPile);
        return cartePeutMonterDansLaPile;
    }

    arriere() {
        let coup = this.listeDesCoups.deleteLastCoup();
        coup.annuler(this);
    }

    verifieVictoire() {
        let victoire = true;
        for (let i = 0; i < NB_PILES; i++) {
            let pile = this.getPile(i);
            if (pile.getNbCartes() !== CARTES_PAR_COULEUR) {
                victoire = false;
                console.log("Pile " + i + " non complète");
            }
        }
        return victoire;
    }

    demarrePartie() {
        this.distribue();
        this.listeDesCoups = new ListeCoups();
    }

// On compte les cases libres piles et colonnes
    compteCasesLibres() {
        let nbCasesLibres = 0;
        for (let i = 0; i < NB_PILES; i++) {
            let caseLibre = this.getCaseLibre(i);
            if (caseLibre.estLibre()) {
                nbCasesLibres++;
            }
        }
        for (let i = 0; i < NB_COLONNES; i++) {
            let colonne = this.getColonne(i);
            if (colonne.getNbCartes() === 0) {
                nbCasesLibres++;
            }
        }
        return nbCasesLibres;
    }

    chercheCarte(carte) {
        if ( carte == null) {
            console.war("Appel de chercheCarte sur element null !");
            return;
        }
        console.log("- PartieSolitaire.js -- chercheCarte  " + carte.getNom());
        let colonne = 0;
        let retourRecherche = null;

        // 1/3 On cherche d'abord dans les colonnes
        while (colonne < NB_COLONNES) {
            retourRecherche = this.chercheDansColonne(carte, colonne);
            if (retourRecherche !== -1) {
                // console.log("Trouvé COL" + (colonne) + " " + (retourRecherche));
                return "COL" + (colonne) + (retourRecherche);
            }
            colonne++;
        }
        // 2/3 On cherche ensuite dans les piles
        let i = 0;
        while (i < NB_PILES) {
            let pile = this.getPile(i);
            if (pile.contientCarte(carte)) {
                return "PIL" + (i);
            } else {
                i++;
            }
        }
        // 3/3 On cherche enfin dans les cellules
        i = 0;
        while (i < NB_PILES) {
            let caseLibre = this.getCaseLibre(i);
            // console.log("caseLibre " + i + " " + caseLibre.getCarte().getNom());
            if (caseLibre?.getCarte() !== null && caseLibre?.getCarte().isEquivalent(carte)) {
                return "CEL" + (i );
            }
            else {
                i++;
            }
        }
        console.error("carte non trouvée" + carte.getNom());
        return null;
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

    // Renvoie les cartes cliquables d'une colonne sous la forme d'une pile de cartes :
    // - la carte du dessus
    // - toutes les cartes du dessous en ordre décroissant et en alternance de couleur

    cartesCliquablesColonne(colonne) {
        let cartesCliquable = new PileDeCartes();
        if (colonne == null) {
            console.warn("colonne null dans Partie.js.cartesCliquablesColonne");
            return cartesCliquable;
        }
        if (colonne.getNbCartes() === 0) {
            return cartesCliquable;
        }

        cartesCliquable.ajouteCarte(colonne.getCarte());
        let carteExaminee = null;
        let nbCartes = colonne.getNbCartes();
        for (let i = nbCartes - 2; i >= 0; i--) {
            carteExaminee = colonne.getCarteN(i);
            if (cartesCliquable.getCarte().peutPoserSur(carteExaminee)) {
                cartesCliquable.ajouteCarte(carteExaminee);
                // console.log("carte cliquable : " + cartesCliquable.getNbCartes() + " : " + carteExaminee.getNom());
            } else {
                // console.log("Dernière carte cliquable " + cartesCliquable.getNbCartes() + " : " + carteExaminee.getNom());
                break;
            }
        }
        return cartesCliquable;
    }

    compterLesCartesEnJeu() {
        let nbCartesEnJeu = 0;
        for (let i = 0; i < NB_PILES; i++) {
            nbCartesEnJeu += this.getPile(i).getNbCartes();
        }
        for (let i = 0; i < NB_COLONNES; i++) {
            nbCartesEnJeu += this.getColonne(i).getNbCartes();
        }
        for (let i = 0; i < NB_PILES; i++) {
            if (this.getCaseLibre(i).getCarte() !== null) {
                nbCartesEnJeu++;
            }
        }
        return nbCartesEnJeu;
    }
}
