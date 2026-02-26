import { Carte } from './Carte.js';

export class ListeCoups {
    #listeCoups;

    constructor() {
        this.#listeCoups = [];
    }

    addCoup(coup) {
        if (coup && coup.getDestination() && coup.getOrigine() && coup.getCarte() instanceof Carte) {
            this.#listeCoups.push(coup);
        } else {
            throw new Error("Le coup n'est pas valide");
        }
    }

    getCoup(index) { return this.#listeCoups[index]; }
    getNbCoups() { return this.#listeCoups.length; }
    getListeCoups() { return [...this.#listeCoups]; }
    
    setListeCoups(liste) { this.#listeCoups = [...liste]; }

    toString() {
        return this.#listeCoups.map(c => c.toString()).join("\n");
    }

    deleteLastCoup() {
        return this.#listeCoups.pop();
    }

    getLastCoup() {
        return this.#listeCoups[this.#listeCoups.length - 1];
    }
}
