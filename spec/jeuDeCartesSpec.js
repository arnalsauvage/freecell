describe("Suite de tests jeuDeCartes.js", function() {
    let maCarte;
    let maCaseLibre;
    let monCoup;
    let maPartie;

    beforeEach(function() {
        monJeu = new JeuDeCartes ();
    });

    it("Test du constructeur", function() {
        expect(monJeu.getNbCartes()).toEqual(52);
        maCarte = new Carte(13,"T");
        expect(monJeu.jeuDeCartes.prendCarte().isEquivalent(maCarte)).toEqual(true);
    });
    it("Test de la fonction melanger", function() {
        monJeu.melanger();
        maCarte = new Carte(13,"T");
        expect(monJeu.jeuDeCartes.prendCarte().isEquivalent(maCarte)).toEqual(false);
    });

    it("Test de prendCarte", function() {

        maCarte = monJeu.jeuDeCartes.prendCarte();
        maCarte = monJeu.jeuDeCartes.prendCarte();
        expect(monJeu.getNbCartes()).toEqual(50);
    });
});

