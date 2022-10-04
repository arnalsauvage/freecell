describe("Suite de tests Coup.js", function() {
    let maCarte;
    let maCaseLibre;
    let monCoup;
    let maPartie;

    beforeEach(function() {
        maCarte = new Carte (1, "C");
        maCaseLibre = new CaseLibre();
        monCoup = new Coup(maCarte,"COL1", "CEL1");
        maPartie = new Partie();
        maPartie.distribue(false);
    });

    it("Test du constructeur, getters, setters", function() {
        expect(monCoup.getCarte()).toEqual(new Carte(1, "C"));
        expect(monCoup.getOrigine()).toEqual("COL1");
        expect(monCoup.getDestination()).toEqual("CEL1");
    });

    it("Test de la fonction setOrigine", function() {

        // Test d'une origine ko COL0 COL9 COL10 COL11
        // Test origine ok COL1 COL2 COL3 ... COL8
        monCoup = new Coup ();
        monCoup.setOrigine("COL0");
        expect(monCoup.getOrigine()).toEqual("");

        monCoup.setOrigine("COL9");
        expect(monCoup.getOrigine()).toEqual("");

        monCoup.setOrigine("COL10");
        expect(monCoup.getOrigine()).toEqual("");

        monCoup.setOrigine("COL11");
        expect(monCoup.getOrigine()).toEqual("");

        for (let i = 1; i<9; i++){
            monCoup.setOrigine("COL" + i);
            expect(monCoup.getOrigine()).toEqual("COL" + i);
        }

        // Test d'une origine ko CEL0 CEL5 CEL6
        // Test origine ok CEL1 ... CEL4
        monCoup = new Coup ();
        monCoup.setOrigine("CEL0");
        expect(monCoup.getOrigine()).toEqual("");

        monCoup.setOrigine("CEL5");
        expect(monCoup.getOrigine()).toEqual("");

        monCoup.setOrigine("CEL6");
        expect(monCoup.getOrigine()).toEqual("");

        monCoup.setOrigine("CEL11");
        expect(monCoup.getOrigine()).toEqual("");

        for (let i = 1; i<5; i++){
            monCoup.setOrigine("CEL" + i);
            expect(monCoup.getOrigine()).toEqual("CEL" + i);
        }

        // Test d'une origine ko PIL0 PIL5 PIL6
        // Test origine ok PIL1 ... PIL4
        monCoup = new Coup ();
        monCoup.setOrigine("PIL0");
        expect(monCoup.getOrigine()).toEqual("");

        monCoup.setOrigine("PIL5");
        expect(monCoup.getOrigine()).toEqual("");

        monCoup.setOrigine("PIL6");
        expect(monCoup.getOrigine()).toEqual("");

        monCoup.setOrigine("PIL11");
        expect(monCoup.getOrigine()).toEqual("");

        for (let i = 1; i<5; i++){
            monCoup.setOrigine("PIL" + i);
            expect(monCoup.getOrigine()).toEqual("PIL" + i);
        }
    });


    it("Test de la fonction coupValable", function() {
        // D'une colonnes vers l'autre
        maCarte = new Carte (13, "K");
        monCoup = new Coup(maCarte,"COL2", "COL1");
        expect(monCoup.coupValable(maPartie)).toEqual(false);
        maCarte = new Carte (6, "K");
        monCoup = new Coup(maCarte,"COL3", "COL1");
        expect(monCoup.coupValable(maPartie)).toEqual(true);

        // D'une colonnes vers une cellule libre ==> ok
        maCarte = new Carte (13, "K");
        monCoup = new Coup(maCarte,"COL2", "CEL1");
        expect(monCoup.coupValable(maPartie)).toEqual(true);

        // D'une colonnes vers une cellule occupée ==> ko
        maPartie.getCaseLibre(1).poseCarte(new Carte(1, "C"));
        monCoup = new Coup(maCarte,"COL2", "CEL1");
        expect(monCoup.coupValable(maPartie)).toEqual(false);

        // D'une colonnes vers une pile avec la bonne carte ==> ok
        maCarte = new Carte (1, "P");
        monCoup = new Coup(maCarte,"COL8", "PIL1");
        expect(monCoup.coupValable(maPartie)).toEqual(true);
        maCarte = new Carte (7, "P");
        monCoup = new Coup(maCarte,"COL7", "PIL1");
        expect(monCoup.coupValable(maPartie)).toEqual(false);
    });

    it("Test de la fonction controleCarteJoueeEtOrigine", function() {
        // Given coup null ==> pas ok
        monCoup =  new Coup(null,"", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);
        monCoup = new Coup(null,"COL3", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);
        maCarte = new Carte (6, "K");
        monCoup = new Coup(maCarte,"", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);
        monCoup = new Coup(null,"COL3", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);

        // Given la partie non mélangée

        // Coup 6 de Carreau de col3 OK
        monCoup = new Coup(maCarte,"COL3", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(true);

        // Coup 6 de Carreau de col2 KO
        monCoup = new Coup(maCarte,"COL2", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);

        // On déplace le 6 de carreau vers la FreeCell 1
        maPartie.getColonne(3).prendCarte();
        maPartie.getCaseLibre(1).poseCarte(maCarte);
        expect(maPartie.getCaseLibre(1).getCarte()).toEqual(maCarte);

        // On tente un coup dont la carte et l'origine sont bons
        monCoup = new Coup(maCarte,"CEL1", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(true);

        // Given mauvaise carte, test ko
        let mauvaiseCarte = new Carte (6,"C");
        monCoup = new Coup(mauvaiseCarte,"CEL1", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);

        // Given case vide ==> test ko
        monCoup = new Coup(maCarte,"CEL2", "COL1");
        expect(monCoup.controleCarteJoueeEtOrigine(maPartie)).toEqual(false);

    });

    it("Test de la fonction jouer(partie)", function () {
        // Test COL vers COL
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL3", "COL1");
        monCoup.jouer(maPartie);
        console.debug(maPartie.getColonne(1).getCarte());
        expect(maPartie.getColonne(1).getCarte().isEquivalent(maCarte)).toEqual(true);

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
        // Test COL vers COL
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL3", "COL1");
        monCoup.jouer(maPartie);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(3).getCarte().isEquivalent(maCarte)).toEqual(true);

        // Test COL vers CEL
        monCoup = new Coup(maCarte, "COL3", "CEL1");
        monCoup.jouer(maPartie);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(3).getCarte().isEquivalent(maCarte)).toEqual(true);

        // Test COL vers PIL
        maCarte = new Carte (1, "P");
        monCoup = new Coup(maCarte,"COL8", "PIL1");
        monCoup.jouer(maPartie);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(8).getCarte().isEquivalent(maCarte)).toEqual(true);

            // Test CEL vers COL
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL3", "CEL1");
        monCoup.jouer(maPartie);
        expect(maPartie.getCaseLibre(1).getCarte().isEquivalent(maCarte)).toEqual(true);
        let monCoup2 = new Coup(maCarte, "CEL1", "COL1");
        monCoup2.jouer(maPartie);
        expect(maPartie.getColonne(1).getCarte().isEquivalent(maCarte)).toEqual(true);
        monCoup2.annuler(maPartie);
        expect(maPartie.getCaseLibre(1).getCarte().isEquivalent(maCarte)).toEqual(true);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(3).getCarte().isEquivalent(maCarte)).toEqual(true);

        // Test CEL vers CEL
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL3", "CEL1");
        monCoup.jouer(maPartie);
        monCoup2 = new Coup(maCarte, "CEL1", "CEL2");
        monCoup2.jouer(maPartie);
        monCoup2.annuler(maPartie);
        expect(maPartie.getCaseLibre(1).getCarte().isEquivalent(maCarte)).toEqual(true);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(3).getCarte().isEquivalent(maCarte)).toEqual(true);

        // Test CEL vers PIL
        maCarte = new Carte (1, "P");
        monCoup = new Coup(maCarte,"COL8", "CEL1");
        monCoup2 = new Coup(maCarte,"CEL1", "PIL1");
        monCoup.jouer(maPartie);
        monCoup2.jouer(maPartie);
        monCoup2.annuler(maPartie);
        monCoup.annuler(maPartie);
        expect(maPartie.getColonne(8).getCarte().isEquivalent(maCarte)).toEqual(true);
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
});

