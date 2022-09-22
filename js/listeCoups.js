class ListeCoups {

    constructor() {
        this.listeCoups = new Array();

        this.log = 4; // 1 : debug , 2: info, 3 : warning , 4 : error
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

    setLog(log) {
        this.log = log;
    }

    getLog() {
        return this.log;
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