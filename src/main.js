console.log("Démarrage du script main.js...");
import '../style.css';
import { PartieSolitaire } from './domain/PartieSolitaire.js';
import { GameRenderer } from './ui/GameRenderer.js';
import { GameController } from './app/GameController.js';
import { Import } from './domain/Import.js';
import { Carte } from './domain/Carte.js';

// Initialisation
const partie = new PartieSolitaire();
const canvases = {
    col: document.getElementById('canvasColonne'),
    pile: document.getElementById('canvasPile'),
    case: document.getElementById('canvasCaseLibre')
};

const uiElements = {
    historique: document.getElementById('historique'),
    importText: document.getElementById('zonetexteimport'),
    chercheInput: document.getElementById('chercheCarte')
};

const renderer = new GameRenderer(canvases);
const controller = new GameController(partie, renderer, { ...uiElements, canvases });

// Event Listeners
canvases.col.addEventListener('click', (e) => controller.handleCanvasClick('col', e));
canvases.pile.addEventListener('click', (e) => controller.handleCanvasClick('pile', e));
canvases.case.addEventListener('click', (e) => controller.handleCanvasClick('case', e));

canvases.col.addEventListener('dblclick', (e) => controller.handleDblClick('col', e));
canvases.case.addEventListener('dblclick', (e) => controller.handleDblClick('case', e));

document.getElementById('btnNouvellePartie').addEventListener('click', (e) => {
    controller.showDifficulty = false; // Hasard = Masqué
    
    // Effet visuel : dé actif, animaux estompés
    document.querySelectorAll('.btn-diff').forEach(b => b.classList.remove('active'));
    document.getElementById('btnNouvellePartie').classList.add('active');
    
    partie.demarrePartie();
    controller.resetStats();
    uiElements.historique.value = "";
    controller.updateUI();
});

// Sélecteur de difficulté (Animaux)
document.querySelectorAll('.btn-diff').forEach(btn => {
    btn.addEventListener('click', () => {
        const level = parseInt(btn.dataset.level);
        controller.showDifficulty = true; // Ciblé = Affiché
        
        // Effet visuel : animal actif, dé et autres animaux estompés
        document.getElementById('btnNouvellePartie').classList.remove('active');
        document.querySelectorAll('.btn-diff').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        partie.demarrePartie(level); 
        controller.resetStats();
        uiElements.historique.value = "";
        controller.updateUI();
    });
});

// Raccourcis Clavier
window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') document.activeElement.blur();
        return;
    }

    const key = e.key.toLowerCase();
    if (key === 'u' || (key === 'z' && e.ctrlKey)) {
        partie.arriere();
        controller.refresh();
        e.preventDefault();
    } else if (key === 'n') {
        document.getElementById('btnNouvellePartie').click();
    } else if (key === 'm') {
        controller.autoMonte();
    } else if (key === 's') {
        settingsDrawer.classList.toggle('hidden');
        if (!settingsDrawer.classList.contains('hidden')) uiElements.chercheInput.focus();
    } else if (key === 'escape') {
        settingsDrawer.classList.add('hidden');
    }
});

document.getElementById('btnArriere').addEventListener('click', () => {
    partie.arriere();
    controller.refresh();
});

document.getElementById('btnMonte').addEventListener('click', () => {
    controller.autoMonte();
});

document.getElementById('btnImport').addEventListener('click', () => {
    const importer = new Import();
    importer.import(uiElements.importText.value, partie);
    controller.refresh();
});

document.getElementById('btnDebug').addEventListener('click', () => {
    partie.initColonnes();
    partie.initPiles();
    partie.initCasesLibres();
    partie.distribue(false); // Pas de mélange
    partie.listeDesCoups = new (partie.listeDesCoups.constructor)();
    partie.donneInitiale = partie.colonnes.map(col => [...col.pileDeCartes]);
    controller.resetStats();
    uiElements.historique.value = "";
    controller.updateUI();
});

// Recherche de carte (Picker de Badges)
const valuePicker = document.getElementById('valuePicker');
const colorPicker = document.getElementById('colorPicker');
const btnClearSearch = document.getElementById('btnClearSearch');

valuePicker.addEventListener('click', (e) => {
    const badge = e.target.closest('.badge');
    if (!badge) return;
    
    // Toggle active state
    const isActive = badge.classList.contains('active');
    valuePicker.querySelectorAll('.badge').forEach(b => b.classList.remove('active'));
    
    if (isActive) {
        controller.handleSearch(null, undefined);
    } else {
        badge.classList.add('active');
        controller.handleSearch(parseInt(badge.dataset.val), undefined);
    }
});

colorPicker.addEventListener('click', (e) => {
    const badge = e.target.closest('.badge');
    if (!badge) return;
    
    const isActive = badge.classList.contains('active');
    colorPicker.querySelectorAll('.badge').forEach(b => b.classList.remove('active'));
    
    if (isActive) {
        controller.handleSearch(undefined, null);
    } else {
        badge.classList.add('active');
        controller.handleSearch(undefined, badge.dataset.col);
    }
});

btnClearSearch.addEventListener('click', () => {
    valuePicker.querySelectorAll('.badge').forEach(b => b.classList.remove('active'));
    colorPicker.querySelectorAll('.badge').forEach(b => b.classList.remove('active'));
    controller.clearSearch();
});

document.getElementById('btnSave').addEventListener('click', () => {
    controller.saveCurrentPosition();
});

const btnToggleSettings = document.getElementById('btnToggleSettings');
const btnCloseDrawer = document.getElementById('btnCloseDrawer');
const settingsDrawer = document.getElementById('settingsDrawer');

btnToggleSettings.addEventListener('click', () => {
    settingsDrawer.classList.toggle('hidden');
});

btnCloseDrawer.addEventListener('click', () => {
    settingsDrawer.classList.add('hidden');
});

const langSelect = document.getElementById('langSelect');

langSelect.addEventListener('change', (e) => {
    controller.setLanguage(e.target.value);
});

const toggleAutoStack = document.getElementById('toggleAutoStack');

toggleAutoStack.addEventListener('change', (e) => {
    controller.autoStackEnabled = e.target.checked;
    if (controller.autoStackEnabled) controller.autoMonte();
});

// Lancement initial
partie.demarrePartie();
controller.updateUI();
controller.refresh();

console.log("Django : Freecell est prêt ! Que les cartes soient avec toi.");
