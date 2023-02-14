// Class to import a deck from a text input

class Import {

    constructor() {
        // Format français : Pique, Coeur, Carreau, Trèfle, Valet, Dame, Roi, As
        this.formatFR = "PCKTVDRA";
        // Format anglais : Spade, Heart, Diamond, Club, Jack, Queen, King, Ace
        this.formetEN = "SHDCJQKA";
        this.format_choisi = "FR";
    }

    // Import a deck from a string
    // Returns a list of cards
    import(text, partie) {
        partie.initColonnes();
        let textColumns = text.split("\n");
        for (let i = 0; i < textColumns.length; i++) {
            console.log("Traitement de la colonne " + i + " : " + textColumns[i]);
            let textColumn = textColumns[i].split(" ");
            for (let j = 0; j < textColumn.length; j++) {
                console.log("Traitement de la carte " + j + " : " + textColumn[j]);
                let card = this.importCard(textColumn[j]);
                if (card) {
                    partie.colonnes[i + 1].ajouteCarte(card);
                }
            }
        }
    }

    // Import a card from a string
    // Returns a card
    importCard(text) {
        let card;
        let color = null;
        let value = null;

        if (text.length === 3) {
            // si le texte commence par "10", on le traite comme une carte de valeur 10
            if (text.slice(0, 2) === "10") {
                color = text[2];
                value = 10;
            }
        } else if (text.length === 2) {
            value = text[0];
            // Si la valeur est une lettre, on la passe en majuscule
            if (isNaN(value)) {
                value = value.toUpperCase();
            }
            // Selon la valeur de la carte, on la convertit en nombre
            if (value === "A") {
                value = 1;
            }
            if (this.format_choisi === "FR") {

                if (value === "V") {
                    value = 11;
                } else if (value === "D") {
                    value = 12;
                } else if (value === "R") {
                    value = 13;
                } else if (value === "X") {
                    value = 10;
                } else {
                    value = parseInt(value);
                }
            } else {
                if (value === "J") {
                    value = 11;
                } else if (value === "Q") {
                    value = 12;
                } else if (value === "K") {
                    value = 13;
                } else {
                    value = parseInt(value);
                }
            }
            color = text[1];
        }
        if (this.format_choisi !== "FR") {
            // Si color = S (pade), on le convertit en P
            if (color === "S") {
                color = "P";
            }
            // Si color = H (eart), on le convertit en C
            if (color === "H") {
                color = "C";
            }
            // Si color = D (iamonds), on le convertit en K
            if (color === "D") {
                color = "K";
            }
            // Si color = C (lover), on le convertit en T
            if (color === "C") {
                color = "T";
            }
        }
        // On crée la carte
        console.log("Carte créée Valeur : " + value + " Couleur : " + color);
        card = new Carte(value, color);
        return card;
    }
}
