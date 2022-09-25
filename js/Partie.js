class Partie {

    constructor(valeur, couleur) {

        this.coup = new Coup();
        this.listeDesCoups = new ListeCoups();

        this.carteLargeur = 100;
        this.carteHauteur = 150;
        this.carteHauteurTete = 30;

        this.colonne = new Array();
        this.colonne[1] = new PileDeCartes();
        this.colonne[2] = new PileDeCartes();
        this.colonne[3] = new PileDeCartes();
        this.colonne[4] = new PileDeCartes();
        this.colonne[5] = new PileDeCartes();
        this.colonne[6] = new PileDeCartes();
        this.colonne[7] = new PileDeCartes();
        this.colonne[8] = new PileDeCartes();

        this.pileDePique = new PileDeCouleur("P");
        this.pileDeTrefle = new PileDeCouleur("T");
        this.pileDeCoeur = new PileDeCouleur("C");
        this.pileDeCarreau = new PileDeCouleur("K");
        this.pile = new Array();
        this.pile[1] = this.pileDePique;
        this.pile[2] = this.pileDeCoeur;
        this.pile[3] = this.pileDeCarreau;
        this.pile[4] = this.pileDeTrefle;

        this.casesLibres = new Array();
        this.casesLibres[1] = new CaseLibre();
        this.casesLibres[2] = new CaseLibre();
        this.casesLibres[3] = new CaseLibre();
        this.casesLibres[4] = new CaseLibre();

        this.log = 1; // 1 : debug , 2: info, 3 : warning , 4 : error
    }

    distribue() {
        let jeu52cartes = new JeuDeCartes();
        jeu52cartes.melanger();
        this.distribueColonne(jeu52cartes, this.colonne[1], 7);
        this.distribueColonne(jeu52cartes, this.colonne[2], 7);
        this.distribueColonne(jeu52cartes, this.colonne[3], 7);
        this.distribueColonne(jeu52cartes, this.colonne[4], 7);
        this.distribueColonne(jeu52cartes, this.colonne[5], 6);
        this.distribueColonne(jeu52cartes, this.colonne[6], 6);
        this.distribueColonne(jeu52cartes, this.colonne[7], 6);
        this.distribueColonne(jeu52cartes, this.colonne[8], 6);
    }

    distribueColonne(jeu, colonne, nombre) {
        for (let i = 1; i <= nombre; i++) {
            colonne.ajouteCarte(jeu.prendCarte());
        }
    }

    getColonne(numero) {
        if (numero >= 1 && numero < 9) {
            return this.colonne[numero];
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
            if (carte == null)
                console.log("dessine carte : null");
            else
                console.log("dessine carte : " + carte.valeur + "-" + carte.couleur);
        }
        if (carte != null && carte.estRouge()) {
            context.fillStyle = "red";
        } else {
            context.fillStyle = "black";
        }
        context.font = "" + this.carteHauteurTete + "px Arial";
        if (carte != null && carte.valeur != 0) {
            context.fillText(carte.getNomCourtFigure(), x + 5, y + this.carteHauteurTete - 5);
            context.fillText(carte.getIconeCouleur(), x + this.carteLargeur - 25, y + this.carteHauteurTete - 5);
        }
    }

    dessineFondDeCarte(context, carte, x, y, surbrillance) {
        if (surbrillance) {
            context.fillStyle = "yellow";
        } else {
            context.fillStyle = "white";
        }
        if (carte == null || carte.valeur == 0) {
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

    dessineColonne(numero) {
        let colonne = this.getColonne(numero);
        // draw the cards
        let x = 0 + (numero - 1) * this.carteLargeur;
        let y = 0;
        for (let i = 0; i < colonne.getNbCartes(); i++) {
            this.dessineCarte(colonne.getCarteN(i), x, y, "Colonne");
            y += this.carteHauteurTete;
        }
    }

    dessinePile(numero) {
        let pile = this.getPile(numero);

        // draw the cards
        let x = 0 + (numero - 1) * this.carteLargeur;
        let y = 0;

        if (pile.getCarte() != null) {
            this.dessineCarte(pile.getCarte(), x, y, "Pile");
        } else {
            console.log("carte pile " + numero + " vide");
            let carteVide = new Carte(0, 0);
            carteVide.setCouleurParNumero(numero);
            carteVide.valeur = " ";
            console.log("carte :" + carteVide.getNom());
            this.dessineCarte(carteVide, x, y, "Pile");
        }
    }

    dessineCaseLibre(numero) {
        let caseLibre = this.getCaseLibre(numero);

        // draw the cards
        let x = 0 + (numero - 1) * this.carteLargeur;
        let y = 0;
        let carte = caseLibre.getCarte();
        if (carte != null) {
            this.dessineCarte(carte, x, y, "CaseLibre");
        } else {
            if (this.log = 1) {
                console.log("carte case libre " + numero + " vide");
            }
            let carteVide = new Carte(0, 0);
            carteVide.setCouleurParNumero(numero);
            carteVide.valeur = " ";
            carteVide.couleur = " ";
            this.dessineCarte(carteVide, x, y, "CaseLibre");
        }
    }

    // trouve la pile de la meme couleur que la carte
    getPileCouleurCarte(carte) {
        let pile = null;
        for (let i = 1; i <= 4; i++) {
            pile = this.getPile(i);
            if (pile.getCouleur() == carte.couleur) {
                console.log("pile de couleur " + carte.couleur + " trouvee");
                return i;
            }
        }
        console.log("pas de pile de couleur " + carte.couleur);
        return null;
    }

    onClickColonne() {
        // get x y of mouse
        let x = event.clientX - document.getElementById("canvasColonne").offsetLeft;
        let y = event.clientY - document.getElementById("canvasColonne").offsetTop;
        console.log("click x = " + x + " y = " + y);

        // get the column number
        let numeroColonne = Math.floor(x / this.carteLargeur) + 1;

        // get the card number
        let numeroCarte = Math.floor(y / this.carteHauteurTete) + 1;
        console.log("click sur colonne " + numeroColonne + " carte " + numeroCarte);

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
            console.log("click magique sur colonne " + numeroColonne + " carte " + numeroCarte);
            let clickMagiqueOk = this.cartePeutMonterDansLaPile(carte);
            let indexMaPile = this.getPileCouleurCarte(carte);
            if (clickMagiqueOk) {
                this.coup.carte = carte;
                this.coup.origine = "COL" + numeroColonne;
                this.coup.destination = "PIL" + indexMaPile;
                console.log("Montée de colonne vers pile ok !");
            } else {
                // on tente de déplacer une carte de la colonne vers une autre colonne
                let colonne = this.cartePeutMonterSurUneColonne(carte);
                if (colonne > 0) {
                    this.coup.carte = carte;
                    this.coup.origine = "COL" + numeroColonne;
                    this.coup.destination = "COL" + colonne;
                    console.log("Montée de colonne vers colonne ok !");
                };
            }
        }

        // Cas du premier clic
        if (this.coup.carte == null) {
            this.coup.carte = carte;
            this.coup.origine = "COL" + numeroColonne;
            let x = (numeroColonne - 1) * this.carteLargeur;
            let y = (numeroCarte - 1) * this.carteHauteurTete;
            this.dessineCarte(carte, x, y, "Colonne", true);
            console.log("x : " + x + " y : " + y);
            console.log("Premier clic, coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " ");
        } else {
            // Cas du second clic
            if (this.coup.destination == null || this.coup.destination == "") {
                this.coup.destination = "COL" + numeroColonne;
                console.log("Second clic, coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " " + this.coup.destination);
            }
            this.coup.jouer(this);
            console.log("coup vers colonne, carte :  " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + " depuis " + this.coup.origine + " vers : " + this.coup.destination);
            this.coup = new Coup();
            this.affiche();
        }
    }

    cartePeutMonterSurUneColonne(carte) {

        console.log("carte peut monter sur une colonne ? " + carte.valeur + " " + carte.couleur);
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
        if (this.getPile(indexMaPile).getNbCartes() == 0) {
            if (carte.valeur != 1) {
                clickMagiqueOk = false;
            }
        } else
        // Si la pile n'est pas vide, et que la carte n'est pas la suivante, c'est loupé !
        if (carte.valeur != this.getPile(indexMaPile).getCarte().valeur + 1) {
            clickMagiqueOk = false;
        }
        return clickMagiqueOk;
    }

    onClickPile() {
        // get x y of mouse
        let x = event.clientX;
        let numeroPile = Math.floor((x - document.getElementById("canvasPile").offsetLeft) / this.carteLargeur) + 1;
        let y = event.clientY - document.getElementById("canvasPile").offsetTop;
        console.log("click x = " + x + " y = " + y);

        let clicMagique = false;
        let numeroCarte = Math.floor(y / this.carteHauteurTete) + 1;
        if (numeroCarte > 1) {
            clicMagique = true;
        }
        if (clicMagique) {

            this.coup.carte = carte;
            this.coup.origine = "PIL" + numeroPile;
            this.coup.destination = "PIL" + indexMaPile;
            console.log("coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " " + this.coup.destination);
            this.coup.jouer(this);
            this.affiche();
            return;
        } else {
            console.log("numeroPile : " + numeroPile);
            let pile = this.getPile(numeroPile);
            let carte = pile.getCarte();
            if (this.coup.carte == null) {
                this.coup.carte = carte;
                this.coup.origine = "PIL" + numeroPile;
                let x = (numeroPile - 1) * this.carteLargeur;
                let y = 0;
                let carteDescendant;
                if (carte == null) {
                    console.log("carte null ! 1");
                    carteDescendant = new Carte(1, pile.getCouleur());
                } else {
                    this.dessineCarte(carte, x, y, "Pile", true);
                    carteDescendant = new Carte(carte.valeur, carte.couleur);
                    carteDescendant.valeur += 1;
                }
                this.metEnSurbrillance(carteDescendant);

            } else {
                this.coup.destination = "PIL" + numeroPile;
                console.log("coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " " + this.coup.destination);
                this.coup.jouer(this);
                this.coup = new Coup();
                this.coup.carte = null;
                this.coup.origine = null;
                this.coup.destination = null;
                this.affiche();
            }
        }
    }

    onClickCaseLibre() {
        // get x y of mouse 
        let x = event.clientX - document.getElementById("canvasCaseLibre").offsetLeft;
        let y = event.clientY - document.getElementById("canvasCaseLibre").offsetTop;
        let numeroCaseLibre = Math.floor(x / this.carteLargeur) + 1;
        let caseLibre = this.getCaseLibre(numeroCaseLibre);
        let carte = caseLibre.getCarte();
        console.log("click x = " + x + " y = " + y);
        console.log("click sur case libre  " + numeroCaseLibre + " carte " + carte);

        let clickMagique = false;

        if (y > this.carteHauteurTete && carte != null) {
            clickMagique = true;
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
                };
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
            let x = (numeroCaseLibre - 1) * this.carteLargeur;
            let y = 0;
            this.dessineCarte(carte, x, y, "CaseLibre", true);
        }
        // Sinon, on enregistre la destination
        else {
            if (this.coup.destination == null || this.coup.destination == "") {
                this.coup.destination = "CEL" + numeroCaseLibre;
                console.log("destination enregistrée : " + "CEL" + numeroCaseLibre);
            }
            console.log("coup laché sur CEL carte : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + " origine :" + this.coup.origine + " destination : " + this.coup.destination);
            this.coup.jouer(this);
            this.coup = new Coup();
            this.affiche();
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
    }

    arriere() {
        let coup = this.listeDesCoups.deleteLastCoup();
        coup.annuler(this);
        this.affiche();

    }

    verifieVictoire() {
        let victoire = true;
        for (let i = 1; i <= 4; i++) {
            let pile = this.getPile(i); {
                if (pile.getNbCartes() != 13) {
                    victoire = false;
                }
            }
            if (victoire) {
                alert("Conglaturations :D !");
            }
        }
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
            if (colonne.getNbCartes() == 0) {
                nbCasesLibres++;
            }
        }
        return nbCasesLibres;
    }

    chercheCarte(carte) {
        console.log("--- chercheCarte  " + carte.getNom());
        let trouve = false;
        let i = 1;
        let j = 1;
        while (!trouve && i <= 8) {
            let colonne = this.getColonne(i);
            j = 0;
            while (!trouve && j < colonne.getNbCartes()) {
                if (colonne.getCarteN(j).isEquivalent(carte)) {

                    trouve = true;
                }
                j++;
            }
            i++;
        }
        if (trouve) {
            console.log("Trouvé COL" + (i - 1) + " " + (j));
            return "COL" + (i - 1) + (j);
        }

        i = 1;
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

    metEnSurbrillance(carte) {
        let id = this.chercheCarte(carte);
        if (id == null) {
            return;
        }
        if (id.startsWith("COL")) {
            console.log("metEnSurbrillance " + id);
            let numeroColonne = id.substring(3, 4);
            let numeroCarte = id.substring(4, 5);
            let x = (numeroColonne - 1) * this.carteLargeur;
            let y = (numeroCarte - 1) * this.carteHauteurTete;
            this.dessineCarte(carte, x, y, "Colonne", true);
        } else if (id.startsWith("PIL")) {
            let numeroPile = id.substring(3, 4);
            let x = (numeroPile - 1) * this.carteLargeur;
            let y = 0;
            this.dessineCarte(carte, x, y, "Pile", true);
        } else if (id.startsWith("CEL")) {
            let numeroCaseLibre = id.substring(3, 4);
            let x = (numeroCaseLibre - 1) * this.carteLargeur;
            let y = 0;
            this.dessineCarte(carte, x, y, "CaseLibre", true);
        }
    }
}