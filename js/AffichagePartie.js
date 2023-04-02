const largeurCartePlusEspace = 1.1;
const couleurCarteJouee = "lightgreen";
const couleurCarteSuivantPile = "lightblue";
const couleurCarteAscendante = "lightpink";
const couleurCarteDescendante = "lightpink";
const couleurCarteNonAccessible = "lightgrey";
const couleurCarteCliquable = "lightblue";
const couleurCarteMontable = "yellow";
const largeurDesCartes = 110;
const hauteurDesCartes = 150;

class AffichagePartie {

    constructor(maPartie) {
        this.partie = maPartie;

        this.carteLargeur = largeurDesCartes;
        this.carteHauteur = hauteurDesCartes;
        this.carteHauteurTete = hauteurDesCartes / 5;
    }

    metCarteEnSurbrillance(context, carte, x, y, couleurSurbrillance) {
        context.fillStyle = couleurSurbrillance;
        context.fillRect(x, y, this.carteLargeur - 1, this.carteHauteurTete - 1);
        this.dessineTexte(carte, context, x, y);
    }

    dessineFondDeCarte(context, carte, x, y) {
        if (carte != null) {
            if (this.partie.isCarteCliquable(carte)) {
                context.fillStyle = "white";
            } else {
                context.fillStyle = couleurCarteNonAccessible;
            }
        }

        if (carte == null || carte.valeur === 0) {
            context.fillStyle = "grey";
        }
        context.fillRect(x, y, this.carteLargeur - 1, this.carteHauteur - 1);
    }

    dessineBordCarte(context, x, y) {
        context.strokeStyle = "black";
        context.strokeRect(x, y, this.carteLargeur - 1, this.carteHauteur - 1);
    }

    dessineCarte(carte, x, y, tas, couleurSurbrillance = "") {
        let id = "canvas" + tas;
        let canvas = document.getElementById(id);
        let context = canvas.getContext("2d");

        this.dessineBordCarte(context, x, y, couleurSurbrillance);

        // couleur de fond
        this.dessineFondDeCarte(context, carte, x, y);
        if (couleurSurbrillance !== "") {
            this.metCarteEnSurbrillance(context, carte, x, y, couleurSurbrillance);
        }
        this.dessineTexte(carte, context, x, y);
    }

    dessineCarteVide(motif, x, y, tas) {
        let id = "canvas" + tas;
        let canvas = document.getElementById(id);
        let context = canvas.getContext("2d");
        this.dessineBordCarte(context, x, y);

        context.fillStyle = 'darkGreen';
        context.fillRect(x, y, this.carteLargeur - 1, this.carteHauteur - 1);
        context.stroke();
        context.strokeStyle = 'black';
        for (let i = 0; i < 3; i++) {
            context.strokeRect(x + +i * 5, y + i * 5, this.carteLargeur - 1 - 10 * i, this.carteHauteur - 1 - 10 * i);
            context.stroke();
        }
    }

    dessineTexte(carte, context, x, y) {
        // texte de la carte
        if (carte != null && carte.estRouge()) {
            context.fillStyle = "red";
        } else {
            context.fillStyle = "black";
        }
        context.font = "" + this.carteHauteurTete + "px Arial";
        let offset = 25;
        if (carte != null && carte.valeur !== 0) {
            context.fillText(carte.getNomCourtFigure(), x, y + this.carteHauteurTete - 5);
            if (carte.valeur === 10) offset = 40;
            context.fillText(carte.getIconeCouleur(), x + offset, y + this.carteHauteurTete - 5);
        }
    }

    dessineTextePileVide(pile, x, y) {
        let canvas = document.getElementById("canvasPile");
        let context = canvas.getContext("2d");
        // texte de la carte
        if (pile.estRouge()) {
            context.fillStyle = "red";
        } else {
            context.fillStyle = "black";
        }
        context.font = "" + this.carteHauteurTete * 2 + "px Arial";

        const carte = new Carte(1, pile.couleur);
        context.fillText(carte.getIconeCouleur(), x + largeurDesCartes / 8, y + this.carteHauteurTete / 2);
    }

