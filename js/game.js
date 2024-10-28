let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;
let soundIcon = document.getElementById('sound-icon');
const backgroundMusic = new Audio('audio/background.mp3');
backgroundMusic.volume = 0.2;
let isMuted = false;

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

function startGame() {
    document.getElementById('start-screen-canvas').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('impressum-link').style.display = 'none';
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

function showGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.style.display = 'flex';
}

function showControlsPopup() {
    document.getElementById('controls-popup').style.display = 'block';
}

function closeControlsPopup() {
    document.getElementById('controls-popup').style.display = 'none';
}

function restartGame() {
    window.location.reload();
}

function showWinScreen() {
    const winScreen = document.getElementById('win-screen');
    winScreen.style.display = 'flex';
    document.getElementById('canvas').style.display = 'none';
}

function setupTouchControls() {
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump = document.getElementById('btn-jump');
    const btnThrow = document.getElementById('btn-throw');

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

function showImpressum() {
    document.getElementById('impressum-popup').style.display = 'block';
}

function closeImpressum() {
    document.getElementById('impressum-popup').style.display = 'none';
}

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
