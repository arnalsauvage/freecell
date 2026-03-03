import { describe, it, expect, beforeEach } from 'vitest';
import { PartieSolitaire, NB_COLONNES, NB_PILES, CARTES_PAR_COULEUR } from '../src/domain/PartieSolitaire.js';
import { Carte } from '../src/domain/Carte.js';
import { Coup } from '../src/domain/Coup.js';
import { PileDeCartes } from '../src/domain/PileDeCartes.js';

describe('PartieSolitaire', () => {
    let maPartie;

    beforeEach(() => {
        maPartie = new PartieSolitaire();
        maPartie.distribue(false); // Mode non mélangé pour des tests prévisibles
    });

    it('doit avoir une structure initiale correcte', () => {
        expect(maPartie.colonnes.length).toBe(NB_COLONNES);
        expect(maPartie.pile.length).toBe(NB_PILES);
        expect(maPartie.casesLibres.length).toBe(NB_PILES);
        expect(maPartie.listeDesCoups.getNbCoups()).toBe(0);
    });

    it('doit distribuer les cartes correctement (mode non mélangé)', () => {
        for (let i = 0; i < 4; i++) {
            expect(maPartie.getColonne(i).getNbCartes()).toBe(7);
        }
        for (let i = 4; i < 8; i++) {
            expect(maPartie.getColonne(i).getNbCartes()).toBe(6);
        }
        // Vérification de cartes spécifiques en mode non mélangé
        expect(maPartie.getColonne(7).getCarte().isEquivalent(new Carte(1, 'P'))).toBe(true);
        expect(maPartie.getColonne(0).getCarte().isEquivalent(new Carte(7, 'T'))).toBe(true);
    });

    it('doit gérer correctement les cases libres', () => {
        expect(maPartie.getNbCasesLibres()).toBe(4);
        for (let i = 0; i < 4; i++) {
            const maCarte = maPartie.getColonne(2).prendCarte();
            maPartie.getCaseLibre(i).poseCarte(maCarte);
            expect(maPartie.getNbCasesLibres()).toBe(4 - i - 1);
        }
    });

    it('doit identifier correctement les index de piles par couleur', () => {
        expect(maPartie.getIndexPileCouleurCarte(new Carte(1, 'P'))).toBe(0);
        expect(maPartie.getIndexPileCouleurCarte(new Carte(1, 'C'))).toBe(1);
        expect(maPartie.getIndexPileCouleurCarte(new Carte(1, 'K'))).toBe(2);
        expect(maPartie.getIndexPileCouleurCarte(new Carte(1, 'T'))).toBe(3);
    });

    it('doit détecter si une carte est cliquable', () => {
        const asPique = new Carte(1, 'P');
        expect(maPartie.isCarteCliquable(asPique)).toBe(true);
        const asCoeur = new Carte(1, 'C');
        expect(maPartie.isCarteCliquable(asCoeur)).toBe(false);
    });

    it('doit détecter si une carte peut monter dans la pile (fondation)', () => {
        const asPique = maPartie.getColonne(7).getCarte();
        expect(maPartie.peutMonterDansLaPile(asPique)).toBe(true);
        const septTrefle = maPartie.getColonne(0).getCarte();
        expect(maPartie.peutMonterDansLaPile(septTrefle)).toBe(false);
    });

    it('doit détecter la victoire quand toutes les cartes sont dans les piles', () => {
        // Au début, pas de victoire
        expect(maPartie.verifieVictoire()).toBe(false);

        // On remplit les piles artificiellement pour simuler une victoire
        const couleurs = ["P", "C", "K", "T"];
        for (let i = 0; i < NB_PILES; i++) {
            const p = maPartie.getPile(i);
            // On vide la pile au cas où
            while(p.getNbCartes() > 0) p.prendCarte();
            // On ajoute 13 cartes
            for (let v = 1; v <= CARTES_PAR_COULEUR; v++) {
                p.ajouteCarte(new Carte(v, couleurs[i]));
            }
        }
        
        expect(maPartie.verifieVictoire()).toBe(true);
    });

    it('doit chercher la position d\'une carte correctement', () => {
        expect(maPartie.chercheCarte(new Carte(1, 'P'))).toBe('COL76');
        const asPique = maPartie.getColonne(7).prendCarte();
        maPartie.getCaseLibre(0).poseCarte(asPique);
        expect(maPartie.chercheCarte(new Carte(1, 'P'))).toBe('CEL0');
    });

    it('doit compter correctement toutes les cartes en jeu', () => {
        const count = maPartie.colonnes.reduce((a, b) => a + b.getNbCartes(), 0) +
                      maPartie.pile.reduce((a, b) => a + b.getNbCartes(), 0) +
                      maPartie.casesLibres.filter(c => !c.estLibre()).length;
        expect(count).toBe(52);
    });

    it('doit exporter et importer l\'état de la partie correctement', () => {
        // Modifier l'état initial
        const asPique = maPartie.getColonne(7).prendCarte();
        maPartie.getCaseLibre(0).poseCarte(asPique);
        
        const state = maPartie.exportState();
        expect(state.cases[0]).not.toBeNull();
        expect(state.cases[0].v).toBe(1);
        
        const nouvellePartie = new PartieSolitaire();
        nouvellePartie.importState(state);
        
        expect(nouvellePartie.getCaseLibre(0).getCarte().isEquivalent(asPique)).toBe(true);
        expect(nouvellePartie.getColonne(7).getNbCartes()).toBe(maPartie.getColonne(7).getNbCartes());
    });

    it('doit calculer une difficulté cohérente', () => {
        const diff = maPartie.calculerDifficulte();
        expect(diff).toBeGreaterThanOrEqual(1);
        expect(diff).toBeLessThanOrEqual(5);
    });

    it('doit détecter si la partie est bloquée', () => {
        // Au début d'une partie normale, elle n'est pas bloquée
        expect(maPartie.estBloquee()).toBe(false);
        
        // On pourrait simuler un blocage total ici, mais c'est complexe.
        // On vérifie au moins que la victoire n'est pas considérée comme un blocage.
        for (let i = 0; i < NB_PILES; i++) {
            const p = maPartie.getPile(i);
            for (let v = 1; v <= CARTES_PAR_COULEUR; v++) {
                p.ajouteCarte(new Carte(v, ["P", "C", "K", "T"][i]));
            }
        }
        expect(maPartie.estBloquee()).toBe(false); // Victoire = pas bloqué
    });
});
