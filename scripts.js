// Script para la página de inicio
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    
    if (startBtn) {
        // Función para manejar tanto click como touch
        function handleStart(e) {
            e.preventDefault();
            
            // Activar pantalla completa SOLO en index.html
            const element = document.documentElement;
            
            try {
                if (element.requestFullscreen) {
                    element.requestFullscreen().then(() => {
                        // Navegar después de activar pantalla completa
                        window.location.href = 'seleccion-personaje.html';
                    }).catch(() => {
                        // Si falla, navegar de todas formas
                        window.location.href = 'seleccion-personaje.html';
                    });
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                    window.location.href = 'seleccion-personaje.html';
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                    window.location.href = 'seleccion-personaje.html';
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                    window.location.href = 'seleccion-personaje.html';
                } else {
                    // Si no hay soporte para pantalla completa, navegar directamente
                    window.location.href = 'seleccion-personaje.html';
                }
            } catch (error) {
                console.log('Error al activar pantalla completa:', error);
                window.location.href = 'seleccion-personaje.html';
            }
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
    
    // Script para la página de selección de personajes (SIN pantalla completa)
    const characterFrames = document.querySelectorAll('.character-frame');
    
    characterFrames.forEach(frame => {
        const character = frame.dataset.character;
        
        function handleCharacterSelect(e) {
            e.preventDefault();
            if (character) {
                // Navegar directamente SIN forzar pantalla completa
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

// Función para salir de pantalla completa
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Función para verificar si está en pantalla completa
function isFullscreen() {
    return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
}

// Detectar cuando se sale de pantalla completa manualmente
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!isFullscreen()) {
        console.log('Pantalla completa desactivada');
    } else {
        console.log('Pantalla completa activada');
    }
}

// Salir automáticamente de pantalla completa cuando se carga cualquier página que NO sea index.html
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si estamos en una página diferente a index.html
    const currentPage = window.location.pathname;
    const isIndexPage = currentPage.endsWith('index.html') || currentPage === '/' || currentPage.endsWith('/');
    
    if (!isIndexPage && isFullscreen()) {
        // Si no estamos en index.html y estamos en pantalla completa, salir
        setTimeout(() => {
            exitFullscreen();
        }, 100);
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