describe("Suite de tests pileDeCouleur.js", function() {
    let maPile;

    beforeEach(function() {
        maPile = new PileDeCouleur ("C");
    });

    it("Test du constructeur et getNbCartes", function() {
        expect(maPile.getCouleur()).toEqual("C");
        expect(maPile.getNbCartes()).toEqual(0);
    });

    it("Test de la fonction ajouteCarte", function() {
        let maCarte = new Carte(1, "C");
        expect(maPile.ajouteCarte(maCarte)).toEqual(true);
        for (let i = 3; i < 13; i++) {
            maCarte = new Carte(i, "");
            expect(maPile.ajouteCarte(maCarte)).toEqual(false);
        }
        for (let i = 1; i < 13; i++) {
            maCarte = new Carte(i, "K");
            expect(maPile.ajouteCarte(maCarte)).toEqual(false);
        }
        for (let i = 1; i < 13; i++) {
            maCarte = new Carte(i, "P");
            expect(maPile.ajouteCarte(maCarte)).toEqual(false);
        }
        for (let i = 1; i < 13; i++) {
            maCarte = new Carte(i, "T");
            expect(maPile.ajouteCarte(maCarte)).toEqual(false);
        }
        expect(maPile.getNbCartes(maCarte)).toEqual(1);
        maPile.prendCarte();
        expect(maPile.getNbCartes(maCarte)).toEqual(0);
    });
});

