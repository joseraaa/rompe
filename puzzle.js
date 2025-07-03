// Script del rompecabezas para cada personaje
class PuzzleGame {
    constructor(characterData) {
        this.characterData = characterData;
        this.puzzlePieces = [];
        this.completedPieces = 0;
        this.isDragging = false;
        this.dragElement = null;
        this.touchOffset = { x: 0, y: 0 };
        this.autoRedirectTimer = null;
        this.isInBiographyMode = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.createPuzzle();
    }
    
    bindEvents() {
        // Botón para mostrar biografía
        const showBiographyBtn = document.getElementById('show-biography');
        if (showBiographyBtn) {
            showBiographyBtn.addEventListener('click', () => {
                this.showBiography();
            });
            
            showBiographyBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.showBiography();
            });
        }
        
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
        
        // Eventos de mouse globales
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.handleMouseMove(e);
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (this.isDragging) {
                this.handleMouseEnd(e);
            }
        });

        // Eventos para detectar interacción del usuario en modo biografía
        this.bindBiographyInteractionEvents();
    }

    bindBiographyInteractionEvents() {
        const events = ['click', 'touchstart', 'mousemove', 'keydown', 'scroll'];
        
        events.forEach(eventType => {
            document.addEventListener(eventType, () => {
                if (this.isInBiographyMode) {
                    this.resetAutoRedirectTimer();
                }
            });
        });
    }

    startAutoRedirectTimer() {
        this.clearAutoRedirectTimer();
        
        this.autoRedirectTimer = setTimeout(() => {
            window.location.href = 'index.html';
        }, 8000);
    }

    resetAutoRedirectTimer() {
        this.clearAutoRedirectTimer();
        this.startAutoRedirectTimer();
    }

    clearAutoRedirectTimer() {
        if (this.autoRedirectTimer) {
            clearTimeout(this.autoRedirectTimer);
            this.autoRedirectTimer = null;
        }
    }
    
    createPuzzle() {
        const board = document.getElementById('puzzle-board');
        const container = document.getElementById('pieces-container');
        
        if (!board || !container) return;
        
        // Limpiar contenedores
        board.innerHTML = '';
        container.innerHTML = '';
        
        this.puzzlePieces = [];
        this.completedPieces = 0;
        
        // Crear slots del tablero en orden correcto (0-11)
        for (let i = 0; i < 12; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.position = i;
            board.appendChild(slot);
        }
        
        // Crear array de posiciones únicas para las piezas
        const piecePositions = [];
        for (let i = 0; i < 12; i++) {
            piecePositions.push(i);
        }
        
        // Mezclar las posiciones para que aparezcan en orden aleatorio
        this.shuffleArray(piecePositions);
        
        // Crear piezas del rompecabezas con posiciones únicas
        piecePositions.forEach((position) => {
            const piece = this.createPuzzlePiece(position);
            container.appendChild(piece);
            this.puzzlePieces.push(piece);
        });
    }
    
    createPuzzlePiece(position) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.position = position;
        
        // Configuración del grid: 4 columnas x 3 filas = 12 piezas
        const cols = 4;
        const rows = 3;
        
        // Calcular fila y columna de esta pieza específica
        const row = Math.floor(position / cols);
        const col = position % cols;
        
        // Dimensiones de cada pieza en el CSS
        const pieceWidth = 80;
        const pieceHeight = 60;
        
        // Dimensiones totales de la imagen de fondo
        const totalWidth = cols * pieceWidth; // 320px
        const totalHeight = rows * pieceHeight; // 180px
        
        // Calcular la posición exacta del fondo para mostrar la sección correcta
        const backgroundX = -(col * pieceWidth);
        const backgroundY = -(row * pieceHeight);
        
        // Aplicar la imagen de fondo con el recorte correcto
        piece.style.backgroundImage = `url(${this.characterData.image})`;
        piece.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
        piece.style.backgroundSize = `${totalWidth}px ${totalHeight}px`;
        piece.style.backgroundRepeat = 'no-repeat';
        
        // Eventos táctiles
        piece.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e, piece);
        });
        
        // Eventos de mouse
        piece.addEventListener('mousedown', (e) => {
            this.handleMouseStart(e, piece);
        });
        
        return piece;
    }
    
    // Manejo de eventos táctiles
    handleTouchStart(e, piece) {
        e.preventDefault();
        
        if (piece.classList.contains('placed')) return;
        
        this.isDragging = true;
        this.dragElement = piece;
        
        const touch = e.touches[0];
        const rect = piece.getBoundingClientRect();
        
        this.touchOffset.x = touch.clientX - rect.left;
        this.touchOffset.y = touch.clientY - rect.top;
        
        this.prepareDragElement(piece);
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
        this.finalizeDrop(touch.clientX, touch.clientY);
    }
    
    // Manejo de eventos de mouse
    handleMouseStart(e, piece) {
        e.preventDefault();
        
        if (piece.classList.contains('placed')) return;
        
        this.isDragging = true;
        this.dragElement = piece;
        
        const rect = piece.getBoundingClientRect();
        
        this.touchOffset.x = e.clientX - rect.left;
        this.touchOffset.y = e.clientY - rect.top;
        
        this.prepareDragElement(piece);
        this.updatePiecePosition(e.clientX, e.clientY);
    }
    
    handleMouseMove(e) {
        if (!this.isDragging || !this.dragElement) return;
        
        this.updatePiecePosition(e.clientX, e.clientY);
    }
    
    handleMouseEnd(e) {
        if (!this.isDragging || !this.dragElement) return;
        
        this.finalizeDrop(e.clientX, e.clientY);
    }
    
    prepareDragElement(piece) {
        piece.style.position = 'fixed';
        piece.style.zIndex = '1000';
        piece.style.pointerEvents = 'none';
        piece.style.transform = 'scale(1.15) rotate(2deg)';
    }
    
    updatePiecePosition(x, y) {
        if (!this.dragElement) return;
        
        this.dragElement.style.left = `${x - this.touchOffset.x}px`;
        this.dragElement.style.top = `${y - this.touchOffset.y}px`;
    }
    
    finalizeDrop(x, y) {
        const slot = this.findNearestSlot(x, y);
        
        if (slot && this.canPlacePiece(this.dragElement, slot)) {
            this.placePiece(this.dragElement, slot);
        } else {
            this.returnPieceToContainer(this.dragElement);
        }
        
        this.resetDragState();
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
        // Obtener las dimensiones reales del slot
        const slotRect = slot.getBoundingClientRect();
        const slotWidth = slotRect.width;
        const slotHeight = slotRect.height;
        
        // Configuración del grid
        const cols = 4;
        const rows = 3;
        
        // Calcular las dimensiones totales de la imagen para el slot
        const totalWidth = cols * slotWidth;
        const totalHeight = rows * slotHeight;
        
        // Calcular posición de la pieza en el grid
        const position = parseInt(piece.dataset.position);
        const row = Math.floor(position / cols);
        const col = position % cols;
        
        // Calcular la posición del fondo para el slot
        const backgroundX = -(col * slotWidth);
        const backgroundY = -(row * slotHeight);
        
        // Resetear estilos de arrastre y aplicar estilos de pieza colocada
        piece.style.position = 'absolute';
        piece.style.left = '0';
        piece.style.top = '0';
        piece.style.width = '100%';
        piece.style.height = '100%';
        piece.style.zIndex = '1';
        piece.style.pointerEvents = 'none';
        piece.style.borderRadius = '0';
        piece.style.border = 'none';
        piece.style.transform = 'scale(1) rotate(0deg)';
        
        // Aplicar el fondo correcto para el tamaño del slot
        piece.style.backgroundSize = `${totalWidth}px ${totalHeight}px`;
        piece.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
        
        piece.classList.add('placed');
        slot.classList.add('filled');
        slot.appendChild(piece);
        
        this.completedPieces++;
        const piecesPlacedElement = document.getElementById('pieces-placed');
        if (piecesPlacedElement) {
            piecesPlacedElement.textContent = this.completedPieces;
        }
        
        // Efecto visual de éxito con estilo vintage
        slot.style.animation = 'vintageGlowPiece 0.8s ease';
        setTimeout(() => {
            slot.style.animation = '';
        }, 800);
        
        if (this.completedPieces === 12) {
            this.onPuzzleComplete();
        }
    }
    
    returnPieceToContainer(piece) {
        // Restaurar estilos originales de la pieza
        piece.style.position = 'relative';
        piece.style.left = '';
        piece.style.top = '';
        piece.style.width = '80px';
        piece.style.height = '60px';
        piece.style.zIndex = '';
        piece.style.pointerEvents = '';
        piece.style.transform = 'scale(1) rotate(0deg)';
        piece.style.borderRadius = '6px';
        piece.style.border = '3px solid #8b4513';
        
        // Restaurar el tamaño de fondo original para el contenedor
        piece.style.backgroundSize = '320px 180px';
        
        // Recalcular la posición del fondo para el tamaño original
        const position = parseInt(piece.dataset.position);
        const cols = 4;
        const row = Math.floor(position / cols);
        const col = position % cols;
        const backgroundX = -(col * 80);
        const backgroundY = -(row * 60);
        piece.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
        
        const container = document.getElementById('pieces-container');
        if (container) {
            container.appendChild(piece);
        }
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
            const showBiographyBtn = document.getElementById('show-biography');
            if (showBiographyBtn) {
                showBiographyBtn.classList.remove('hidden');
            }
            
            // Efecto de celebración vintage
            const board = document.getElementById('puzzle-board');
            if (board) {
                board.style.animation = 'antiqueFadeBoard 1.5s ease';
                
                setTimeout(() => {
                    board.style.animation = '';
                }, 1500);
            }
        }, 500);
    }
    
    showBiography() {
        const puzzleContainer = document.querySelector('.puzzle-container');
        const biographyScreen = document.getElementById('biography-screen');
        
        if (puzzleContainer && biographyScreen) {
            puzzleContainer.style.display = 'none';
            biographyScreen.classList.remove('hidden');
            biographyScreen.style.display = 'block';
            
            // Activar modo biografía y iniciar temporizador
            this.isInBiographyMode = true;
            this.startAutoRedirectTimer();
        }
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si existe characterData (definido en cada página de personaje)
    if (typeof characterData !== 'undefined') {
        new PuzzleGame(characterData);
    }
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