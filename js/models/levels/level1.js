/**
 * Startposition des Charakters.
 * @type {number}
 */
const characterStartX = 100; 

/**
 * Mindestabstand vom Charakter.
 * @type {number}
 */
const minDistance = 400;     

/**
 * Maximale x-Position im Level.
 * @type {number}
 */
const maxX = 2000;           

/**
 * Erstellt ein neues Level mit Gegnern, Wolken und Hintergrundobjekten.
 * @param {Object[]} enemies - Array der Gegnerobjekte für das Level.
 * @param {Object[]} clouds - Array der Wolkenobjekte für das Level.
 * @param {Object[]} backgroundObjects - Array der Hintergrundobjekte für das Level.
 */
const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chick(),
        new Chick(),
        new Chick(),
        new Chick(),
        new Endboss()
    ],

    [
        new Cloud()
    ],

    [
        new Backgroundobject('img/5_background/layers/air.png', -719),
        new Backgroundobject('img/5_background/layers/3_third_layer/2.png', -719),
        new Backgroundobject('img/5_background/layers/2_second_layer/2.png', -719),
        new Backgroundobject('img/5_background/layers/1_first_layer/2.png', -719),

        new Backgroundobject('img/5_background/layers/air.png', 0),
        new Backgroundobject('img/5_background/layers/3_third_layer/1.png', 0),
        new Backgroundobject('img/5_background/layers/2_second_layer/1.png', 0),
        new Backgroundobject('img/5_background/layers/1_first_layer/1.png', 0),
        new Backgroundobject('img/5_background/layers/air.png', 719),
        new Backgroundobject('img/5_background/layers/3_third_layer/2.png', 719),
        new Backgroundobject('img/5_background/layers/2_second_layer/2.png', 719),
        new Backgroundobject('img/5_background/layers/1_first_layer/2.png', 719),

        new Backgroundobject('img/5_background/layers/air.png', 719 * 2),
        new Backgroundobject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new Backgroundobject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new Backgroundobject('img/5_background/layers/1_first_layer/1.png', 719 * 2),
        new Backgroundobject('img/5_background/layers/air.png', 719 * 3),
        new Backgroundobject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
        new Backgroundobject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
        new Backgroundobject('img/5_background/layers/1_first_layer/2.png', 719 * 3)
    ]
);

/**
 * Setzt die Anfangspositionen für die Gegner im Level.
 * @param {Object} enemy - Das Gegnerobjekt, für das die Position festgelegt wird.
 * @param {number} index - Der Index des Gegners im Gegner-Array.
 */
level1.enemies.forEach((enemy, index) => {
    const minX = characterStartX + minDistance; 

    if (enemy instanceof Chicken) {
        enemy.x = minX + Math.random() * (maxX - minX);
        enemy.y = 365;
    }
    
    if (enemy instanceof Chick) {
        enemy.x = minX + Math.random() * (maxX - minX);
        enemy.y = 385;
    }

    if (enemy instanceof Endboss) {
        enemy.x = maxX + 500; 
        enemy.y = 50;
    }
});
