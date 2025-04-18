import './assets/style.css';
import { AStarGrid } from './AStarGrid';
import { AStarPathfinder, HeuristicType, Vec2 } from './AStarPathfinder';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const TILES = 50;
const start = { x: 0, y: 0 };
const end = { x: TILES - 1, y: TILES - 1 };

const PERCENTAGE_OBSTACLES = 0.3;

/**
 * Create obstacle grid while ensuring a valid path exists
 */
function createObstacleGrid(): AStarGrid {
    let grid: AStarGrid;
    let path: Vec2[];

    do {
        grid = new AStarGrid(TILES, TILES);
        for (let i = 0; i < TILES * TILES * PERCENTAGE_OBSTACLES; i++) {
            const x = Math.floor(Math.random() * TILES);
            const y = Math.floor(Math.random() * TILES);
            if ((x === start.x && y === start.y) || (x === end.x && y === end.y)) continue;
            grid.setObstacle({ x, y });
        }
        const testPf = new AStarPathfinder(grid, HeuristicType.MANHATTAN);
        path = testPf.findPath(start, end);
    } while (path.length === 0);

    return grid;
}

const grid = createObstacleGrid();
const pathfinder = new AStarPathfinder(grid, HeuristicType.MANHATTAN);
const generator = pathfinder.findPathGenerator(start, end);

const tileWidth = canvas.width / TILES;
const tileHeight = canvas.height / TILES;
const tileSize = Math.min(tileWidth, tileHeight);
const tileOffsetX = (canvas.width - tileSize * TILES) / 2;
const tileOffsetY = (canvas.height - tileSize * TILES) / 2;

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

let SPEED_MULTIPLIER = 10;

function tick() {
    let _step = generator.next();

    for (let i = 1; i < SPEED_MULTIPLIER; i++) {
        if (_step.done) break;
        _step = generator.next();
    }

    const step = _step;

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
    }
}

tick();
