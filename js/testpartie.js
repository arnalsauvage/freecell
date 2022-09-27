let TESTS_DISPLAY = false;

function testeCarte() {
    console.log("-- Tests ma carte : --");
    let maCarte = new Carte(11, "K");
    let nom = maCarte.getNom();
    let nbErreurs = 0;
    if (nom != "Valet de Carreau") {
        console.log("Erreur 1 : nom de carte = " + nom);
        nbErreurs++;
    }

    let autreCarte = new Carte(12, "T");
    let autrenom = autreCarte.getNom();
    if (autrenom != "Dame de Trèfle") {
        console.log("Erreur 2 : nom de autrecarte = " + autrenom);
        nbErreurs++;
    }

    if (!maCarte.peutPoserSur(autreCarte)) {
        console.log("Erreur 3 : carte ne peut pas se poser sur autrecarte");
        nbErreurs++;
    }

    autreCarte = new Carte(12, "P");
    if (!maCarte.peutPoserSur(autreCarte)) {
        console.log("Erreur 4 : carte se pose pas sur autrecarte");
        console.log(" Poser " + maCarte.getNom() + " sur " + autreCarte.getNom() + " :" + maCarte.peutPoserSur(autreCarte));
        nbErreurs++;
    }

    autreCarte = new Carte(12, "C");
    if (maCarte.peutPoserSur(autreCarte)) {
        console.log("Erreur 5 : carte se pose sur autrecarte");
        console.log(" Poser " + maCarte.getNom() + " sur " + autreCarte.getNom() + " :" + maCarte.peutPoserSur(autreCarte));
        nbErreurs++;
    }
    autreCarte = new Carte(11, "T");
    if (maCarte.peutPoserSur(autreCarte)) {
        console.log("Erreur 6 : carte se pose sur autrecarte");
        console.log(" Poser " + maCarte.getNom() + " sur " + autreCarte.getNom() + " :" + maCarte.peutPoserSur(autreCarte));
        nbErreurs++;
    }
    autreCarte = new Carte(10, "T");
    if (maCarte.peutPoserSur(autreCarte)) {
        console.log("Erreur 7 : carte se pose sur autrecarte");
        console.log(" Poser " + maCarte.getNom() + " sur " + autreCarte.getNom() + " :" + maCarte.peutPoserSur(autreCarte));
        nbErreurs++;
    }
    console.log("-- Fin  Tests ma carte : ----" + nbErreurs + " erreur(s) --");

}

function testeJeuDeCartes() {
    console.log("------- Tests JeuDeCarte : --------");
    let nbErreurs = 0;
    let monJeu = new JeuDeCartes();
    if (TESTS_DISPLAY) {
        monJeu.displayCards();
    }
    monJeu.melanger();
    if (TESTS_DISPLAY) {
        monJeu.displayCards();
    }
    if (monJeu.getNbCartes() != 52) {
        nbErreurs++;
        console.log("Erreur 8 : nombre de cartes = " + monJeu.getNbCartes());
    }
    if (monJeu.prendCarte() == null) {
        console.log("Erreur 9 : pas de carte");
        nbErreurs++;
    }
    if (monJeu.getNbCartes() != 51) {
        console.log("Erreur 10 : nombre de cartes = " + monJeu.getNbCartes());
        nbErreurs++;
    }
    console.log("-- Fin Tests JeuDeCarte : " + nbErreurs + " erreur(s) --");
}

function testePileDeCartes() {
    console.log("------- Test ma pile de cartes : -------");
    let pileDeCartes = new PileDeCartes;
    let maCarte = new Carte(11, "K");
    pileDeCartes.ajouteCarte(maCarte);
    maCarte = new Carte(1, "P");
    pileDeCartes.ajouteCarte(maCarte);
    pileDeCartes.ajouteCarte(new Carte(10, "C"));
    pileDeCartes.ajouteCarte(new Carte(12, "T"));
    pileDeCartes.ajouteCarte(new Carte(13, "K"));
    pileDeCartes.displayCards();
    if (pileDeCartes.getNbCartes() != 5) {
        console.log("Erreur 11 : nombre de cartes = " + pileDeCartes.getNbCartes());
    }
    if (pileDeCartes.prendCarte() == null) {
        console.log("Erreur 12 : pas de carte");
    }
    if (pileDeCartes.getNbCartes() != 4) {
        console.log("Erreur 13 : nombre de cartes = " + pileDeCartes.getNbCartes());
    }
    pileDeCartes.displayCards();
    console.log("-- Fin Test ma pile de cartes : --");
}

testeCarte();
testeJeuDeCartes();
testePileDeCartes();