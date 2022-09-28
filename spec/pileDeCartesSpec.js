describe("Suite de tests listeCoups.js", function() {
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

});

