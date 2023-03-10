describe("Suite de tests position.js", function() {

    it("Test des fonctions constructeur getTypeDePile getNumero getIndice", function() {
        let position = new Position("COL7");
        expect(position.getTypeDePile()).toEqual("COL");
        expect(position.getNumero()).toEqual(7);
        expect(position.estValide()).toEqual(true);

        position = new Position("COL0");
        expect(position.estValide()).toEqual(false);

        position = new Position("PIL4");
        expect(position.getNumero()).toEqual(4);
        expect(position.getTypeDePile()).toEqual("PIL");
        expect(position.estValide()).toEqual(true);

        position = new Position("CEL2");
        expect(position.getNumero()).toEqual(2);
        expect(position.getTypeDePile()).toEqual("CEL");
        expect(position.estValide()).toEqual(true);

        // Dixième carte de la colonne 2
        position = new Position("COL210");
        expect(position.getNumero()).toEqual(2);
        expect(position.getTypeDePile()).toEqual("COL");
        expect(position.getIndice()).toEqual(10);

        // Neuvième carte de la colonne 2
        position = new Position("COL29");
        expect(position.getNumero()).toEqual(2);
        expect(position.getTypeDePile()).toEqual("COL");
        expect(position.getIndice()).toEqual(9);

    });
});
