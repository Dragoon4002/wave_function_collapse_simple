let tiles = [];
let grid = [];
let DIM = 50;

const BLANK = 0;
const VERTICAL = 1;
const HORIZONTAL = 2;
const CROSS = 3;
const DR = 4;
const UR = 5;
const UL = 6;
const DL = 7;

const rules = [
    //top,right,down,left
    [
        [BLANK, HORIZONTAL, UL, UR],
        [BLANK, VERTICAL, UR, DR],
        [BLANK, HORIZONTAL, DR, DL],
        [BLANK, VERTICAL, UL, DL]
    ],
    [
        [VERTICAL, CROSS, DR, DL],
        [VERTICAL, BLANK, UR, DR],
        [VERTICAL, CROSS, UR, UL],
        [VERTICAL, BLANK, UL, DL]
    ],
    [
        [HORIZONTAL, BLANK, UR, UL],
        [HORIZONTAL, CROSS, UL, DL],
        [HORIZONTAL, BLANK, DR, DL],
        [HORIZONTAL, CROSS, UR, DR]
    ],
    [
        [CROSS, VERTICAL, DR, DL],
        [CROSS, HORIZONTAL, UL, DL],
        [CROSS, VERTICAL, UR, UL],
        [CROSS, HORIZONTAL, UR, DR]
    ],
    [
        [BLANK, HORIZONTAL, UR, UL],
        [BLANK, VERTICAL, UR, DR],
        [CROSS, VERTICAL, UR, UL],
        [CROSS, HORIZONTAL, UL, DL]
    ],
    [
        [CROSS, VERTICAL, DL, DR],
        [CROSS, HORIZONTAL, UL, DL],
        [BLANK, HORIZONTAL, DL, DR],
        [BLANK, VERTICAL, UR, DR]
    ],
    [
        [CROSS, VERTICAL, DL, DR],
        [BLANK, VERTICAL, UL, DL],
        [BLANK, HORIZONTAL, DL, DR],
        [CROSS, HORIZONTAL, DR, UR]
    ],
    [
        [BLANK, HORIZONTAL, UR, UL],
        [BLANK, VERTICAL, UL, DL],
        [BLANK, HORIZONTAL, DL, DR],
        [CROSS, HORIZONTAL, DR, UR]
    ]
];

function preload() {
    tiles[0] = loadImage("tiles/1.png");
    tiles[1] = loadImage("tiles/2.png");
    tiles[2] = loadImage("tiles/3.png");
    tiles[3] = loadImage("tiles/4.png");
    tiles[4] = loadImage("tiles/5.png");
    tiles[5] = loadImage("tiles/6.png");
    tiles[6] = loadImage("tiles/7.png");
    tiles[7] = loadImage("tiles/8.png");
}

function setup() {
    createCanvas(500, 500);

    for (let i = 0; i < DIM * DIM; i++) {
        grid[i] = {
            collapsed: false,
            options: [BLANK, VERTICAL, HORIZONTAL, CROSS, DL, DR, UL, UR],
        };
    }
    noLoop();  // Ensure no looping from the beginning
}

function mousePressed() {
    redraw();
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
                image(tiles[index], i * w, j * h, w, h);
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
                let options = [BLANK, VERTICAL, HORIZONTAL, UL, UR, DL, DR, CROSS];
                let validOptions = [];
                // Look up
                if (j > 0) {
                    let up = grid[i + (j - 1) * DIM];
                    for (let option of up.options) {
                        let valid = rules[option][2];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // Look right
                if (i < DIM - 1) {
                    let right = grid[i + 1 + j * DIM];
                    for (let option of right.options) {
                        let valid = rules[option][3];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // Look down
                if (j < DIM - 1) {
                    let down = grid[i + (j + 1) * DIM];
                    for (let option of down.options) {
                        let valid = rules[option][0];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // Look left
                if (i > 0) {
                    let left = grid[i - 1 + j * DIM];
                    for (let option of left.options) {
                        let valid = rules[option][1];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                nextGrid[index] = {
                    options,
                    collapsed: false,
                };
            }
        }
    }
    grid = nextGrid;
    loop();  // Ensure drawing continues until all cells are filled
}
