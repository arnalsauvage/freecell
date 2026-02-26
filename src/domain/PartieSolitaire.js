import { Coup } from './Coup.js';
import { ListeCoups } from './ListeCoups.js';
import { PileDeCartes } from './PileDeCartes.js';
import { PileDeCouleur } from './PileDeCouleur.js';
import { CaseLibre } from './CaseLibre.js';
import { JeuDeCartes } from './JeuDeCartes.js';
import { Position } from './Position.js';
import { Carte } from './Carte.js';

export const NB_COLONNES = 8;
export const NB_PILES = 4;
export const CARTES_PAR_COULEUR = 13;
export const TAB_COULEURS = ["P", "C", "K", "T"];

export class PartieSolitaire {
    constructor() {
        this.listeDesCoups = new ListeCoups();
        this.initColonnes();
        this.initPiles();
        this.initCasesLibres();
        this.donneInitiale = [];
    }

    initColonnes() {
        this.colonnes = Array.from({ length: NB_COLONNES }, () => new PileDeCartes());
    }

    initPiles() {
        this.pile = TAB_COULEURS.map(couleur => new PileDeCouleur(couleur));
    }

    initCasesLibres() {
        this.casesLibres = Array.from({ length: NB_PILES }, () => new CaseLibre());
    }

    distribue(melanger = true) {
        const jeu = new JeuDeCartes();
        if (melanger) jeu.melanger();

        for (let i = 0; i < NB_COLONNES; i++) {
            const nbCartes = i < 4 ? 7 : 6;
            for (let j = 0; j < nbCartes; j++) {
                this.colonnes[i].ajouteCarte(jeu.prendCarte());
            }
        }
    }

    getColonne(n) { return this.colonnes[n] || null; }
    getPile(n) { return this.pile[n] || null; }
    getCaseLibre(n) { return this.casesLibres[n] || null; }

    getNbCasesLibres() {
        return this.casesLibres.filter(c => c.estLibre()).length;
    }

    getNbColonnesVides() {
        return this.colonnes.filter(c => c.getNbCartes() === 0).length;
    }

    getIndexPileCouleurCarte(carte) {
        const index = TAB_COULEURS.indexOf(carte.couleur);
        return index === -1 ? null : index;
    }

    peutMonterDansLaPile(carte) {
        if (!carte) return false;
        const indexPile = this.getIndexPileCouleurCarte(carte);
        if (indexPile === null) return false;

        const pileFondation = this.getPile(indexPile);
        if (pileFondation.estVide()) {
            return carte.valeur === 1;
        }
        return carte.valeur === pileFondation.getCarte().valeur + 1;
    }

    cartePeutMonterSurUneColonne(carte) {
        if (!carte) return -1;
        for (let i = 0; i < NB_COLONNES; i++) {
            const col = this.getColonne(i);
            if (col.getNbCartes() === 0 || carte.peutPoserSur(col.getCarte())) {
                return i;
            }
        }
        return -1;
    }

    chercheCarte(carte) {
        if (!carte) return null;
        for (let i = 0; i < NB_COLONNES; i++) {
            for (let j = 0; j < this.colonnes[i].getNbCartes(); j++) {
                if (this.colonnes[i].getCarteN(j).isEquivalent(carte)) {
                    return `COL${i}${j + 1}`;
                }
            }
        }
        for (let i = 0; i < NB_PILES; i++) {
            if (this.pile[i].contientCarte(carte)) return `PIL${i}`;
        }
        for (let i = 0; i < NB_PILES; i++) {
            if (this.casesLibres[i].getCarte()?.isEquivalent(carte)) return `CEL${i}`;
        }
        return null;
    }

    isCarteCliquable(carte) {
        if (!carte) return false;
        const posStr = this.chercheCarte(carte);
        if (!posStr) return false;

        const pos = new Position(posStr);
        if (pos.getTypeDePile() === "COL") {
            const colonne = this.getColonne(pos.getNumero());
            if (colonne.getCarte()?.isEquivalent(carte)) return true;
            const cliquables = this.cartesCliquablesColonne(colonne);
            return cliquables.contientCarte(carte);
        }
        return pos.getTypeDePile() === "CEL";
    }

    cartesCliquablesColonne(colonne) {
        const cliquables = new PileDeCartes();
        if (!colonne || colonne.getNbCartes() === 0) return cliquables;

        cliquables.ajouteCarte(colonne.getCarte());
        for (let i = colonne.getNbCartes() - 2; i >= 0; i--) {
            const current = colonne.getCarteN(i);
            if (cliquables.getCarte().peutPoserSur(current)) {
                cliquables.ajouteCarte(current);
            } else {
                break;
            }
        }
        return cliquables;
    }

    arriere() {
        const coup = this.listeDesCoups.deleteLastCoup();
        if (coup) coup.annuler(this);
    }

    verifieVictoire() {
        return this.pile.every(p => p.getNbCartes() === CARTES_PAR_COULEUR);
    }

