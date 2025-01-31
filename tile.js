function reverseString(s){
    let arr = s.split("");
    arr = arr.reverse();
    return arr.join("");
}

function compareEdge(a,b){
    return a==reverseString(b)
}

class Tile{
    constructor(img, edges){
        this.img = img;
        this.edges = edges

        this.up = [];
        this.right = [];
        this.down = [];
        this.left = [];
    }

    analayze(tiles){
        for(let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];
            //UP
            if(compareEdge(tile.edges[2],this.edges[0])){
                this.up.push(i);
            }
            //RIGHT
            if(compareEdge(tile.edges[3],this.edges[1])){
                this.right.push(i);
            }
            //DOWN
            if(compareEdge(tile.edges[0],this.edges[2])){
                this.down.push(i);
            }
            //LEFT
            if(compareEdge(tile.edges[1],this.edges[3])){
                this.left.push(i);
            }
        }
    }

    rotate(num){
        const w = this.img.width;
        const h = this.img.height;
        const newImg = createGraphics(w, h);
        newImg.imageMode(CENTER);
        newImg.translate(w/2, h/2);
        newImg.rotate(HALF_PI * num);
        newImg.image(this.img, 0, 0);

        const newEdges = [];
        const len = this.edges.length;
        for(let i = 0; i < len; i++){
            newEdges[i] = this.edges[(i - num + len)%len];
        }
        
        return new Tile(newImg , newEdges);
    }

    flip(direction) {
        const w = this.img.width;
        const h = this.img.height;
        const newImg = createGraphics(w, h);
        newImg.imageMode(CENTER);
        newImg.translate(w / 2, h / 2);

        if (direction === 1) {
            // Horizontal Flip
            newImg.scale(-1, 1); // Flip horizontally
        } else if (direction === -1) {
            // Vertical Flip
            newImg.scale(1, -1); // Flip vertically
        }

        newImg.image(this.img, 0, 0);

        const newEdges = [];
        const len = this.edges.length;
        for (let i = 0; i < len; i++) {
            if (direction === 1) {
                newEdges[i] = this.edges[(len - i) % len]; // Horizontal flip
            } else if (direction === -1) {
                newEdges[i] = this.edges[(i + 2) % len]; // Vertical flip
            }
        }
        
        return new Tile(newImg, newEdges);
    }
}