// chicken.class.js
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

    isDead = false; // Status, ob das Huhn tot ist

    /**
     * Erstellt ein neues Huhn und initialisiert die Animation mit zufälliger Position und Geschwindigkeit.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]); // Initialisiere mit dem ersten Bild der Laufanimation
        this.loadImages(this.IMAGES_WALKING); // Lade alle Laufbilder
        this.x = 200 + Math.random() * 500; // Zufällige Position
        this.y = 365; // Bodenhöhe
        this.speed = 0.15 + Math.random() * 0.5; // Zufällige Geschwindigkeit
        /* this.animate(); */ // Starte die Animation

        // Starte die Animation mit Verzögerung
        this.startAnimationWithDelay(2000); // 2000 Millisekunden = 2 Sekunden Verzögerung
    }

    /**
     * Startet die Animation nach einer angegebenen Verzögerung.
     *
     * @param {number} delay - Die Verzögerung in Millisekunden bevor die Animation startet.
     */
    startAnimationWithDelay(delay) {
        setTimeout(() => {
            this.animate(); // Startet die Bewegung und Animation nach der Verzögerung
        }, delay);
    }

    /**
     * Führt die Bewegung und die Laufanimation des Huhns aus.
     */
    animate() {
        this.movingInterval = setInterval(() => {
            if (!this.isDead) { // Nur bewegen, wenn das Huhn nicht tot ist
                this.moveLeft();
            }
        }, 1000 / 60); // Bewegt das Huhn 60-mal pro Sekunde

        this.walkingAnimationInterval = setInterval(() => {
            if (!this.isDead) { // Nur animieren, wenn das Huhn nicht tot ist
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200); // Wechselt die Bilder für die Laufanimation alle 200 Millisekunden
    }

    /**
     * Setzt den Status des Huhns auf tot, ändert das Bild und stoppt die Animation und Bewegung.
     * Entfernt das Huhn nach einer kurzen Verzögerung vom Bildschirm.
     */
    die() {
        this.isDead = true; // Setze den Status auf "tot"
        this.loadImage(this.IMAGE_DEAD); // Bild ändern, um zu zeigen, dass das Huhn zerdrückt ist
        clearInterval(this.movingInterval); // Stoppe die Bewegung
        clearInterval(this.walkingAnimationInterval); // Stoppe die Animation
        this.speed = 0; // Setze die Geschwindigkeit auf 0, um jegliche Bewegung zu verhindern

        // Entferne das Huhn nach einer halben Sekunde
        setTimeout(() => {
            this.remove(); // Entfernt das Huhn vom Bildschirm
        }, 500); // 500 Millisekunden Verzögerung
    }

    /**
     * Entfernt das Huhn vom sichtbaren Bereich, indem es außerhalb des Bildschirms positioniert wird.
     */
    remove() {
        this.x = -1000; // Verschiebe das Huhn aus dem sichtbaren Bereich
    }
}
