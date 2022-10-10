
class Partie {

    // Carte disparue ? partie.colonnes[2].ajouteCarte(new Carte(4,"C"))

    constructor() {

        this.coup = new Coup();
        this.listeDesCoups = new ListeCoups();

        this.carteLargeur = 100;
        this.carteHauteur = 150;
        this.carteHauteurTete = 30;

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

        this.log = 1; // 1 : debug , 2: info, 3 : warning , 4 : error
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

    // Une carte est cliquable si elle est tout en bas de la colonne
    // ou si elle s'enchaine avec des alternances de couleur et de valeur
    // ou si elle est sur une case libre.
    isCarteCliquable(carteAjuger) {
        console.debug("Partie.js - isCarteCliquable - carte a juger " + carteAjuger.getNom());
        if (carteAjuger === null) {
            console.debug("Partie.js - isCarteCliquable - carte a juger null");
            return false;
        }

        let position = this.chercheCarte(carteAjuger);
        position = new Position(position);
        if (position == null) {
            console.warn("Partie.js -  isCarteCliquable - carte a juger non trouvee");
            return false;
        }

        switch (position.getPile()) {
            case "COL" :
                let colonne = this.getColonne(position.getNumero());
                if (colonne.getCarte() === carteAjuger) {
                    console.debug("Partie.js - isCarteCliquable -  carte a juger en bas de la colonnes" + position.getNumero());
                    return true;
                }

                console.debug("Partie.js - isCarteCliquable - carte a juger en colonne " + position
                    .getNumero());
                let cartesCliquablesColonne = this.cartesCliquablesColonne(colonne);

                if (cartesCliquablesColonne.contientCarte(carteAjuger)) {
                    console
                        .debug("Partie.js - isCarteCliquable ------------- carte a juger ok dans la col  " + position
                            .getNumero());
                    return true;
                }

                break;
            case
            "CEL"
            :
// TODO a bouger fans fonction isMagicCliquable
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

                return true;
                break;

        }


        // if carte in colonnes and alternance de couleur et de valeur
        position = this.chercheCarte(carteAjuger);
        console
            .debug(" Partie.js - isCarteCliquable -carte a juger trouvee en position " + position);

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
        this.affiche();
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
        this.affiche();
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

// Dessine

    dessineFondDeCarte(context, carte, x, y, surbrillance) {
        if (surbrillance) {
            context.fillStyle = "yellow";
        } else {
            context.fillStyle = "white";
        }
        if (carte == null || carte.valeur === 0) {
            context.fillStyle = "lightgrey";
        }
        if (surbrillance) {
            context.fillRect(x, y, this.carteLargeur - 1, this.carteHauteurTete - 1);

        } else {
            context.fillRect(x, y, this.carteLargeur - 1, this.carteHauteur - 1);
        }
    }

    dessineBordCarte(context, x, y, surbrillance) {
        context.strokeStyle = "black";
        if (!surbrillance) {
            context.strokeRect(x, y, this.carteLargeur - 1, this.carteHauteur - 1);
        }
        if (this.log <= 1) {
            console.log("affichage bord de la carte");
        }
    }

    dessineCarte(carte, x, y, tas, surbrillance = false) {
        let id = "canvas" + tas;
        if (this.log <= 1) {
            console.log("id a afficher : " + id);
        }
        let canvas = document.getElementById(id);
        let context = canvas.getContext("2d");

        this.dessineBordCarte(context, x, y, surbrillance);

        // couleur de fond
        this.dessineFondDeCarte(context, carte, x, y, surbrillance);

        // texte de la carte
        if (this.log <= 1) {
            if (carte == null) console.log("dessine carte : null"); else console.log("dessine carte : " + carte.valeur + "-" + carte.couleur);
        }
        if (carte != null && carte.estRouge()) {
            context.fillStyle = "red";
        } else {
            context.fillStyle = "black";
        }
        context.font = "" + this.carteHauteurTete + "px Arial";
        let offset = 25;
        if (carte != null && carte.valeur !== 0) {
            context.fillText(carte.getNomCourtFigure(), x , y + this.carteHauteurTete - 5);

            if (carte.valeur === 10)
                offset = 40;
            context.fillText(carte.getIconeCouleur(), x +offset, y + this.carteHauteurTete - 5);
        }
    }

    dessineColonne(numero) {
        let colonne = this.getColonne(numero);
        // draw the cards
        let x = (numero - 1) * this.carteLargeur * 1.1;
        let y = 0;
        for (let i = 0; i < colonne.getNbCartes(); i++) {
            // let cliquable = this.isCarteCliquable(colonne.getCarteN(i), colonne);
            this.dessineCarte(colonne.getCarteN(i), x, y, "Colonne");
            if ((i === colonne.getNbCartes() - 1) && this.cartePeutMonterDansLaPile(colonne.getCarteN(i))){
                this.dessineCarte(colonne.getCarteN(i), x, y, "Colonne", true);
            }
            y += this.carteHauteurTete;
        }
    }

    dessinePile(numero) {
        let pile = this.getPile(numero);

        // draw the cards
        let x = (numero - 1) * (this.carteLargeur *1.1);
        let y = 0;

        if (pile.getCarte() != null) {
            this.dessineCarte(pile.getCarte(), x, y, "Pile");
        } else {
            console.log("carte pile " + numero + " vide");
            let carteVide = new Carte(0, 0);
            carteVide.setCouleurParNumero(numero);
            carteVide.valeur = 0;
            console.log("carte :" + carteVide.getNom());
            this.dessineCarte(carteVide, x, y, "Pile");
        }
    }

    dessineCaseLibre(numero) {
        let caseLibre = this.getCaseLibre(numero);

        // draw the cards
        let x = (numero - 1) * (this.carteLargeur * 1.1);
        let y = 0;
        let carte = caseLibre.getCarte();
        if (carte != null) {
            this.dessineCarte(carte, x, y, "CaseLibre", false);
            if (this.cartePeutMonterDansLaPile(carte)
                || this.cartePeutMonterSurUneColonne(carte) > 0) {
                this.dessineCarte(carte, x, y, "CaseLibre", true);
            }
        } else {
            if (this.log === 1) {
                console.log("carte case libre " + numero + " vide");
            }
            let carteVide = new Carte(0, 0);
            carteVide.setCouleurParNumero(numero);
            carteVide.valeur = 0;
            carteVide.couleur = " ";
            this.dessineCarte(carteVide, x, y, "CaseLibre");
        }
    }

    afficheCarteSuivantePile(numeroPile) {
        let x = (numeroPile - 1) * (this.carteLargeur * 1.1);
        let y = 0;
        let carteDescendant;
        let pile = this.getPile(numeroPile);
        let carte = pile.getCarte();
        if (carte == null) {
            console.warn("carte null ! 1");
            carteDescendant = new Carte(1, pile.getCouleur());
        } else {
            this.dessineCarte(carte, x, y, "Pile", true);
            carteDescendant = new Carte(carte.valeur, carte.couleur);
            carteDescendant.valeur += 1;
        }
        this.metEnSurbrillance(carteDescendant);
    }

    afficheCartesSuivantesPiles() {
        for (let i = 1; i <= 4; i++) {
            this.afficheCarteSuivantePile(i);
        }
    }

    affiche() {
        let id = "canvasColonne";
        let canvas = document.getElementById(id);
        let context = canvas.getContext("2d");
        let bckplog = this.log;
        this.log = 4;

        // erase the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 1; i <= 8; i++) {
            this.dessineColonne(i);
        }
        for (let i = 1; i <= 4; i++) {
            this.dessinePile(i);
        }
        for (let i = 1; i <= 4; i++) {
            this.dessineCaseLibre(i);
        }
        this.log = bckplog;
        if (this.verifieVictoire()) {
            alert("Conglaturations :D !");
        }
        if (this.compterLesCartesEnJeu() !== 52) {
            alert("Il manque des cartes !");
        }
    }

    metEnSurbrillance(carte) {
        let id = this.chercheCarte(carte);
        if (id == null) {
            return;
        }
        if (id.startsWith("COL")) {
            console.log("metEnSurbrillance " + id);
            let numeroColonne = id.substring(3, 4);
            let numeroCarte = id.substring(4, 5);
            let x = (numeroColonne - 1) * (this.carteLargeur * 1.1);
            let y = (numeroCarte - 1) * this.carteHauteurTete;
            this.dessineCarte(carte, x, y, "Colonne", true);
        } else if (id.startsWith("PIL")) {
            let numeroPile = id.substring(3, 4);
            let x = (numeroPile - 1) * (this.carteLargeur * 1.1);
            let y = 0;
            this.dessineCarte(carte, x, y, "Pile", true);
        } else if (id.startsWith("CEL")) {
            let numeroCaseLibre = id.substring(3, 4);
            let x = (numeroCaseLibre - 1) * (this.carteLargeur * 1.1);
            let y = 0;
            this.dessineCarte(carte, x, y, "CaseLibre", true);
        }
    }

    onClickColonne() {
        // get x y of mouse
        let x = event.clientX - document.getElementById("canvasColonne").offsetLeft;
        let y = event.clientY - document.getElementById("canvasColonne").offsetTop;
        console.log("click x = " + x + " y = " + y);

        // get the column number
        let numeroColonne = Math.floor(x / (1.1*this.carteLargeur)) + 1;

        // get the card number
        let numeroCarte = Math.floor(y / this.carteHauteurTete) + 1;
        console.log("click sur colonnes " + numeroColonne + " carte " + numeroCarte);

        // détermine si le clic est magique : si on clique plus bas que l'en-tête de la dernière carte
        let clicMagique = false;
        if (numeroCarte > this.getColonne(numeroColonne).getNbCartes() && this.getColonne(numeroColonne).getNbCartes() > 0) {
            numeroCarte = this.getColonne(numeroColonne).getNbCartes();
            clicMagique = true;
        }

        // get the card
        let colonne = this.getColonne(numeroColonne);
        let carte = colonne.getCarteN(numeroCarte - 1);
        if (carte == null) {
            console.log("carte null");
        } else {
            console.log("---- carte : " + carte.getNom() + carte.valeur + " " + carte.couleur);
        }
        if (clicMagique) {
            console.log("click magique sur colonnes " + numeroColonne + " carte " + numeroCarte);
            let clickMagiqueOk = this.cartePeutMonterDansLaPile(carte);
            let indexMaPile = this.getPileCouleurCarte(carte);
            if (clickMagiqueOk) {
                this.coup.carte = carte;
                this.coup.origine = "COL" + numeroColonne;
                this.coup.destination = "PIL" + indexMaPile;
                console.log("Montée de colonnes vers pile ok !");
            } else {
                // on tente de déplacer une carte de la colonne vers une autre colonne
                let colonne = this.cartePeutMonterSurUneColonne(carte);
                if (colonne > 0) {
                    this.coup.carte = carte;
                    this.coup.origine = "COL" + numeroColonne;
                    this.coup.destination = "COL" + colonne;
                    console.log("Montée de colonnes vers colonnes ok !");
                }
            }
        }

        // Cas du premier clic
        if (this.coup.carte == null) {
            this.coup.carte = carte;
            this.coup.origine = "COL" + numeroColonne;
            x = (numeroColonne - 1) * (this.carteLargeur * 1.1);
            y = (numeroCarte - 1) * this.carteHauteurTete;
            this.dessineCarte(carte, x, y, "Colonne", true);
            console.log("x : " + x + " y : " + y);
            console.log("Premier clic, coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " ");
        } else {
            // Cas du second clic
            if (this.coup.destination == null || this.coup.destination === "") {
                this.coup.destination = "COL" + numeroColonne;
                console.log("Second clic, coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " " + this.coup.destination);
            }
            this.coup.jouer(this);
            console.log("coup vers colonnes, carte :  " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + " depuis " + this.coup.origine + " vers : " + this.coup.destination);
            this.coup = new Coup();
            this.affiche();
        }
    }

    onClickPile() {
        // get x y of mouse
        let x = event.clientX;
        let numeroPile = Math.floor((x - document.getElementById("canvasPile").offsetLeft) / (this.carteLargeur * 1.1)) + 1;
        let y = event.clientY - document.getElementById("canvasPile").offsetTop;
        console.info("click x = " + x + " y = " + y);
        console.log("numeroPile : " + numeroPile);
        let pile = this.getPile(numeroPile);
        let carte = pile.getCarte();

        let clicMagique = false;
        let numeroCarte = Math.floor(y / this.carteHauteurTete) + 1;
        if (numeroCarte > 1) {
            clicMagique = true;
        }
        if (clicMagique) {
            if (carte != null) {
                this.coup.carte = carte;
                this.coup.origine = "PIL" + numeroPile;
                this.coup.destination = "PIL" + numeroPile;
                console.info("coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " " + this.coup.destination);
            }
        } else {
            // Si c'est un premier clic, on met en surbrillance la carte
            if (this.coup.carte == null) {
                this.coup.carte = carte;
                this.coup.origine = "PIL" + numeroPile;
                this.afficheCarteSuivantePile(numeroPile, carte);
                return;
            }
            this.coup.destination = "PIL" + numeroPile;
            console.log("coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " " + this.coup.destination);
        }
        this.coup.jouer(this);
        this.coup = new Coup();
        this.affiche();
    }

    onClickCaseLibre() {
        // get x y of mouse
        let x = event.clientX - document.getElementById("canvasCaseLibre").offsetLeft;
        let y = event.clientY - document.getElementById("canvasCaseLibre").offsetTop;
        let numeroCaseLibre = Math.floor(x / (this.carteLargeur * 1.1)) + 1;
        let caseLibre = this.getCaseLibre(numeroCaseLibre);
        let carte = caseLibre.getCarte();
        console.log("click x = " + x + " y = " + y);
        console.log("click sur case libre  " + numeroCaseLibre + " carte " + carte);

        // Si c'est un premier clic, on met en surbrillance la carte

        if (y > this.carteHauteurTete && carte != null) {

            console.log("click magique sur case libre " + numeroCaseLibre + " carte " + carte);
            let clickMagiqueOk = this.cartePeutMonterDansLaPile(carte);
            let indexMaPile = this.getPileCouleurCarte(carte);
            if (clickMagiqueOk) {
                this.coup.carte = carte;
                this.coup.origine = "CEL" + numeroCaseLibre;
                this.coup.destination = "PIL" + indexMaPile;
                console.log("Montée de case libre vers pile ok !");
            } else {
                // on tente de déplacer une carte de la colonne vers une autre colonne
                let colonne = this.cartePeutMonterSurUneColonne(carte);
                if (colonne > 0) {
                    this.coup.carte = carte;
                    this.coup.origine = "CEL" + numeroCaseLibre;
                    this.coup.destination = "COL" + colonne;
                    console.log("Descente de pile vers colonne ok !");
                }
            }
        } else {
            console.log("click normal sur case libre " + numeroCaseLibre + " carte " + carte);
        }

        // Si c'est le premier clic, on enregistre la carte à bouger, et on la met en surbrillance
        if (this.coup.carte == null) {
            console.log("premier clic sur case libre " + numeroCaseLibre + " carte " + carte);
            this.coup.carte = carte;
            this.coup.origine = "CEL" + numeroCaseLibre;
            if (carte != null) {
                console.log("coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " ");
            }
            let x = (numeroCaseLibre - 1) * (this.carteLargeur * 1.1);
            let y = 0;
            this.dessineCarte(carte, x, y, "CaseLibre", true);
        }
        // Sinon, on enregistre la destination
        else {
            if (this.coup.destination == null || this.coup.destination === "") {
                this.coup.destination = "CEL" + numeroCaseLibre;
                console.log("destination enregistrée : " + "CEL" + numeroCaseLibre);
            }
            console.log("coup lâché sur CEL carte : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + " origine :" + this.coup.origine + " destination : " + this.coup.destination);
            this.coup.jouer(this);
            this.coup = new Coup();
            this.affiche();
        }
    }

}
