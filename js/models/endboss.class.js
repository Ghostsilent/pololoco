class Endboss extends MoveableObject {
    height = 400;
    width = 250;
    y = 55;
    energy = 100; // Start mit 100% Energie
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
    ]; // Bildsequenz für die Trefferanimation


    IMAGES_DEFEATED = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ]; // Bildsequenz für die Besieg-Animation

    IMAGES_WALKING_MOVING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    isHit = false; // Status, ob der Endboss getroffen wurde
    isDefeated = false; // Status, ob der Endboss besiegt wurde

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HIT); // Lade die Bilder für die Trefferanimation
        this.loadImages(this.IMAGES_DEFEATED); // Lade die Bilder für die Besieg-Animation
        this.loadImages(this.IMAGES_WALKING_MOVING); // Lade die Bilder für die Geh-Animation
        this.x = 2500;
        this.animate();
    }

    hit() {
        if (!this.isDefeated) { // Nur Schaden zufügen, wenn er noch nicht besiegt ist
            this.energy -= 20; // Reduziert die Energie des Endbosses um 20%
            if (this.energy <= 0) { // Prüft, ob die Energie 0 oder weniger ist
                this.energy = 0; // Stellt sicher, dass die Energie nicht negativ wird
                this.defeat(); // Starte die Besieg-Animation sofort, wenn die Energie auf 0 fällt
            } else {
                this.playHitAnimation(); // Starte die Trefferanimation, wenn Energie noch vorhanden ist
            }
        }
    }

    defeat() {
        this.isDefeated = true; // Setze den Status auf "besiegt"
        let currentImageIndex = 0;
        let defeatedAnimationInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_DEFEATED[currentImageIndex]];
            currentImageIndex++;
            if (currentImageIndex >= this.IMAGES_DEFEATED.length) {
                clearInterval(defeatedAnimationInterval); // Stoppe die Animation
                // Hier kannst du weitere Aktionen hinzufügen, z.B. den Endboss entfernen oder Punkte hinzufügen
            }
        }, 200); // Zeit in Millisekunden zwischen den Bildern der Besieg-Animation
    }

    playHitAnimation() {
        this.isHit = true; // Setze den Status auf "getroffen"
        let currentImageIndex = 0;
        let hitAnimationInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_HIT[currentImageIndex]];
            currentImageIndex++;
            if (currentImageIndex >= this.IMAGES_HIT.length) {
                clearInterval(hitAnimationInterval); // Stoppe die Animation
                this.isHit = false; // Setze den Status auf "nicht getroffen" zurück
            }
        }, 100); // Zeit in Millisekunden zwischen den Bildern der Animation
    }

    startMoving() {
        if (!this.isMoving) { // Sicherstellen, dass der Endboss nicht bereits läuft
            this.isMoving = true;
            clearInterval(this.standbyAnimationInterval); // Stoppt die Standby-Animation, wenn sie läuft
            this.animate(); // Startet die Bewegung
        }
    }

    animate() {
        // Standby-Animation abspielen, solange der Endboss noch nicht läuft
        this.standbyAnimationInterval = setInterval(() => {
            if (!this.isMoving && !this.isHit && !this.isDefeated) {
                this.playAnimation(this.IMAGES_WALKING); // Spielt die "Alert"-Animation ab
            }
        }, 300); // Standby-Animation alle 300 ms aktualisieren
    
        // Bewegung des Endbosses
        this.movementInterval = setInterval(() => {
            if (!this.isHit && !this.isDefeated && this.isMoving) {
                clearInterval(this.standbyAnimationInterval); // Stoppe die Standby-Animation
                this.moveLeft(); // Endboss bewegt sich nach links
            }
        }, 1000 / 60); // Aktualisiert 60-mal pro Sekunde (flüssige Bewegung)
    
        // Geh-Animation des Endbosses
        this.animationInterval = setInterval(() => {
            if (!this.isHit && !this.isDefeated && this.isMoving) {
                clearInterval(this.standbyAnimationInterval); // Stoppe die Standby-Animation, falls sie noch läuft
                this.playAnimation(this.IMAGES_WALKING_MOVING); // Geh-Animation abspielen
            }
        }, 400); // Geh-Animation alle 400 ms aktualisieren (langsamer)
    }
    




}
