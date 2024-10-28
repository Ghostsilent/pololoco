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
    ];

    breakSound = new Audio('audio/204694_2570743-lq.mp3');
    throwSound = new Audio('audio/throw.mp3');
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
        this.loadImages(this.bottleRotationImages);
        this.initThrow();
    }

    initThrow() {
        this.throw();
    }

    throw() {
        if (!isMuted) {
            this.throwSound.play();
        }
        this.speedY = 30;
        this.applyGravity();
        this.startRotation();
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
            currentImageIndex = (currentImageIndex + 1) % this.bottleRotationImages.length;
        }, 100);
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
        this.hasHitGround = true;
        clearInterval(this.gravityInterval);
        clearInterval(this.throwInterval);
        clearInterval(this.rotationInterval);
        this.speedY = 0;
        if (!isMuted) {
            this.breakSound.play();
        }
        this.playSplashAnimation();
    }

    playSplashAnimation(callback) {
        const splashSound = new Audio('audio/204694_2570743-lq.mp3');
        if (!isMuted) {
            splashSound.play();
        }
        let currentImageIndex = 0;
        this.animationInterval = setInterval(() => {
            this.img = this.imageCache[this.brokenBottleImages[currentImageIndex]];
            currentImageIndex++;
            if (currentImageIndex >= this.brokenBottleImages.length) {
                clearInterval(this.animationInterval);
                if (callback) callback();
            }
        }, 100);
    }

    remove() {
        this.x = -1000;
    }
}
