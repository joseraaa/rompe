// Script para la página de inicio
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    
    if (startBtn) {
        // Función para manejar tanto click como touch
        function handleStart(e) {
            e.preventDefault();
            
            // Intentar activar pantalla completa directamente desde el gesto del usuario
            requestFullscreen();
            
            // Navegar después de un pequeño delay
            setTimeout(() => {
                window.location.href = 'seleccion-personaje.html';
            }, 100);
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
                // Intentar mantener pantalla completa al navegar
                ensureFullscreen();
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

// Función simplificada para solicitar pantalla completa
function requestFullscreen() {
    const element = document.documentElement;
    
    // Verificar si ya está en pantalla completa
    if (isFullscreen()) {
        return;
    }
    
    // Intentar activar pantalla completa con diferentes APIs
    try {
        if (element.requestFullscreen) {
            element.requestFullscreen().catch(() => {
                console.log('No se pudo activar la pantalla completa');
            });
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } catch (error) {
        console.log('Error al solicitar pantalla completa:', error);
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

// Función para asegurar que se mantenga la pantalla completa (solo si ya está activa)
function ensureFullscreen() {
    // Solo intentar mantener pantalla completa si ya está activa
    // No intentar activarla si no está activa para evitar errores de permisos
    if (isFullscreen()) {
        // Ya está en pantalla completa, no hacer nada
        return;
    }
}

// Función para manejar la navegación
function navigateFullscreen(url) {
    // Solo intentar mantener pantalla completa si ya está activa
    ensureFullscreen();
    setTimeout(() => {
        window.location.href = url;
    }, 100);
}

// Detectar cuando se sale de pantalla completa manualmente
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!isFullscreen()) {
        // El usuario salió de pantalla completa manualmente
        console.log('Pantalla completa desactivada por el usuario');
    }
}

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

// Función global para botones que necesiten mantener pantalla completa
window.navigateWithFullscreen = function(url) {
    navigateFullscreen(url);
};

// Detectar orientación en dispositivos móviles
window.addEventListener('orientationchange', function() {
    // No intentar forzar pantalla completa en cambio de orientación
    console.log('Orientación cambiada');
});

// Mantener pantalla completa al cambiar de pestaña (si es posible)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // No intentar forzar pantalla completa al volver a la pestaña
        console.log('Pestaña visible nuevamente');
    }
});