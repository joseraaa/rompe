// Script para la página de inicio
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    
    if (startBtn) {
        // Función para manejar tanto click como touch
        function handleStart(e) {
            e.preventDefault();
            
            // Activar pantalla completa antes de navegar
            requestFullscreen().then(() => {
                // Pequeño delay para asegurar que la pantalla completa se active
                setTimeout(() => {
                    window.location.href = 'seleccion-personaje.html';
                }, 100);
            }).catch(() => {
                // Si falla la pantalla completa, navegar de todas formas
                window.location.href = 'seleccion-personaje.html';
            });
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
                // Mantener pantalla completa al navegar
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

// Función para solicitar pantalla completa con compatibilidad multiplataforma
function requestFullscreen() {
    return new Promise((resolve, reject) => {
        const element = document.documentElement;
        
        // Verificar si ya está en pantalla completa
        if (isFullscreen()) {
            resolve();
            return;
        }
        
        // Función para manejar el éxito
        const onFullscreenChange = () => {
            if (isFullscreen()) {
                document.removeEventListener('fullscreenchange', onFullscreenChange);
                document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
                document.removeEventListener('mozfullscreenchange', onFullscreenChange);
                document.removeEventListener('MSFullscreenChange', onFullscreenChange);
                resolve();
            }
        };
        
        // Función para manejar errores
        const onFullscreenError = () => {
            document.removeEventListener('fullscreenerror', onFullscreenError);
            document.removeEventListener('webkitfullscreenerror', onFullscreenError);
            document.removeEventListener('mozfullscreenerror', onFullscreenError);
            document.removeEventListener('MSFullscreenError', onFullscreenError);
            reject(new Error('Fullscreen request failed'));
        };
        
        // Agregar listeners para eventos de cambio y error
        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);
        document.addEventListener('mozfullscreenchange', onFullscreenChange);
        document.addEventListener('MSFullscreenChange', onFullscreenChange);
        
        document.addEventListener('fullscreenerror', onFullscreenError);
        document.addEventListener('webkitfullscreenerror', onFullscreenError);
        document.addEventListener('mozfullscreenerror', onFullscreenError);
        document.addEventListener('MSFullscreenError', onFullscreenError);
        
        // Intentar activar pantalla completa con diferentes APIs
        try {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else {
                reject(new Error('Fullscreen API not supported'));
            }
        } catch (error) {
            reject(error);
        }
        
        // Timeout de seguridad
        setTimeout(() => {
            if (!isFullscreen()) {
                reject(new Error('Fullscreen request timeout'));
            }
        }, 3000);
    });
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

// Función para asegurar que se mantenga la pantalla completa
function ensureFullscreen() {
    if (!isFullscreen()) {
        requestFullscreen().catch(() => {
            // Si falla, continuar sin pantalla completa
            console.log('No se pudo mantener la pantalla completa');
        });
    }
}

// Función para manejar la navegación manteniendo pantalla completa
function navigateFullscreen(url) {
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

// Detectar orientación en dispositivos móviles y mantener pantalla completa
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        ensureFullscreen();
    }, 500);
});

// Mantener pantalla completa al cambiar de pestaña (si es posible)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setTimeout(() => {
            ensureFullscreen();
        }, 100);
    }
});