class EndbossStatusBar extends MoveableObject {
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',   // 0% Health
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',  // 20% Health
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',  // 40% Health
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',  // 60% Health
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',  // 80% Health
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'  // 100% Health
    ];

    percentage = 100; // Startet mit 100% Health

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 500;  // Position auf dem Bildschirm anpassen
        this.y = 50;    // Position unter der Spielerstatusleiste
        this.width = 200;
        this.height = 40;
        this.setPercentage(100); // Initial auf 100% setzen
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
