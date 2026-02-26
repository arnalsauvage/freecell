import { Coup } from '../domain/Coup.js';
import { CARD_DIMENSIONS } from '../ui/CardRenderer.js';
import { TYPES_PILE, Position } from '../domain/Position.js';
import { NB_COLONNES, NB_PILES } from '../domain/PartieSolitaire.js';
import { translations } from './Translations.js';

export class GameController {
    constructor(partie, renderer, uiElements) {
        this.partie = partie;
        this.renderer = renderer;
        this.uiElements = uiElements; // { historique, ..., canvases, savedGamesList }
        
        this.selectedCard = null;
        this.origine = null;
        this.searchVal = null;
        this.searchCol = null;
        
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.currentLang = 'fr';
        this.animatingCard = null;
        this.autoStackEnabled = false;
        this.isReplaying = false;
        this.stopReplayRequested = false;
        this.showDifficulty = true;
    }

    setLanguage(lang) {
        this.currentLang = lang;
        this.updateUI();
    }

    updateUI() {
        const t = translations[this.currentLang];
        const labelNewGame = document.getElementById('label-newgame');
        if (labelNewGame) labelNewGame.textContent = t.newGame + " :";
        
        document.getElementById('btnArriere').textContent = t.undo;
        document.getElementById('btnMonte').textContent = t.autoStack;
        document.getElementById('label-autoassist').textContent = t.autoStackToggle;
        document.getElementById('label-freecells').textContent = t.freeCells;
        document.getElementById('label-foundations').textContent = t.foundations;
        document.getElementById('label-lang').textContent = t.langLabel;
        document.getElementById('label-search').textContent = t.searchLabel;
        document.getElementById('label-noir').textContent = this.currentLang === 'fr' ? 'Noir' : 'Black';
        document.getElementById('label-rouge').textContent = this.currentLang === 'fr' ? 'Rouge' : 'Red';
        document.getElementById('btnDebug').textContent = t.debugGame;
        document.getElementById('btnClearSearch').textContent = this.currentLang === 'fr' ? 'Effacer la recherche' : 'Clear Search';
        document.getElementById('btnSave').textContent = t.saveBtn;
        document.getElementById('label-saves').textContent = t.savedGamesLabel;
        
        document.getElementById('label-diff').textContent = t.diffLabel;
        const diff = this.partie.calculerDifficulte();
        const levelEl = document.getElementById('difficultyLevel');
        const container = document.getElementById('difficultyContainer');
        if (levelEl) levelEl.textContent = t.diffLevels[diff - 1];
        if (container) {
            container.classList.remove('diff-level-1', 'diff-level-2', 'diff-level-3', 'diff-level-4', 'diff-level-5');
            container.classList.add(`diff-level-${diff}`);
            container.style.display = this.showDifficulty ? 'flex' : 'none';
        }
        this.renderSavedGames();
        this.refresh();
    }

