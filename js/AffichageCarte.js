class AffichageCarte {

    metCarteEnSurbrillance(context, carte, x, y, couleurSurbrillance) {
        context.fillStyle = couleurSurbrillance;
        context.fillRect(x, y, this.carteLargeur, this.carteHauteurTete);
        this.dessineTexte(carte, context, x, y);
    }

    dessineFondDeCarte(context, carte, x, y) {
        if (carte != null) {
            if (this.partie.isCarteCliquable(carte)) {
                context.fillStyle = "white";
            } else {
                context.fillStyle = "lightgrey";
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

    dessineCarte(carte, x, y, tas, couleurSurbrillance = false) {
        let id = "canvas" + tas;
        let canvas = document.getElementById(id);
        let context = canvas.getContext("2d");

        this.dessineBordCarte(context, x, y, couleurSurbrillance);

        // couleur de fond
        this.dessineFondDeCarte(context, carte, x, y);
        if (couleurSurbrillance) {
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


}