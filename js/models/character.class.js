class Character extends MoveableObject {
    height = 250;
    y = 80;
    speed = 10;
    sleepTimeout; // Timer für die Inaktivität
    sleepInterval; // Intervall für die Schlafanimation
    isSleeping = false; // Status, ob der Spieler schläft

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

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

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    world;
    walking_sound = new Audio('audio/running.mp3')
    deathSound = new Audio('audio/gameover.mp3'); // Sound-Datei für das Sterben des Spielers
    jumpSound = new Audio('audio/jump.mp3'); // Sound-Datei für das Springen

    // Neue Eigenschaften zum Speichern der Interval-IDs
    movementInterval;
    animationInterval;

    jumpOnEnemy() {
        this.speedY = 25; // Setzt die Sprunghöhe
    }

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEPING); // Lade Schlafbilder
        this.applyGravity();
        this.animate();
        this.resetSleepTimer(); // Starte den Inaktivitäts-Timer
    }

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

    resetSleepTimer() {
        clearTimeout(this.sleepTimeout); // Lösche den vorherigen Timer
        this.isSleeping = false; // Setze den Schlafstatus zurück
        if (this.sleepInterval) {
            clearInterval(this.sleepInterval); // Stoppe die Schlafanimation
        }
        this.loadImage(this.IMAGES_WALKING[0]); // Setze das Bild auf den Standbild
        // Setze den Timer für die Schlafanimation auf 5 Sekunden
        this.sleepTimeout = setTimeout(() => {
            this.startSleepAnimation();
        }, 5000);
    }

    startSleepAnimation() {
        this.isSleeping = true;
        let currentImageIndex = 0;
        this.sleepInterval = setInterval(() => {
            let img = this.imageCache[this.IMAGES_SLEEPING[currentImageIndex]];
            if (img) {
                this.img = img; // Zeichnet das Bild nur, wenn es vorhanden ist
            } else {
                console.warn('Bild nicht im Cache gefunden:', this.IMAGES_SLEEPING[currentImageIndex]);
            }
            currentImageIndex++;
            if (currentImageIndex >= this.IMAGES_SLEEPING.length) {
                currentImageIndex = 0; // Wiederhole die Schlafanimation
            }
        }, 200); // Zeit in Millisekunden zwischen den Bildern
    }

    animate() {
        // Speichern der Interval-IDs
        this.movementInterval = setInterval(() => {
            this.walking_sound.pause();
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                if (!isMuted) {
                    this.walking_sound.play(); // Nur abspielen, wenn nicht gemutet
                }
                this.resetSleepTimer(); // Timer zurücksetzen
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                if (!isMuted) {
                    this.walking_sound.play(); // Nur abspielen, wenn nicht gemutet
                }
                this.resetSleepTimer(); // Timer zurücksetzen
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.resetSleepTimer(); // Timer zurücksetzen
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        let deathSoundPlayed = false; // Variable, um zu prüfen, ob der Sound bereits abgespielt wurde

        this.animationInterval = setInterval(() => {
            if (this.isDead()) {
                if (!deathSoundPlayed && !isMuted) {
                    this.deathSound.play();
                    deathSoundPlayed = true;
                }
                this.playAnimation(this.IMAGES_DEAD);
                setTimeout(() => {
                    showGameOverScreen(); // Zeigt den Game Over-Bildschirm
                    this.world.stopGame(); // Hier wird das Spiel gestoppt
                }, 2000); // 2 Sekunden Verzögerung nach dem Tod des Spielers
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 50);
    }

    jump() {
        if (!isMuted) {
            this.jumpSound.play(); // Sound abspielen, wenn der Spieler springt
        }
        this.speedY = 30;
        this.resetSleepTimer(); // Timer zurücksetzen
    }

}
