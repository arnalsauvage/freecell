describe("Suite de tests listeCoups.js", function() {
    let maListe;


    beforeEach(function() {
        maListe = new ListeCoups ();
    });

    it("Test du constructeur", function() {
        expect(maListe.getNbCoups()).toEqual(0);
    });

    it("Test de la fonction addCoup et GetCoup", function() {
        let monCoup = new Coup(new Carte(13,"T"), "COL1", "COL2");
        maListe.addCoup(monCoup);
        expect(maListe.getNbCoups()).toEqual(1);
    });

    it("Test de getCoup", function() {
        let monCoup = new Coup(new Carte(13,"T"), "COL1", "COL2");
        maListe.addCoup(monCoup);
        monCoup = new Coup(new Carte(1,"C"), "COL1", "COL2");
        maListe.addCoup(monCoup);
        expect(maListe.getNbCoups()).toEqual(2);
        expect(maListe.getCoup(0).getCarte().isEquivalent(new Carte(13,"T"))).toEqual(true);
    });

    it("Test de deleteLastCoup", function() {
        let monCoup = new Coup(new Carte(1,"C"), "COL1", "COL2");
        maListe.addCoup(monCoup);
        monCoup = new Coup(new Carte(13,"T"), "COL1", "COL2");
        maListe.addCoup(monCoup);
        expect(maListe.getCoup(1).getCarte().isEquivalent(new Carte(13,"T"))).toEqual(true);
        maListe.deleteLastCoup();
        expect(maListe.getNbCoups()).toEqual(1);
        expect(maListe.getCoup(0).getCarte().isEquivalent(new Carte(1,"C"))).toEqual(true);
    });});

