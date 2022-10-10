describe("Suite de tests position.js", function() {
    let variable = "bidule";
    it("Test des fonctions constructeur getPile getNumero getIndice", function() {
        let position = new Position("COL7");
        expect(position.getPile()).toEqual("COL");
        expect(position.getNumero()).toEqual(7);
        expect(position.estValide()).toEqual(true);

        position = new Position("COL0");
        expect(position.estValide()).toEqual(false);

        position = new Position("PIL4");
        expect(position.getNumero()).toEqual(4);
        expect(position.getPile()).toEqual("PIL");
        expect(position.estValide()).toEqual(true);

        position = new Position("CEL2");
        expect(position.getNumero()).toEqual(2);
        expect(position.getPile()).toEqual("CEL");
        expect(position.estValide()).toEqual(true);
    });




});
