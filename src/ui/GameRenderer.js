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
        const x = n * CARD_DIMENSIONS.WIDTH * CARD_DIMENSIONS.SPACING_FACTOR;
        let y = 0;

        if (col.estVide()) {
            this.renderers.col.drawEmptySlot(x, y);
            return;
        }

        for (let i = 0; i < col.getNbCartes(); i++) {
            const carte = col.getCarteN(i);
            
            // On saute le rendu si la carte est en vol
            if (state.hidingCard && state.hidingCard.isEquivalent(carte)) {
                y += CARD_DIMENSIONS.HEADER_HEIGHT;
                continue;
            }
            
            const isLast = i === col.getNbCartes() - 1;
            
            let highlight = null;
            if (state.selectedCard?.isEquivalent(carte)) {
                highlight = COLORS.PLAYED;
            } else if (state.selectedCard && state.selectedCard.peutPoserSur(carte)) {
                highlight = COLORS.ASCENDING; // Là où je peux poser ma carte
            } else if (state.selectedCard && carte.peutPoserSur(state.selectedCard)) {
                highlight = COLORS.DESCENDING; // Ce qui peut venir sur ma carte
            } else if (state.isCardSearched && state.isCardSearched(carte)) {
                highlight = 'rgba(255, 0, 0, 0.5)';
            }

            this.renderers.col.drawCard(carte, x, y, {
                highlightColor: highlight,
                isCliquable: partie.isCarteCliquable(carte)
            });
            y += CARD_DIMENSIONS.HEADER_HEIGHT;
        }
    }

    renderPile(partie, n, state) {
        const pile = partie.getPile(n);
        const x = n * CARD_DIMENSIONS.WIDTH * CARD_DIMENSIONS.SPACING_FACTOR;
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
        const x = n * CARD_DIMENSIONS.WIDTH * CARD_DIMENSIONS.SPACING_FACTOR;
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
                highlight = COLORS.DESCENDING;
            } else if (state.isCardSearched && state.isCardSearched(carte)) {
                highlight = 'rgba(255, 0, 0, 0.5)';
            }
            
            this.renderers.case.drawCard(carte, x, y, {
                highlightColor: highlight,
                isCliquable: true
            });
        }
    }
}
