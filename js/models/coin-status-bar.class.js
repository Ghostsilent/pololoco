class CoinStatusBar extends MoveableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',   // 0 Münzen
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',   // 2 Münzen
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',   // 4 Münzen
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',   // 6 Münzen
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',   // 8 Münzen
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'   // 10 Münzen
    ];

    percentage = 0; // Start mit 0 Münzen

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 80; // Position unter der Flaschenstatusleiste
        this.width = 200;
        this.height = 50;
        this.setPercentage(0);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage >= 10) {
            return 5;
        } else if (this.percentage >= 8) {
            return 4;
        } else if (this.percentage >= 6) {
            return 3;
        } else if (this.percentage >= 4) {
            return 2;
        } else if (this.percentage >= 2) {
            return 1;
        } else {
            return 0;
        }
    }
}
