describe("Suite de tests Coup.js", function () {
    let maCarte;
    let maCaseLibre;
    let monCoup;
    let maPartie;

    beforeEach(function () {
        maCarte = new Carte(1, "C");
        maCaseLibre = new CaseLibre();
        monCoup = new Coup(maCarte, "COL1", "CEL1");
        maPartie = new PartieSolitaire();
        maPartie.distribue(false);
    });

    it("Test du constructeur", function () {
        expect(monCoup.getCarte()).toEqual(new Carte(1, "C"));
        expect(monCoup.getOrigine()).toEqual("COL1");
        expect(monCoup.getDestination()).toEqual("CEL1");
    });

    it("Test des fonctions setOrigine et setDestination, verifieOrigineDest, getOrigine, getDestination", function () {
        monCoup = new Coup();
        // set array of chars to test

        let charsOk = ["COL0", "COL1", "COL2", "COL3", "COL4", "COL5", "COL6", "COL7",
           "CEL0", "CEL1", "CEL2", "CEL3","PIL0", "PIL1", "PIL2", "PIL3"];

        let charsKo = ["COL8", "COL9", "COL10", "COL11", "CEL12",
            "CEL4", "CEL5", "CEL6", "CEL7",
            "PIL4", "PIl5", "PIL6", "PIL7", "PIL8"];

        // Test origine ok COL1 COL2 COL3 ... COL8

        // parcours la boucle et test chaque origine
        for (let i = 0; i < charsOk.length; i++) {
            monCoup.setOrigine(charsOk[i]);
            expect(monCoup.getOrigine()).toEqual(charsOk[i]);

            monCoup.setDestination(charsOk[i]);
            expect(monCoup.getDestination()).toEqual(charsOk[i]);
        }

        // Test d'une origine ko COL0 COL9 COL10 COL11
        // Test origine ok COL1 COL2 COL3 ... COL8

        // parcours la boucle et test chaque origine
        for (let i = 0; i < charsKo.length; i++) {
            monCoup.setOrigine(charsKo[i]);
            expect(monCoup.getOrigine()).toEqual("");
            monCoup.setDestination(charsKo[i]);
            expect(monCoup.getDestination()).toEqual("");
        }
    });

    it("Test de la fonction getTypeOrigine", function () {
        monCoup.origine = "COL1";
        expect(monCoup.getTypeOrigine()).toEqual("COL");
        monCoup.origine = "CEL2";
        expect(monCoup.getTypeOrigine()).toEqual("CEL");
        monCoup.origine = "PIL3";
        expect(monCoup.getTypeOrigine()).toEqual("PIL");
        monCoup.origine = "COUCOU";
        expect(monCoup.getTypeOrigine()).toEqual("");
    });

    it("Test de la fonction getTypeDestination", function () {
        monCoup.destination = "COL1";
        expect(monCoup.getTypeDestination()).toEqual("COL");
        monCoup.destination = "CEL2";
        expect(monCoup.getTypeDestination()).toEqual("CEL");
        monCoup.destination = "PIL3";
        expect(monCoup.getTypeDestination()).toEqual("PIL");
        monCoup.destination = "COUCOU";
        expect(monCoup.getTypeDestination()).toEqual("");
    });

    it("Test de la fonction getTypeOrigine getTypeDestination, getNumOrigine getNumDestination()", function () {
        // given un coup valide, les infos remontent
        monCoup = new Coup(maCarte, "COL3", "COL1");
        expect(monCoup.getTypeOrigine()).toEqual("COL");
        expect(monCoup.getNumOrigine()).toEqual(3);
        expect(monCoup.getTypeDestination()).toEqual("COL");
        expect(monCoup.getNumDestination()).toEqual(1);

        // given un cou non renseigné, on renvoie du null et du vide
        monCoup = new Coup(maCarte, "dklfkdlfkd");
        expect(monCoup.getTypeOrigine()).toEqual("");
        expect(monCoup.getNumOrigine()).toEqual(null);
        expect(monCoup.getTypeDestination()).toEqual("");
        expect(monCoup.getNumDestination()).toEqual(null);

    });

    it('Test des fonctions GetNumOrigine et getNumDestination', function () {
        let charsTestees = ["COL1", "CEL2", "PIL3", "COL11"];

        let charsResult = [1, 2, 3, null];

        for (let i = 0; i < charsTestees.length; i++) {
            monCoup.setOrigine(charsTestees[i]);
            monCoup.setDestination(charsTestees[i]);
            expect(monCoup.getNumOrigine()).toEqual(charsResult[i]);
            expect(monCoup.getNumDestination()).toEqual(charsResult[i]);
        }

    });

    it("Test de la fonction isEquivalent(coup)", function () {
        // Test COL vers COL
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL3", "COL1");
        let autreCoup = new Coup(maCarte, "COL3", "COL1");
        expect(monCoup.isEquivalent(autreCoup)).toEqual(true);

        autreCoup.setOrigine("COL2");
        expect(monCoup.isEquivalent(autreCoup)).toEqual(false);

        autreCoup.setOrigine("COL3");
        autreCoup.setDestination("COL2");
        expect(monCoup.isEquivalent(autreCoup)).toEqual(false);

        autreCoup.setDestination("COL1");
        autreCoup.setCarte(new Carte(7, "K"));
        expect(monCoup.isEquivalent(autreCoup)).toEqual(false);

    });

    it("Test de la fonction evalueNombreDeCartesDeplacablesSelonColonneJouee(partie)", function () {

        for (let i = 0; i < 8; i++) {
            monCoup.origine = "COL" + (i );
            console.log("Test de la colonne " + monCoup.origine);
            console.log('Cartes déplaçables : ' + monCoup.evalueNombreDeCartesDeplacablesSelonColonneJouee(maPartie));
            expect(monCoup.evalueNombreDeCartesDeplacablesSelonColonneJouee(maPartie)).toEqual(5);
        }
        while(!maPartie.getColonne(7).estVide()){
            maPartie.getColonne(7).prendCarte();
            console.log('On vide une carte :' );
        }
        expect(maPartie.getNbColonnesVides()).toEqual(1);
        monCoup.origine = "COL1";
        expect(monCoup.evalueNombreDeCartesDeplacablesSelonColonneJouee(maPartie)).toEqual(10);

    });

    it("Test de la fonction recupPileCartesJouees(partie)", function () {
        // Déplacement d'une carte de COL à COL
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL3", "COL1");
        let maPile = new PileDeCartes();
        maPile.ajouteCarte(maCarte);
        expect(monCoup.recupPileCartesJouees(maPartie,2,false)).toEqual(maPile);

        // Déplacement de deux cartes de COL à COL
        // On bouge la dame de cœur Col4 vers roi de pique col 6
        maPile = new PileDeCartes();
        maCarte = new Carte(12, "C");
        maPile.ajouteCarte(maCarte);
        maPartie.getColonne(5).ajouteCarte(maCarte);
        maCarte = new Carte(13, "P");
        maPile.ajouteCarte(maCarte);

        monCoup = new Coup(maCarte, "COL6", "COL6");
        expect(monCoup.recupPileCartesJouees(maPartie,5,false)).toEqual(maPile);
    });

    it("Test de la fonction controleCarteJoueeEtOrigine", function () {
        // Given coup null ==> pas ok
        monCoup = new Coup(null, "", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);
        monCoup = new Coup(null, "COL3", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);
        monCoup = new Coup(null, "COL3", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);

        // Given la partie non mélangée

        // Coup 6 de Carreau de col3 OK
        console.log("---Test de la carte " + maCarte.toString());
        monCoup = new Coup(maCarte, "COL2", "COL0");
        //expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(true);

        // Coup 6 de Carreau de col2 KO
        monCoup = new Coup(maCarte, "COL1", "COL0");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);

        // On déplace le 6 de carreau de col3 vers la FreeCell 1
        maPartie.getColonne(2).prendCarte();
        maPartie.getCaseLibre(0).poseCarte(maCarte);
        expect(maPartie.getCaseLibre(0).getCarte()).toEqual(maCarte);

        // On tente un coup dont la carte et l'origine sont bonnes
        monCoup = new Coup(maCarte, "CEL0", "COL0");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(true);

        // Given mauvaise carte, test ko
        let mauvaiseCarte = new Carte(6, "C");
        monCoup = new Coup(mauvaiseCarte, "CEL0", "COL0");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);

        // Given case vide ==> test ko
        monCoup = new Coup(maCarte, "CEL1", "COL0");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);

    });

    it("Test de la fonction coupValable", function () {
        // D'une colonne vers l'autre Roi de carreau de COL2 vers COL1 refusé
        maCarte = new Carte(13, "K");
        monCoup = new Coup(maCarte, "COL1", "COL0");
        expect(monCoup.coupValable(maPartie)).toEqual(false);

        // 6 de carreau de col3 vers COL1 ok !
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL2", "COL0");
        expect(monCoup.coupValable(maPartie)).toEqual(true);

        // D'une colonne vers une cellule libre ==> ok roi de carreau de COL2 vers CEL1 ok
        maCarte = new Carte(13, "K");
        monCoup = new Coup(maCarte, "COL1", "CEL0");
        expect(monCoup.coupValable(maPartie)).toEqual(true);

        // D'une colonne vers une cellule occupée ==> ko
        maPartie.getCaseLibre(0).poseCarte(new Carte(1, "C"));
        monCoup = new Coup(maCarte, "COL1", "CEL0");
        expect(monCoup.coupValable(maPartie)).toEqual(false);

        // D'une colonne vers une pile avec la bonne carte ==> ok
        maCarte = new Carte(1, "P");
        monCoup = new Coup(maCarte, "COL7", "PIL0");
        expect(monCoup.coupValable(maPartie)).toEqual(true);
        maCarte = new Carte(7, "P");
        monCoup = new Coup(maCarte, "COL6", "PIL0");
        expect(monCoup.coupValable(maPartie)).toEqual(false);
    });

    it("Test de la fonction jouer(partie)", function () {
        // Test COL vers COL : 6 de carreau COL 3 vers 7 de trèfle COL1
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL2", "COL0");
        expect(maPartie.getColonne(2).getCarte().isEquivalent(maCarte)).toEqual(true);
        expect(maPartie.getColonne(0).getNbCartes()).toEqual(7);
        expect(monCoup.recupPileCartesJouees(maPartie,2,false).getNbCartes()).toEqual(1);
        console.log ("coupSpec.js : avant jouer pile trouvee " + monCoup.recupPileCartesJouees(maPartie,2,false).toString());
        monCoup.jouer(maPartie); //
        expect(maPartie.getColonne(0).getNbCartes()).toEqual(8);
        expect(maPartie.getColonne(2).getCarte().isEquivalent(maCarte)).toEqual(false);
        console.debug("coupSpec.js - " + maPartie.getColonne(1).getCarte().getNom());
        expect(maPartie.getColonne(0).getCarte().isEquivalent(maCarte)).toEqual(true);

        // TODO ==> traiter les  cas :
        // Test COL vers COL avec plusieurs cartes
        // Test COL vers CEL ok
        // Test COL vers CEL ko
        // Test COL (plusieurs cartes) vers CEL ko
        // Test COL vers PIL ok
        // Test COL vers PIL ko
        // Test COL (plusieurs cartes) vers PIL ko

        // Test CEL vers COL
        // Test CEL vers PIL
        // Test CEL vers CEL
    });

    it("Test de la fonction annuler(partie)", function () {
        // Test COL vers COL - 6 de carreau Col 3 vers Col 1
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL2", "COL0");
        monCoup.jouer(maPartie);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(2).getCarte().isEquivalent(maCarte)).toEqual(true);
//
        console.log("coupSpec.js - trouvé   " + maPartie.getColonne(2).getCarte().getNom());
        // Test COL vers CEL 6 carreau COL3 vers Cellule 1
        monCoup = new Coup(maCarte, "COL2", "CEL0");
        monCoup.jouer(maPartie);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(2).getCarte().isEquivalent(maCarte)).toEqual(true);
