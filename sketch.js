const tiles = [];
const tileImages = [];
let grid = [];
let DIM = 100;

// const BLANK = 0;
// const VERTICAL = 1;
// const HORIZONTAL = 2;
// const CROSS = 3;
// const DR = 4;
// const UR = 5;
// const UL = 6;
// const DL = 7;

function preload() {
    const path = "tiles";
    tileImages[0] = loadImage(`${path}/1.png`);
    tileImages[1] = loadImage(`${path}/2.png`);
    tileImages[2] = loadImage(`${path}/3.png`);
    tileImages[3] = loadImage(`${path}/4.png`);
    tileImages[4] = loadImage(`${path}/5.png`);
    tileImages[5] = loadImage(`${path}/6.png`);
}

function setup() {
    createCanvas(700, 700);
    //Loaded and created the tiles
    tiles[0] = new Tile(tileImages[0], [0, 0, 0, 0]);//Blank
    tiles[1] = new Tile(tileImages[1], [1, 0, 1, 0]);//Vertical
    tiles[2] = tiles[1].rotate(1);//Horizontal
    tiles[3] = new Tile(tileImages[2], [0, 0, 1, 1]);//DL
    tiles[4] = tiles[3].rotate(1);//UL
    tiles[5] = tiles[3].rotate(2);//UR
    tiles[6] = tiles[3].rotate(3);//DR
    tiles[7] = new Tile(tileImages[3], [1, 1, 1, 1]);//CROSS
    tiles[8] = new Tile(tileImages[4], [1, 1, 0, 1]);//TUP
    tiles[9] = tiles[8].rotate(1);//TRIGHT
    tiles[10] = tiles[8].rotate(2);//TDOWN
    tiles[11] = tiles[8].rotate(3);//TLEFT
    tiles[12] = new Tile(tileImages[5], [1, 0, 0, 0]);//END UP
    tiles[13] = tiles[12].rotate(1);//END RIGHT
    tiles[14] = tiles[12].rotate(2);//END DOWN
    tiles[15] = tiles[12].rotate(3);//END LEFT
    
    //generating adjucency rule
    for(let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        tile.analayze(tiles);
    }

    //cell in everyspot on grid
    for (let i = 0; i < DIM * DIM; i++) {
        grid[i] = new Cell(tiles.length)
    }

    noLoop();  // Ensure no looping from the beginning
}

function mousePressed() {
    // Reinitialize the grid
    grid = [];
    for (let i = 0; i < DIM * DIM; i++) {
        grid[i] = new Cell(tiles.length);
    }

    // Ensure drawing continues until all cells are filled
    loop();
}

function checkValid(arr, valid) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (!valid.includes(arr[i])) {
            arr.splice(i, 1);
        }
    }
}

function draw() {
    background(0);
    
    const w = width / DIM;
    const h = height / DIM;
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            let cell = grid[i + j * DIM];
            if (cell.collapsed) {
                let index = cell.options[0];
                image(tiles[index].img, i * w, j * h, w, h);
            } else {
                fill(0);
                stroke(255);
                rect(i * w, j * h, w, h);
            }
        }
    }
    // Picking cell with least entropy
    let gridCopy = grid.slice();
    gridCopy = gridCopy.filter((a) => !a.collapsed);

    if (gridCopy.length == 0) {
        noLoop();  // Stop drawing once all cells are collapsed
        return;
    }

    gridCopy.sort((a, b) => {
        return a.options.length - b.options.length;
    });
    let len = gridCopy[0].options.length;
    let stopIndex = 0;

    for (let i = 1; i < gridCopy.length; i++) {
        if (gridCopy[i].options.length > len) {
            stopIndex = i;
            break;
        }
    }

    if (stopIndex > 0) gridCopy.splice(stopIndex);

    const cell = random(gridCopy);
    cell.collapsed = true;
    const pick = random(cell.options);
    cell.options = [pick];


    const nextGrid = [];
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            let index = i + j * DIM;
            if (grid[index].collapsed) {
                nextGrid[index] = grid[index];
            } else {
                let options = new Array(tiles.length).fill(0).map((x, i)=> i);
                // Look up
                if (j > 0) {
                    let up = grid[i + (j - 1) * DIM];
                    let validOptions = [];
                    for (let option of up.options) {
                        let valid = tiles[option].down;
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // Look right
                if (i < DIM - 1) {
                    let right = grid[i + 1 + j * DIM];
                    let validOptions = [];
                    for (let option of right.options) {
                        let valid = tiles[option].left
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // Look down
                if (j < DIM - 1) {
                    let down = grid[i + (j + 1) * DIM];
                    let validOptions = [];
                    for (let option of down.options) {
                        let valid = tiles[option].up;
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // Look left
                if (i > 0) {
                    let left = grid[i - 1 + j * DIM];
                    let validOptions = [];
                    for (let option of left.options) {
                        let valid = tiles[option].right;
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                nextGrid[index] = new Cell(options)
            }
        }
    }
    grid = nextGrid;
    loop();  // Ensure drawing continues until all cells are filled
}
