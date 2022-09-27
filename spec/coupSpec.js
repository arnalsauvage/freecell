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
        // D'une colonne vers l'autre
        maCarte = new Carte (13, "K");
        monCoup = new Coup(maCarte,"COL2", "COL1");
        expect(monCoup.coupValable(maPartie)).toEqual(false);
        maCarte = new Carte (6, "K");
        monCoup = new Coup(maCarte,"COL3", "COL1");
        expect(monCoup.coupValable(maPartie)).toEqual(true);

        // D'une colonne vers une cellule libre ==> ok
        maCarte = new Carte (13, "K");
        monCoup = new Coup(maCarte,"COL2", "CEL1");
        expect(monCoup.coupValable(maPartie)).toEqual(true);

        // D'une colonne vers une cellule occupée ==> ko
        maPartie.getCaseLibre(1).poseCarte(new Carte(1, "C"));
        monCoup = new Coup(maCarte,"COL2", "CEL1");
        expect(monCoup.coupValable(maPartie)).toEqual(false);

        // D'une colonne vers une pile avec la bonne carte ==> ok
        maCarte = new Carte (1, "P");
        monCoup = new Coup(maCarte,"COL8", "PIL1");
        expect(monCoup.coupValable(maPartie)).toEqual(true);
        maCarte = new Carte (7, "P");
        monCoup = new Coup(maCarte,"COL7", "PIL1");
        expect(monCoup.coupValable(maPartie)).toEqual(false);
    });

    it("Test de la fonction prendCarte", function() {
        maCaseLibre.poseCarte(maCarte);
        expect(maCaseLibre.prendCarte()).toEqual(maCarte);
        expect(maCaseLibre.getCarte()).toEqual(null);
    });

});