//
        // Test COL vers PIL As de pique col 8 vers pile 1
        maCarte = new Carte(1, "P");
        monCoup = new Coup(maCarte, "COL7", "PIL0");
        monCoup.jouer(maPartie);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(7).getCarte().isEquivalent(maCarte)).toEqual(true);

        // Test CEL vers COL : on bouge le 6 de carreau vers la cellule 1
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL2", "CEL0");
        monCoup.jouer(maPartie);
        expect(maPartie.getCaseLibre(0).getCarte().isEquivalent(maCarte)).toEqual(true);

        // On descend le 6 de carreau vers la colonne 1
        maCarte = new Carte(6, "K");
        let monCoup2 = new Coup(maCarte, "CEL0", "COL0");
        console.log("coupSpec.js - carte en bas de la colonne 1 : " + maPartie.getColonne(0).getCarte().getNom());
        monCoup2.jouer(maPartie);
        console.log("coupSpec.js - carte en bas de la colonne 1 : " + maPartie.getColonne(0).getCarte().getNom());
        expect(maPartie.getColonne(0).getCarte().isEquivalent(maCarte)).toEqual(true);

        monCoup2.annuler(maPartie);
        expect(maPartie.getCaseLibre(0).getCarte().isEquivalent(maCarte)).toEqual(true);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(2).getCarte().isEquivalent(maCarte)).toEqual(true);

        // Test CEL vers CEL
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL2", "CEL0");
        monCoup.jouer(maPartie);
        monCoup2 = new Coup(maCarte, "CEL0", "CEL1");
        monCoup2.jouer(maPartie);
        monCoup2.annuler(maPartie);
        expect(maPartie.getCaseLibre(0).getCarte().isEquivalent(maCarte)).toEqual(true);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(2).getCarte().isEquivalent(maCarte)).toEqual(true);

        // Test CEL vers PIL
        maCarte = new Carte(1, "P");
        monCoup = new Coup(maCarte, "COL7", "CEL0");
        monCoup2 = new Coup(maCarte, "CEL0", "PIL0");
        monCoup.jouer(maPartie);
        monCoup2.jouer(maPartie);
        monCoup2.annuler(maPartie);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(7).getCarte().isEquivalent(maCarte)).toEqual(true);
    });

    it("Test de la fonction shortDesc()", function () {
        maCarte = new Carte(1, "P");
        monCoup = new Coup(maCarte, "COL7", "CEL0");
        expect(monCoup.shortDesc()).toEqual("AP-COL7-CEL0");

        maCarte = new Carte(11, "C");
        monCoup = new Coup(maCarte, "COL7", "PIL0");
        expect(monCoup.shortDesc()).toEqual("VC-COL7-PIL0");

        maCarte = new Carte(12, "K");
        monCoup = new Coup(maCarte, "COL7", "COL0");
        expect(monCoup.shortDesc()).toEqual("DK-COL7-COL0");

        maCarte = new Carte(13, "T");
        monCoup = new Coup(maCarte, "CEL0", "CEL1");
        expect(monCoup.shortDesc()).toEqual("RT-CEL0-CEL1");

    });
});

