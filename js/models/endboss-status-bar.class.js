// endbossStatusBar.class.js
class EndbossStatusBar extends MoveableObject {
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',   
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',  
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',  
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',  
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',  
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'  
    ];

    percentage = 100; 

    /**
     * Erstellt eine neue Statusleiste für den Endboss und initialisiert die Position und Größe.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 500;  
        this.y = 50;   
        this.width = 200;
        this.height = 40;
        this.setPercentage(100); 
    }

    /**
     * Setzt den aktuellen Prozentsatz der Statusleiste und aktualisiert das angezeigte Bild entsprechend.
     *
     * @param {number} percentage - Der neue Prozentsatz für die Statusleiste.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Bestimmt den Index des Bildes, das basierend auf dem aktuellen Prozentsatz angezeigt werden soll.
     *
     * @returns {number} Der Index des passenden Bildes in der IMAGES-Array.
     */
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
