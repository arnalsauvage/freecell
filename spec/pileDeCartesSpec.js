describe("Suite de tests PileDeCartes.js", function() {
    let maPile;

    beforeEach(function() {
        maPile = new PileDeCartes ();
    });

    it("Test du constructeur et estVide", function() {
        expect(maPile.getNbCartes()).toEqual(0);
        expect(maPile.estVide()).toEqual(true);
    });

    it("Test de la fonction ajouteCarte, getNbCartes, getCarteN et getCarte", function() {
        let maCarte = new Carte(1, "C");
        maPile.ajouteCarte(maCarte);
        expect(maPile.estVide()).toEqual(false);
        expect(maPile.getNbCartes()).toEqual(1);
        expect(maPile.getCarteN(0).getNom()).toEqual("As de Coeur");
        expect(maPile.getCarte().getNom()).toEqual("As de Coeur");
    });

    it("Test de la fonction contientCarte", function() {
        let maCarte = new Carte(1, "C");
        maPile.ajouteCarte(maCarte);
        maCarte = new Carte(2, "C");
        maPile.ajouteCarte(maCarte);
        maCarte = new Carte(3, "C");
        maPile.ajouteCarte(maCarte);
        maCarte = new Carte(4, "C");
        maPile.ajouteCarte(maCarte);
        maCarte = new Carte(5, "C");
        maPile.ajouteCarte(maCarte);
        expect(maPile.contientCarte(new Carte(1, "C"))).toEqual(true);

    });

    it("Test de la fonction isEquivalent", function() {
        let maCarte = new Carte(1, "C");
        maPile= new PileDeCartes();
        let maPile2 = new PileDeCartes ();
        maPile.ajouteCarte(maCarte);
        maPile2.ajouteCarte(maCarte);
        maCarte = new Carte(2, "C");
        maPile.ajouteCarte(maCarte);
        maPile2.ajouteCarte(maCarte);
        maCarte = new Carte(3, "C");
        maPile.ajouteCarte(maCarte);
        maPile2.ajouteCarte(maCarte);
        expect(maPile.isEquivalent(maPile2)).toEqual(true);

    });

    it("Test de la fonction prendCarte", function() {
        let maCarte = new Carte(1, "C");
        maPile.ajouteCarte(maCarte);
        maCarte = new Carte(2, "C");
        maPile.ajouteCarte(maCarte);
        maCarte = new Carte(3, "C");
        maPile.ajouteCarte(maCarte);
        maCarte = new Carte(4, "C");
        maPile.ajouteCarte(maCarte);
        maCarte = new Carte(5, "C");
        maPile.ajouteCarte(maCarte);
        expect(maPile.contientCarte(new Carte(1, "C"))).toEqual(true);
        expect(maPile.getNbCartes()).toEqual(5);
        maPile.prendCarte();
        expect(maPile.getNbCartes()).toEqual(4);
        expect(maPile.contientCarte(new Carte(5, "C"))).toEqual(false);
    });
});

