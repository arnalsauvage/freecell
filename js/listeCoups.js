class ListeCoups {

    #listeCoups;
    constructor() {
        this.#listeCoups = [];
    }

    addCoup(coup) {
        if (coup && typeof coup.getDestination() === 'string' && typeof coup.getOrigine() ===   'string' && coup.getCarte() instanceof Carte && coup.getDestination() !== '' && coup.getOrigine() !== '') {
            this.#listeCoups.push(coup);
            console.log("Coup ajouté");
        }
        else    {
            throw new Error("Le coup n'est pas valide");
        }
    }

    getCoup(index) {
        return this.#listeCoups[index];
    }

    getNbCoups() {
        return this.#listeCoups.length;
    }

    getListeCoups() {
        return this.#listeCoups;
    }

    setListeCoups(listeCoups) {
        this.#listeCoups = listeCoups;
    }

    toString() {
        let chaine = "";
        this.#listeCoups.forEach(coup => {
            chaine += coup.toString() + "\n";
        });
        return chaine;
    }

    deleteCoup(index) {
        this.#listeCoups.splice(index, 1);
    }

    deleteLastCoup() {
        return this.#listeCoups.pop();
    }

    getLastCoup() {
        return this.#listeCoups[this.getNbCoups() - 1];
    }
}
