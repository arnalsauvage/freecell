describe("Suite de tests CaseLibre.js", function() {
    let carteAsDeCoeur;
    let maCaseLibre;

    beforeEach(function() {
        carteAsDeCoeur = new Carte (1, "C");
        maCaseLibre = new CaseLibre();
    });

    it("Test des fonctions poserCarte et getCarte", function() {
        maCaseLibre.poseCarte(carteAsDeCoeur);
        expect(maCaseLibre.getCarte()).toEqual(carteAsDeCoeur);

        expect(maCaseLibre.poseCarte(carteAsDeCoeur)).toEqual(false);
    });

    it("Test de la fonction prendCarte", function() {
        maCaseLibre.poseCarte(carteAsDeCoeur);
        expect(maCaseLibre.prendCarte()).toEqual(carteAsDeCoeur);
        expect(maCaseLibre.getCarte()).toEqual(null);
    });

});
