class CoinStatusBar extends MoveableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',   
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',   
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',  
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',   
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',   
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'  
    ];

    percentage = 0; 

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 80; 
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