    getContext(carte) {
        let position = new Position(this.partie.chercheCarte(carte));
        let id = "canvas";
        switch (position.getTypeDePile()) {
            case  "COL" :
                id = "canvas" + "Colonne";
                break;
            case "PIL" :
                id = "canvas" + "Pile";
                break;
            case "CEL" :
                id = "canvas" + "CaseLibre";
                break;
            default:
                console.error("getContext : pile inconnue !" + position.getTypeDePile());
        }
        let canvas = document.getElementById(id);
        return canvas.getContext("2d");
    }

    metEnSurbrillance(carte, couleurSubrillance) {
        let position = new Position(this.partie.chercheCarte(carte));
        let x, y;
        let context = this.getContext(carte);
        console.log("metEnSurbrillance " + carte.getNom() + " couleur " + couleurSubrillance);

        switch (position.getTypeDePile()) {
            case  "COL" :
                x = (position.getNumero() ) * (this.carteLargeur * largeurCartePlusEspace);
                y = (position.getIndice() -1) * this.carteHauteurTete;
                this.metCarteEnSurbrillance(context, carte, x, y, couleurSubrillance);
                break;
            case "PIL":
            case "CEL" :
                x = (position.getNumero()  - 1) * (this.carteLargeur * largeurCartePlusEspace);
                y = 0;
                this.metCarteEnSurbrillance(context, carte, x, y, couleurSubrillance);
                break;
        }
    }

    dessineColonne(numero) {
        let colonne = this.partie.getColonne(numero);
        // draw the cards
        let x = (numero ) * this.carteLargeur * largeurCartePlusEspace;
        let y = 0;

        for (let i = 0; i < colonne.getNbCartes(); i++) {
            let surbrillance = "";
            let carteAffichee = colonne.getCarteN(i);
            if ((this.partie.cartePeutMonterSurUneColonne(carteAffichee)>=0) && (i+1===colonne.getNbCartes())){
                surbrillance = couleurCarteCliquable;
            }
            if (this.partie.cartePeutMonterDansLaPile(carteAffichee)) {
                surbrillance = couleurCarteMontable;
            }
            this.dessineCarte(carteAffichee, x, y, "Colonne", surbrillance);
            y += this.carteHauteurTete;
        }
    }

    dessinePile(numero) {
        let pile = this.partie.getPile(numero);
        // draw the cards
        let x = (numero ) * (this.carteLargeur * largeurCartePlusEspace);
        let y = 0;
        if (pile.getCarte() != null) {
            this.dessineCarte(pile.getCarte(), x, y, "Pile");
        } else {
            this.dessineCarteVide("pile", x, y, "Pile");
            this.dessineTextePileVide(pile, x + largeurDesCartes / 5, y + hauteurDesCartes / 3);
        }
    }

    dessineCaseLibre(numero) {
        let caseLibre = this.partie.getCaseLibre(numero);
        // console.log("dessineCaseLibre " + numero);
        // draw the cards
        let x = (numero ) * (this.carteLargeur * largeurCartePlusEspace);
        let y = 0;
        let carte = caseLibre.getCarte();
        if (carte != null) {
            let couleur = "";
            if (this.partie.cartePeutMonterSurUneColonne(carte) >= 0) {
                couleur = "lightgreen";
            }
            if (this.partie.cartePeutMonterDansLaPile(carte)) {
                couleur = "yellow";
            }
            this.dessineCarte(carte, x, y, "CaseLibre", couleur);
        } else {
            console.log("carte case libre " + numero + " vide");
            this.dessineCarteVide("motif", x, y, "CaseLibre");
        }
    }

    afficheCarteSuivantePile(numeroPile) {
        let carteDescendant;
        let pile = this.partie.getPile(numeroPile);
        let carte = pile.getCarte();
        if (carte == null) {
            console.warn("carte null ! 1");
            carteDescendant = new Carte(1, pile.getCouleur());
        } else {
            carteDescendant = new Carte(carte.valeur, carte.couleur);
            carteDescendant.valeur += 1;
        }
        this.metEnSurbrillance(carteDescendant, couleurCarteSuivantPile);
    }

    afficheCartesSuivantesPiles() {
        for (let i = 0; i < 4; i++) {
            this.afficheCarteSuivantePile(i);
        }
    }

    jouer(coup) {
        coup.jouer(this.partie);
        this.ajouteHistorique(coup.shortDesc().trim() + " ");
        this.affiche();
        this.partie.coup = new Coup();
    }

