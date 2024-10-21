class BottleStatusBar extends MoveableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',   // 0 Flaschen
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',   // 2 Flaschen
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',   // 4 Flaschen
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',   // 6 Flaschen
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',   // 8 Flaschen
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'   // 10 Flaschen
    ];

    percentage = 0; // Start mit 0 Flaschen

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 40; // Position unter der Gesundheitsleiste
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
