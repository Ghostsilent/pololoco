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

level1.enemies.forEach((enemy, index) => {
    if (enemy instanceof Chicken) {
        // Zufällige X-Position auf der Spielfläche zwischen 200 und 2000 Pixeln
        enemy.x = 200 + Math.random() * 1800; 
        enemy.y = 365; // Y-Position auf dem Boden
    }
    
    if (enemy instanceof Chick) {
        // Zufällige X-Position auf der Spielfläche zwischen 200 und 2000 Pixeln
        enemy.x = 200 + Math.random() * 1800; 
        enemy.y = 385; // Y-Position auf dem Boden
    }
});
