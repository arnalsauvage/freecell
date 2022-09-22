function testeCarte() {
    let maCarte = new Carte(11, "K");
    let nom = maCarte.getNom();
    console.log("Carte : " + nom);

    let autreCarte = new Carte(12, "T");
    let autrenom = autreCarte.getNom();
    console.log("Autre Carte : " + autrenom);

    console.log(" Poser carte sur autreCarte :");
    console.log(maCarte.peutPoserSur(autreCarte));

    autreCarte = new Carte(12, "P");
    console.log(" Poser " + maCarte.getNom() + " sur " + autreCarte.getNom() + " :" + maCarte.peutPoserSur(autreCarte));
    autreCarte = new Carte(12, "C");
    console.log(" Poser " + maCarte.getNom() + " sur " + autreCarte.getNom() + " :" + maCarte.peutPoserSur(autreCarte));

    autreCarte = new Carte(11, "T");
    console.log(" Poser " + maCarte.getNom() + " sur " + autreCarte.getNom() + " :" + maCarte.peutPoserSur(autreCarte));

    autreCarte = new Carte(10, "T");
    console.log(" Poser " + maCarte.getNom() + " sur " + autreCarte.getNom() + " :" + maCarte.peutPoserSur(autreCarte));
}

function testeJeuDeCartes() {
    let monJeu = new JeuDeCartes();
    monJeu.melanger();
    monJeu.displayCards();
}

function testePileDeCartes() {
    console.log("-- ma pile de cartes : --");
    let pileDeCartes = new PileDeCartes;
    let maCarte = new Carte(11, "K");
    pileDeCartes.ajouteCarte(maCarte);
    maCarte = new Carte(1, "P");
    pileDeCartes.ajouteCarte(maCarte);
    pileDeCartes.ajouteCarte(new Carte(10, "C"));
    pileDeCartes.ajouteCarte(new Carte(12, "T"));
    pileDeCartes.ajouteCarte(new Carte(13, "K"));
    pileDeCartes.displayCards();
}

testeCarte();
testeJeuDeCartes();
testePileDeCartes();