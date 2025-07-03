// Script para la página de inicio
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    
    if (startBtn) {
        // Función para manejar tanto click como touch
        function handleStart(e) {
            e.preventDefault();
            
            // Activar pantalla completa INMEDIATAMENTE
            const element = document.documentElement;
            
            try {
                if (element.requestFullscreen) {
                    element.requestFullscreen().then(() => {
                        // Navegar después de activar pantalla completa
                        setTimeout(() => {
                            window.location.href = 'seleccion-personaje.html';
                        }, 200);
                    }).catch(() => {
                        // Si falla, navegar de todas formas
                        window.location.href = 'seleccion-personaje.html';
                    });
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                    setTimeout(() => {
                        window.location.href = 'seleccion-personaje.html';
                    }, 200);
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                    setTimeout(() => {
                        window.location.href = 'seleccion-personaje.html';
                    }, 200);
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                    setTimeout(() => {
                        window.location.href = 'seleccion-personaje.html';
                    }, 200);
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
    
    // Script para la página de selección de personajes
    const characterFrames = document.querySelectorAll('.character-frame');
    
    characterFrames.forEach(frame => {
        const character = frame.dataset.character;
        
        function handleCharacterSelect(e) {
            e.preventDefault();
            if (character) {
                // Asegurar pantalla completa antes de navegar
                ensureFullscreenAndNavigate(`${character}.html`);
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

// Función para verificar si está en pantalla completa
function isFullscreen() {
    return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
}

// Función para solicitar pantalla completa
function requestFullscreen() {
    const element = document.documentElement;
    
    if (isFullscreen()) {
        return Promise.resolve();
    }
    
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
        return Promise.resolve();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
        return Promise.resolve();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
        return Promise.resolve();
    }
    
    return Promise.reject('Fullscreen not supported');
}

// Función para asegurar pantalla completa y navegar
function ensureFullscreenAndNavigate(url) {
    if (isFullscreen()) {
        // Ya está en pantalla completa, navegar directamente
        window.location.href = url;
    } else {
        // Intentar activar pantalla completa antes de navegar
        requestFullscreen().then(() => {
            setTimeout(() => {
                window.location.href = url;
            }, 100);
        }).catch(() => {
            // Si falla, navegar de todas formas
            window.location.href = url;
        });
    }
}

// Función para mantener pantalla completa en navegación
function navigateWithFullscreen(url) {
    ensureFullscreenAndNavigate(url);
}

// Detectar cuando se sale de pantalla completa manualmente
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!isFullscreen()) {
        console.log('Pantalla completa desactivada por el usuario');
    } else {
        console.log('Pantalla completa activada');
    }
}

// Intentar reactivar pantalla completa en ciertas situaciones
window.addEventListener('focus', () => {
    // Cuando la ventana recupera el foco, intentar mantener pantalla completa
    setTimeout(() => {
        if (!isFullscreen() && document.hasFocus()) {
            // Solo intentar si la página tiene foco y no está en pantalla completa
            // No forzar para evitar interrumpir al usuario
        }
    }, 100);
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

// Función global para botones que necesiten mantener pantalla completa
window.navigateWithFullscreen = function(url) {
    ensureFullscreenAndNavigate(url);
};

// Detectar orientación en dispositivos móviles
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        if (isFullscreen()) {
            // Mantener pantalla completa después del cambio de orientación
            console.log('Manteniendo pantalla completa después de cambio de orientación');
        }
    }, 500);
});