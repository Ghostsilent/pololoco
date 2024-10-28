class Endboss extends MoveableObject {
    height = 400;
    width = 250;
    y = 55;
    energy = 100;
    speed = 0.15;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_HIT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEFEATED = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    IMAGES_WALKING_MOVING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    isHit = false;
    isDefeated = false;

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HIT);
        this.loadImages(this.IMAGES_DEFEATED);
        this.loadImages(this.IMAGES_WALKING_MOVING);
        this.x = 2500;
        this.animate();
    }

    hit() {
        if (!this.isDefeated) {
            this.energy -= 20;
            if (this.energy <= 0) {
                this.energy = 0;
                this.defeat();
            } else {
                this.playHitAnimation();
            }
        }
    }

    defeat() {
        this.isDefeated = true;
        let currentImageIndex = 0;
        let defeatedAnimationInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_DEFEATED[currentImageIndex]];
            currentImageIndex++;
            if (currentImageIndex >= this.IMAGES_DEFEATED.length) {
                clearInterval(defeatedAnimationInterval);
                setTimeout(() => {
                    showWinScreen();
                }, 2000);
            }
        }, 200);
    }

    playHitAnimation() {
        this.isHit = true;
        let currentImageIndex = 0;
        let hitAnimationInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_HIT[currentImageIndex]];
            currentImageIndex++;
            if (currentImageIndex >= this.IMAGES_HIT.length) {
                clearInterval(hitAnimationInterval);
                this.isHit = false;
            }
        }, 100);
    }

    startMoving() {
        if (!this.isMoving) {
            this.isMoving = true;
            clearInterval(this.standbyAnimationInterval);
            this.animate();
        }
    }

    animate() {
        this.standbyAnimationInterval = setInterval(() => {
            if (!this.isMoving && !this.isHit && !this.isDefeated) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 300);
    
        this.movementInterval = setInterval(() => {
            if (!this.isHit && !this.isDefeated && this.isMoving) {
                clearInterval(this.standbyAnimationInterval);
                this.moveLeft();
            }
        }, 1000 / 60);
    
        this.animationInterval = setInterval(() => {
            if (!this.isHit && !this.isDefeated && this.isMoving) {
                clearInterval(this.standbyAnimationInterval);
                this.playAnimation(this.IMAGES_WALKING_MOVING);
            }
        }, 400);
    }
}
