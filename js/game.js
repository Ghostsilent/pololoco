// main.js
let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;
let soundIcon = document.getElementById('sound-icon');
const backgroundMusic = new Audio('audio/background.mp3');
backgroundMusic.volume = 0.2;
let isMuted = false;

/**
 * Initialisiert das Spiel, setzt das Canvas und startet die Hintergrundmusik.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    soundIcon = document.getElementById('sound-icon');
    backgroundMusic.volume = 0.2;
    backgroundMusic.loop = true;
    backgroundMusic.play();
    if (!isMuted) {
        backgroundMusic.play();
    }
}

/**
 * Schaltet die Soundausgabe um und aktualisiert die Sound-Icons entsprechend.
 */
function toggleSound() {
    isMuted = !isMuted;
    const soundIcon = document.getElementById('sound-icon');
    if (isMuted) {
        backgroundMusic.pause();
        soundIcon.src = 'img/icons8-no-audio-50.png';
    } else {
        backgroundMusic.play();
        soundIcon.src = 'img/soundimage.png';
    }
    updateAllSounds();
}

/**
 * Aktualisiert den Soundstatus aller relevanten Sounds im Spiel basierend auf dem aktuellen Mute-Status.
 */
function updateAllSounds() {
    if (world && world.character) {
        const sounds = [world.character.walking_sound, world.character.jumpSound, world.character.deathSound];
        sounds.forEach(sound => {
            if (isMuted) {
                sound.pause();
                sound.currentTime = 0;
            } else {
                if (sound.currentTime > 0 && sound.paused) {
                    sound.play();
                }
            }
        });
    }
}

// Event Listener für Tastendruck
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});

// Event Listener für das Loslassen der Taste
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }
});

/**
 * Zeigt den Startbildschirm an und lädt das Startbild.
 */
function showStartScreen() {
    const startScreenCanvas = document.getElementById('start-screen-canvas');
    const ctx = startScreenCanvas.getContext('2d');
    const startImage = new Image();
    startImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';
    startImage.onload = function () {
        ctx.drawImage(startImage, 0, 0, startScreenCanvas.width, startScreenCanvas.height);
    };
    document.getElementById('start-button').style.display = 'block';
}

/**
 * Startet das Spiel, versteckt den Startbildschirm und zeigt die Spielanzeige.
 */
function startGame() {
    document.getElementById('start-screen-canvas').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';
    /* document.getElementById('impressum-link').style.display = 'none'; */
    document.getElementById('canvas').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
    init();
    setupTouchControls();
    if (isMuted) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play();
    }
    const soundIcon = document.getElementById('sound-icon');
    if (isMuted) {
        soundIcon.src = 'img/icons8-no-audio-50.png';
    } else {
        soundIcon.src = 'img/soundimage.png';
    }
}

/**
 * Zeigt den Game Over Bildschirm an.
 */
function showGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.style.display = 'flex';
}

/**
 * Zeigt das Steuerungs-Popup an.
 */
function showControlsPopup() {
    document.getElementById('controls-popup').style.display = 'block';
}

/**
 * Schließt das Steuerungs-Popup.
 */
function closeControlsPopup() {
    document.getElementById('controls-popup').style.display = 'none';
}

/**
 * Startet das Spiel neu, indem die Seite neu geladen wird.
 */
function restartGame() {
    window.location.reload();
}

/**
 * Zeigt den Sieg-Bildschirm an und versteckt das Spiel-Canvas.
 */
function showWinScreen() {
    const winScreen = document.getElementById('win-screen');
    winScreen.style.display = 'flex';
    document.getElementById('canvas').style.display = 'none';
}

/**
 * Richtet die Touch-Steuerungen für mobile Geräte ein.
 */
function setupTouchControls() {
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump = document.getElementById('btn-jump');
    const btnThrow = document.getElementById('btn-throw');

    /**
     * Fügt Touch-Ereignisse zu einem Button hinzu, um eine bestimmte Tasteneigenschaft zu setzen.
     *
     * @param {HTMLElement} button - Der Button, der Touch-Ereignisse empfangen soll.
     * @param {string} keyProperty - Die Tasteneigenschaft, die bei Touch-Ereignissen gesetzt werden soll.
     */
    function addTouchEvent(button, keyProperty) {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[keyProperty] = true;
        });
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[keyProperty] = false;
        });
    }

    addTouchEvent(btnLeft, 'LEFT');
    addTouchEvent(btnRight, 'RIGHT');
    addTouchEvent(btnJump, 'SPACE');
    addTouchEvent(btnThrow, 'D');
}

/**
 * Zeigt das Impressum-Popup an.
 */
function showImpressum() {
    document.getElementById('impressum-popup').style.display = 'block';
}

/**
 * Schließt das Impressum-Popup.
 */
function closeImpressum() {
    document.getElementById('impressum-popup').style.display = 'none';
}

/**
 * Überprüft die Ausrichtung des Geräts und zeigt ggf. eine Overlay an.
 */
function checkOrientation() {
    const overlay = document.getElementById('rotate-device-overlay');
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width < height && width < 1000) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('load', checkOrientation);

window.onload = function() {
    showStartScreen();
    if (isTouchDevice()) {
        showTouchControls();
    }
};

/**
 * Überprüft, ob das Gerät ein Touch-Gerät ist.
 *
 * @returns {boolean} Wahr, wenn das Gerät Touch-fähig ist, sonst falsch.
 */
function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

/**
 * Zeigt die Touch-Steuerungen an, falls es sich um ein Touch-Gerät handelt.
 */
function showTouchControls() {
    document.getElementById('touch-controls').style.display = 'flex';
}
