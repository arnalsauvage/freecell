// Class to import a deck from a text input

// Format français : Pique, Coeur, Carreau, Trèfle, Valet, Dame, Roi, As, 10
const FORMAT_FR = {
    colors: ["P", "C", "K", "T"],
    values: ["V", "D", "R", "A", "X"]
};

// Format anglais : Spade, Heart, Diamond, Club, Jack, Queen, King, Ace

const FORMAT_EN = {
    colors: ["S", "H", "D", "C"],
    values: ["J", "Q", "K", "A"]
};

class Import {
    constructor() {
        this.formatChoisi = "FR";
    }

    // Search for a card in the given list of stacks
// Returns true if the card is found, false otherwise
    searchCardInStacks(card, stacks) {
        for (let i = 0; i < stacks.length; i++) {
            if (stacks[i].contientCarte(card)) {
                return true;
            }
        }
        return false;
    }

    // Import a deck from a string
    // Returns a list of cards in the Game
    import(text, partie) {
        partie.initColonnes();
        let textColumns = text.split("\n");
        for (let i = 0; i < textColumns.length; i++) {
            console.log("Traitement de la colonne " + i + " : " + textColumns[i]);
            let textColumn = textColumns[i].split(" ");
            for (let j = 0; j < textColumn.length; j++) {
                console.log("Traitement de la carte " + j + " : " + textColumn[j]);
                try {
                    let card = this.importCard(textColumn[j]);
                    if (card) {
                        if (this.searchCardInStacks(card, [...partie.colonnes, ...partie.pile, ...partie.casesLibres])) {
                            throw new Error("La carte existe déjà dans les colonnes, piles ou cases libres.");
                        }
                        partie.colonnes[i].ajouteCarte(card);
                    }
                } catch (error) {
                    console.log("Erreur lors de l'importation de la carte : " + error.message);
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

        console.log("Import de la carte " + text);

        // validate card
        try {
            card = this.validateCard(text, FORMAT_FR);
        } catch (error) {
            console.log("Erreur lors de la validation de la carte : " + error.message);
            return null;    // return null if the card is not valid
        }

        return card;
    }

    // Validate a card from a string and a language format
    validateCard(text, format) {
        // On vérifie que le texte n'est pas vide
        if (text.length === 0) {
            throw new Error("Le texte est vide.");
        }

        // On vérifie que le texte ne contient pas de caractères interdits
        if (text.match(/[^0-9A-Za-z]/)) {
            throw new Error("Le texte contient des caractères interdits.");
        }

        // On vérifie que le texte ne contient pas plus de 3 caractères
        if (text.length > 3) {
            throw new Error("Le texte contient plus de 3 caractères.");
        }

        // On vérifie que le texte ne contient pas moins de 2 caractères
        if (text.length < 2) {
            throw new Error("Le texte contient moins de 2 caractères.");
        }

        let value = text[0];
        let color = text[1].toUpperCase();

        if (text.length === 3 && text.slice(0, 2) === "10") {
            value = 10;
            color = text[2].toUpperCase();
        }

        // Si la valeur est une lettre, on la passe en majuscule
        // puis on vérifie qu'elle correspond au format attendu
        if (isNaN(value)) {
            value = value.toUpperCase();
            if (!format.values.includes(value)) {
                throw new Error("La valeur " + value + " est incorrecte.");
            }
        }

        if (!format.colors.includes(color)) {
            console.log("Format attendu : " + format.colors);
            throw new Error("La couleur " + color + " est incorrecte.");
        }

        if (this.formatChoisi === "FR") {
            const valueMap = {
                "V": 11,
                "D": 12,
                "R": 13,
                "A": 1,
                "X": 10
            };
            value = valueMap[value] || parseInt(value);
            if (!FORMAT_FR.colors.includes(color)) {
                throw new Error("La couleur " + color + " est incorrecte.");
            }
        } else {
            const valueMap = {
                "J": 11,
                "Q": 12,
                "K": 13,
                "A": 1
            };
            value = valueMap[value] || parseInt(value);
            if (!FORMAT_EN.colors.includes(color)) {
                throw new Error("La couleur " + color + " est incorrecte.");
            }
        }

        let carte = new Carte(value, color);
        return carte;
    }
}
