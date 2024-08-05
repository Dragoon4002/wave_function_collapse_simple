const tiles = [];
const tileImages = [];
let grid = [];
let DIM = 30;

// const BLANK = 0;
// const VERTICAL = 1;
// const HORIZONTAL = 2;
// const CROSS = 3;
// const DR = 4;
// const UR = 5;
// const UL = 6;
// const DL = 7;

function preload() {
    /*
    const path = 'tiles/circuit';
    for (let i = 0; i < 13; i++) {
        tileImages[i] = loadImage(`${path}/${i}.png`);
    }
    */
    const path = 'tiles/maps';
    for (let i = 0; i < 23; i++) {
    tileImages[i] = loadImage(`${path}/${i}.png`);
    }
}

function setup() {
    createCanvas(700, 700);
    //Loaded and created the tiles
    
    /*
    //Path = tiles/circuit 13 images 0 - 13
    tiles[0] = new Tile(tileImages[0], ["AAA", "AAA", "AAA", "AAA"]);
    tiles[1] = new Tile(tileImages[1], ["BBB", "BBB", "BBB", "BBB"]);
    tiles[2] = new Tile(tileImages[2], ["BBB", "BCB", "BBB", "BBB"]);
    tiles[3] = new Tile(tileImages[3], ["BBB", "BDB", "BBB", "BDB"]);
    tiles[4] = new Tile(tileImages[6], ["BBB", "BCB", "BBB", "BCB"]);
    tiles[5] = new Tile(tileImages[7], ["BDB", "BCB", "BDB", "BCB"]);
    tiles[6] = new Tile(tileImages[8], ["BDB", "BBB", "BCB", "BBB"]);
    tiles[7] = new Tile(tileImages[9], ["BCB", "BCB", "BBB", "BCB"]);
    tiles[8] = new Tile(tileImages[10], ["BCB", "BCB", "BCB", "BCB"]);
    tiles[9] = new Tile(tileImages[11], ["BCB", "BCB", "BBB", "BBB"]);
    tiles[10] = new Tile(tileImages[12], ["BBB", "BCB", "BBB", "BCB"]);
    tiles[11] = new Tile(tileImages[4], ["ABB", "BCB", "BBA", "AAA"]);
    tiles[12] = new Tile(tileImages[5], ["ABB", "BBB", "BBB", "BBA"]);
    
    for(let i=2; i<14; i++){
        for(let j=0; j<4; j++){
            tiles.push(tiles[i].rotate(j));
        }
    }
    */
    
    tiles[0] = new Tile(tileImages[0], ["MMM","MMM","MMM","MMM"]);
    tiles[1] = new Tile(tileImages[1], ["MMM","MMM","MMM","MMM"]);
    tiles[2] = new Tile(tileImages[2], ["MMM","MMM","MMM","MWM"]);
    tiles[3] = new Tile(tileImages[3], ["MMM","MWM","MMM","MWM"]);
    tiles[4] = new Tile(tileImages[4], ["WWM","MWM","MWW","WWW"]);
    tiles[5] = new Tile(tileImages[5], ["WWW","WWW","WWW","WWW"]);
    tiles[6] = new Tile(tileImages[6], ["WWS","SSS","SWW","WWW"]);
    tiles[7] = new Tile(tileImages[7], ["WWS","SSS","SSW","WWW"]);
    tiles[8] = new Tile(tileImages[8], ["SSS","SSS","SSW","WWS"]);
    tiles[9] = new Tile(tileImages[9], ["SSS","SSS","SSS","SSS"]);
    tiles[10] = new Tile(tileImages[10], ["SSG","GGG","GSS","SSS"]);
    tiles[11] = new Tile(tileImages[11], ["SSG","GGG","GGG","GGS"]);
    tiles[12] = new Tile(tileImages[12], ["GGG","GGG","GGG","GGG"]);
    tiles[13] = new Tile(tileImages[13], ["GGG","GGG","GGG","GGG"]);
    tiles[14] = new Tile(tileImages[14], ["GGG","GWG","GGG","GWG"]);
    tiles[15] = new Tile(tileImages[15], ["GGG","GWG","GGG","GWG"]);
    tiles[16] = new Tile(tileImages[16], ["GGM","MWM","MGG","GWG"]);
    tiles[17] = new Tile(tileImages[17], ["GWG","GWG","GGG","GWG"]);
    tiles[18] = new Tile(tileImages[18], ["SSG","GWG","GSS","SWS"]);
    tiles[19] = new Tile(tileImages[19], ["SSW","WWW","WSS","SWS"]);
    tiles[20] = new Tile(tileImages[20], ["GGG","GGM","MMM","MGG"]);
    tiles[21] = new Tile(tileImages[21], ["WWM","MMM","MWW","WWW"]);
    tiles[22] = new Tile(tileImages[22], ["WSS","SSS","SWW","WWW"]);
    
    for(let i=2; i<23; i++){
        for(let j=0; j<4; j++){
            tiles.push(tiles[i].rotate(j));
        }
    }
    
    //generating adjucency rule
    for(let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        tile.analayze(tiles);
    }

    //cell in everyspot on grid
    startOver();

    noLoop();  // Ensure no looping from the beginning
}

function mousePressed() {
    startOver();
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

function startOver(){
    grid = [];
    for (let i = 0; i < DIM * DIM; i++) {
        grid[i] = new Cell(tiles.length);
    }
}
/*
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
    if(pick == undefined){
        noLoop();
        return;
    }
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

                // Draw possible options
                let optionsCount = cell.options.length;
                let optionW = w / optionsCount;
                let optionH = h / optionsCount;
                for (let k = 0; k < optionsCount; k++) {
                    let optionIndex = cell.options[k];
                    let sx = k % optionsCount;
                    let sy = Math.floor(k / optionsCount);
                    image(tiles[optionIndex].img, i * w + sx * optionW, j * h + sy * optionH, optionW, optionH);
                }
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

    gridCopy.sort((a, b) => a.options.length - b.options.length);
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
    if (pick == undefined) {
        noLoop();
        return;
    }
    cell.options = [pick];

    const nextGrid = [];
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            let index = i + j * DIM;
            if (grid[index].collapsed) {
                nextGrid[index] = grid[index];
            } else {
                let options = new Array(tiles.length).fill(0).map((x, i) => i);
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
                nextGrid[index] = new Cell(options);
            }
        }
    }
    grid = nextGrid;
    loop();  // Ensure drawing continues until all cells are filled
}
*/

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
                /*
                // Draw possible options
                let optionsCount = cell.options.length;
                let optionSize = Math.sqrt(optionsCount);
                let optionW = w / optionSize;
                let optionH = h / optionSize;
                for (let k = 0; k < optionsCount; k++) {
                    let optionIndex = cell.options[k];
                    let sx = k % optionSize;
                    let sy = Math.floor(k / optionSize);
                    image(tiles[optionIndex].img, i * w + sx * optionW, j * h + sy * optionH, optionW, optionH);
                }
                */
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

    gridCopy.sort((a, b) => a.options.length - b.options.length);
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
    if (pick == undefined) {
        startOver();
        return;
    }
    cell.options = [pick];

    const nextGrid = [];
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            let index = i + j * DIM;
            if (grid[index].collapsed) {
                nextGrid[index] = grid[index];
            } else {
                let options = new Array(tiles.length).fill(0).map((x, i) => i);
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
                nextGrid[index] = new Cell(options);
            }
        }
    }
    grid = nextGrid;
    loop();  // Ensure drawing continues until all cells are filled
}