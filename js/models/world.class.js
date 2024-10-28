// world.class.js
class World {
    character = new Character();
    level = level1;

    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    bottleStatusBar = new BottleStatusBar();
    coinStatusBar = new CoinStatusBar();
    endbossStatusBar = new EndbossStatusBar();
    throwableObjects = [];
    bottles = [];
    coins = [];
    collectedBottles = 0;
    collectedCoins = 0;
    lastThrowTime = 0;
    throwCooldown = 1000;

    backgroundMusic = new Audio('audio/background.mp3');
    musicPlaying = false;
    throwSound = new Audio('audio/throw.mp3');

    runInterval;
    animationFrameId;

    /**
     * Erstellt eine neue Welt, initialisiert die Zeichenfläche, Tastatur und startet die Spielmechanismen.
     *
     * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem das Spiel gezeichnet wird.
     * @param {Object} keyboard - Das Keyboard-Objekt zur Steuerung des Charakters.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.addEndboss();
        this.createBottles();
        this.createCoins();
    }

    /**
     * Setzt die Welt für den Charakter, damit der Charakter auf die Welt zugreifen kann.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Spielt die Hintergrundmusik in einer Schleife mit angepasster Lautstärke ab.
     */
    playBackgroundMusic() {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
    }

    /**
     * Startet das Haupt-Intervall, das verschiedene Spielüberprüfungen alle 50 Millisekunden durchführt.
     */
    run() {
        this.runInterval = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkEndbossCollisions();
            this.checkProximityToEndboss();
        }, 50);
    }

    /**
     * Überprüft die Nähe des Charakters zum Endboss und startet die Bewegung des Endboss, wenn der Charakter nahe genug ist.
     */
    checkProximityToEndboss() {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss) {
            const distanceToCharacter = Math.abs(this.character.x - endboss.x);
            const viewDistance = 500;

            if (distanceToCharacter <= viewDistance && !endboss.isMoving) {
                setTimeout(() => {
                    endboss.startMoving();
                }, 2000);
            }
        }
    }

    /**
     * Überprüft Kollisionen zwischen Wurfobjekten und Feinden, verarbeitet Treffer und aktualisiert die Statusleiste des Endboss.
     */
    checkEndbossCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        enemy.hit();
                        this.endbossStatusBar.setPercentage(enemy.energy);
                    } else if (enemy instanceof Chicken || enemy instanceof Chick) {
                        enemy.die();
                    }
                    this.throwableObjects.splice(bottleIndex, 1);
                }
            });
        });
    }

    /**
     * Überprüft, ob der Charakter eine Flasche werfen kann und wirft eine Flasche, wenn die Bedingungen erfüllt sind.
     */
    checkThrowObjects() {
        const currentTime = Date.now();

        if (this.keyboard.D && this.collectedBottles > 0 && (currentTime - this.lastThrowTime >= this.throwCooldown)) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.collectedBottles--;
            this.bottleStatusBar.setPercentage(this.collectedBottles);

            if (!isMuted) {
                this.throwSound.play();
            }

            this.lastThrowTime = currentTime;
        }
    }

    /**
     * Überprüft Kollisionen zwischen dem Charakter und Feinden sowie Sammelobjekten wie Flaschen und Münzen.
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (this.character.isAboveGround() && this.character.speedY < 0 && this.character.y + this.character.height - 20 < enemy.y + enemy.height) {
                    enemy.die();
                    this.character.jumpOnEnemy();
                } else {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        });

        this.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles.splice(index, 1);
                this.collectedBottles++;
                this.bottleStatusBar.setPercentage(this.collectedBottles);
            }
        });

        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1);
                this.collectedCoins++;
                this.coinStatusBar.setPercentage(this.collectedCoins);
            }
        });
    }

    /**
     * Erstellt eine bestimmte Anzahl von Flaschen an zufälligen Positionen und fügt sie dem Spiel hinzu.
     */
    createBottles() {
        for (let i = 0; i < 10; i++) {
            let x = 200 + Math.random() * 1800;
            let y = 340;
            this.bottles.push(new Bottle(x, y));
        }
    }

    /**
     * Erstellt eine bestimmte Anzahl von Münzen an zufälligen Positionen und fügt sie dem Spiel hinzu.
     */
    createCoins() {
        for (let i = 0; i < 10; i++) {
            let x = 200 + Math.random() * 1800;
            let y = 340;
            this.coins.push(new Coin(x, y));
        }
    }

    /**
     * Fügt die Statusleiste des Endboss zur Spielkarte hinzu.
     */
    addEndboss() {
        this.addToMap(this.endbossStatusBar);
    }

    /**
     * Überprüft den Status des Endboss und aktualisiert die Statusleiste entsprechend.
     */
    checkEndbossStatus() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss) {
            this.endbossStatusBar.setPercentage(endboss.energy);
        }
    }

    /**
     * Zeichnet alle Spielobjekte auf das Canvas und aktualisiert die Darstellung kontinuierlich.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleStatusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.endbossStatusBar);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.coins);

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        this.animationFrameId = requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Fügt eine Liste von Objekten zur Spielkarte hinzu und zeichnet sie.
     *
     * @param {Array} objects - Ein Array von Spielobjekten, die hinzugefügt werden sollen.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Fügt ein einzelnes Objekt zur Spielkarte hinzu und zeichnet es, ggf. gespiegelt.
     *
     * @param {MoveableObject} mo - Das Spielobjekt, das hinzugefügt werden soll.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Spiegelt das Bild eines Objekts horizontal, um die Richtung zu ändern.
     *
     * @param {MoveableObject} mo - Das Spielobjekt, das gespiegelt werden soll.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Setzt die Spiegelung eines Objekts zurück, nachdem es gezeichnet wurde.
     *
     * @param {MoveableObject} mo - Das Spielobjekt, das die Spiegelung zurücksetzen soll.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Stoppt das Spiel, indem alle laufenden Intervalle und Animationen beendet werden.
     */
    stopGame() {
        clearInterval(this.runInterval);
        clearInterval(this.character.movementInterval);
        clearInterval(this.character.animationInterval);
        cancelAnimationFrame(this.animationFrameId);
    }
}
