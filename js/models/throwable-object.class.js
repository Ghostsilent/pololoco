class ThrowableObject extends MoveableObject {
    brokenBottleImages = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    bottleRotationImages = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]; // Bildsequenz für die Rotationsanimation

    breakSound = new Audio('audio/204694_2570743-lq.mp3'); // Sound für das Zerspringen der Flasche
    throwSound = new Audio('audio/throw.mp3'); // Sound für das Werfen der Flasche
    hasHitGround = false;
    gravityInterval;
    throwInterval;
    animationInterval;
    rotationInterval;

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.loadImages(this.brokenBottleImages);
        this.loadImages(this.bottleRotationImages); // Lade die Rotationsbilder
        // Initialisiere den Wurf separat vom Konstruktor
        this.initThrow();

    }

    initThrow() {
        // Startet den Wurf und die Bewegung der Flasche
        this.throw();
    }

    throw() {
        if (!isMuted) {
            this.throwSound.play(); // Sound abspielen, wenn nicht gemutet
        }
        this.speedY = 30;
        this.applyGravity();
        this.startRotation(); // Starte die Rotationsanimation
        this.throwInterval = setInterval(() => {
            if (!this.hasHitGround) {
                this.x += 10;
            }
        }, 25);
    }

    startRotation() {
        let currentImageIndex = 0;
        this.rotationInterval = setInterval(() => {
            this.img = this.imageCache[this.bottleRotationImages[currentImageIndex]];
            currentImageIndex = (currentImageIndex + 1) % this.bottleRotationImages.length; // Rotiert durch die Bilder
        }, 100); // Zeit in Millisekunden zwischen den Bildern der Rotation
    }

    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.hitGround();
            }
        }, 1000 / 25);
    }

    hitGround() {
        this.hasHitGround = true; // Setzt den Status auf "hat den Boden berührt"
        clearInterval(this.gravityInterval); // Stoppe die Gravitation
        clearInterval(this.throwInterval); // Stoppe die Wurfbewegung
        clearInterval(this.rotationInterval); // Stoppe die Rotationsanimation
        this.speedY = 0; // Setzt die Geschwindigkeit auf 0, damit die Flasche nicht weiter fällt
        if (!isMuted) {
            this.breakSound.play();
        }

        // Starte die Splash-Animation der zerbrochenen Flasche
        this.playSplashAnimation();
    }

    playSplashAnimation(callback) {
        // Sound-Objekt erstellen
        const splashSound = new Audio('audio/204694_2570743-lq.mp3'); // Pfad zur Sound-Datei
        if (!isMuted) {
            splashSound.play(); // Sound abspielen, wenn nicht gemutet
        }
        let currentImageIndex = 0;
        this.animationInterval = setInterval(() => {
            this.img = this.imageCache[this.brokenBottleImages[currentImageIndex]];
            currentImageIndex++;
            if (currentImageIndex >= this.brokenBottleImages.length) {
                clearInterval(this.animationInterval); // Stoppe die Animation
                if (callback) callback(); // Rufe die Callback-Funktion auf, wenn sie definiert ist
            }
        }, 100); // Zeit in Millisekunden zwischen den Bildern der Animation
    }

    remove() {
        this.x = -1000; // Verschiebt die Flasche aus dem sichtbaren Bereich
    }
}
