import { describe, it, expect, beforeEach } from 'vitest';
import { Import } from '../src/domain/Import.js';
import { PartieSolitaire } from '../src/domain/PartieSolitaire.js';
import { Carte } from '../src/domain/Carte.js';

describe('Import', () => {
    let monImport;
    let maPartie;

    beforeEach(() => {
        monImport = new Import();
        maPartie = new PartieSolitaire();
    });

    it('doit parser correctement une carte simple (parseCard)', () => {
        const carte = monImport.parseCard('2P');
        expect(carte.valeur).toBe(2);
        expect(carte.couleur).toBe('P');
    });

    it('doit parser correctement les figures et As (parseCard)', () => {
        expect(monImport.parseCard('AC').valeur).toBe(1);
        expect(monImport.parseCard('XK').valeur).toBe(10);
        expect(monImport.parseCard('VT').valeur).toBe(11);
        expect(monImport.parseCard('DP').valeur).toBe(12);
        expect(monImport.parseCard('RC').valeur).toBe(13);
    });

    it('doit parser correctement le format "10" (parseCard)', () => {
        const carte = monImport.parseCard('10K');
        expect(carte.valeur).toBe(10);
        expect(carte.couleur).toBe('K');
    });

    it('doit être insensible à la casse (parseCard)', () => {
        const carte = monImport.parseCard('vk');
        expect(carte.valeur).toBe(11);
        expect(carte.couleur).toBe('K');
    });

    it('doit importer une configuration complète dans les colonnes (import)', () => {
        const config = "7T 5P 2C\nAC 2K\n3P\n4K\n5C\n6T\n7P\n8K";
        monImport.import(config, maPartie);

        expect(maPartie.getColonne(0).getNbCartes()).toBe(3);
        expect(maPartie.getColonne(0).getCarte().isEquivalent(new Carte(2, 'C'))).toBe(true);
        expect(maPartie.getColonne(7).getNbCartes()).toBe(1);
        expect(maPartie.getColonne(7).getCarte().isEquivalent(new Carte(8, 'K'))).toBe(true);
    });

    it('doit renvoyer null pour une carte invalide', () => {
        expect(monImport.parseCard('ZZ')).toBeNull();
        expect(monImport.parseCard('1')).toBeNull();
        expect(monImport.parseCard('')).toBeNull();
    });
});
