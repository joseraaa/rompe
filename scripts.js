// Script para la página de inicio
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    
    if (startBtn) {
        // Función para manejar tanto click como touch
        function handleStart(e) {
            e.preventDefault();
            window.location.href = 'seleccion-personaje.html';
        }
        
        // Eventos para mouse y touch
        startBtn.addEventListener('click', handleStart);
        startBtn.addEventListener('touchend', handleStart);
        
        // Efectos visuales
        startBtn.addEventListener('mouseenter', () => {
            startBtn.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        startBtn.addEventListener('mouseleave', () => {
            startBtn.style.transform = 'translateY(0) scale(1)';
        });
        
        startBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startBtn.style.transform = 'translateY(-2px) scale(1.02)';
        });
    }
    
    // Script para la página de selección de personajes
    const characterFrames = document.querySelectorAll('.character-frame');
    
    characterFrames.forEach(frame => {
        const character = frame.dataset.character;
        
        function handleCharacterSelect(e) {
            e.preventDefault();
            if (character) {
                window.location.href = `${character}.html`;
            }
        }
        
        // Eventos para mouse y touch
        frame.addEventListener('click', handleCharacterSelect);
        frame.addEventListener('touchend', handleCharacterSelect);
        
        // Efectos visuales mejorados
        frame.addEventListener('mouseenter', () => {
            frame.style.transform = 'translateY(-5px) scale(1.02)';
            frame.style.borderColor = '#d4af37';
        });
        
        frame.addEventListener('mouseleave', () => {
            frame.style.transform = 'translateY(0) scale(1)';
            frame.style.borderColor = '#8b4513';
        });
        
        frame.addEventListener('touchstart', (e) => {
            e.preventDefault();
            frame.style.transform = 'translateY(-5px) scale(1.02)';
            frame.style.borderColor = '#d4af37';
        });
    });
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