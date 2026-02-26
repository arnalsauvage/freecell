import { describe, it, expect } from 'vitest';
import { Carte } from '../src/domain/Carte.js';

describe('Carte', () => {
    it('doit créer une carte valide', () => {
        const carte = new Carte(1, 'P');
        expect(carte.getNom()).toBe('As de Pique');
    });

    it('doit détecter si une carte peut être posée sur une autre', () => {
        const asRouge = new Carte(1, 'C');
        const deuxNoir = new Carte(2, 'T');
        expect(asRouge.peutPoserSur(deuxNoir)).toBe(true);
    });
});
