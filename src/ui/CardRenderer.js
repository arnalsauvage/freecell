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
    }

    drawCard(carte, x, y, options = {}) {
        const { highlightColor, isCliquable } = options;

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
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0,0,0,0.4)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetY = 3;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, CARD_DIMENSIONS.WIDTH, CARD_DIMENSIONS.HEIGHT, CARD_DIMENSIONS.RADIUS);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawBase(x, y, carte, isCliquable) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, CARD_DIMENSIONS.WIDTH, CARD_DIMENSIONS.HEIGHT, CARD_DIMENSIONS.RADIUS);
        
        if (!carte) {
            this.ctx.fillStyle = "#bbb";
        } else {
            // Assistance visuelle : Blanc pur si jouable, Gris si bloquée
            this.ctx.fillStyle = isCliquable ? "#ffffff" : "#d0d0d0";
        }
        this.ctx.fill();

        // Si la carte est grise, on réduit aussi un peu l'opacité globale pour l'effet "désactivé"
        if (carte && !isCliquable) {
            this.ctx.globalAlpha = 0.85;
        }

        // Bordure nette
        this.ctx.strokeStyle = "rgba(0,0,0,0.4)";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawWatermark(carte, x, y) {
        this.ctx.save();
        this.ctx.fillStyle = carte.estRouge() ? "rgba(231, 76, 60, 0.22)" : "rgba(44, 62, 80, 0.22)";
        this.ctx.font = `bold 100px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            carte.getIconeCouleur(), 
            x + CARD_DIMENSIONS.WIDTH / 2, 
            y + CARD_DIMENSIONS.HEIGHT / 1.8
        );
        this.ctx.restore();
    }

    drawEmptySlot(x, y) {
        this.ctx.save();
        
        // Fond contrasté
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, CARD_DIMENSIONS.WIDTH, CARD_DIMENSIONS.HEIGHT, CARD_DIMENSIONS.RADIUS);
        this.ctx.fillStyle = COLORS.EMPTY;
        this.ctx.fill();
        
        // Bordure claire pour la visibilité
        this.ctx.strokeStyle = "rgba(255,255,255,0.2)";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawHighlight(x, y, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, CARD_DIMENSIONS.WIDTH, CARD_DIMENSIONS.HEADER_HEIGHT, [CARD_DIMENSIONS.RADIUS, CARD_DIMENSIONS.RADIUS, 0, 0]);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawText(carte, x, y) {
        this.ctx.save();
        const color = carte.estRouge() ? "#e74c3c" : "#2c3e50";
        this.ctx.fillStyle = color;
        
        // Chiffre/Lettre
        const fontSize = CARD_DIMENSIONS.HEADER_HEIGHT - 6;
        this.ctx.font = `bold ${fontSize}px "Segoe UI", Arial`;
        const figure = carte.getNomCourtFigure();
        this.ctx.fillText(figure, x + 8, y + CARD_DIMENSIONS.HEADER_HEIGHT - 8);
        
        // Mesure dynamique de la largeur du texte pour décaler l'icône
        const textWidth = this.ctx.measureText(figure).width;
        
        // Petit symbole à côté (bien espacé)
        const icone = carte.getIconeCouleur();
        this.ctx.font = `${fontSize - 4}px Arial`;
        this.ctx.fillText(icone, x + 12 + textWidth, y + CARD_DIMENSIONS.HEADER_HEIGHT - 8);
        
        this.ctx.restore();
    }

    drawEmptyPileText(pile, x, y) {
        this.ctx.save();
        // Plus net et contrasté
        this.ctx.fillStyle = pile.estRouge() ? "rgba(231, 76, 60, 0.4)" : "rgba(255, 255, 255, 0.25)";
        this.ctx.font = `bold ${CARD_DIMENSIONS.HEADER_HEIGHT * 2.5}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const icones = { "P": "♠", "C": "♥", "K": "♦", "T": "♣" };
        this.ctx.fillText(icones[pile.couleur], x + CARD_DIMENSIONS.WIDTH / 2, y + CARD_DIMENSIONS.HEIGHT / 2);
        this.ctx.restore();
    }
}
