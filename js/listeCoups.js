class ListeCoups {

    constructor() {
        this.listeCoups = [];
    }

    addCoup(coup) {
        this.listeCoups.push(coup);
    }

    getCoup(index) {
        return this.listeCoups[index];
    }

    getNbCoups() {
        return this.listeCoups.length;
    }

    getListeCoups() {
        return this.listeCoups;
    }

    setListeCoups(listeCoups) {
        this.listeCoups = listeCoups;
    }

    // retourne la liste des coups sous forme de chaine de caractères
    toString() {
        let chaine = "";
        for (let i = 0; i < this.getNbCoups(); i++) {
            chaine += this.getCoup(i).toString() + "\n";
        }
        return chaine;
    }

    deleteCoup(index) {
        this.listeCoups.splice(index, 1);
    }

    deleteLastCoup() {
        return this.listeCoups.pop();
    }

    getLastCoup() {
        return this.listeCoups[this.getNbCoups() - 1];
    }
}
