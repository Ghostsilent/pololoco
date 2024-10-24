// file: js/models/world.class.js
class World {
    character = new Character();
    level = level1;

    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    bottleStatusBar = new BottleStatusBar(); // Neue Statusleiste für Flaschen
    coinStatusBar = new CoinStatusBar(); // Neue Statusleiste für Münzen
    endbossStatusBar = new EndbossStatusBar(); // Neue Statusleiste für den Endboss
    throwableObjects = [];
    bottles = []; // Array für Flaschen
    coins = [];   // Array für Münzen
    collectedBottles = 0; // Zähler für gesammelte Flaschen
    collectedCoins = 0; // Zähler für gesammelte Münzen
    lastThrowTime = 0; // Neue Variable, um die Zeit des letzten Flaschenwurfs zu speichern
    throwCooldown = 1000; // Cooldown-Zeit in Millisekunden (1 Sekunde)

    // Hintergrundmusik hinzufügen
    backgroundMusic = new Audio('audio/background.mp3');
    musicPlaying = false; // Neue Eigenschaft, um den Status der Musik zu verfolgen
    throwSound = new Audio('audio/throw.mp3'); // Sound-Datei für das Werfen

    // Neue Eigenschaften zum Speichern der Interval- und Animations-IDs
    runInterval;
    animationFrameId;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.addEndboss();

        // Neue Methoden zur Initialisierung von Flaschen und Münzen
        this.createBottles();
        this.createCoins();
    }

    setWorld() {
        this.character.world = this;
    }

    playBackgroundMusic() {
        this.backgroundMusic.loop = true; // Loop-Modus aktivieren
        this.backgroundMusic.volume = 0.5; // Lautstärke auf 50% setzen
        this.backgroundMusic.play(); // Musik abspielen
    }

    run() {
        // Speichern der Interval-ID
        this.runInterval = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkEndbossCollisions();
            this.checkProximityToEndboss(); // Neue Methode zur Aktivierung des Endbosses
        }, 90);
    }

    checkProximityToEndboss() {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss) {
            const distanceToCharacter = Math.abs(this.character.x - endboss.x);
            const viewDistance = 500; // Beispiel für die Sichtweite

            if (distanceToCharacter <= viewDistance && !endboss.isMoving) {
                // Starte die Bewegung nach 2 Sekunden
                setTimeout(() => {
                    endboss.startMoving();
                }, 2000); // 2000 Millisekunden = 2 Sekunden Verzögerung
            }
        }
    }

    checkEndbossCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        enemy.hit(); // Endboss nimmt Schaden
                        this.endbossStatusBar.setPercentage(enemy.energy); // Aktualisiere die Statusleiste
                    } else if (enemy instanceof Chicken || enemy instanceof Chick) {
                        enemy.die(); // Kleinere Gegner sterben sofort
                    }
                    this.throwableObjects.splice(bottleIndex, 1); // Entferne die Flasche nach dem Treffer
                }
            });
        });
    }

    checkThrowObjects() {
        const currentTime = Date.now(); // Aktuelle Zeit in Millisekunden

        // Überprüfen, ob die Taste "D" gedrückt ist, Flaschen verfügbar sind und der Cooldown abgelaufen ist
        if (this.keyboard.D && this.collectedBottles > 0 && (currentTime - this.lastThrowTime >= this.throwCooldown)) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.collectedBottles--; // Verringert die Anzahl der verfügbaren Flaschen
            this.bottleStatusBar.setPercentage(this.collectedBottles); // Statusleiste aktualisieren

            if (!isMuted) {
                this.throwSound.play(); 
            }

            this.lastThrowTime = currentTime; // Aktualisiere die Zeit des letzten Wurfs
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (this.character.isAboveGround() && this.character.speedY < 0 && this.character.y + this.character.height - 20 < enemy.y + enemy.height) {
                    // Spieler springt auf das Huhn, wenn der untere Bereich des Spielers innerhalb eines bestimmten Abstandes zur Oberseite des Huhns liegt
                    enemy.die(); // Huhn stirbt
                    this.character.jumpOnEnemy(); // Spieler bekommt einen kleinen Sprung nach oben
                } else {
                    this.character.hit(); // Spieler nimmt Schaden
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        });

        // Neue Kollisionsprüfung für Flaschen
        this.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles.splice(index, 1); // Entfernt die gesammelte Flasche
                this.collectedBottles++; // Erhöht die Anzahl der gesammelten Flaschen
                this.bottleStatusBar.setPercentage(this.collectedBottles); // Statusleiste aktualisieren
            }
        });

        // Neue Kollisionsprüfung für Münzen
        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1); // Entfernt die gesammelte Münze
                this.collectedCoins++; // Erhöht die Anzahl der gesammelten Münzen
                this.coinStatusBar.setPercentage(this.collectedCoins); // Münzenstatusleiste aktualisieren
            }
        });
    }

    // Neue Methoden zum Erstellen der Flaschen in der Welt
    createBottles() {
        for (let i = 0; i < 10; i++) { // Anzahl der Flaschen
            let x = 200 + Math.random() * 1800; // zufällige Position
            let y = 340; // Bodenhöhe
            this.bottles.push(new Bottle(x, y));
        }
    }

    // Neue Methoden zum Erstellen der Münzen in der Welt
    createCoins() {
        for (let i = 0; i < 10; i++) { // Anzahl der Münzen
            let x = 200 + Math.random() * 1800; // zufällige Position
            let y = 340; // Bodenhöhe
            this.coins.push(new Coin(x, y));
        }
    }

    addEndboss() {
        this.addToMap(this.endbossStatusBar);
    }

    checkEndbossStatus() {
        // Beispiel-Logik, wie die Statusleiste des Endbosses basierend auf seiner Energie aktualisiert werden kann
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss) {
            this.endbossStatusBar.setPercentage(endboss.energy);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        // ------ Platz für feste Objekte (z.B. Statusbar) ------
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleStatusBar); // Neue Flaschenstatusleiste hinzufügen
        this.addToMap(this.coinStatusBar); // Münzenstatusleiste hinzufügen
        this.addToMap(this.endbossStatusBar); // Statusleiste des Endbosses hinzufügen
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        // Neue Zeilen zum Hinzufügen der Flaschen und Münzen zur Welt
        this.addObjectsToMap(this.bottles); // Flaschen zur Welt hinzufügen
        this.addObjectsToMap(this.coins);   // Münzen zur Welt hinzufügen

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        this.animationFrameId = requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    stopGame() {
        // Stoppt die Hauptspiel-Schleife
        clearInterval(this.runInterval);

        // Stoppt die Bewegungs- und Animations-Intervalle des Charakters
        clearInterval(this.character.movementInterval);
        clearInterval(this.character.animationInterval);

        // Stoppt die laufende Zeichnung
        cancelAnimationFrame(this.animationFrameId);
    }
    
}
