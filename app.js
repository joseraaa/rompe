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
                image: 'imagenes/Francisco.jpg'
            },
            bonilla: {
                name: 'Juan Crisóstomo Bonilla',
                biography: 'Militar liberal poblano nacido en 1835. Participó activamente en la defensa de Puebla contra las fuerzas francesas durante la Intervención. Fue gobernador de Puebla y destacó como reformador educativo, impulsando la educación pública y laica. Su visión progresista ayudó a modernizar el estado. Murió en 1884, dejando un legado de servicio público y compromiso con la educación.',
                image: 'imagenes/Bonilla.jpg'
            },
            mendez: {
                name: 'Juan Nepomuceno Méndez',
                biography: 'Militar y político nacido en 1820 en Tetela de Ocampo, Puebla. Combatiente clave durante la Intervención Francesa, defendió la soberanía nacional desde la Sierra Norte. Fue presidente interino de México en 1876. Su liderazgo en momentos cruciales de la historia nacional lo convirtió en una figura respetada. Murió en 1894, recordado por su integridad y patriotismo.',
                image: 'imagenes/Nepomuceno.jpg'
            },
            zaragoza: {
                name: 'Ignacio Zaragoza',
                biography: 'General mexicano nacido en 1829 en Bahía del Espíritu Santo, Texas (entonces territorio mexicano). Héroe nacional que derrotó al ejército francés el 5 de mayo de 1862 en la Batalla de Puebla, demostrando que el ejército francés no era invencible. Su victoria elevó la moral del pueblo mexicano durante la Intervención. Murió en 1862 a los 33 años, pero su legado perdura como símbolo de resistencia y valentía.',
                image: 'imagenes/ignacio.jpg'
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
        
        document.getElementById('show-biography').addEventListener('click', () => {
            this.showBiography();
        });
        
        // Nuevo botón para volver al inicio desde la biografía
        document.getElementById('return-to-start').addEventListener('click', () => {
            this.showScreen('welcome-screen');
        });
        
        // Selección de personajes
        document.querySelectorAll('.character-frame').forEach(frame => {
            frame.addEventListener('click', () => {
                const character = frame.dataset.character;
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
        
        // Crear array de posiciones únicas para evitar duplicaciones
        const uniquePositions = [];
        for (let i = 0; i < 12; i++) {
            uniquePositions.push(i);
        }
        
        // Mezclar las posiciones automáticamente
        this.shuffleArray(uniquePositions);
        
        // Crear piezas del rompecabezas con posiciones únicas
        uniquePositions.forEach((position) => {
            const piece = this.createPuzzlePiece(position);
            container.appendChild(piece);
            this.puzzlePieces.push(piece);
        });
    }
    
    createPuzzlePiece(position) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.position = position;
        
        // Calcular posición única de la imagen de fondo
        const row = Math.floor(position / 4);
        const col = position % 4;
        const backgroundX = -col * 80;
        const backgroundY = -row * 60;
        
        const character = this.characters[this.currentCharacter];
        piece.style.backgroundImage = `url(${character.image})`;
        piece.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
        piece.style.backgroundSize = '320px 180px';
        
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
    }
    
    handleTouchMove(e) {
        if (!this.isDragging || !this.dragElement) return;
        
        const touch = e.touches[0];
        this.updatePiecePosition(touch.clientX, touch.clientY);
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
        
        // Efecto visual de éxito con estilo vintage (solo al completar)
        slot.style.animation = 'vintageGlow 0.8s ease';
        setTimeout(() => {
            slot.style.animation = '';
        }, 800);
        
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
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    onPuzzleComplete() {
        setTimeout(() => {
            document.getElementById('show-biography').classList.remove('hidden');
            
            // Efecto de celebración vintage
            const board = document.getElementById('puzzle-board');
            board.style.animation = 'antiqueFade 1.5s ease';
            
            setTimeout(() => {
                board.style.animation = '';
            }, 1500);
        }, 500);
    }
    
    showBiography() {
        const character = this.characters[this.currentCharacter];
        
        document.getElementById('biography-name').textContent = character.name;
        document.getElementById('biography-text').textContent = character.biography;
        
        const completedPortrait = document.getElementById('completed-portrait');
        completedPortrait.src = character.image;
        completedPortrait.alt = character.name;
        
        this.showScreen('biography-screen');
    }
}

// Añadir animaciones CSS dinámicamente con estilo vintage
const style = document.createElement('style');
style.textContent = `
    @keyframes vintageGlow {
        0% { 
            transform: scale(1); 
            box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
        }
        50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.8);
            background-color: rgba(212, 175, 55, 0.2); 
        }
        100% { 
            transform: scale(1); 
            box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
        }
    }
    
    @keyframes antiqueFade {
        0%, 20%, 53%, 80%, 100% { 
            transform: translateY(0) scale(1); 
            filter: sepia(15%);
        }
        40%, 43% { 
            transform: translateY(-8px) scale(1.02); 
            filter: sepia(5%);
        }
        70% { 
            transform: translateY(-4px) scale(1.01); 
            filter: sepia(10%);
        }
        90% { 
            transform: translateY(-2px) scale(1.005); 
            filter: sepia(12%);
        }
    }
    
    .puzzle-piece {
        will-change: transform;
        transition: filter 0.3s ease;
    }
    
    .puzzle-piece:active {
        transition: none;
        filter: sepia(5%) contrast(1.3) brightness(1.1);
    }
    
    .character-frame:hover .character-portrait {
        animation: vintageGlow 2s ease-in-out infinite;
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

// Prevenir el menú contextual en dispositivos táctiles
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Prevenir selección de texto en dispositivos táctiles
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});