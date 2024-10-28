// moveableObject.class.js
class MoveableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Wendet die Schwerkraft auf das Objekt an, um es nach unten zu bewegen.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Überprüft, ob das Objekt über dem Boden ist.
     *
     * @returns {boolean} Wahr, wenn das Objekt über dem Boden ist, sonst falsch.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y < 370; 
        } else {
            return this.y < 180; 
        }
    }

    /**
     * Überprüft, ob dieses Objekt mit einem anderen kollidiert.
     *
     * @param {MoveableObject} mo - Das andere bewegliche Objekt, mit dem kollidiert werden soll.
     * @returns {boolean} Wahr, wenn eine Kollision vorliegt, sonst falsch.
     */
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height;
    }

    /**
     * Verarbeitet einen Treffer auf das Objekt, reduziert die Energie und aktualisiert den letzten Trefferzeitpunkt.
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Überprüft, ob das Objekt kürzlich verletzt wurde.
     *
     * @returns {boolean} Wahr, wenn das Objekt innerhalb der letzten Sekunde verletzt wurde, sonst falsch.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; 
        timepassed = timepassed / 1000; 
        return timepassed < 1;
    }

    /**
     * Überprüft, ob das Objekt tot ist.
     *
     * @returns {boolean} Wahr, wenn die Energie 0 erreicht hat, sonst falsch.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Spielt eine Animationssequenz basierend auf den übergebenen Bildern ab.
     *
     * @param {string[]} images - Array von Bildpfaden für die Animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Bewegt das Objekt nach rechts basierend auf der aktuellen Geschwindigkeit.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Bewegt das Objekt nach links basierend auf der aktuellen Geschwindigkeit.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Lässt das Objekt springen, indem die vertikale Geschwindigkeit gesetzt wird.
     */
    jump() {
        this.speedY = 30;
    }
}
