describe("Suite de tests Partie.js", function() {
    let maPile;

    beforeEach(function() {
        maPartie = new Partie ();
    });

    it("Test du constructeur", function() {
        expect(maPartie.colonne.length).toEqual(9);
        expect(maPartie.pile.length).toEqual(5);
        expect(maPartie.casesLibres.length).toEqual(5);
        expect(maPartie.listeDesCoups.getNbCoups()).toEqual(0);
    });

    it("Test de la fonction distribue et distribueColonne", function() {
        maPartie.distribue(false );
        for (let i = 1; i < 5; i++) {
            expect(maPartie.colonne[i].getNbCartes()).toEqual(7);
        }
        for (let i = 5; i < 9; i++) {
            expect(maPartie.colonne[i].getNbCartes()).toEqual(6);
        }
        expect(maPartie.colonne[8].getCarte()).toEqual(new Carte(1, "P"));
        expect(maPartie.colonne[1].getCarte()).toEqual(new Carte(7, "T"));

    });

    it("Test de la fonction melanger et getColonne", function() {
        maPartie.distribue(true );
        expect(maPartie.getColonne(8).getCarte()).not.toEqual(new Carte(1, "P"));
        expect(maPartie.getColonne(1).getCarte()).not.toEqual(new Carte(7, "T"));
    });

    it("Test de la fonction getColonne", function() {
        maPartie.distribue(false );
        expect(maPartie.getColonne(8).getCarte()).toEqual(new Carte(1, "P"));
        expect(maPartie.getColonne(1).getCarte()).toEqual(new Carte(7, "T"));
    });

    it("Test de la fonction getPileCouleurCarte", function() {
        maPartie.distribue(false );

        expect(maPartie.getPileCouleurCarte(new Carte(1,"P"))).toEqual(1);
        expect(maPartie.getPileCouleurCarte(new Carte(1,"C"))).toEqual(2);
        expect(maPartie.getPileCouleurCarte(new Carte(1,"K"))).toEqual(3);
        expect(maPartie.getPileCouleurCarte(new Carte(1,"T"))).toEqual(4);
    });

    it("Test de la fonction isCarteCliquable", function() {
        maPartie.distribue(false );
        expect(maPartie.isCarteCliquable(new Carte(1,"P"), maPartie.getColonne(1))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1,"C"), maPartie.getColonne(1))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1,"K"), maPartie.getColonne(1))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1,"T"), maPartie.getColonne(1))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1,"T"), maPartie.getColonne(2))).toEqual(false);
        expect(maPartie.isCarteCliquable(new Carte(1,"P"), maPartie.getColonne(8))).toEqual(true);

    });


});