    estBloquee() {
        if (this.verifieVictoire()) return false;
        const sources = [];
        this.colonnes.forEach((col, i) => {
            if (!col.estVide()) {
                const cliquables = this.cartesCliquablesColonne(col);
                for(let j=0; j<cliquables.getNbCartes(); j++) {
                    sources.push({ carte: cliquables.getCarteN(j), pos: `COL${i}` });
                }
            }
        });
        this.casesLibres.forEach((cell, i) => {
            if (!cell.estLibre()) sources.push({ carte: cell.getCarte(), pos: `CEL${i}` });
        });

        for (const source of sources) {
            const indexPile = this.getIndexPileCouleurCarte(source.carte);
            const coupPile = new Coup(source.carte, source.pos, `PIL${indexPile}`);
            if (coupPile.estValide(this)) return false;

            for (let i = 0; i < NB_COLONNES; i++) {
                const coupCol = new Coup(source.carte, source.pos, `COL${i}`);
                if (coupCol.estValide(this)) return false;
            }

            for (let i = 0; i < NB_PILES; i++) {
                const coupCell = new Coup(source.carte, source.pos, `CEL${i}`);
                if (coupCell.estValide(this)) return false;
            }
        }
        return true;
    }

    demarrePartie(cibleDifficulte = null) {
        if (cibleDifficulte === null) {
            this.initColonnes();
            this.initPiles();
            this.initCasesLibres();
            this.distribue();
        } else {
            let meilleurTirage = null;
            let plusPetiteEcart = Infinity;
            for (let i = 0; i < 100; i++) {
                this.initColonnes();
                this.initPiles();
                this.initCasesLibres();
                this.distribue();
                const diffGeneree = this.calculerDifficulte();
                const ecart = Math.abs(diffGeneree - cibleDifficulte);
                if (ecart === 0) {
                    meilleurTirage = this.colonnes.map(col => [...col.pileDeCartes]);
                    break; 
                }
                if (ecart < plusPetiteEcart) {
                    plusPetiteEcart = ecart;
                    meilleurTirage = this.colonnes.map(col => [...col.pileDeCartes]);
                }
            }
            this.initColonnes();
            this.initPiles();
            this.initCasesLibres();
            meilleurTirage.forEach((cards, i) => {
                this.colonnes[i].pileDeCartes = cards;
            });
        }
        this.listeDesCoups = new ListeCoups();
        this.donneInitiale = this.colonnes.map(col => [...col.pileDeCartes]);
    }

    calculerDifficulte() {
        let score = 0;
        for (let i = 0; i < NB_COLONNES; i++) {
            const col = this.getColonne(i);
            const nb = col.getNbCartes();
            for (let j = 0; j < nb; j++) {
                const carte = col.getCarteN(j);
                const distDuBas = (nb - 1) - j;
                if (carte.valeur === 1) score += distDuBas * 8;
                if (carte.valeur === 2) score += distDuBas * 4;
            }
        }
        let coupsPiles = 0;
        for (let i = 0; i < NB_COLONNES; i++) {
            if (this.peutMonterDansLaPile(this.getColonne(i).getCarte())) coupsPiles++;
        }
        score -= coupsPiles * 15;
        let sequences = 0;
        for (let i = 0; i < NB_COLONNES; i++) {
            const col = this.getColonne(i);
            for (let j = 0; j < col.getNbCartes() - 1; j++) {
                if (col.getCarteN(j+1).peutPoserSur(col.getCarteN(j))) sequences++;
            }
        }
        score -= sequences * 5;
        const names = ["Ultra Facile", "Facile", "Moyen", "Difficile", "Enfer !"];
        let level = 3;
        if (score < 30) level = 1;
        else if (score < 55) level = 2;
        else if (score < 80) level = 3;
        else if (score < 105) level = 4;
        else level = 5;
        console.log(`[Difficulty Engine] Score total : ${score} -> ${names[level-1]} (As/2: ${score + (coupsPiles*15) + (sequences*5)} | Piles: -${coupsPiles*15} | Seq: -${sequences*5})`);
        return level;
    }

    resetToInitial() {
        this.initColonnes();
        this.initPiles();
        this.initCasesLibres();
        this.donneInitiale.forEach((cards, i) => {
            this.colonnes[i].pileDeCartes = [...cards];
        });
        this.listeDesCoups = new ListeCoups();
    }

    exportState() {
        return {
            colonnes: this.colonnes.map(c => c.pileDeCartes.map(card => ({ v: card.valeur, c: card.couleur }))),
            piles: this.pile.map(p => p.pileDeCartes.map(card => ({ v: card.valeur, c: card.couleur }))),
            cases: this.casesLibres.map(c => c.getCarte() ? { v: c.getCarte().valeur, c: c.getCarte().couleur } : null),
            donneInitiale: this.donneInitiale.map(col => col.map(card => ({ v: card.valeur, c: card.couleur }))),
            historique: this.listeDesCoups.getListeCoups().map(coup => coup.export())
        };
    }

    importState(state) {
        this.initColonnes();
        this.initPiles();
        this.initCasesLibres();
        state.colonnes.forEach((cards, i) => {
            cards.forEach(data => this.colonnes[i].ajouteCarte(new Carte(data.v, data.c)));
        });
        state.piles.forEach((cards, i) => {
            cards.forEach(data => this.pile[i].ajouteCarte(new Carte(data.v, data.c)));
        });
        state.cases.forEach((data, i) => {
            if (data) this.casesLibres[i].poseCarte(new Carte(data.v, data.c));
        });
        this.donneInitiale = state.donneInitiale.map(col => col.map(data => new Carte(data.v, data.c)));
        this.listeDesCoups = new ListeCoups();
        if (state.historique) {
            state.historique.forEach(data => {
                const card = new Carte(data.v, data.c);
                this.listeDesCoups.addCoup(new Coup(card, data.o, data.d));
            });
        }
    }
}
