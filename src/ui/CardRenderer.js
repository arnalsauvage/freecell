export const CARD_DIMENSIONS = {
    WIDTH: 110,
    HEIGHT: 150,
    HEADER_HEIGHT: 30,
    SPACING_FACTOR: 1.1,
    RADIUS: 8
};

export const COLORS = {
    NONE: '#ffffff',
    CLICKABLE: '#ffffff',
    HIGHLIGHT: 'rgba(241, 196, 15, 0.4)',
    PLAYED: 'rgba(46, 204, 113, 0.4)',
    ASCENDING: 'rgba(255, 255, 0, 0.35)',
    DESCENDING: 'rgba(255, 255, 0, 0.35)',
    EMPTY: 'rgba(255, 255, 255, 0.08)' 
};

export class CardRenderer {
    constructor(context) {
        this.ctx = context;
        this.scale = 1;
    }

    setScale(scale) {
        this.scale = scale;
    }

    get scaled() {
        return {
            WIDTH: CARD_DIMENSIONS.WIDTH * this.scale,
            HEIGHT: CARD_DIMENSIONS.HEIGHT * this.scale,
            HEADER_HEIGHT: CARD_DIMENSIONS.HEADER_HEIGHT * this.scale,
            RADIUS: CARD_DIMENSIONS.RADIUS * this.scale
        };
    }

    drawCard(carte, x, y, options = {}) {
        const { highlightColor, isCliquable } = options;
        const s = this.scaled;

        this.drawShadow(x, y);
        this.drawBase(x, y, carte, isCliquable);
        
        if (carte) {
            this.drawWatermark(carte, x, y);
            this.drawText(carte, x, y);
        }

        if (highlightColor) {
            this.drawHighlight(x, y, highlightColor);
        }
    }

    drawShadow(x, y) {
        const s = this.scaled;
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0,0,0,0.4)';
        this.ctx.shadowBlur = 8 * this.scale;
        this.ctx.shadowOffsetY = 3 * this.scale;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, s.WIDTH, s.HEIGHT, s.RADIUS);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawBase(x, y, carte, isCliquable) {
        const s = this.scaled;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, s.WIDTH, s.HEIGHT, s.RADIUS);
        
        if (!carte) {
            this.ctx.fillStyle = "#bbb";
        } else {
            this.ctx.fillStyle = isCliquable ? "#ffffff" : "#d0d0d0";
        }
        this.ctx.fill();

        if (carte && !isCliquable) {
            this.ctx.globalAlpha = 0.85;
        }

        this.ctx.strokeStyle = "rgba(0,0,0,0.4)";
        this.ctx.lineWidth = Math.max(1, 1 * this.scale);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawWatermark(carte, x, y) {
        const s = this.scaled;
        this.ctx.save();
        this.ctx.fillStyle = carte.estRouge() ? "rgba(231, 76, 60, 0.22)" : "rgba(44, 62, 80, 0.22)";
        this.ctx.font = `bold ${100 * this.scale}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            carte.getIconeCouleur(), 
            x + s.WIDTH / 2, 
            y + s.HEIGHT / 1.8
        );
        this.ctx.restore();
    }

    drawEmptySlot(x, y) {
        const s = this.scaled;
        this.ctx.save();
        
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, s.WIDTH, s.HEIGHT, s.RADIUS);
        this.ctx.fillStyle = COLORS.EMPTY;
        this.ctx.fill();
        
        this.ctx.strokeStyle = "rgba(255,255,255,0.2)";
        this.ctx.lineWidth = 2 * this.scale;
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawHighlight(x, y, color) {
        const s = this.scaled;
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, s.WIDTH, s.HEADER_HEIGHT, [s.RADIUS, s.RADIUS, 0, 0]);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawText(carte, x, y) {
        const s = this.scaled;
        this.ctx.save();
        const color = carte.estRouge() ? "#e74c3c" : "#2c3e50";
        this.ctx.fillStyle = color;
        
        const fontSize = s.HEADER_HEIGHT - (6 * this.scale);
        this.ctx.font = `bold ${fontSize}px "Segoe UI", Arial`;
        const figure = carte.getNomCourtFigure();
        this.ctx.fillText(figure, x + (8 * this.scale), y + s.HEADER_HEIGHT - (8 * this.scale));
        
        const textWidth = this.ctx.measureText(figure).width;
        
        const icone = carte.getIconeCouleur();
        this.ctx.font = `${fontSize - (4 * this.scale)}px Arial`;
        this.ctx.fillText(icone, x + (12 * this.scale) + textWidth, y + s.HEADER_HEIGHT - (8 * this.scale));
        
        this.ctx.restore();
    }

    drawEmptyPileText(pile, x, y) {
        const s = this.scaled;
        this.ctx.save();
        this.ctx.fillStyle = pile.estRouge() ? "rgba(231, 76, 60, 0.4)" : "rgba(255, 255, 255, 0.25)";
        this.ctx.font = `bold ${s.HEADER_HEIGHT * 2.5}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const icones = { "P": "♠", "C": "♥", "K": "♦", "T": "♣" };
        this.ctx.fillText(icones[pile.couleur], x + s.WIDTH / 2, y + s.HEIGHT / 2);
        this.ctx.restore();
    }
}
