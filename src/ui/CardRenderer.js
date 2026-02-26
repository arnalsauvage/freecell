export const CARD_DIMENSIONS = {
    WIDTH: 110,
    HEIGHT: 150,
    HEADER_HEIGHT: 30,
    SPACING_FACTOR: 1.1
};

export const COLORS = {
    NONE: 'lightgrey',
    CLICKABLE: 'white',
    HIGHLIGHT: 'yellow',
    PLAYED: 'lightgreen',
    ASCENDING: 'lightpink',
    DESCENDING: 'lightpink',
    EMPTY: 'darkGreen'
};

export class CardRenderer {
    constructor(context) {
        this.ctx = context;
    }

    drawCard(carte, x, y, options = {}) {
        const { highlightColor, isCliquable } = options;

        this.drawBase(x, y, carte, isCliquable);
        
        if (highlightColor) {
            this.drawHighlight(x, y, highlightColor);
        }

        if (carte) {
            this.drawText(carte, x, y);
        }
    }

    drawBase(x, y, carte, isCliquable) {
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(x, y, CARD_DIMENSIONS.WIDTH - 1, CARD_DIMENSIONS.HEIGHT - 1);

        if (!carte) {
            this.ctx.fillStyle = "grey";
        } else {
            this.ctx.fillStyle = isCliquable ? "white" : COLORS.NONE;
        }
        this.ctx.fillRect(x, y, CARD_DIMENSIONS.WIDTH - 1, CARD_DIMENSIONS.HEIGHT - 1);
    }

    drawEmptySlot(x, y) {
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(x, y, CARD_DIMENSIONS.WIDTH - 1, CARD_DIMENSIONS.HEIGHT - 1);
        this.ctx.fillStyle = COLORS.EMPTY;
        this.ctx.fillRect(x, y, CARD_DIMENSIONS.WIDTH - 1, CARD_DIMENSIONS.HEIGHT - 1);

        for (let i = 0; i < 3; i++) {
            const offset = i * 5;
            this.ctx.strokeRect(
                x + offset, 
                y + offset, 
                CARD_DIMENSIONS.WIDTH - 1 - 10 * i, 
                CARD_DIMENSIONS.HEIGHT - 1 - 10 * i
            );
        }
    }

    drawHighlight(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, CARD_DIMENSIONS.WIDTH - 1, CARD_DIMENSIONS.HEADER_HEIGHT - 1);
    }

    drawText(carte, x, y) {
        this.ctx.fillStyle = carte.estRouge() ? "red" : "black";
        this.ctx.font = `${CARD_DIMENSIONS.HEADER_HEIGHT}px Arial`;
        
        const figure = carte.getNomCourtFigure();
        const icone = carte.getIconeCouleur();
        const offset = figure === "10" ? 40 : 25;

        this.ctx.fillText(figure, x + 5, y + CARD_DIMENSIONS.HEADER_HEIGHT - 5);
        this.ctx.fillText(icone, x + offset, y + CARD_DIMENSIONS.HEADER_HEIGHT - 5);
    }

    drawEmptyPileText(pile, x, y) {
        this.ctx.fillStyle = pile.estRouge() ? "red" : "black";
        this.ctx.font = `${CARD_DIMENSIONS.HEADER_HEIGHT * 3}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const icones = { "P": "♠", "C": "♥", "K": "♦", "T": "♣" };
        const icone = icones[pile.couleur];
        
        this.ctx.fillText(
            icone, 
            x + CARD_DIMENSIONS.WIDTH / 2, 
            y + CARD_DIMENSIONS.HEIGHT / 2
        );
        
        // On remet les réglages par défaut pour ne pas casser le reste du dessin
        this.ctx.textAlign = 'start';
        this.ctx.textBaseline = 'alphabetic';
    }
}
