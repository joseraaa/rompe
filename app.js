class HistoricalPuzzleApp {
    constructor() {
        this.currentCharacter = null;
        this.puzzlePieces = [];
        this.completedPieces = 0;
        this.isDragging = false;
        this.dragElement = null;
        this.touchOffset = { x: 0, y: 0 };
        
        this.characters = {
            lucas: {
                name: 'Juan Francisco Lucas',
                biography: 'Líder indígena totonaco nacido en 1834 en la Sierra Norte de Puebla. Defendió a su pueblo y a México durante la Intervención Francesa, organizando fuerzas guerrilleras que hostigaron al ejército invasor. Su conocimiento del terreno serrano fue clave para la resistencia. Murió en 1917, siendo recordado como un héroe que luchó por la libertad y la justicia social de los pueblos originarios.',
                image: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)'
            },
            bonilla: {
                name: 'Juan Crisóstomo Bonilla',
                biography: 'Militar liberal poblano nacido en 1835. Participó activamente en la defensa de Puebla contra las fuerzas francesas durante la Intervención. Fue gobernador de Puebla y destacó como reformador educativo, impulsando la educación pública y laica. Su visión progresista ayudó a modernizar el estado. Murió en 1884, dejando un legado de servicio público y compromiso con la educación.',
                image: 'linear-gradient(135deg, #2F4F4F 0%, #708090 50%, #B0C4DE 100%)'
            },
            mendez: {
                name: 'Juan Nepomuceno Méndez',
                biography: 'Militar y político nacido en 1820 en Tetela de Ocampo, Puebla. Combatiente clave durante la Intervención Francesa, defendió la soberanía nacional desde la Sierra Norte. Fue presidente interino de México en 1876. Su liderazgo en momentos cruciales de la historia nacional lo convirtió en una figura respetada. Murió en 1894, recordado por su integridad y patriotismo.',
                image: 'linear-gradient(135deg, #800000 0%, #DC143C 50%, #FFB6C1 100%)'
            },
            zaragoza: {
                name: 'Ignacio Zaragoza',
                biography: 'General mexicano nacido en 1829 en Bahía del Espíritu Santo, Texas (entonces territorio mexicano). Héroe nacional que derrotó al ejército francés el 5 de mayo de 1862 en la Batalla de Puebla, demostrando que el ejército francés no era invencible. Su victoria elevó la moral del pueblo mexicano durante la Intervención. Murió en 1862 a los 33 años, pero su legado perdura como símbolo de resistencia y valentía.',
                image: 'linear-gradient(135deg, #006400 0%, #228B22 50%, #90EE90 100%)'
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showScreen('welcome-screen');
    }
    
    bindEvents() {
        // Botones de navegación
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showScreen('character-selection');
        });
        
        document.getElementById('back-to-welcome').addEventListener('click', () => {
            this.showScreen('welcome-screen');
        });
        
        document.getElementById('back-to-selection').addEventListener('click', () => {
            this.showScreen('character-selection');
        });
        
        document.getElementById('show-biography').addEventListener('click', () => {
            this.showBiography();
        });
        
        document.getElementById('play-again').addEventListener('click', () => {
            this.startPuzzle(this.currentCharacter);
        });
        
        document.getElementById('choose-another').addEventListener('click', () => {
            this.showScreen('character-selection');
        });
        
        document.getElementById('shuffle-pieces').addEventListener('click', () => {
            this.shufflePieces();
        });
        
        // Selección de personajes
        document.querySelectorAll('.character-card').forEach(card => {
            card.addEventListener('click', () => {
                const character = card.dataset.character;
                this.startPuzzle(character);
            });
        });
        
        // Eventos táctiles globales
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.handleTouchMove(e);
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (this.isDragging) {
                this.handleTouchEnd(e);
            }
        });
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    startPuzzle(characterKey) {
        this.currentCharacter = characterKey;
        const character = this.characters[characterKey];
        
        document.getElementById('current-character-name').textContent = character.name;
        document.getElementById('pieces-placed').textContent = '0';
        document.getElementById('show-biography').classList.add('hidden');
        
        this.createPuzzle();
        this.showScreen('puzzle-screen');
    }
    
    createPuzzle() {
        const board = document.getElementById('puzzle-board');
        const container = document.getElementById('pieces-container');
        
        // Limpiar contenedores
        board.innerHTML = '';
        container.innerHTML = '';
        
        this.puzzlePieces = [];
        this.completedPieces = 0;
        
        // Crear slots del tablero
        for (let i = 0; i < 12; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.position = i;
            board.appendChild(slot);
        }
        
        // Crear piezas del rompecabezas
        const pieces = [];
        for (let i = 0; i < 12; i++) {
            pieces.push(i);
        }
        
        // Mezclar piezas
        this.shuffleArray(pieces);
        
        pieces.forEach((position, index) => {
            const piece = this.createPuzzlePiece(position);
            container.appendChild(piece);
            this.puzzlePieces.push(piece);
        });
    }
    
    createPuzzlePiece(position) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.position = position;
        
        // Calcular posición de la imagen de fondo
        const row = Math.floor(position / 4);
        const col = position % 4;
        const backgroundX = -col * 80;
        const backgroundY = -row * 60;
        
        const character = this.characters[this.currentCharacter];
        piece.style.background = character.image;
        piece.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
        piece.style.backgroundSize = '320px 180px';
        
        // Añadir número de pieza para depuración
        piece.innerHTML = `<div style="position: absolute; top: 2px; left: 2px; font-size: 10px; color: white; text-shadow: 1px 1px 1px black;">${position + 1}</div>`;
        
        // Eventos táctiles
        piece.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e, piece);
        });
        
        return piece;
    }
    
    handleTouchStart(e, piece) {
        e.preventDefault();
        
        if (piece.classList.contains('placed')) return;
        
        this.isDragging = true;
        this.dragElement = piece;
        
        const touch = e.touches[0];
        const rect = piece.getBoundingClientRect();
        
        this.touchOffset.x = touch.clientX - rect.left;
        this.touchOffset.y = touch.clientY - rect.top;
        
        piece.style.position = 'fixed';
        piece.style.zIndex = '1000';
        piece.style.pointerEvents = 'none';
        
        this.updatePiecePosition(touch.clientX, touch.clientY);
        this.highlightValidSlots(piece);
    }
    
    handleTouchMove(e) {
        if (!this.isDragging || !this.dragElement) return;
        
        const touch = e.touches[0];
        this.updatePiecePosition(touch.clientX, touch.clientY);
        this.highlightNearbySlots(touch.clientX, touch.clientY);
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging || !this.dragElement) return;
        
        const touch = e.changedTouches[0];
        const slot = this.findNearestSlot(touch.clientX, touch.clientY);
        
        if (slot && this.canPlacePiece(this.dragElement, slot)) {
            this.placePiece(this.dragElement, slot);
        } else {
            this.returnPieceToContainer(this.dragElement);
        }
        
        this.resetDragState();
        this.clearHighlights();
    }
    
    updatePiecePosition(x, y) {
        if (!this.dragElement) return;
        
        this.dragElement.style.left = `${x - this.touchOffset.x}px`;
        this.dragElement.style.top = `${y - this.touchOffset.y}px`;
    }
    
    findNearestSlot(x, y) {
        const slots = document.querySelectorAll('.puzzle-slot');
        let nearestSlot = null;
        let minDistance = 100; // Distancia mínima para considerar válido
        
        slots.forEach(slot => {
            const rect = slot.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            
            if (distance < minDistance && !slot.classList.contains('filled')) {
                minDistance = distance;
                nearestSlot = slot;
            }
        });
        
        return nearestSlot;
    }
    
    canPlacePiece(piece, slot) {
        const piecePosition = parseInt(piece.dataset.position);
        const slotPosition = parseInt(slot.dataset.position);
        return piecePosition === slotPosition;
    }
    
    placePiece(piece, slot) {
        piece.style.position = 'absolute';
        piece.style.left = '0';
        piece.style.top = '0';
        piece.style.width = '100%';
        piece.style.height = '100%';
        piece.style.zIndex = '1';
        piece.style.pointerEvents = 'none';
        piece.style.borderRadius = '0';
        piece.style.border = 'none';
        
        piece.classList.add('placed');
        slot.classList.add('filled');
        slot.appendChild(piece);
        
        this.completedPieces++;
        document.getElementById('pieces-placed').textContent = this.completedPieces;
        
        // Efecto visual de éxito
        slot.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            slot.style.animation = '';
        }, 500);
        
        if (this.completedPieces === 12) {
            this.onPuzzleComplete();
        }
    }
    
    returnPieceToContainer(piece) {
        piece.style.position = 'relative';
        piece.style.left = '';
        piece.style.top = '';
        piece.style.zIndex = '';
        piece.style.pointerEvents = '';
        
        const container = document.getElementById('pieces-container');
        container.appendChild(piece);
    }
    
    resetDragState() {
        this.isDragging = false;
        this.dragElement = null;
        this.touchOffset = { x: 0, y: 0 };
    }
    
    highlightValidSlots(piece) {
        const piecePosition = parseInt(piece.dataset.position);
        const targetSlot = document.querySelector(`.puzzle-slot[data-position="${piecePosition}"]`);
        
        if (targetSlot && !targetSlot.classList.contains('filled')) {
            targetSlot.classList.add('highlight');
        }
    }
    
    highlightNearbySlots(x, y) {
        this.clearHighlights();
        const slot = this.findNearestSlot(x, y);
        if (slot) {
            slot.classList.add('highlight');
        }
    }
    
    clearHighlights() {
        document.querySelectorAll('.puzzle-slot').forEach(slot => {
            slot.classList.remove('highlight');
        });
    }
    
    shufflePieces() {
        const container = document.getElementById('pieces-container');
        const pieces = Array.from(container.children);
        
        // Mezclar array
        this.shuffleArray(pieces);
        
        // Reorganizar en el contenedor
        pieces.forEach(piece => {
            container.appendChild(piece);
        });
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    onPuzzleComplete() {
        setTimeout(() => {
            document.getElementById('show-biography').classList.remove('hidden');
            
            // Efecto de celebración
            const board = document.getElementById('puzzle-board');
            board.style.animation = 'bounce 1s ease';
            
            setTimeout(() => {
                board.style.animation = '';
            }, 1000);
        }, 500);
    }
    
    showBiography() {
        const character = this.characters[this.currentCharacter];
        
        document.getElementById('biography-name').textContent = character.name;
        document.getElementById('biography-text').textContent = character.biography;
        
        const completedImage = document.getElementById('completed-image');
        completedImage.style.background = character.image;
        
        this.showScreen('biography-screen');
    }
}

// Añadir animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); background-color: rgba(40, 167, 69, 0.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
        40%, 43% { transform: translateY(-10px); }
        70% { transform: translateY(-5px); }
        90% { transform: translateY(-2px); }
    }
    
    .puzzle-piece {
        will-change: transform;
    }
    
    .puzzle-piece:active {
        transition: none;
    }
`;
document.head.appendChild(style);

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new HistoricalPuzzleApp();
});

// Prevenir zoom en dispositivos móviles
document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);