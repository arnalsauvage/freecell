class Position {

    constructor(position) {
        if (position === null) {
            return false;
        }
        if (position.length > 3 && position.length <= 6) {
            this.position = position;
            this.pile = position.substring(0, 3);
            this.numero = parseInt(position.substring(3, 4));
            if (position.length === 5) {
                this.indice = parseInt(position.substring(4, 5));
            }
            if (position.length === 6) {
                this.indice = parseInt(position.substring(4, 6));
            }
        }
    }

    getPile() {
        return this.pile;
    }

    getNumero() {
        return this.numero;
    }

    getIndice() {
        return  this.indice;
    }

    estValide() {
        if (!(this.pile === "COL" || this.pile === "CEL" || this.pile === "PIL")) {
            return false
        }
        if (this.pile === "COL") {
            if (this.numero < 1 || this.numero > 7) {
                return false;
            }
        } else {
            if (this.numero < 1 || this.numero > 4) {
                return false
            }
        }
        return true;
    }
}
