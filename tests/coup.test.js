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

    it('doit identifier le type de position (COL, CEL, PIL)', () => {
        expect(new Coup(maCarte, 'COL1', 'CEL1').getTypeOrigine()).toBe('COL');
        expect(new Coup(maCarte, 'CEL2', 'PIL0').getTypeOrigine()).toBe('CEL');
        expect(new Coup(maCarte, 'PIL3', 'COL0').getTypeOrigine()).toBe('PIL');
    });

    it('doit extraire correctement le numéro de pile/colonne', () => {
        expect(new Coup(maCarte, 'COL3', 'CEL1').getNumOrigine()).toBe(3);
        expect(new Coup(maCarte, 'CEL2', 'PIL0').getNumOrigine()).toBe(2);
        expect(new Coup(maCarte, 'PIL3', 'COL0').getNumOrigine()).toBe(3);
        // Cas invalide (plus de 9 colonnes n'existent pas ici)
        expect(new Coup(maCarte, 'COLX', 'COL0').getNumOrigine()).toBeNaN();
    });

    it('doit valider si un coup est possible (estValide)', () => {
        // En mode non mélangé, As de Pique (COL7) peut aller en PIL0 (Fondation Pique)
        const asPique = maPartie.getColonne(7).getCarte();
        const coupOk = new Coup(asPique, 'COL7', 'PIL0');
        expect(coupOk.estValide(maPartie)).toBe(true);

        // Mais un 7 de Trèfle (COL0) ne peut pas aller en PIL0
        const septTrefle = maPartie.getColonne(0).getCarte();
        const coupKo = new Coup(septTrefle, 'COL0', 'PIL0');
        expect(coupKo.estValide(maPartie)).toBe(false);

        // On peut toujours mettre une carte en case libre vide
        const coupCel = new Coup(septTrefle, 'COL0', 'CEL0');
        expect(coupCel.estValide(maPartie)).toBe(true);
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

    it('doit générer une description via toString', () => {
        const asPique = new Carte(1, 'P');
        const coup = new Coup(asPique, 'COL7', 'CEL0');
        expect(coup.toString()).toContain('As de Pique');
        expect(coup.toString()).toContain('COL7');
        expect(coup.toString()).toContain('CEL0');
    });
});
