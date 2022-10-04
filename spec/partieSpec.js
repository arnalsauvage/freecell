describe("Suite de tests Partie.js", function () {

    let maPartie;
    beforeEach(function () {
        maPartie = new Partie();
    });

    it("Test du constructeur", function () {
        expect(maPartie.colonnes.length).toEqual(9);
        expect(maPartie.pile.length).toEqual(5);
        expect(maPartie.casesLibres.length).toEqual(5);
        expect(maPartie.listeDesCoups.getNbCoups()).toEqual(0);
    });

    it("Test de la fonction distribue et distribueColonne", function () {
        maPartie.distribue(false);
        for (let i = 1; i < 5; i++) {
            expect(maPartie.colonnes[i].getNbCartes()).toEqual(7);
        }
        for (let i = 5; i < 9; i++) {
            expect(maPartie.colonnes[i].getNbCartes()).toEqual(6);
        }
        expect(maPartie.colonnes[8].getCarte()).toEqual(new Carte(1, "P"));
        expect(maPartie.colonnes[1].getCarte()).toEqual(new Carte(7, "T"));

    });

    it("Test de la fonction melanger et getColonne", function () {
        maPartie.distribue(true);
        expect(maPartie.getColonne(8).getCarte()).not.toEqual(new Carte(1, "P"));
        expect(maPartie.getColonne(1).getCarte()).not.toEqual(new Carte(7, "T"));
    });

    it("Test de la fonction getColonne", function () {
        maPartie.distribue(false);
        expect(maPartie.getColonne(8).getCarte()).toEqual(new Carte(1, "P"));
        expect(maPartie.getColonne(1).getCarte()).toEqual(new Carte(7, "T"));
    });

    it("Test de la fonction getPileCouleurCarte", function () {
        maPartie.distribue(false);

        expect(maPartie.getPileCouleurCarte(new Carte(1, "P"))).toEqual(1);
        expect(maPartie.getPileCouleurCarte(new Carte(1, "C"))).toEqual(2);
        expect(maPartie.getPileCouleurCarte(new Carte(1, "K"))).toEqual(3);
        expect(maPartie.getPileCouleurCarte(new Carte(1, "T"))).toEqual(4);
    });

    it("Test de la fonction isCarteCliquable", function () {
        // Given la partie non mélangée
        maPartie.distribue(false);
        // Then seul l'as de pique est cliquable
        expect(maPartie.isCarteCliquable(new Carte(1, "C"))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1, "K"))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1, "T"))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1, "P"))).toEqual(true);

        // Given la partie non mélangée
        // When on déplace la carte 6K de la colonne 3 vers la colonne 1
        let monCoup = new Coup();
        monCoup.setOrigine("COL" + 3);
        let maCarte = maPartie.getColonne(3).prendCarte();
        maPartie.getColonne(1).ajouteCarte(maCarte);

        // Then le 6 de carreau et le 7 de trèfle sont cliquables
        expect(maPartie.isCarteCliquable(new Carte(6, "K"))).toEqual(true);

        console.log ("----------- test 7 de trèfle !!! --------------- ");
        expect(maPartie.isCarteCliquable(new Carte(7, "T"))).toEqual(true);
    });

    // À faire en cypress

    // onClickColonne
    // onClickPile

    it("Test de la fonction cartePeutMonterSurUneColonne(carte)", function () {
        maPartie.distribue(false);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(1).getCarte())).toEqual(0);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(2).getCarte())).toEqual(0);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(3).getCarte())).toEqual(1);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(4).getCarte())).toEqual(6);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(5).getCarte())).toEqual(1);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(6).getCarte())).toEqual(0);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(7).getCarte())).toEqual(0);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(8).getCarte())).toEqual(0);

    });

    it("Test de la fonction cartePeutMonterDansLaPile(carte)", function () {
        maPartie.distribue(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(1).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(2).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(3).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(4).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(5).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(6).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(7).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(8).getCarte())).toEqual(true);

    });

    // A faire en cypress
    // afficheCarteSuivantePile(numeroPile)
    //  onClickCaseLibre
    // arriere


    it("Test de la fonction verifieVictoire", function () {

        maPartie.distribue(false);
        let monCoup = new Coup();
        let maCarte = new Carte(1, "P");
        for (let i = 8; i > 0; i--) {
            while (!maPartie.getColonne(i).estVide()) {
                monCoup.setOrigine("COL" + i);
                maCarte = maPartie.getColonne(i).getCarte();
                monCoup.setCarte(maCarte);
                monCoup.setDestination("PIL" + maCarte.getCouleurNumero());
                console.log("--PartieSpec mon Coup (col " + i + ":  " + monCoup.toString());
                monCoup.jouer(maPartie);
            }
        }
        expect(maPartie.verifieVictoire()).toEqual(true);
    });

    it("Test de la fonction compteCasesLibres", function () {

        maPartie.distribue(false);
        let monCoup = new Coup();
        expect(maPartie.compteCasesLibres()).toEqual(4);
        for (let i = 1; i < 5; i++) {

            monCoup.setOrigine("COL" + 8);
            let maCarte = maPartie.getColonne(8).prendCarte();
            maPartie.getCaseLibre( i).poseCarte(maCarte);
            expect(maPartie.compteCasesLibres()).toEqual(4 - i);
        }
    });

    it("Test de la fonction chercheCarte", function () {

        maPartie.distribue(false);
        expect(maPartie.chercheCarte(new Carte(1, "P"))).toEqual("COL86");
        expect(maPartie.chercheCarte(new Carte(1, "C"))).toEqual("COL65");
        expect(maPartie.chercheCarte(new Carte(1, "K"))).toEqual("COL45");
        expect(maPartie.chercheCarte(new Carte(1, "T"))).toEqual("COL26");

    });

    it("Test de la fonction chercheDansColonne(carte, numColonne)", function () {

        maPartie.distribue(false);
        expect(maPartie.chercheDansColonne(new Carte(1, "P"), 1)).toEqual(-1);
        expect(maPartie.chercheDansColonne(new Carte(1, "P"), 8)).toEqual(6);

    });

    it("Test de la fonction cartesCliquables( numColonne)", function () {
        // Given la partie non mélangée
        maPartie.distribue(false);
        // Then la colonne 1 n'a qu'une carte cliquable
        let pileAttendue = new PileDeCartes();
        pileAttendue.ajouteCarte(new Carte(7, "T"));
        console.info("cartesCliquables(1) attendu : " + pileAttendue.toString());
        let pileRecue = maPartie.cartesCliquablesColonne(maPartie.getColonne(1));
        console.log("piles recue : " + pileRecue.toString() + " pile attendue : " + pileAttendue.toString());
        expect(pileRecue.isEquivalent(pileAttendue)).toEqual(true);

  /*      // Déplaçons la carte 6K de la colonne 3 vers la colonne 1
        let monCoup = new Coup();
        monCoup.setOrigine("COL" + 3);
        let maCarte = maPartie.getColonne(3).getCarte();
        monCoup.setCarte(maCarte);
        monCoup.setDestination("COL" + 1);
        console.log ("--PartieSpec mon Coup (col 3 vers col 1):  " + monCoup.toString());
        monCoup.jouer(maPartie);

        pileAttendue = new PileDeCartes();
        pileAttendue.ajouteCarte(new Carte(6, "K"));
        pileAttendue.ajouteCarte(new Carte(7, "T"));

        console.log("Pile Attendue : " + pileAttendue.toString());
        console.log("Pile obtenue : " + maPartie.cartesCliquablesColonne(maPartie.getColonne(1)).toString());
        expect(maPartie.cartesCliquablesColonne(maPartie.getColonne(1)).isEquivalent(pileAttendue));
        */

    });

    it("Test de la fonction compterLesCartesEnJeu( )", function () {
        // Given la partie non mélangée
        maPartie.distribue(false);
        expect(maPartie.compterLesCartesEnJeu()).toEqual(52);
    });
});


