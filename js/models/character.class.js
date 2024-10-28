/**
 * Repräsentiert einen Charakter im Spiel, der sich bewegen und verschiedene Animationen ausführen kann.
 * @extends MoveableObject
 */
class Character extends MoveableObject {
    /**
     * Die Höhe des Charakters.
     * @type {number}
     */
    height = 250;

    /**
     * Die y-Position des Charakters.
     * @type {number}
     */
    y = 80;

    /**
     * Die Geschwindigkeit des Charakters.
     * @type {number}
     */
    speed = 10;

    /**
     * Timeout für den Schlafmodus des Charakters.
     * @type {number | undefined}
     */
    sleepTimeout;

    /**
     * Intervall für die Schlafanimation des Charakters.
     * @type {number | undefined}
     */
    sleepInterval;

    /**
     * Gibt an, ob der Charakter im Leerlauf ist.
     * @type {boolean}
     */
    isIdle = false;

    /**
     * Gibt an, ob der Charakter schläft.
     * @type {boolean}
     */
    isSleeping = false;

    /**
     * Bilder für die Geh-Animation des Charakters.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /**
     * Bilder für die Sprung-Animation des Charakters.
     * @type {string[]}
     */
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    /**
     * Bilder für die Schlafanimation des Charakters.
     * @type {string[]}
     */
    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /**
     * Bilder für die Todesanimation des Charakters.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * Bilder für die Verletzungsanimation des Charakters.
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /**
     * Bilder für die Leerlaufanimation des Charakters.
     * @type {string[]}
     */
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /**
     * Die Welt, in der sich der Charakter befindet.
     * @type {Object}
     */
    world;

    /**
     * Audiodatei für das Gehgeräusch.
     * @type {Audio}
     */
    walking_sound = new Audio('audio/running.mp3');

    /**
     * Audiodatei für das Todesgeräusch.
     * @type {Audio}
     */
    deathSound = new Audio('audio/gameover.mp3');

    /**
     * Audiodatei für das Sprunggeräusch.
     * @type {Audio}
     */
    jumpSound = new Audio('audio/jump.mp3');

    /**
     * Intervall für die Bewegung des Charakters.
     * @type {number | undefined}
     */
    movementInterval;

    /**
     * Intervall für die Animation des Charakters.
     * @type {number | undefined}
     */
    animationInterval;

    /**
     * Setzt den Charakter dazu, auf einen Gegner zu springen.
     */
    jumpOnEnemy() {
        this.speedY = 25;
    }

    /**
     * Konstruktor, der den Charakter initialisiert und die Bilder und Animationen lädt.
     */
    constructor() {
        super();
        this.loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEPING);
        this.loadImages(this.IMAGES_IDLE);
        this.applyGravity();
        this.animate();
        this.resetSleepTimer();
        this.walking_sound.volume = 0.2;
        this.deathSound.volume = 0.2;
        this.jumpSound.volume = 0.2;
    }

    /**
     * Lädt die angegebenen Bilder und speichert sie im Cache.
     * @param {string[]} arr - Array der Bildpfade.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            img.onload = () => {
                this.imageCache[path] = img;
            };
            img.onerror = () => {
                console.error('Bild konnte nicht geladen werden:', path);
            };
        });
    }

    /**
     * Setzt den Schlaf-Timer zurück und startet gegebenenfalls Leerlauf- oder Schlafanimationen.
     */
    resetSleepTimer() {
        clearTimeout(this.sleepTimeout);
        clearTimeout(this.idleTimeout);
        this.isSleeping = false;
        this.isIdle = false;
    
        if (this.sleepInterval) {
            clearInterval(this.sleepInterval);
        }
        if (this.idleInterval) {
            clearInterval(this.idleInterval);
        }
    
        if (this.isSleeping || this.isIdle) {
            this.loadImage(this.IMAGES_WALKING[0]);
        }
    
        this.idleTimeout = setTimeout(() => {
            this.startIdleAnimation();
        }, 100);
    
        this.sleepTimeout = setTimeout(() => {
            this.startSleepAnimation();
        }, 5000);
    }

    /**
     * Startet die Leerlaufanimation des Charakters.
     */
    startIdleAnimation() {
        this.isIdle = true;
        let currentImageIndex = 0;
        this.idleInterval = setInterval(() => {
            let img = this.imageCache[this.IMAGES_IDLE[currentImageIndex]];
            if (img) {
                this.img = img;
            } else {
                console.warn('Bild nicht im Cache gefunden:', this.IMAGES_IDLE[currentImageIndex]);
            }
            currentImageIndex++;
            if (currentImageIndex >= this.IMAGES_IDLE.length) {
                currentImageIndex = 0;
            }
        }, 500);
    }

    /**
     * Startet die Schlafanimation des Charakters.
     */
    startSleepAnimation() {
        this.isSleeping = true;
        let currentImageIndex = 0;
        this.sleepInterval = setInterval(() => {
            let img = this.imageCache[this.IMAGES_SLEEPING[currentImageIndex]];
            if (img) {
                this.img = img;
            } else {
                console.warn('Bild nicht im Cache gefunden:', this.IMAGES_SLEEPING[currentImageIndex]);
            }
            currentImageIndex++;
            if (currentImageIndex >= this.IMAGES_SLEEPING.length) {
                currentImageIndex = 0;
            }
        }, 200);
    }

    /**
     * Startet die Animationen und Bewegungen des Charakters.
     */
    animate() {
        this.movementInterval = setInterval(() => {
            this.walking_sound.pause();
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                if (!isMuted) {
                    this.walking_sound.play();
                }
                this.resetSleepTimer();
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                if (!isMuted) {
                    this.walking_sound.play();
                }
                this.resetSleepTimer();
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.resetSleepTimer();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        let deathSoundPlayed = false;

        this.animationInterval = setInterval(() => {
            if (this.isDead()) {
                if (!deathSoundPlayed && !isMuted) {
                    this.deathSound.play();
                    deathSoundPlayed = true;
                }
                this.playAnimation(this.IMAGES_DEAD);
                setTimeout(() => {
                    showGameOverScreen();
                    this.world.stopGame();
                }, 2000);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (this.isSleeping) {
            } else if (this.isIdle) {
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 120);
    }

    /**
     * Lässt den Charakter springen.
     */
    jump() {
        if (!isMuted) {
            this.jumpSound.play();
        }
        this.speedY = 30;
        this.resetSleepTimer();
    }
}
