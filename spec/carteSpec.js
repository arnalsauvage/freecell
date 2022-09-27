describe("Suite de tests Carte.js", function() {
    let variable = "bidule";
    it("Test des fonctions getValeur setvaleur", function() {
        let carte = new Carte(1, 1);
        expect(carte.getValeur()).toEqual(1);

        for (let i = 1; i <= 13; i++) {
            carte.setValeur(i);
            expect(carte.getValeur()).toEqual(i);
        }
    });

    it("Test de la fonction isEquivalent", function() {
        let carte = new Carte(1, 1);
        let carte2 = new Carte(1, 1);
        expect(carte.isEquivalent(carte2)).toEqual(true);
        carte2.setValeur(2);
        expect(carte.isEquivalent(carte2)).toEqual(false);
        carte2.setValeur(1);
        carte2.setCouleurParNumero(2);
        expect(carte.isEquivalent(carte2)).toEqual(false);
    });

    it("Test des fonctions getCouleur setCouleur", function() {
        let carte = new Carte(1, "C");
        expect(carte.getCouleur()).toEqual("C");
        carte.setCouleur("T");
        expect(carte.getCouleur()).toEqual("T");
        carte.setCouleur("P");
        expect(carte.getCouleur()).toEqual("P");
        carte.setCouleur("K");
        expect(carte.getCouleur()).toEqual("K");
        carte.setCouleur("A");
        expect(carte.getCouleur()).toEqual("K");
    });

    it("Test de la fonction getNomCouleur", function() {
        let carte = new Carte(1, "P");
        expect(carte.getNomCouleur()).toEqual("Pique");
        carte.setCouleurParNumero(2);
        expect(carte.getNomCouleur()).toEqual("Coeur");
        carte.setCouleurParNumero(3);
        expect(carte.getNomCouleur()).toEqual("Carreau");
        carte.setCouleurParNumero(4);
        expect(carte.getNomCouleur()).toEqual("Trèfle");
    });

    it("Test de la fonction getIconeCouleur", function() {
        let carte = new Carte(1, "P");
        expect(carte.getIconeCouleur()).toEqual("♠");
        carte.setCouleurParNumero(2);
        expect(carte.getIconeCouleur()).toEqual("♥");
        carte.setCouleurParNumero(3);
        expect(carte.getIconeCouleur()).toEqual("♦");
        carte.setCouleurParNumero(4);
        expect(carte.getIconeCouleur()).toEqual("♣");
    });

    it("Test de la fonction setCouleurParNumero et getCouleur", function() {
        let carte = new Carte(1, 1);
        carte.setCouleurParNumero(1);
        expect(carte.getCouleur()).toEqual("P");
        carte.setCouleurParNumero(2);
        expect(carte.getCouleur()).toEqual("C");
        carte.setCouleurParNumero(3);
        expect(carte.getCouleur()).toEqual("K");
        carte.setCouleurParNumero(4);
        expect(carte.getCouleur()).toEqual("T");
    });

    it("Test de la fonction getCouleurParNumero", function() {
        let carte = new Carte(1, 1);
        expect(carte.getCouleurParNumero(1)).toEqual("P");
        expect(carte.getCouleurParNumero(2)).toEqual("C");
        expect(carte.getCouleurParNumero(3)).toEqual("K");
        expect(carte.getCouleurParNumero(4)).toEqual("T");
    });

    it("Initialisation d'une carte Valet de Carreau avec new Carte(11,K)", function() {
        let maCarte = new Carte(11, "K");
        let nom = maCarte.getNom();

        expect(nom).toBe("Valet de Carreau");
    });


    it("Test fonction peut poser valet de carreau sur dame de trèfle OK", function() {
        let maCarte = new Carte(11, "K");
        let autreCarte = new Carte(12, "T");

        expect(maCarte.peutPoserSur(autreCarte)).toBe(true);
    });

    it("getNomCourtfigure", function() {
        let maCarte = new Carte(1, "K");
        expect(maCarte.getNomCourtFigure()).toBe("A");
        maCarte.setValeur(11);
        expect(maCarte.getNomCourtFigure()).toBe("V");
        maCarte.setValeur(12);
        expect(maCarte.getNomCourtFigure()).toBe("D");
        maCarte.setValeur(13);
        expect(maCarte.getNomCourtFigure()).toBe("R");
        for (let i = 2; i <= 10; i++) {
            maCarte.setValeur(i);
            expect(maCarte.getNomCourtFigure()).toBe(""+i);
        }
    });

    it("fonctions estRouge et estNoir", function() {
        let maCarte = new Carte(1, "K");
        expect(maCarte.estRouge()).toBe(true);
        expect(maCarte.estNoir()).toBe(false);
        maCarte.setCouleur("T");
        expect(maCarte.estRouge()).toBe(false);
        expect(maCarte.estNoir()).toBe(true);
        maCarte.setCouleur("C");
        expect(maCarte.estRouge()).toBe(true);
        expect(maCarte.estNoir()).toBe(false);
        maCarte.setCouleur("P");
        expect(maCarte.estRouge()).toBe(false);
        expect(maCarte.estNoir()).toBe(true);
    });

    it("Test KO fonction peut poser valet de carreau sur trefle autre que dame False", function() {
        let maCarte = new Carte(11, "K");
        let autreCarte = new Carte(13, "T");
        expect(maCarte.peutPoserSur(autreCarte)).toBe(false);
        for (let i=1; i < 12; i++){
            autreCarte.setValeur(1);
            expect(maCarte.peutPoserSur(autreCarte)).toBe(false);
        }
    });

    it("Test fonction peut poser valet de carreau sur dame de pique Ok", function() {
        let maCarte = new Carte(11, "K");
        let autreCarte = new Carte(12, "P");
        expect(maCarte.peutPoserSur(autreCarte)).toBe(true);
    });

    it("Test fonction peut poser valet de carreau sur dame de carreau et coeur False", function() {
        let maCarte = new Carte(11, "K");

        let autreCarte = new Carte(12, "K");
        expect(maCarte.peutPoserSur(autreCarte)).toBe(false);

        autreCarte = new Carte(12, "C");
        expect(maCarte.peutPoserSur(autreCarte)).toBe(false);
    });

    it("Test getNom Initialisation d'une carte Dame de Trèfle avec new Carte(12,T)", function() {
        let maCarte = new Carte(12, "T");
        let nom = maCarte.getNom();

        expect(nom).toBe("Dame de Trèfle");
    });

});
