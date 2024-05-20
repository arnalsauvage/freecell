const PILE_COLONNE = 'COL';
const PILE_CELLULE = 'CEL';
const PILE_PILE = 'PIL';

// L'objet position permet de désigner n'importe quelle carte du jeu, ou une pile de cartes
// par exemple : COL1, CEL2, PIL3, COL29 (9è carte de la colonne 2); COL210 (10è carte de la colonne 2)
class Position {
    constructor(chainePosition) {
        if (chainePosition===null || chainePosition===undefined) {
            throw new Error('Position invalide : ne doit pas être null');
        }
        if (!chainePosition || chainePosition.length < 4 || chainePosition.length > 6) {
            throw new Error('Position invalide : ' + chainePosition + ' doit etre de la forme COL1, CEL2, PIL3, COL29, COL210, ...');
        }
        this.position = chainePosition;
        this.typeDePile = chainePosition.substring(0, 3);
        this.numero = parseInt(chainePosition.substring(3, 4));
        if (chainePosition.length === 5 && this.typeDePile === PILE_COLONNE) {
            this.indice = parseInt(chainePosition.substring(4, 5));
        }
        if (chainePosition.length === 6 && this.typeDePile === PILE_COLONNE) {
            this.indice = parseInt(chainePosition.substring(4, 6));
        }
    }

    // retourne le tpe de pile, COL, CEL ou PIL
    getTypeDePile() {
        return this.typeDePile;
    }

    // retourne le numéro de la pile, 0 à 7 pour les colonnes, 0 à 4 pour les cellules et les piles vides
    getNumero() {
        return this.numero;
    }

    // retourne l'indice de la carte dans la pile
    getIndice() {
        return this.indice;
    }

    // retourne true si la position est valide
    estValide() {
        const estPileValide = [PILE_COLONNE, PILE_CELLULE, PILE_PILE].includes(this.typeDePile);
        const estNumeroValide = this.typeDePile === PILE_COLONNE ? this.numero >= 1 && this.numero <= 7 : this.numero >= 1 && this.numero <= 4;
        return estPileValide && estNumeroValide;
    }
}