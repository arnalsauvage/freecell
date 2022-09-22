class Partie {

    constructor(valeur, couleur) {
        this.coup = new Coup();
        this.listeDesCoups = new ListeCoups();

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
        // bord de la carte
        context.strokeStyle = "black";
        context.strokeRect(x, y, 100, 150);
        console.log("affichage bord de la carte");
        // couleur de fond
        if (surbrillance) {
            context.fillStyle = "yellow";
        } else {
            context.fillStyle = "white";
        }
        if (carte.valeur == 0) {
            context.fillStyle = "lightgrey";
        }
        context.fillRect(x, y, 100, 150);

        // texte de la carte
        console.log("dessine carte : " + carte.valeur + "-" + carte.couleur);
        if (carte.estRouge()) {
            context.fillStyle = "red";
        } else {
            context.fillStyle = "black";
        }
        context.font = "30px Arial";
        context.fillText(carte.getNomCourt(), x + 5, y + 24);


    }

    dessineColonne(numero) {
        let colonne = this.getColonne(numero);
        // draw the cards
        let x = 0 + (numero - 1) * 100;
        let y = 0;
        for (let i = 0; i < colonne.getNbCartes(); i++) {
            this.dessineCarte(colonne.getCarteN(i), x, y, "Colonne");
            y += 30;
        }
    }

    dessinePile(numero) {
        let pile = this.getPile(numero);

        // draw the cards
        let x = 0 + (numero - 1) * 100;
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
        let x = 0 + (numero - 1) * 100;
        let y = 0;
        let carte = caseLibre.getCarte();
        if (carte != null) {
            this.dessineCarte(carte, x, y, "CaseLibre");
        } else {
            console.log("carte case libre " + numero + " vide");
            let carteVide = new Carte(0, 0);
            carteVide.setCouleurParNumero(numero);
            carteVide.valeur = " ";
            carteVide.couleur = " ";
            this.dessineCarte(carteVide, x, y, "CaseLibre");
        }
    }

    onClickColonne() {
        // get x y of mouse
        let x = event.clientX;
        let y = event.clientY;
        let numeroColonne = Math.floor(x / 100) + 1;
        let colonne = this.getColonne(numeroColonne);
        let carte = colonne.getCarte(colonne.getNbCartes() - 1);
        if (this.coup.carte == null) {
            this.coup.carte = carte;
            this.coup.origine = "COL" + numeroColonne;
            let x = (numeroColonne - 1) * 100;
            let y = (colonne.getNbCartes() - 1) * 30;
            this.dessineCarte(carte, x, y, "Colonne", true);
            console.log("x : " + x + " y : " + y);
            console.log("coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " ");
        } else {
            this.coup.destination = "COL" + numeroColonne;
            console.log("coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " " + this.coup.destination);
            this.coup.jouer(this);
            this.coup = new Coup();
            this.coup.carte = null;
            this.coup.origine = null;
            this.coup.destination = null;
            this.affiche();
        }
    }

    onClickPile() {
        // get x y of mouse
        let x = event.clientX;
        let y = event.clientY;
        x += 50;
        let numeroPile = Math.floor(x / 100) - 4;
        console.log("numeroPile : " + numeroPile);
        let pile = this.getPile(numeroPile);
        let carte = pile.getCarte();
        if (this.coup.carte == null) {
            this.coup.carte = carte;
            this.coup.origine = "PIL" + numeroPile;
            let x = (numeroPile - 1) * 100;
            let y = 0;
            this.dessineCarte(carte, x, y, "Pile", true);
            console.log("coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " ");
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

    onClickCaseLibre() {
        // get x y of mouse 
        let x = event.clientX;
        let y = event.clientY;
        let numeroCaseLibre = Math.floor(x / 100) + 1;
        let caseLibre = this.getCaseLibre(numeroCaseLibre);
        let carte = caseLibre.getCarte();
        // Si c'est le premier clic, on enregistre la carte à bouger
        if (this.coup.carte == null) {
            this.coup.carte = carte;
            this.coup.origine = "CEL" + numeroCaseLibre;
            console.log("coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " ");
            let x = (numeroCaseLibre - 1) * 100;
            let y = 0;
            this.dessineCarte(carte, x, y, "CaseLibre", true);
        }
        // Sinon, on enregistre la destination
        else {
            this.coup.destination = "CEL" + numeroCaseLibre;
            console.log("coup : " + this.coup.carte.valeur + ' ' + this.coup.carte.couleur + ' ' + this.coup.origine + " " + this.coup.destination);
            this.coup.jouer(this);
            this.coup = new Coup();
            this.coup.carte = null;
            this.coup.origine = null;
            this.coup.destination = null;
            this.affiche();
        }
    }

    affiche() {
        let id = "canvasColonne";
        let canvas = document.getElementById(id);
        let context = canvas.getContext("2d");

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
}