    // Cette méthode est appelée par le bouton "Monte !" du menu
    // Elle tente de monter une carte sur une pile
    joueCarteAmonter() {
        let carte;
        for (let i = 0; i < NB_COLONNES; i++) {
            // Si la colonne n'est pas vide
            if (!this.partie.getColonne(i).estVide()) {
                carte = this.partie.getColonne(i).getCarte();
                if (carte.estValide() && this.partie.cartePeutMonterDansLaPile(carte)) {
                    let numeroPile = this.partie.getIndexPileCouleurCarte(carte);
                    let coup = new Coup(carte, "COL" + (i), "PIL" + (numeroPile));
                    // console.log(" Mon coup : carte " + carte + " coup : " + coup.toString());
                    this.jouer(coup);
                    return;
                }
            }
        }
        // Parcourt les cases libres pour tenter de les monter :
        for(let i=0; i < NB_PILES; i++){
            if (!this.partie.getCaseLibre(i).estLibre()) {
                carte = this.partie.getCaseLibre(i).getCarte();
                if (carte.estValide() && this.partie.cartePeutMonterDansLaPile(carte)) {
                    let numeroPile = this.partie.getIndexPileCouleurCarte(carte);
                    let coup = new Coup(carte, "CEL" + (i), "PIL" + (numeroPile));
                    // console.log(" Mon coup : carte " + carte + " coup : " + coup.toString());
                    this.jouer(coup);
                    return;
                }
            }
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
        for (let i = 0; i < NB_COLONNES; i++) {
            console.log("dessineColonne " + i);
            this.dessineColonne(i);
        }
        for (let i = 0; i < NB_PILES; i++) {
            console.log("dessinePile " + i);
            this.dessinePile(i);
        }
        for (let i = 0; i < NB_PILES; i++) {
            console.log("dessineCaseLibre " + i);
            this.dessineCaseLibre(i);
        }
        this.log = bckplog;
        if (this.partie.verifieVictoire()) {
            alert("Conglaturations :D !");
        }
        if (this.partie.compterLesCartesEnJeu() !== 52) {
            alert("Il manque des cartes ! Il n'y en a que " + this.partie.compterLesCartesEnJeu() + " !");
        }
    }

    onClickColonne() {
        // get x y of mouse click
        let x = event.clientX - document.getElementById("canvasColonne").offsetLeft;
        let y = event.clientY - document.getElementById("canvasColonne").offsetTop;
        console.log("click x = " + x + " y = " + y);

        // get the column number
        let numeroColonne = Math.floor(x / (largeurCartePlusEspace * this.carteLargeur)) ;

        // get the card number
        let numeroCarte = Math.floor(y / this.carteHauteurTete) +1;
        console.log("click sur colonne " + (numeroColonne +1 )+ " carte " + (numeroCarte ));

        // détermine si le clic est magique : si on clique plus bas que l'en-tête de la dernière carte
        let clicMagique = false;
        if (numeroCarte > this.partie.getColonne(numeroColonne).getNbCartes() && this.partie.getColonne(numeroColonne).getNbCartes() > 0) {
            numeroCarte = this.partie.getColonne(numeroColonne).getNbCartes();
            clicMagique = true;
        }

        // get the card
        let colonne = this.partie.getColonne(numeroColonne);
        let carte = colonne.getCarteN(numeroCarte - 1);
        if (carte == null) {
            console.log("carte null");
        } else {
            console.log("---- carte : " + carte.getNom() + " " + carte.valeur + " " + carte.couleur);
        }
        if (clicMagique) {
            console.log("click magique sur colonne " + (numeroColonne +1 ) + " carte " + numeroCarte);
            let clickMagiqueOk = this.partie.cartePeutMonterDansLaPile(carte);
            console.log("click magique ok ? " + clickMagiqueOk + " carte : " + carte.getNom() );
            let indexMaPile = this.partie.getIndexPileCouleurCarte(carte);
            if (clickMagiqueOk) {
                this.partie.coup.carte = carte;
                this.partie.coup.origine = "COL" + numeroColonne;
                this.partie.coup.destination = "PIL" + indexMaPile;
                console.log("Montée de colonnes vers pile ok !");
            } else {
                // on tente de déplacer une carte de la colonne vers une autre colonne
                let colonne = this.partie.cartePeutMonterSurUneColonne(carte);
                if (colonne >= 0) {
                    this.partie.coup.carte = carte;
                    this.partie.coup.origine = "COL" + numeroColonne;
                    this.partie.coup.destination = "COL" + colonne;
                    console.log("Montée de colonnes vers colonnes ok !");
                }
            }
        }

        // Cas du premier clic
        if (this.partie.coup.carte == null) {
            this.gerePremierClickSurColonne(carte, numeroColonne, numeroCarte);

        } else {
            // Cas du second clic
            if (
                this.partie.coup.destination == null || this.partie.coup.destination === "") {
                this.partie.coup.destination = "COL" + numeroColonne;
                console
                    .log("Second clic, coup : " + this.partie.coup.carte.valeur + ' ' + this.partie.coup.carte.couleur + ' ' + this.partie.coup.origine + " " + this.partie.coup.destination);
            }
            if (this.partie.coup.coupValable(this.partie)) {
                this.jouer(partie.coup);
            }
        }
    }

    gerePremierClickSurColonne(carte, numeroColonne, numeroCarte) {
        this.partie.coup.carte = carte;
        this.partie.coup.origine = "COL" + (numeroColonne);
        let x = (numeroColonne ) * (this.carteLargeur * largeurCartePlusEspace);
        let y = (numeroCarte - 1) * this.carteHauteurTete;
        this.metEnSurbrillance(carte, couleurCarteJouee);
        if (carte.valeur > 1) {
            if (carte.estRouge()) {
                let carteAscendant = new Carte(carte.valeur + 1, "T");
                this.metEnSurbrillance(carteAscendant, couleurCarteAscendante);
                carteAscendant = new Carte(carte.valeur + 1, "P");
                this.metEnSurbrillance(carteAscendant, couleurCarteAscendante);

            } else {
                let carteAscendant = new Carte(carte.valeur + 1, "C");
                this.metEnSurbrillance(carteAscendant, couleurCarteAscendante);
                carteAscendant = new Carte(carte.valeur + 1, "K");
                this.metEnSurbrillance(carteAscendant, couleurCarteAscendante);
            }
        }
        if (carte.valeur < 13) {
            if (carte.estRouge()) {
                let carteDescendant = new Carte(carte.valeur -1, "T");
                this.metEnSurbrillance(carteDescendant, couleurCarteDescendante);
                carteDescendant = new Carte(carte.valeur - 1, "P");
                this.metEnSurbrillance(carteDescendant, couleurCarteDescendante);

            } else {
                let carteDescendant = new Carte(carte.valeur - 1, "C");
                this.metEnSurbrillance(carteDescendant, couleurCarteDescendante);
                carteDescendant = new Carte(carte.valeur - 1, "K");
                this.metEnSurbrillance(carteDescendant, couleurCarteDescendante);
            }
        }
        console.log("x : " + x + " y : " + y);
        console.log("Premier clic, coup : " + this.partie.coup.carte.valeur + ' ' + this.partie.coup.carte.couleur + ' ' + this.partie.coup.origine + " ");
    }

    onClickPile() {
        // get x y of mouse
        let x = event.clientX;
        let numeroPile = Math.floor((x - document.getElementById("canvasPile").offsetLeft) / (this.carteLargeur * largeurCartePlusEspace)) ;
        let y = event.clientY - document.getElementById("canvasPile").offsetTop;
        console.info("click x = " + x + " y = " + y);
        console.log("numeroPile : " + numeroPile);
        let pile = this.partie.getPile(numeroPile);
        let carte = pile.getCarte();

        let clicMagique = false;
        let numeroCarte = Math.floor(y / this.carteHauteurTete) + 1;
        if (numeroCarte > 1) {
            clicMagique = true;
        }
        if (clicMagique) {
            if (carte != null) {
                this.partie.coup.carte = carte;
                this.partie.coup.origine = "PIL" + numeroPile;
                this.partie.coup.destination = "PIL" + numeroPile;
                console.info("coup : " + this.partie.coup.carte.valeur + ' ' + this.partie.coup.carte.couleur + ' ' + this.partie.coup.origine + " " + this.partie.coup.destination);
            }
        } else {
            // Si c'est un premier clic, on met en surbrillance la carte
            if (this.partie.coup.carte === null) {
                this.partie.coup.carte = carte;
                this.partie.coup.origine = "PIL" + numeroPile;
                this.metEnSurbrillance(carte, couleurCarteJouee);
                return (0);
            }
            this.partie.coup.destination = "PIL" + numeroPile;
            console.log("coup : " + this.partie.coup.carte.valeur + ' ' + this.partie.coup.carte.couleur + ' ' + this.partie.coup.origine + " " + this.partie.coup.destination);
        }
        this.jouer(partie.coup);
    }

    onClickCaseLibre() {
        // get x y of mouse
        let x = event.clientX - document.getElementById("canvasCaseLibre").offsetLeft;
        let y = event.clientY - document.getElementById("canvasCaseLibre").offsetTop;
        let numeroCaseLibre = Math.floor(x / (this.carteLargeur * largeurCartePlusEspace));
        let caseLibre = this.partie.getCaseLibre(numeroCaseLibre);
        let carte = caseLibre.getCarte();
        console.log("click x = " + x + " y = " + y);
        console.log("click sur case libre  " + numeroCaseLibre + " carte " + carte);

        // Si c'est un premier clic, on met en surbrillance la carte

        if (y > this.carteHauteurTete && carte != null) {

            console.log("click magique sur case libre " + numeroCaseLibre + " carte " + carte);
            let clickMagiqueOk = this.partie.cartePeutMonterDansLaPile(carte);
            let indexMaPile = this.partie.getIndexPileCouleurCarte(carte);
            if (clickMagiqueOk) {
                this.partie.coup.carte = carte;
                this.partie.coup.origine = "CEL" + numeroCaseLibre;
                this.partie.coup.destination = "PIL" + indexMaPile;
                console.log("Montée de case libre vers pile ok !");
            } else {
                // on tente de déplacer une carte de la colonne vers une autre colonne
                let colonne = this.partie.cartePeutMonterSurUneColonne(carte);
                if (colonne > 0) {
                    this.partie.coup.carte = carte;
                    this.partie.coup.origine = "CEL" + numeroCaseLibre;
                    this.partie.coup.destination = "COL" + colonne;
                    console.log("Descente de pile vers colonne ok !");
                }
            }
        } else {
            console.log("click normal sur case libre " + numeroCaseLibre + " carte " + carte);
        }

        // Si c'est le premier clic, on enregistre la carte à bouger, et on la met en surbrillance
        if (this.partie.coup.carte == null) {
            console.log("premier clic sur case libre " + numeroCaseLibre + " carte " + carte);
            this.partie.coup.carte = carte;
            this.partie.coup.origine = "CEL" + numeroCaseLibre;
            if (carte != null) {
                console.log("coup : " + this.partie.coup.carte.valeur + ' ' + this.partie.coup.carte.couleur + ' ' + this.partie.coup.origine + " ");
            }
            let x = (numeroCaseLibre) * (this.carteLargeur * largeurCartePlusEspace);
            let y = 0;
            this.dessineCarte(carte, x, y, "CaseLibre", couleurCarteJouee);
        }
        // Sinon, on enregistre la destination
        else {
            if (this.partie.coup.destination == null || this.partie.coup.destination === "") {
                this.partie.coup.destination = "CEL" + numeroCaseLibre;
                console.log("destination enregistrée : " + "CEL" + numeroCaseLibre);
            }
            console.log("coup lâché sur CEL carte : " + this.partie.coup.carte.valeur + ' ' + this.partie.coup.carte.couleur + " origine :" + this.partie.coup.origine + " destination : " + this.partie.coup.destination);
            this.jouer(this.partie.coup);
        }
    }

    arriere() {
        let coup = this.partie.listeDesCoups.deleteLastCoup();
        coup.annuler(this.partie);
        // Suppression du coup joué de la liste des coups joués
        const textarea = document.getElementById('historique');
        // Supprime la derniere entrée dans le textarea
        textarea.value = textarea.value.substring(0, textarea.value.lastIndexOf(" "));
        this.partie.listeDesCoups.deleteLastCoup();
        this.affiche();
    }

    ajouteHistorique(chaine) {
        const textarea = document.getElementById('historique');

// ✅ Append text
        textarea.value = textarea.value.trim() + " " + chaine.trim();
    }

    videHistorique() {
        const textarea = document.getElementById('historique');
        textarea.value = "Historique : ";
    }
}
