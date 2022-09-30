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

    it("Test de la fonction RecupCarteJouee", function() {
        // TODO

        // RECUPERE LA CARTE JOUEE DEPUIS COLONNE
        maCarte = new Carte (6, "K");
        monCoup = new Coup(maCarte,"COL3", "COL1");

        let autreCarte = monCoup.controleCarteJouee(maPartie);
        expect(autreCarte).toEqual(maCarte);

        // RECUPERE LA CARTE JOUEE DEPUIS CASE LIBRE
        maCarte = new Carte (7, "P");
        monCoup = new Coup(maCarte,"COL7", "CEL1");
        monCoup.jouer(maPartie);
        monCoup = new Coup(maCarte,"CEL1", "COL7");
        let autrecarte = monCoup.controleCarteJouee( maPartie);
        expect(autrecarte).toEqual(maCarte);
    });

    it("Test de la fonction jouer(partie)", function () {
        // Test COL vers COL
        maCarte = new Carte(6, "K");
        monCoup = new Coup(maCarte, "COL3", "COL1");
        monCoup.jouer(maPartie);
        expect(maPartie.getColonne(1).getCarte().isEquivalent(maCarte)).toEqual(true);

        // TODO ==> traiter les 5 cas
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

