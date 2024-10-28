class Chicken extends MoveableObject {
    y = 360;
    height = 60;
    width = 80;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'

    isDead = false;

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.y = 365;
        this.speed = 0.15 + Math.random() * 0.5;
        this.startAnimationWithDelay(2000);
    }

    startAnimationWithDelay(delay) {
        setTimeout(() => {
            this.animate();
        }, delay);
    }

    animate() {
        this.movingInterval = setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.walkingAnimationInterval = setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    die() {
        this.isDead = true;
        this.loadImage(this.IMAGE_DEAD);
        clearInterval(this.movingInterval);
        clearInterval(this.walkingAnimationInterval);
        this.speed = 0;

        setTimeout(() => {
            this.remove();
        }, 500);
    }

    remove() {
        this.x = -1000;
    }
}
