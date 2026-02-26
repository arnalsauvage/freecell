import { Carte } from './Carte.js';

export class Import {
    static FORMAT_FR = {
        colors: ["P", "C", "K", "T"],
        values: { "V": 11, "D": 12, "R": 13, "A": 1, "X": 10 }
    };

    import(text, partie) {
        partie.initColonnes();
        const lines = text.split("\n");
        
        lines.forEach((line, i) => {
            if (i >= 8) return;
            const cards = line.trim().split(" ");
            cards.forEach(cardStr => {
                const card = this.parseCard(cardStr);
                if (card) partie.getColonne(i).ajouteCarte(card);
            });
        });
    }

    parseCard(str) {
        if (str.length < 2) return null;
        
        let valStr = str[0];
        let colStr = str[1].toUpperCase();

        if (str.length === 3 && str.startsWith("10")) {
            valStr = "10";
            colStr = str[2].toUpperCase();
        }

        let val = parseInt(valStr);
        if (isNaN(val)) val = Import.FORMAT_FR.values[valStr.toUpperCase()];
        
        if (!val || !Import.FORMAT_FR.colors.includes(colStr)) return null;
        
        return new Carte(val, colStr);
    }
}
