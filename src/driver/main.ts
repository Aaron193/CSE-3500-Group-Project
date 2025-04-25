import '../assets/style.css';
import { AStarGrid } from '../AStarGrid';
import { AStarPathfinder, HeuristicType, Vec2 } from '../AStarPathfinder';

/* HTML SELECTORS */
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const gridSizeInput = document.getElementById('grid_size') as HTMLInputElement;
const randomizeButton = document.getElementById('randomize') as HTMLButtonElement;
const startStopButton = document.getElementById('start_stop') as HTMLButtonElement;
const speedInput = document.getElementById('speed') as HTMLInputElement;
const speedDisplay = document.getElementById('speed_display') as HTMLSpanElement;
const pathLength = document.getElementById('path_length') as HTMLSpanElement;

/* GLOBAL VARS (pretty messy but will do for now) */
let TILES = +gridSizeInput.value;
const start = { x: 0, y: 0 };
let end = { x: TILES - 1, y: TILES - 1 };

const PERCENTAGE_OBSTACLES = 0.5;
let isRunning = false;
let isPathFound = false;
let SPEED_MULTIPLIER = +speedInput.value;

let tileWidth: number;
let tileHeight: number;
let tileSize: number;
let tileOffsetX: number;
let tileOffsetY: number;
let grid: AStarGrid;
let pathfinder: AStarPathfinder;
let generator: Generator<{ current?: any; open: any[]; closed: any[] }, Vec2[], undefined>;

/**
 * Create obstacle grid while ensuring a valid path exists
 */
function createObstacleGrid(tiles: number): AStarGrid {
    let grid: AStarGrid;
    let path: Vec2[];

    do {
        grid = new AStarGrid(tiles, tiles);
        for (let i = 0; i < tiles * tiles * PERCENTAGE_OBSTACLES; i++) {
            const x = Math.floor(Math.random() * tiles);
            const y = Math.floor(Math.random() * tiles);
            if ((x === start.x && y === start.y) || (x === end.x && y === end.y)) continue;
            grid.setObstacle({ x, y });
        }
        const testPf = new AStarPathfinder(grid, HeuristicType.MANHATTAN);
        path = testPf.findPath(start, end);
    } while (path.length === 0);

    return grid;
}

function updateSizes() {
    tileWidth = canvas.width / TILES;
    tileHeight = canvas.height / TILES;
    tileSize = Math.min(tileWidth, tileHeight);
    tileOffsetX = (canvas.width - tileSize * TILES) / 2;
    tileOffsetY = (canvas.height - tileSize * TILES) / 2;
}

function resetPathfinding() {
    pathfinder = new AStarPathfinder(grid, HeuristicType.MANHATTAN);
    generator = pathfinder.findPathGenerator(start, end);
    isPathFound = false;
    pathLength.textContent = 'Path Length: 0';
}

function setButtonStart() {
    startStopButton.textContent = 'Start';
    startStopButton.classList.remove('btn-warning');
    startStopButton.classList.add('btn-success');
}

function setButtonStop() {
    startStopButton.textContent = 'Pause';
    startStopButton.classList.remove('btn-success');
    startStopButton.classList.add('btn-warning');
}

const drawGrid = () => {
    for (let x = 0; x < TILES; x++) {
        for (let y = 0; y < TILES; y++) {
            const tileX = tileOffsetX + x * tileSize;
            const tileY = tileOffsetY + y * tileSize;
            ctx.fillStyle = 'white';
            ctx.fillRect(tileX, tileY, tileSize, tileSize);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(tileX, tileY, tileSize, tileSize);
        }
    }
};

const drawObstacles = () => {
    ctx.fillStyle = 'black';
    for (let x = 0; x < TILES; x++) {
        for (let y = 0; y < TILES; y++) {
            const tileX = tileOffsetX + x * tileSize;
            const tileY = tileOffsetY + y * tileSize;
            if (grid.getNode({ x, y }).isObstacle) {
                ctx.fillRect(tileX, tileY, tileSize, tileSize);
            }
        }
    }
};

