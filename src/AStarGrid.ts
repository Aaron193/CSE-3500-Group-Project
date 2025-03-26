import { Vec2 } from './AStarPathfinder';

export enum TileType {
    EMPTY,
    OBSTACLE,
}

export class AStarGrid {
    width: number;
    height: number;
    grid: TileType[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grid = new Array(width * height).fill(TileType.EMPTY);
    }

    getTile(position: Vec2) {
        return this.grid[position.y * this.width + position.x];
    }

    setObstacle(x: number, y: number) {
        this.grid[y * this.width + x] = TileType.OBSTACLE;
    }
}
