import { CardRenderer, CARD_DIMENSIONS, COLORS } from './CardRenderer.js';
import { NB_COLONNES, NB_PILES } from '../domain/PartieSolitaire.js';

export class GameRenderer {
    constructor(canvases) {
        this.canvases = canvases; // { col, pile, case }
        this.renderers = {
            col: new CardRenderer(canvases.col.getContext('2d')),
            pile: new CardRenderer(canvases.pile.getContext('2d')),
            case: new CardRenderer(canvases.case.getContext('2d'))
        };
        this.scale = 1;
        this.resize();
    }

    resize() {
        // On se base sur la largeur du conteneur des colonnes (le plus large)
        const container = this.canvases.col.parentElement;
        const availableWidth = container.clientWidth;
        
        // Un Freecell a 8 colonnes. On utilise le SPACING_FACTOR (1.1)
        // Largeur totale = (NB_COLONNES - 1) * WIDTH * 1.1 + WIDTH
        // Pour 8 colonnes : WIDTH * (7 * 1.1 + 1) = WIDTH * 8.7
        const baseWidthRequired = CARD_DIMENSIONS.WIDTH * 8.7;
        
        this.scale = Math.min(1.2, availableWidth / baseWidthRequired);
        
        // On applique l'échelle à tous les renderers
        Object.values(this.renderers).forEach(r => r.setScale(this.scale));
        
        const s = this.renderers.col.scaled;
        
        // Redimensionnement des canvases
        // Colonnes (8 colonnes)
        this.canvases.col.width = s.WIDTH * 8.7;
        this.canvases.col.height = s.HEIGHT + (CARD_DIMENSIONS.HEADER_HEIGHT * 15 * this.scale); // Assez de place pour les piles longues
        
        // Piles et Cases Libres (4 slots chacune)
        const topRowWidth = s.WIDTH * 4.4;
        this.canvases.pile.width = topRowWidth;
        this.canvases.pile.height = s.HEIGHT + 10;
        this.canvases.case.width = topRowWidth;
        this.canvases.case.height = s.HEIGHT + 10;
    }

    render(partie, state = {}) {
        this.clearAll();
        
        // Colonnes
        for (let i = 0; i < NB_COLONNES; i++) {
            this.renderColonne(partie, i, state);
        }

        // Piles
        for (let i = 0; i < NB_PILES; i++) {
            this.renderPile(partie, i, state);
        }

        // Cases Libres
        for (let i = 0; i < NB_PILES; i++) {
            this.renderCaseLibre(partie, i, state);
        }
    }

    clearAll() {
        Object.values(this.canvases).forEach(canvas => {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        });
    }

    renderColonne(partie, n, state) {
        const col = partie.getColonne(n);
        const s = this.renderers.col.scaled;
        const x = n * s.WIDTH * CARD_DIMENSIONS.SPACING_FACTOR;
        let y = 0;

        if (col.estVide()) {
            this.renderers.col.drawEmptySlot(x, y);
            return;
        }

        for (let i = 0; i < col.getNbCartes(); i++) {
            const carte = col.getCarteN(i);
            
            if (state.hidingCard && state.hidingCard.isEquivalent(carte)) {
                y += s.HEADER_HEIGHT;
                continue;
            }
            
            let highlight = null;
            if (state.selectedCard?.isEquivalent(carte)) {
                highlight = COLORS.PLAYED;
            } else if (state.selectedCard && state.selectedCard.peutPoserSur(carte)) {
                highlight = COLORS.ASCENDING;
            } else if (state.selectedCard && carte.peutPoserSur(state.selectedCard)) {
                if (!state.selectedOrigine?.startsWith('CEL')) {
                    highlight = COLORS.DESCENDING;
                }
            } else if (state.isCardSearched && state.isCardSearched(carte)) {
                highlight = 'rgba(255, 255, 0, 0.45)';
            }

            this.renderers.col.drawCard(carte, x, y, {
                highlightColor: highlight,
                isCliquable: partie.isCarteCliquable(carte)
            });
            y += s.HEADER_HEIGHT;
        }
    }

    renderPile(partie, n, state) {
        const pile = partie.getPile(n);
        const s = this.renderers.pile.scaled;
        const x = n * s.WIDTH * CARD_DIMENSIONS.SPACING_FACTOR;
        const y = 0;

        if (pile.estVide()) {
            this.renderers.pile.drawEmptySlot(x, y);
            this.renderers.pile.drawEmptyPileText(pile, x, y);
        } else {
            this.renderers.pile.drawCard(pile.getCarte(), x, y, { isCliquable: false });
        }
    }

    renderCaseLibre(partie, n, state) {
        const caseLibre = partie.getCaseLibre(n);
        const s = this.renderers.case.scaled;
        const x = n * s.WIDTH * CARD_DIMENSIONS.SPACING_FACTOR;
        const y = 0;
        const carte = caseLibre.getCarte();

        if (!carte || (state.hidingCard && state.hidingCard.isEquivalent(carte))) {
            this.renderers.case.drawEmptySlot(x, y);
        } else {
            let highlight = null;
            if (state.selectedCard?.isEquivalent(carte)) {
                highlight = COLORS.PLAYED;
            } else if (state.selectedCard && state.selectedCard.peutPoserSur(carte)) {
                highlight = COLORS.ASCENDING;
            } else if (state.selectedCard && carte.peutPoserSur(state.selectedCard)) {
                if (!state.selectedOrigine?.startsWith('CEL')) {
                    highlight = COLORS.DESCENDING;
                }
            } else if (state.isCardSearched && state.isCardSearched(carte)) {
                highlight = 'rgba(255, 255, 0, 0.45)';
            }
            
            this.renderers.case.drawCard(carte, x, y, {
                highlightColor: highlight,
                isCliquable: true
            });
        }
    }
}
