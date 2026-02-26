export const TYPES_PILE = {
    COLONNE: 'COL',
    CELLULE: 'CEL',
    PILE: 'PIL'
};

export class Position {
    constructor(chainePosition) {
        if (!chainePosition) {
            throw new Error('Position invalide : ne doit pas être null');
        }
        
        this.typeDePile = chainePosition.substring(0, 3);
        this.numero = parseInt(chainePosition.substring(3, 4));
        this.indice = null;

        if (chainePosition.length >= 5 && this.typeDePile === TYPES_PILE.COLONNE) {
            this.indice = parseInt(chainePosition.substring(4));
        }
    }

    getTypeDePile() { return this.typeDePile; }
    getNumero() { return this.numero; }
    getIndice() { return this.indice; }

    estValide() {
        const typesValides = Object.values(TYPES_PILE);
        if (!typesValides.includes(this.typeDePile)) return false;
        
        if (this.typeDePile === TYPES_PILE.COLONNE) {
            return this.numero >= 0 && this.numero <= 7;
        }
        return this.numero >= 0 && this.numero <= 3;
    }
}
