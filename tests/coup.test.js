import { describe, it, expect, beforeEach } from 'vitest';
import { Coup } from '../src/domain/Coup.js';
import { Carte } from '../src/domain/Carte.js';
import { PartieSolitaire } from '../src/domain/PartieSolitaire.js';

describe('Coup', () => {
    let maCarte;
    let maPartie;
    let monCoup;

    beforeEach(() => {
        maCarte = new Carte(1, 'C'); // As de Cœur
        maPartie = new PartieSolitaire();
        maPartie.distribue(false);
        monCoup = new Coup(maCarte, 'COL1', 'CEL1');
    });

    it('doit avoir un constructeur fonctionnel', () => {
        expect(monCoup.getCarte().isEquivalent(new Carte(1, 'C'))).toBe(true);
        expect(monCoup.getOrigine()).toBe('COL1');
        expect(monCoup.getDestination()).toBe('CEL1');
    });

    it('doit valider correctement les origines et destinations', () => {
        const charsOk = ['COL0', 'COL1', 'COL7', 'CEL0', 'CEL3', 'PIL0', 'PIL3'];
        const charsKo = ['COL8', 'COL9', 'CEL4', 'PIL4', 'COUCOU'];

        const testCoup = new Coup();
        
        charsOk.forEach(pos => {
            testCoup.setOrigine(pos);
            expect(testCoup.getOrigine()).toBe(pos);
            testCoup.setDestination(pos);
            expect(testCoup.getDestination()).toBe(pos);
        });

        charsKo.forEach(pos => {
            testCoup.setOrigine(pos);
            expect(testCoup.getOrigine()).toBe('');
            testCoup.setDestination(pos);
            expect(testCoup.getDestination()).toBe('');
        });
    });

    it('doit identifier le type de position (COL, CEL, PIL)', () => {
        expect(new Coup(maCarte, 'COL1', 'CEL1').getTypeOrigine()).toBe('COL');
        expect(new Coup(maCarte, 'CEL2', 'PIL0').getTypeOrigine()).toBe('CEL');
        expect(new Coup(maCarte, 'PIL3', 'COL0').getTypeOrigine()).toBe('PIL');
    });

    it('doit extraire correctement le numéro de pile/colonne', () => {
        expect(new Coup(maCarte, 'COL3', 'CEL1').getNumOrigine()).toBe(3);
        expect(new Coup(maCarte, 'CEL2', 'PIL0').getNumOrigine()).toBe(2);
        expect(new Coup(maCarte, 'PIL3', 'COL0').getNumOrigine()).toBe(3);
        // Cas invalide
        expect(new Coup(maCarte, 'COL11', 'COL0').getNumOrigine()).toBe(null);
    });

    it('doit détecter si deux coups sont équivalents', () => {
        const coup1 = new Coup(new Carte(6, 'K'), 'COL3', 'COL1');
        const coup2 = new Coup(new Carte(6, 'K'), 'COL3', 'COL1');
        const coup3 = new Coup(new Carte(7, 'K'), 'COL3', 'COL1');
        const coup4 = new Coup(new Carte(6, 'K'), 'COL2', 'COL1');

        expect(coup1.isEquivalent(coup2)).toBe(true);
        expect(coup1.isEquivalent(coup3)).toBe(false);
        expect(coup1.isEquivalent(coup4)).toBe(false);
    });

    it('doit valider si un coup est possible (coupValable)', () => {
        // En mode non mélangé, As de Pique (COL7) peut aller en PIL0 (Fondation Pique)
        const asPique = maPartie.getColonne(7).getCarte();
        const coupOk = new Coup(asPique, 'COL7', 'PIL0');
        expect(coupOk.coupValable(maPartie)).toBe(true);

        // Mais un 7 de Trèfle (COL0) ne peut pas aller en PIL0
        const septTrefle = maPartie.getColonne(0).getCarte();
        const coupKo = new Coup(septTrefle, 'COL0', 'PIL0');
        expect(coupKo.coupValable(maPartie)).toBe(false);

        // On peut toujours mettre une carte en case libre vide
        const coupCel = new Coup(septTrefle, 'COL0', 'CEL0');
        expect(coupCel.coupValable(maPartie)).toBe(true);
    });

    it('doit jouer et annuler un coup correctement', () => {
        // Déplacement du 6 de Carreau (COL2) vers 7 de Trèfle (COL0)
        const sixCarreau = maPartie.getColonne(2).getCarte();
        const coup = new Coup(sixCarreau, 'COL2', 'COL0');
        
        expect(maPartie.getColonne(0).getNbCartes()).toBe(7);
        
        // Jouer
        coup.jouer(maPartie);
        expect(maPartie.getColonne(0).getNbCartes()).toBe(8);
        expect(maPartie.getColonne(0).getCarte().isEquivalent(sixCarreau)).toBe(true);
        
        // Annuler
        coup.annuler(maPartie);
        expect(maPartie.getColonne(0).getNbCartes()).toBe(7);
        expect(maPartie.getColonne(2).getCarte().isEquivalent(sixCarreau)).toBe(true);
    });

    it('doit générer une description courte (shortDesc)', () => {
        const asPique = new Carte(1, 'P');
        const coup = new Coup(asPique, 'COL7', 'CEL0');
        expect(coup.shortDesc()).toBe('AP-COL7-CEL0');
    });
});
