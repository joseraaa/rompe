// Clase principal del juego de rompecabezas
class PuzzleGame {
    constructor() {
        this.gridCols = 4;
        this.gridRows = 3;
        this.totalPieces = this.gridCols * this.gridRows;
        this.completedPieces = 0;
        this.pieces = [];
        this.isDragging = false;
        this.dragElement = null;
        this.touchOffset = { x: 0, y: 0 };
        this.puzzleImage = this.createPuzzleImage();
        
        this.init();
    }
    
    // Crear imagen del rompecabezas (usando una imagen de ejemplo)
    createPuzzleImage() {
        // Usando una imagen de paisaje de Pexels
        return 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300';
    }
    
    init() {
        this.bindEvents();
        this.createPuzzleGrid();
        this.createPuzzlePieces();
        this.updateProgress();
    }
    
    bindEvents() {
        // Botones de control
        const shuffleBtn = document.getElementById('shuffle-btn');
        const resetBtn = document.getElementById('reset-btn');
        const newGameBtn = document.getElementById('new-game-btn');
        
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.shufflePieces());
            shuffleBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.shufflePieces();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
            resetBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.resetGame();
            });
        }
        
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.newGame());
            newGameBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.newGame();
            });
        }
        
        // Eventos globales para arrastrar
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
        
        // Prevenir comportamientos por defecto en móviles
        this.preventDefaultBehaviors();
    }
    
    createPuzzleGrid() {
        const grid = document.getElementById('puzzle-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        for (let i = 0; i < this.totalPieces; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.position = i;
            grid.appendChild(slot);
        }
    }
    
    createPuzzlePieces() {
        const container = document.getElementById('pieces-container');
        if (!container) return;
        
        container.innerHTML = '';
        this.pieces = [];
        
        // Crear array de posiciones y mezclarlo
        const positions = Array.from({ length: this.totalPieces }, (_, i) => i);
        this.shuffleArray(positions);
        
        // Crear cada pieza con su posición correcta
        positions.forEach((position) => {
            const piece = this.createPuzzlePiece(position);
            container.appendChild(piece);
            this.pieces.push(piece);
        });
    }
    
    createPuzzlePiece(position) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.position = position;
        
        // Calcular fila y columna
        const row = Math.floor(position / this.gridCols);
        const col = position % this.gridCols;
        
        // Dimensiones de la pieza en CSS
        const pieceWidth = 80;
        const pieceHeight = 60;
        
        // Dimensiones totales de la imagen de fondo
        const totalWidth = this.gridCols * pieceWidth;
        const totalHeight = this.gridRows * pieceHeight;
        
        // Calcular posición del fondo
        const backgroundX = -(col * pieceWidth);
        const backgroundY = -(row * pieceHeight);
        
        // Aplicar imagen de fondo
        piece.style.backgroundImage = `url(${this.puzzleImage})`;
        piece.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
        piece.style.backgroundSize = `${totalWidth}px ${totalHeight}px`;
        piece.style.backgroundRepeat = 'no-repeat';
        
        // Eventos de arrastre
        this.addDragEvents(piece);
        
        return piece;
    }
    
    addDragEvents(piece) {
        // Eventos táctiles
        piece.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e, piece);
        });
        
        // Eventos de mouse
        piece.addEventListener('mousedown', (e) => {
            this.handleMouseStart(e, piece);
        });
    }
    
    // Manejo de eventos táctiles
    handleTouchStart(e, piece) {
        e.preventDefault();
        
        if (piece.classList.contains('placed')) return;
        
        this.startDrag(piece);
        
        const touch = e.touches[0];
        const rect = piece.getBoundingClientRect();
        
        this.touchOffset.x = touch.clientX - rect.left;
        this.touchOffset.y = touch.clientY - rect.top;
        
        this.updatePiecePosition(touch.clientX, touch.clientY);
    }
    
    handleTouchMove(e) {
        if (!this.isDragging || !this.dragElement) return;
        
        const touch = e.touches[0];
        this.updatePiecePosition(touch.clientX, touch.clientY);
        this.highlightNearestSlot(touch.clientX, touch.clientY);
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
        
        this.startDrag(piece);
        
        const rect = piece.getBoundingClientRect();
        
        this.touchOffset.x = e.clientX - rect.left;
        this.touchOffset.y = e.clientY - rect.top;
        
        this.updatePiecePosition(e.clientX, e.clientY);
    }
    
    handleMouseMove(e) {
        if (!this.isDragging || !this.dragElement) return;
        
        this.updatePiecePosition(e.clientX, e.clientY);
        this.highlightNearestSlot(e.clientX, e.clientY);
    }
    
    handleMouseEnd(e) {
        if (!this.isDragging || !this.dragElement) return;
        
        this.finalizeDrop(e.clientX, e.clientY);
    }
    
    startDrag(piece) {
        this.isDragging = true;
        this.dragElement = piece;
        
        piece.classList.add('dragging');
        piece.style.position = 'fixed';
        piece.style.zIndex = '1000';
        piece.style.pointerEvents = 'none';
    }
    
    updatePiecePosition(x, y) {
        if (!this.dragElement) return;
        
        this.dragElement.style.left = `${x - this.touchOffset.x}px`;
        this.dragElement.style.top = `${y - this.touchOffset.y}px`;
    }
    
    highlightNearestSlot(x, y) {
        // Remover highlight anterior
        document.querySelectorAll('.puzzle-slot').forEach(slot => {
            slot.classList.remove('highlight');
        });
        
        const nearestSlot = this.findNearestSlot(x, y);
        if (nearestSlot && !nearestSlot.classList.contains('filled')) {
            nearestSlot.classList.add('highlight');
        }
    }
    
    finalizeDrop(x, y) {
        const slot = this.findNearestSlot(x, y);
        
        // Remover todos los highlights
        document.querySelectorAll('.puzzle-slot').forEach(s => {
            s.classList.remove('highlight');
        });
        
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
        let minDistance = 80; // Distancia mínima para considerar válido
        
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
        // Resetear estilos de arrastre
        piece.style.position = 'absolute';
        piece.style.left = '0';
        piece.style.top = '0';
        piece.style.width = '100%';
        piece.style.height = '100%';
        piece.style.zIndex = '1';
        piece.style.pointerEvents = 'none';
        piece.style.transform = 'none';
        
        // Ajustar tamaño de fondo para el slot
        const slotWidth = slot.offsetWidth;
        const slotHeight = slot.offsetHeight;
        const totalWidth = slotWidth * this.gridCols;
        const totalHeight = slotHeight * this.gridRows;
        
        piece.style.backgroundSize = `${totalWidth}px ${totalHeight}px`;
        
        piece.classList.remove('dragging');
        piece.classList.add('placed', 'piece-success');
        slot.classList.add('filled');
        slot.appendChild(piece);
        
        this.completedPieces++;
        this.updateProgress();
        
        // Remover clase de animación después de la animación
        setTimeout(() => {
            piece.classList.remove('piece-success');
        }, 800);
        
        if (this.completedPieces === this.totalPieces) {
            this.onPuzzleComplete();
        }
    }
    
    returnPieceToContainer(piece) {
        piece.style.position = 'relative';
        piece.style.left = '';
        piece.style.top = '';
        piece.style.zIndex = '';
        piece.style.pointerEvents = '';
        piece.style.transform = '';
        piece.style.width = '80px';
        piece.style.height = '60px';
        
        // Restaurar tamaño de fondo original
        piece.style.backgroundSize = `${this.gridCols * 80}px ${this.gridRows * 60}px`;
        
        piece.classList.remove('dragging');
        
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
    
    updateProgress() {
        const progressElement = document.getElementById('pieces-placed');
        if (progressElement) {
            progressElement.textContent = this.completedPieces;
        }
    }
    
    shufflePieces() {
        const container = document.getElementById('pieces-container');
        if (!container) return;
        
        // Obtener todas las piezas no colocadas
        const unplacedPieces = Array.from(container.children);
        
        // Mezclar array
        this.shuffleArray(unplacedPieces);
        
        // Reordenar en el contenedor
        unplacedPieces.forEach(piece => {
            container.appendChild(piece);
        });
        
        // Efecto visual
        container.style.animation = 'none';
        container.offsetHeight; // Trigger reflow
        container.style.animation = 'pieceGlow 0.6s ease';
        
        setTimeout(() => {
            container.style.animation = '';
        }, 600);
    }
    
    resetGame() {
        // Mover todas las piezas de vuelta al contenedor
        const slots = document.querySelectorAll('.puzzle-slot');
        const container = document.getElementById('pieces-container');
        
        slots.forEach(slot => {
            const piece = slot.querySelector('.puzzle-piece');
            if (piece) {
                this.returnPieceToContainer(piece);
                piece.classList.remove('placed');
            }
            slot.classList.remove('filled', 'highlight');
        });
        
        this.completedPieces = 0;
        this.updateProgress();
        this.shufflePieces();
        
        // Ocultar mensaje de completación si está visible
        const completionMessage = document.getElementById('completion-message');
        if (completionMessage) {
            completionMessage.classList.add('hidden');
        }
    }
    
    newGame() {
        this.resetGame();
        
        // Ocultar mensaje de completación
        const completionMessage = document.getElementById('completion-message');
        if (completionMessage) {
            completionMessage.classList.add('hidden');
        }
        
        // Opcional: cambiar imagen del rompecabezas
        this.puzzleImage = this.getRandomPuzzleImage();
        this.createPuzzlePieces();
    }
    
    getRandomPuzzleImage() {
        const images = [
            'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
            'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
            'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
            'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
            'https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
        ];
        
        return images[Math.floor(Math.random() * images.length)];
    }
    
    onPuzzleComplete() {
        setTimeout(() => {
            const completionMessage = document.getElementById('completion-message');
            if (completionMessage) {
                completionMessage.classList.remove('hidden');
            }
            
            // Efecto de celebración en el tablero
            const grid = document.getElementById('puzzle-grid');
            if (grid) {
                grid.style.animation = 'celebrationPop 1s ease';
                
                setTimeout(() => {
                    grid.style.animation = '';
                }, 1000);
            }
        }, 500);
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    preventDefaultBehaviors() {
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
        
        // Prevenir menú contextual
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        
        // Prevenir selección de texto
        document.addEventListener('selectstart', function(e) {
            if (e.target.classList.contains('puzzle-piece')) {
                e.preventDefault();
            }
        });
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new PuzzleGame();
});

// Prevenir comportamientos no deseados en dispositivos móviles
window.addEventListener('load', () => {
    // Prevenir el rebote en iOS
    document.body.addEventListener('touchstart', function (e) {
        if (e.target === document.body) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.body.addEventListener('touchend', function (e) {
        if (e.target === document.body) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.body.addEventListener('touchmove', function (e) {
        if (e.target === document.body) {
            e.preventDefault();
        }
    }, { passive: false });
});