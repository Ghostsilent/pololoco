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

    setWorld() {
        this.character.world = this;
    }

    playBackgroundMusic() {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
    }

    run() {
        this.runInterval = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkEndbossCollisions();
            this.checkProximityToEndboss();
        }, 50);
    }

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

    createBottles() {
        for (let i = 0; i < 10; i++) {
            let x = 200 + Math.random() * 1800;
            let y = 340;
            this.bottles.push(new Bottle(x, y));
        }
    }

    createCoins() {
        for (let i = 0; i < 10; i++) {
            let x = 200 + Math.random() * 1800;
            let y = 340;
            this.coins.push(new Coin(x, y));
        }
    }

    addEndboss() {
        this.addToMap(this.endbossStatusBar);
    }

    checkEndbossStatus() {
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
        clearInterval(this.runInterval);
        clearInterval(this.character.movementInterval);
        clearInterval(this.character.animationInterval);
        cancelAnimationFrame(this.animationFrameId);
    }
}
