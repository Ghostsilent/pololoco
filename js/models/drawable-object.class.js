class DrawableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    
        // Fehlerbehandlung, wenn das Bild nicht geladen werden kann
        this.img.onerror = () => {
            console.error('Fehler beim Laden des Bildes:', path);
        };
    }
    
    draw(ctx) {
        // Überprüfe, ob das Bild existiert und vollständig geladen ist
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
            console.warn('Bild nicht geladen oder nicht vorhanden:', this.img);
        }
    }
    

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height)
            ctx.stroke();
        }
    }

    /**
     * 
     * @param {Array} arr - ['img/image1.png', 'img/image2.png',...]
     */
        loadImages(arr) {
            arr.forEach((path) => {
                let img = new Image();
                img.src = path;
                this.imageCache[path] = img;
            });
    
        }
}