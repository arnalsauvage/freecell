describe("Suite de tests PartieSolitaire.js", function () {

    let maPartie;
    beforeEach(function () {
        maPartie = new PartieSolitaire();
        maPartie.distribue(false);
    });

    it("Test du constructeur", function () {
        expect(maPartie.colonnes.length).toEqual(8);
        expect(maPartie.pile.length).toEqual(4);
        expect(maPartie.casesLibres.length).toEqual(4);
        expect(maPartie.listeDesCoups.getNbCoups()).toEqual(0);
    });

    it("Test de la fonction distribue et distribueColonne", function () {
        for (let i = 0; i < 4; i++) {
            expect(maPartie.colonnes[i].getNbCartes()).toEqual(7);
        }
        for (let i = 4; i < 8; i++) {
            expect(maPartie.colonnes[i].getNbCartes()).toEqual(6);
        }
        expect(maPartie.colonnes[7].getCarte()).toEqual(new Carte(1, "P"));
        expect(maPartie.colonnes[0].getCarte()).toEqual(new Carte(7, "T"));

    });

    it("Test de la fonction melanger et getColonne", function () {
        maPartie = new PartieSolitaire();
        maPartie.distribue(true);
        expect(maPartie.getColonne(7).getCarte()).not.toEqual(new Carte(1, "P"));
        expect(maPartie.getColonne(0).getCarte()).not.toEqual(new Carte(7, "T"));
    });

    it("Test de la fonction getColonne", function () {
        expect(maPartie.getColonne(7).getCarte()).toEqual(new Carte(1, "P"));
        expect(maPartie.getColonne(0).getCarte()).toEqual(new Carte(7, "T"));
    });


    it("Test de la fonction getNbCasesLibres", function () {
        let maCarte;
        expect(maPartie.getNbCasesLibres()).toEqual(4);
        for (let i = 0; i < 4; i++) {
            maCarte = maPartie.getColonne(2).prendCarte();
            maPartie.getCaseLibre(i).poseCarte(maCarte);
            expect(maPartie.getNbCasesLibres()).toEqual(4 - i -1);
        }
    });

    it("Test de la fonction getNbColonnesVides", function () {
        expect(maPartie.getNbColonnesVides()).toEqual(0);
        let maCarte;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                maCarte = maPartie.getColonne(i).prendCarte();

            }
            expect(maPartie.getNbColonnesVides()).toEqual( i+1);
        }
    });

    // À faire en cypress

    // onClickColonne
    // onClickPile

    // test fonction getIndexPileCouleurCarte
    it("Test de la fonction getIndexPileCouleurCarte", function () {
        expect(maPartie.getIndexPileCouleurCarte(new Carte(1, "P"))).toEqual(0);
        expect(maPartie.getIndexPileCouleurCarte(new Carte(1, "C"))).toEqual(1);
        expect(maPartie.getIndexPileCouleurCarte(new Carte(1, "K"))).toEqual(2);
        expect(maPartie.getIndexPileCouleurCarte(new Carte(1, "T"))).toEqual(3);
    });

    // test fonction isCarteCliquable
    it("Test de la fonction isCarteCliquable", function () {
        let maCarte;
        //Basique : au début, les 8 cartes en bas des colonnes sont cliquables
        for (let j = 0; j < 8; j++) {
            maCarte = maPartie.getColonne(j).getCarte();
            console.log("Itération "+  j +  " : maCarte = " + maCarte.getNom());
            expect(maPartie.isCarteCliquable(maCarte)).toEqual(true);
        }
        // Given la partie non mélangée
        // Then seul l'as de pique est cliquable
        expect(maPartie.isCarteCliquable(new Carte(1, "C"))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1, "K"))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1, "T"))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1, "P"))).toEqual(true);

        // Given la partie non mélangée
        // When on déplace la carte 6K de la colonne 3 vers la colonne 1
        let monCoup = new Coup();
        monCoup.setOrigine("COL" + 3);
        maCarte = maPartie.getColonne(2).prendCarte();
        maPartie.getColonne(1).ajouteCarte(maCarte);

        // Then le 6 de carreau et le 7 de trèfle sont cliquables
        expect(maPartie.isCarteCliquable(new Carte(6, "K"))).toEqual(true);

        console.log("----------- test 7 de trèfle !!! --------------- ");
        expect(maPartie.isCarteCliquable(new Carte(7, "T"))).toEqual(true);

    });

    // À faire en cypress

    // onClickColonne

    // onClickPile

    it("Test de la fonction cartePeutMonterSurUneColonne(carte)", function () {
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(0).getCarte())).toEqual(-1);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(1).getCarte())).toEqual(-1);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(2).getCarte())).toEqual(0);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(3).getCarte())).toEqual(5);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(4).getCarte())).toEqual(0);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(5).getCarte())).toEqual(-1);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(6).getCarte())).toEqual(-1);
        expect(maPartie.cartePeutMonterSurUneColonne(maPartie.getColonne(7).getCarte())).toEqual(-1);

    });

    it("Test de la fonction cartePeutMonterDansLaPile(carte)", function () {
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(0).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(1).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(2).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(3).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(4).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(5).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(6).getCarte())).toEqual(false);
        expect(maPartie.cartePeutMonterDansLaPile(maPartie.getColonne(7).getCarte())).toEqual(true);

    });

    // A faire en cypress
    // afficheCarteSuivantePile(numeroPile)
    //  onClickCaseLibre
    // arriere


    it("Test de la fonction verifieVictoire", function () {
        let monCoup = new Coup();
        let maCarte = new Carte(1, "P");
        let nombreMax = 60;
        let nbreBoucles =0;
        for (let i = 7; i >= 0; i--) {
            while (!maPartie.getColonne(i).estVide()&& nbreBoucles < nombreMax) {
                nbreBoucles++;
                console.log("nbreBoucles: " + nbreBoucles);
                monCoup.setOrigine("COL" + i);
                maCarte = maPartie.getColonne(i).getCarte();
                monCoup.setCarte(maCarte);
                monCoup.setDestination("PIL" + maCarte.getCouleurNumero()); // Todo vérfier numéro de pile car non changé suite à refacto 17/2
                console.log("--PartieSpec mon Coup (col " + i + ":  " + monCoup.toString());
                monCoup.jouer(maPartie);
            }
        }
        expect(maPartie.verifieVictoire()).toEqual(true);
    });

    it("Test de la fonction compteCasesLibres", function () {
        let monCoup = new Coup();
        expect(maPartie.compteCasesLibres()).toEqual(NB_PILES);
        for (let i = 0; i < NB_PILES; i++) {
            monCoup.setOrigine("COL" + 8);
            let maCarte = maPartie.getColonne(7).prendCarte();
            maPartie.getCaseLibre(i).poseCarte(maCarte);
            expect(maPartie.compteCasesLibres()).toEqual(NB_PILES - i -1);
        }
    });

    it("Test de la fonction chercheCarte", function () {
        expect(maPartie.chercheCarte(new Carte(1, "P"))).toEqual("COL76");
        expect(maPartie.chercheCarte(new Carte(1, "C"))).toEqual("COL55");
        expect(maPartie.chercheCarte(new Carte(1, "K"))).toEqual("COL35");
        expect(maPartie.chercheCarte(new Carte(1, "T"))).toEqual("COL16");
        expect(maPartie.chercheCarte(new Carte(13, "T"))).toEqual("COL01");

        // Tester une recherche dans une cellule
        // On va déplacer l'as de pique vers la Cellule 0

        let monCoup = new Coup();
        monCoup.setOrigine("COL7");
        let maCarte = maPartie.getColonne(7).getCarte();
        monCoup.setCarte(maCarte);
        monCoup.setDestination("CEL0");
        monCoup.jouer(maPartie);
        expect(maPartie.chercheCarte(new Carte(1, "P"))).toEqual("CEL0");

        // Tester une recherche dans une pile
        // On va déplacer l'as de pique vers la Pile de pique
        monCoup.setOrigine("CEL0");
        monCoup.setDestination("PIL0");
        monCoup.jouer(maPartie);
        expect(maPartie.chercheCarte(new Carte(1, "P"))).toEqual("PIL0");

    });

    it("Test de la fonction chercheDansColonne(carte, numColonne)", function () {
        expect(maPartie.chercheDansColonne(new Carte(1, "P"), 1)).toEqual(-1);
        expect(maPartie.chercheDansColonne(new Carte(1, "P"), 7)).toEqual(6);
    });

    it("Test de la fonction cartesCliquables( numColonne)", function () {
        // Given la partie non mélangée

        // Then la colonne 1 n'a qu'une carte cliquable
        let pileAttendue = new PileDeCartes();
        pileAttendue.ajouteCarte(new Carte(7, "T"));
        console.info("cartesCliquables(1) attendu : " + pileAttendue.toString());
        let pileRecue = maPartie.cartesCliquablesColonne(maPartie.getColonne(0));
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

        expect(maPartie.compterLesCartesEnJeu()).toEqual(52);
    });
});


