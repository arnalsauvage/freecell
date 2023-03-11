describe("Suite de tests jeuDeCartes.js", function() {
    let monJeu;
    let maCarte;

    beforeEach(function() {
        monJeu = new JeuDeCartes ();
    });

    it("Test du constructeur", function() {
        expect(monJeu.getNbCartes()).toEqual(52);
        maCarte = new Carte(13,"T");
        expect(monJeu.jeuDeCartes.prendCarte().isEquivalent(maCarte)).toEqual(true);
    });
    it("Test de la fonction melanger", function() {
        // Given deux jeux identiques
        let monJeuInitial = new JeuDeCartes ();
        expect(monJeu.jeuDeCartes.isEquivalent(monJeuInitial.jeuDeCartes)).toEqual(true);

        // When on mélange le jeu
        monJeu.melanger();

        // Then on s'attend à ce que les deux jeux soient différents
        let differences = 0;
        for (let i = 0; i < monJeu.getNbCartes(); i++) {
            if (!monJeu.jeuDeCartes.getCarteN(i).isEquivalent(monJeuInitial.jeuDeCartes.getCarteN(i))) {
                differences++;
            }
        }
        expect(differences).toBeGreaterThan(0);
    });

    it("Test de prendCarte", function() {

        maCarte = monJeu.jeuDeCartes.prendCarte();
        maCarte = monJeu.jeuDeCartes.prendCarte();
        expect(monJeu.getNbCartes()).toEqual(50);
    });
});