    // --- Gestion de la Sauvegarde ---
    saveCurrentPosition() {
        const t = translations[this.currentLang];
        const now = new Date();
        const days = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
        const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
        
        const defaultName = `Partie ${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
        const name = window.prompt(t.savePrompt, defaultName);
        
        if (name) {
            const saves = JSON.parse(localStorage.getItem('freecell_saves') || '{}');
            saves[name] = {
                state: this.partie.exportState(),
                moves: this.moves,
                elapsed: this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0,
                history: this.uiElements.historique.value
            };
            localStorage.setItem('freecell_saves', JSON.stringify(saves));
            this.renderSavedGames();
        }
    }

    renderSavedGames() {
        const t = translations[this.currentLang];
        const container = document.getElementById('savedGamesList');
        const saves = JSON.parse(localStorage.getItem('freecell_saves') || '{}');
        
        if (Object.keys(saves).length === 0) {
            container.innerHTML = `<div style="text-align:center; opacity:0.5; font-size:0.8rem;">${t.noSavedGames}</div>`;
            return;
        }

        container.innerHTML = Object.keys(saves).map(name => `
            <div class="save-item" data-name="${name}">
                <span>${name} (${saves[name].moves} m)</span>
                <span class="delete-save" data-name="${name}">&times;</span>
            </div>
        `).join('');

        // Listeners pour charger/supprimer
        container.querySelectorAll('.save-item').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-save')) {
                    this.deleteSave(e.target.dataset.name);
                } else {
                    this.loadSave(el.dataset.name);
                }
            });
        });
    }

    loadSave(name) {
        const saves = JSON.parse(localStorage.getItem('freecell_saves') || '{}');
        const save = saves[name];
        if (save) {
            this.partie.importState(save.state);
            this.moves = save.moves;
            document.getElementById('moveCount').textContent = this.moves;
            this.uiElements.historique.value = save.history;
            
            // Reprise du timer
            this.resetStats();
            this.moves = save.moves;
            document.getElementById('moveCount').textContent = this.moves;
            this.startTime = Date.now() - (save.elapsed * 1000);
            this.startTimer();
            
            this.updateUI();
            document.getElementById('settingsDrawer').classList.add('hidden');
        }
    }

    deleteSave(name) {
        const saves = JSON.parse(localStorage.getItem('freecell_saves') || '{}');
        delete saves[name];
        localStorage.setItem('freecell_saves', JSON.stringify(saves));
        this.renderSavedGames();
    }

    // --- Fin Gestion Sauvegarde ---

    startTimer() {
        if (this.timerInterval) return;
        if (!this.startTime) this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const seconds = Math.floor((Date.now() - this.startTime) / 1000);
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            const timerEl = document.getElementById('timer');
            if (timerEl) timerEl.textContent = `${m}:${s}`;
        }, 1000);
    }

    resetStats() {
        this.moves = 0;
        const moveEl = document.getElementById('moveCount');
        const timerEl = document.getElementById('timer');
        if (moveEl) moveEl.textContent = "0";
        if (timerEl) timerEl.textContent = "00:00";
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.startTime = null;
    }

    handleSearch(val, col) {
        if (val !== undefined) this.searchVal = val;
        if (col !== undefined) this.searchCol = col;
        this.refresh();
    }

    clearSearch() {
        this.searchVal = null;
        this.searchCol = null;
        this.refresh();
    }

    isCardSearched(carte) {
        if (!carte) return false;
        if (this.searchVal === null && this.searchCol === null) return false;
        if (this.searchVal !== null && this.searchCol !== null) {
            if (carte.valeur !== this.searchVal) return false;
            if (this.searchCol === "N") return carte.estNoir();
            if (this.searchCol === "R") return carte.estRouge();
            return carte.couleur === this.searchCol;
        }
        if (this.searchVal !== null) return carte.valeur === this.searchVal;
        if (this.searchCol !== null) {
            if (this.searchCol === "N") return carte.estNoir();
            if (this.searchCol === "R") return carte.estRouge();
            return carte.couleur === this.searchCol;
        }
        return false;
    }

    getGlobalCardPos(card) {
        const posStr = this.partie.chercheCarte(card);
        if (!posStr) return null;
        const pos = new Position(posStr);
        const type = pos.getTypeDePile().toLowerCase();
        const canvasMap = { col: 'col', pil: 'pile', cel: 'case' };
        const canvas = this.uiElements.canvases[canvasMap[type]];
        const rect = canvas.getBoundingClientRect();
        const xOffset = pos.getNumero() * (CARD_DIMENSIONS.WIDTH * CARD_DIMENSIONS.SPACING_FACTOR);
        let yOffset = 0;
        if (type === 'col') yOffset = (pos.getIndice() - 1) * CARD_DIMENSIONS.HEADER_HEIGHT;
        return { x: rect.left + xOffset + window.scrollX, y: rect.top + yOffset + window.scrollY };
    }

    animateCoup(card, startPos) {
        return new Promise((resolve) => {
            if (!startPos) return resolve();
            this.animatingCard = card;
            this.refresh();
            const endPos = this.getGlobalCardPos(card);
            if (!endPos) {
                this.animatingCard = null;
                this.refresh();
                return resolve();
            }
            const ghost = document.createElement('div');
            ghost.className = 'flying-card';
            ghost.style.left = `${startPos.x}px`;
            ghost.style.top = `${startPos.y}px`;
            ghost.style.color = card.estRouge() ? 'red' : 'black';
            ghost.innerHTML = `<span class="card-value">${card.getNomCourtFigure()}</span><span class="card-icon">${card.getIconeCouleur()}</span>`;
            document.body.appendChild(ghost);
            ghost.offsetHeight;
            ghost.style.left = `${endPos.x}px`;
            ghost.style.top = `${endPos.y}px`;
            ghost.addEventListener('transitionend', () => {
                if (document.body.contains(ghost)) document.body.removeChild(ghost);
                this.animatingCard = null;
                this.refresh();
                resolve();
            }, { once: true });
        });
    }

    handleCanvasClick(canvasType, event) {
        if (this.isReplaying) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const numPile = Math.floor(x / (CARD_DIMENSIONS.WIDTH * CARD_DIMENSIONS.SPACING_FACTOR));
        const numCarte = Math.floor(y / CARD_DIMENSIONS.HEADER_HEIGHT) + 1;
        this.processClick(canvasType, numPile, numCarte);
    }

    processClick(type, numPile, numCarte) {
        if (type === 'col') {
            const col = this.partie.getColonne(numPile);
            if (numCarte > col.getNbCartes() && col.getNbCartes() > 0) {
                this.tryAutoMove(col.getCarte(), `COL${numPile}${col.getNbCartes()}`);
                return;
            }
        }
        const idPos = this.toPositionString(type, numPile, numCarte);
        if (!this.selectedCard) {
            this.handleFirstClick(type, numPile, numCarte, idPos);
        } else {
            this.handleSecondClick(idPos);
        }
    }

    async handleDblClick(canvasType, event) {
        if (this.isReplaying) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const numPile = Math.floor(x / (CARD_DIMENSIONS.WIDTH * CARD_DIMENSIONS.SPACING_FACTOR));
        const numCarte = Math.floor(y / CARD_DIMENSIONS.HEADER_HEIGHT) + 1;
        let carte = null;
        if (canvasType === 'col') {
            carte = this.partie.getColonne(numPile).getCarteN(numCarte - 1) || this.partie.getColonne(numPile).getCarte();
        } else if (canvasType === 'case') {
            carte = this.partie.getCaseLibre(numPile).getCarte();
        }
        if (carte) await this.tryAutoMove(carte, this.toPositionString(canvasType, numPile, numCarte));
    }

    async tryAutoMove(carte, originePos) {
        if (!carte) return false;
        const startPos = this.getGlobalCardPos(carte);
        let coup = null;
        if (this.partie.peutMonterDansLaPile(carte)) {
            coup = new Coup(carte, originePos, `PIL${this.partie.getIndexPileCouleurCarte(carte)}`);
        } else {
            const colDest = this.partie.cartePeutMonterSurUneColonne(carte);
            if (colDest >= 0 && !originePos.startsWith(`COL${colDest}`)) {
                coup = new Coup(carte, originePos, `COL${colDest}`);
            }
        }
        if (coup && coup.jouer(this.partie)) {
            await this.animateCoup(carte, startPos);
            await this.refreshAfterAuto(coup);
            return true;
        }
        return false;
    }

    async autoMonte() {
        for (let i = 0; i < NB_COLONNES; i++) {
            const col = this.partie.getColonne(i);
            const carte = col.getCarte();
            if (carte && this.partie.peutMonterDansLaPile(carte)) {
                const pos = `COL${i}${col.getNbCartes()}`;
                const success = await this.tryAutoMove(carte, pos);
                if (success) return true;
            }
        }
        for (let i = 0; i < NB_PILES; i++) {
            const carte = this.partie.getCaseLibre(i).getCarte();
            if (carte && this.partie.peutMonterDansLaPile(carte)) {
                const success = await this.tryAutoMove(carte, `CEL${i}`);
                if (success) return true;
            }
        }
        return false;
    }

    async refreshAfterAuto(coup) {
        this.updateHistorique(coup);
        this.selectedCard = null;
        this.origine = null;
        this.refresh();
        if (this.partie.verifieVictoire()) {
            this.handleVictory();
            return;
        }
        if (this.autoStackEnabled && !this.isReplaying) {
            setTimeout(() => this.autoMonte(), 100);
        }
    }

    async handleSecondClick(destPos) {
        const startPos = this.getGlobalCardPos(this.selectedCard);
        const cardToAnimate = this.selectedCard;
        const coup = new Coup(this.selectedCard, this.origine, destPos);
        if (coup.jouer(this.partie)) {
            await this.animateCoup(cardToAnimate, startPos);
            this.updateHistorique(coup);
            if (this.partie.verifieVictoire()) {
                this.handleVictory();
            } else if (this.autoStackEnabled) {
                this.autoMonte();
            }
        }
        this.selectedCard = null;
        this.origine = null;
        this.refresh();
    }

    async handleVictory() {
        if (this.isReplaying) return;
        this.isReplaying = true;
        this.stopReplayRequested = false;
        this.fireworks();
        const t = translations[this.currentLang];
        const overlay = document.createElement('div');
        overlay.className = 'replay-overlay';
        overlay.innerHTML = `<div class="title">${t.congratulations}</div><div class="subtitle">${t.victoryPressKey}</div>`;
        document.body.appendChild(overlay);
        const stopHandler = () => { this.stopReplayRequested = true; };
        window.addEventListener('keydown', stopHandler, { once: true });
        window.addEventListener('mousedown', stopHandler, { once: true });
        await new Promise(r => setTimeout(r, 5000));
        const history = [...this.partie.listeDesCoups.getListeCoups()];
        while(!this.stopReplayRequested) {
            this.partie.resetToInitial();
            this.refresh();
            await new Promise(r => setTimeout(r, 1000));
            if (this.stopReplayRequested) break;
            for (const coup of history) {
                if (this.stopReplayRequested) break;
                const startPos = this.getGlobalCardPos(coup.getCarte());
                coup.jouer(this.partie);
                await this.animateCoup(coup.getCarte(), startPos);
                await new Promise(r => setTimeout(r, 50));
            }
            if (this.stopReplayRequested) break;
            await new Promise(r => setTimeout(r, 1000));
            for (let i = history.length - 1; i >= 0; i--) {
                if (this.stopReplayRequested) break;
                const coup = history[i];
                const startPos = this.getGlobalCardPos(coup.getCarte());
                coup.annuler(this.partie);
                await this.animateCoup(coup.getCarte(), startPos);
                await new Promise(r => setTimeout(r, 50));
            }
            if (this.stopReplayRequested) break;
            await new Promise(r => setTimeout(r, 1000));
        }
        window.removeEventListener('keydown', stopHandler);
        window.removeEventListener('mousedown', stopHandler);
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
        this.isReplaying = false;
        document.getElementById('btnNouvellePartie').click();
    }

    fireworks() {
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.className = 'particle';
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#ffffff'];
                p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                p.style.left = x + 'px';
                p.style.top = y + 'px';
                p.style.boxShadow = `0 0 10px ${p.style.backgroundColor}`;
                document.body.appendChild(p);
                const destX = (Math.random() - 0.5) * 600;
                const destY = (Math.random() - 0.5) * 600;
                p.animate([{ transform: 'translate(0, 0) scale(1.5)', opacity: 1 }, { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }], { duration: 1500, easing: 'ease-out' });
                setTimeout(() => { if (document.body.contains(p)) document.body.removeChild(p); }, 1500);
            }, i * 50);
        }
    }

    handleFirstClick(type, numPile, numCarte, idPos) {
        if (this.isReplaying) return;
        let carte = null;
        if (type === 'col') {
            const col = this.partie.getColonne(numPile);
            carte = col.getCarteN(numCarte - 1) || col.getCarte();
        } else if (type === 'case') {
            carte = this.partie.getCaseLibre(numPile).getCarte();
        } else if (type === 'pile') {
            carte = this.partie.getPile(numPile).getCarte();
        }
        if (carte && this.partie.isCarteCliquable(carte)) {
            this.selectedCard = carte;
            this.origine = idPos;
            this.refresh();
        }
    }

    toPositionString(type, numPile, numCarte) {
        const prefix = { col: TYPES_PILE.COLONNE, pile: TYPES_PILE.PILE, case: TYPES_PILE.CELLULE }[type];
        const cardIndex = (type === 'col') ? numCarte : '';
        return `${prefix}${numPile}${cardIndex}`;
    }

    updateHistorique(coup) {
        this.moves++;
        const moveEl = document.getElementById('moveCount');
        if (moveEl) moveEl.textContent = this.moves;
        if (!this.startTime) this.startTimer();
        const short = `${coup.getCarte().getNomCourtTxt()}-${coup.getOrigine()}-${coup.getDestination()}`;
        if (this.uiElements.historique) this.uiElements.historique.value += " " + short;
    }

    refresh() {
        this.renderer.render(this.partie, { 
            selectedCard: this.selectedCard,
            isCardSearched: (carte) => this.isCardSearched(carte),
            hidingCard: this.animatingCard
        });
    }
}
