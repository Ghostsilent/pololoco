let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true; // Zustand des Sounds
let soundIcon; // Referenz zum Sound-Symbol wird später initialisiert
const backgroundMusic = new Audio('audio/background.mp3'); // Hintergrundmusik
let isMuted = false; // Variable zur Steuerung des Mute-Zustands

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    // Initialisiere die Referenz zum Sound-Symbol nach dem DOM-Ladevorgang
    soundIcon = document.getElementById('sound-icon');

    console.log('My Character is', world.character);


    backgroundMusic.volume = 0.2; // Lautstärke auf 20% setzen
    // Hintergrundmusik initial abspielen
    backgroundMusic.loop = true; // Endlosschleife aktivieren
    backgroundMusic.play();
}

function toggleSound() {
    isMuted = !isMuted; // Mute-Zustand umschalten

    if (isMuted) {
        backgroundMusic.pause(); // Hintergrundmusik pausieren
        soundIcon.src = 'img/icons8-no-audio-50.png'; // Symbolbild auf stumm ändern
    } else {
        backgroundMusic.play(); // Hintergrundmusik abspielen
        soundIcon.src = 'img/soundimage.png'; // Symbolbild auf laut ändern
    }

    // Alle anderen Sounds pausieren oder abspielen, basierend auf isMuted
    updateAllSounds();
}

function updateAllSounds() {
    // Alle Soundobjekte hier definieren
    const sounds = [world.character.walking_sound, world.character.jumpSound, world.character.deathSound /* weitere Sounds hier hinzufügen */];
    
    sounds.forEach(sound => {
        if (isMuted) {
            sound.pause(); // Sound pausieren, wenn gemutet
            sound.currentTime = 0; // Setze die Wiedergabeposition zurück, um Probleme zu vermeiden
        } else {
            // Stelle sicher, dass nur Sounds abgespielt werden, die nicht bereits abgespielt werden
            if (sound.currentTime > 0 && sound.paused) {
                sound.play(); // Sound abspielen, wenn nicht gemutet und pausiert
            }
        }
    });
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
    startImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png'; // Pfad zu deinem Startbild

    startImage.onload = function () {
        ctx.drawImage(startImage, 0, 0, startScreenCanvas.width, startScreenCanvas.height);
    };

    // Zeige den START-Button nach dem Laden des Bildes an
    document.getElementById('start-button').style.display = 'block';
}

function startGame() {
    document.getElementById('start-screen-canvas').style.display = 'none';
    document.getElementById('start-button').style.display = 'none'; // Button ausblenden
    document.getElementById('canvas').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';

    init(); // Spiel starten

    // Überprüfe den Mute-Status und pausiere die Musik, falls gemutet
    if (isMuted) {
        backgroundMusic.pause(); // Musik stoppen, wenn gemutet
    }
}

function showGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.style.display = 'flex'; // Zeige den Game Over Screen an
}


function showControlsPopup() {
    // Zeige das Pop-up Fenster an
    document.getElementById('controls-popup').style.display = 'block';
}

function closeControlsPopup() {
    // Verstecke das Pop-up Fenster
    document.getElementById('controls-popup').style.display = 'none';
}

function restartGame() {
    // Seite wird neu geladen
    window.location.reload();
}




function showWinScreen() {
    const winScreen = document.getElementById('win-screen');
    winScreen.style.display = 'flex'; // Zeige den Win Screen an
    document.getElementById('canvas').style.display = 'none'; // Verstecke das Spiel
}
