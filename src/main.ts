import './assets/style.css';
import { AStarGrid } from './AStarGrid';
import { AStarPathfinder, HeuristicType } from './AStarPathfinder';
// import viteLogo from '/vite.svg';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

console.log('Hello from main.ts');

// tiles spawn left to right
const TILES = 50;

const grid = new AStarGrid(TILES, TILES);
const finder = new AStarPathfinder(grid, HeuristicType.MANHATTAN);

const start = { x: 0, y: 0 };
const end = { x: TILES - 1, y: TILES - 1 };

for (let i = 0; i < TILES * TILES * 0.3; i++) {
    const x = Math.floor(Math.random() * TILES);
    const y = Math.floor(Math.random() * TILES);
    if (x === start.x && y === start.y) continue;
    grid.setObstacle({ x, y });
}

const path = finder.findPath(start, end)!;

console.log('PATH', path);

// draw the grid
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

const drawPath = () => {
    // draw lines
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = tileSize / 2;
    ctx.beginPath();
    ctx.moveTo(tileOffsetX + start.x * tileSize + tileSize / 2, tileOffsetY + start.y * tileSize + tileSize / 2);
    for (const node of path) {
        const x = tileOffsetX + node.x * tileSize + tileSize / 2;
        const y = tileOffsetY + node.y * tileSize + tileSize / 2;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(tileOffsetX + end.x * tileSize + tileSize / 2, tileOffsetY + end.y * tileSize + tileSize / 2);
    ctx.stroke();
};

const drawObstacles = () => {
    ctx.fillStyle = 'red';
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

    ctx.fillStyle = 'yellow';
    const endX = tileOffsetX + end.x * tileSize;
    const endY = tileOffsetY + end.y * tileSize;
    ctx.fillRect(endX, endY, tileSize, tileSize);
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawObstacles();
    drawPath();
    drawStartEnd();
};

draw();
