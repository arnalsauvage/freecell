import { describe, it, expect, beforeEach } from 'vitest';
import { PartieSolitaire, NB_COLONNES, NB_PILES } from '../src/domain/PartieSolitaire.js';
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
        expect(maPartie.piles.length).toBe(NB_PILES);
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
        // En mode non mélangé, l'As de Pique (COL7) est cliquable
        expect(maPartie.isCarteCliquable(new Carte(1, 'P'))).toBe(true);
        // Une carte au milieu d'une colonne ne l'est pas
        expect(maPartie.isCarteCliquable(new Carte(1, 'C'))).toBe(false);
    });

    it('doit détecter si une carte peut monter dans la pile (fondation)', () => {
        // L'As de Pique peut monter (la pile est vide)
        const asPique = maPartie.getColonne(7).getCarte();
        expect(maPartie.peutMonterDansLaPile(asPique)).toBe(true);
        
        // Un 7 de trèfle ne peut pas monter sur une pile vide
        const septTrefle = maPartie.getColonne(0).getCarte();
        expect(maPartie.peutMonterDansLaPile(septTrefle)).toBe(false);
    });

    it('doit détecter la victoire quand toutes les cartes sont dans les piles', () => {
        // Simulation rapide de victoire
        for (let i = 0; i < NB_COLONNES; i++) {
            const col = maPartie.getColonne(i);
            while (!col.estVide()) {
                const carte = col.getCarte();
                const numPile = maPartie.getIndexPileCouleurCarte(carte);
                const coup = new Coup(carte, `COL${i}`, `PIL${numPile}`);
                coup.jouer(maPartie);
            }
        }
        expect(maPartie.verifieVictoire()).toBe(true);
    });

    it('doit chercher la position d'une carte correctement', () => {
        // As de Pique est au bas de la COL7 (indice 6 car 0-indexed)
        expect(maPartie.chercheCarte(new Carte(1, 'P'))).toBe('COL76');
        
        // Déplacement vers case libre
        const asPique = maPartie.getColonne(7).getCarte();
        const coup = new Coup(asPique, 'COL7', 'CEL0');
        coup.jouer(maPartie);
        expect(maPartie.chercheCarte(new Carte(1, 'P'))).toBe('CEL0');
    });

    it('doit compter correctement toutes les cartes en jeu', () => {
        expect(maPartie.compterLesCartesEnJeu()).toBe(52);
    });
});
