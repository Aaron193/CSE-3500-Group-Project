import { AStarGrid, TileType } from './AStarGrid';
import { PriorityQueue } from './PriorityQueue';

export interface Vec2 {
    x: number;
    y: number;
}

export class AStarPathfinder {
    // This grid will act as our graph that A* will traverse
    grid: AStarGrid;
    // create a min-heap by passing a min-comparator function to the PriorityQueue
    minHeap: PriorityQueue<number> = new PriorityQueue<number>((a, b) => a < b);

    constructor(grid: AStarGrid) {
        this.grid = grid;
    }

    findPath(start: Vec2, end: Vec2) {
        if (this.grid.getTile(start) === TileType.OBSTACLE || this.grid.getTile(end) === TileType.OBSTACLE) {
            throw new Error('ERROR findPath: start or end is an obstacle');
        }

        // A*
    }
}
