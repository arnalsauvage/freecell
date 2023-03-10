describe("Suite de tests --- Import.js --- ", function() {

    it("Test de la méthode importCard ", function() {
        let partie = new PartieSolitaire();
        let monImport = new Import();
        let carte ;

        // Cas basique : on attend un 2 de pique ou un trois de coeur

        carte = monImport.importCard("2P");
        expect(carte.getValeur()).toEqual(2);
        expect(carte.getCouleur()).toEqual("P");

        carte = monImport.importCard("3C");
        expect(carte.getValeur()).toEqual(3);
        expect(carte.getCouleur()).toEqual("C");

        // Gestion des figures : on attend un 10, un valet, une dame, un roi ou un as

        carte = monImport.importCard("XK");
        expect(carte.getValeur()).toEqual(10);
        expect(carte.getCouleur()).toEqual("K");

        carte = monImport.importCard("VP");
        expect(carte.getValeur()).toEqual(11);
        expect(carte.getCouleur()).toEqual("P");

        carte = monImport.importCard("DT");
        expect(carte.getValeur()).toEqual(12);
        expect(carte.getCouleur()).toEqual("T");

        carte = monImport.importCard("RT");
        expect(carte.getValeur()).toEqual(13);
        expect(carte.getCouleur()).toEqual("T");

        carte = monImport.importCard("AC");
        expect(carte.getValeur()).toEqual(1);
        expect(carte.getCouleur()).toEqual("C");

        // Gestion des minuscules

        carte = monImport.importCard("xk");
        expect(carte.getValeur()).toEqual(10);
        expect(carte.getCouleur()).toEqual("K");

        carte = monImport.importCard("vp");
        expect(carte.getValeur()).toEqual(11);
        expect(carte.getCouleur()).toEqual("P");

    });

    it("Test de la méthode import ", function() {
        let partie = new PartieSolitaire();
        let monImport = new Import();
        let carte = monImport.import("AT XC 8K VC 6P VP DK\n" +
            "6T 4C XK 3C DC 7C XT\n" +
            "DP 2K 3P RP 2T 4P 4K\n" +
            "9T 5C VT 5T 5P 2P 8T\n" +
            "3T 6C AK XP VK RC\n" +
            "2C 8C 9K RK 3K AC\n" +
            "9P 7T DT 7P RT 6K\n" +
            "7K 4T 5K AP 8P 9C",partie);

        // On attend une dame de carreau en bas de la colonne 1
        expect(partie.getColonne(0).getCarte().getValeur()).toEqual(12);
        expect(partie.getColonne(0).getCarte().getCouleur()).toEqual("K");

        // On attend un dix de trefle en bas de la colonne 2
        expect(partie.getColonne(1).getCarte().getCouleur()).toEqual("T");
        expect(partie.getColonne(1).getCarte().getValeur()).toEqual(10);

        // On attend un 4 de carreau en bas de la colonne 3
        expect(partie.getColonne(2).getCarte().getCouleur()).toEqual("K");
        expect(partie.getColonne(2).getCarte().getValeur()).toEqual(4);

        // On attend un 8 de trèfle en bas de la colonne 4
        expect(partie.getColonne(3).getCarte().getCouleur()).toEqual("T");
        expect(partie.getColonne(3).getCarte().getValeur()).toEqual(8);

        // On attend un roi de coeur en bas de la colonne 5
        expect(partie.getColonne(4).getCarte().getCouleur()).toEqual("C");
        expect(partie.getColonne(4).getCarte().getValeur()).toEqual(13);

        // On attend un As de coeur en bas de la colonne 6
        expect(partie.getColonne(5).getCarte().getCouleur()).toEqual("C");
        expect(partie.getColonne(5).getCarte().getValeur()).toEqual(1);

        // On attend un 9 de pique en bas de la colonne 7
        expect(partie.getColonne(6).getCarte().getValeur()).toEqual(6);
        expect(partie.getColonne(6).getCarte().getCouleur()).toEqual("K");


        // On attend un 9 de coeur en bas de la colonne 8
        expect(partie.getColonne(7).getCarte().getValeur()).toEqual(9);
        expect(partie.getColonne(7).getCarte().getCouleur()).toEqual("C");

    });

});