const drawStartEnd = () => {
    ctx.fillStyle = 'green';
    const startX = tileOffsetX + start.x * tileSize;
    const startY = tileOffsetY + start.y * tileSize;
    ctx.fillRect(startX, startY, tileSize, tileSize);

    ctx.fillStyle = 'purple';
    const endX = tileOffsetX + end.x * tileSize;
    const endY = tileOffsetY + end.y * tileSize;
    ctx.fillRect(endX, endY, tileSize, tileSize);
};

function drawCurrentState() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawObstacles();
    drawStartEnd();
}

let prevUpdate = 0;

function tick() {
    if (!isRunning) return;

    const now = Date.now();
    const delta = (now - prevUpdate) / 1000; // in seconds

    // run simulation at 60 Hz no matter what native monitor refresh rate is
    if (delta < 1 / 60) {
        requestAnimationFrame(tick);
        return;
    }

    prevUpdate = now;

    let step = generator.next();

    for (let i = 1; i < SPEED_MULTIPLIER && !step.done; i++) {
        step = generator.next();
    }

    if (!step.done) {
        const { current, open = [], closed = [] } = step.value || {};

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawObstacles();

        // draw closed set
        closed.forEach(node => {
            const x = tileOffsetX + node.position.x * tileSize;
            const y = tileOffsetY + node.position.y * tileSize;
            ctx.fillStyle = 'rgba(255,0,0,0.5)';
            ctx.fillRect(x, y, tileSize, tileSize);
        });

        // draw open set
        open.forEach(node => {
            const x = tileOffsetX + node.position.x * tileSize;
            const y = tileOffsetY + node.position.y * tileSize;
            ctx.fillStyle = 'rgba(0,0,255,0.5)';
            ctx.fillRect(x, y, tileSize, tileSize);
        });

        // draw our current node being evaluated
        if (current) {
            const x = tileOffsetX + current.position.x * tileSize;
            const y = tileOffsetY + current.position.y * tileSize;
            ctx.fillStyle = 'yellow';
            ctx.fillRect(x, y, tileSize, tileSize);
        }

        drawStartEnd();
        requestAnimationFrame(tick);
    } else {
        // we found a path. Draw it.
        const path = step.value || [];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawObstacles();
        drawStartEnd();

        // draw the final path
        ctx.fillStyle = 'rgba(0,255,0,0.5)';
        path.forEach(node => {
            const x = tileOffsetX + node.x * tileSize;
            const y = tileOffsetY + node.y * tileSize;
            ctx.fillRect(x, y, tileSize, tileSize);
        });

        pathLength.textContent = `Path Length: ${path.length}`;

        isRunning = false;
        isPathFound = true;
        setButtonStart();
    }
}

// Grid initialization
grid = createObstacleGrid(TILES);
updateSizes();
resetPathfinding();
drawCurrentState();

// Event Listeners
gridSizeInput.onchange = () => {
    if (isRunning) return;

    // Verify size 5-50
    if (+gridSizeInput.value < 5 || +gridSizeInput.value > 50) {
        alert('Grid size must be between 5 and 50!');
        if (+gridSizeInput.value < 5) gridSizeInput.value = '5';
        if (+gridSizeInput.value > 50) gridSizeInput.value = '50';
    }

    TILES = +gridSizeInput.value;
    end = { x: TILES - 1, y: TILES - 1 };
    grid = createObstacleGrid(TILES);
    updateSizes();
    resetPathfinding();
    drawCurrentState();
};

randomizeButton.onclick = () => {
    if (isRunning) return;

    grid = createObstacleGrid(TILES);
    resetPathfinding();
    drawCurrentState();
};

startStopButton.onclick = () => {
    if (!isRunning) {
        if (isPathFound) {
            resetPathfinding();
            drawCurrentState();
        }

        isRunning = true;
        setButtonStop();
        tick();
    } else {
        isRunning = false;
        setButtonStart();
    }
};

speedInput.oninput = () => {
    SPEED_MULTIPLIER = +speedInput.value;
    speedDisplay.textContent = `${SPEED_MULTIPLIER}x`;
};
