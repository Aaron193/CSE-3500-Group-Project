import { AStarGrid, TileType } from './AStarGrid';
import { PriorityQueue } from './PriorityQueue';

export interface Vec2 {
    x: number;
    y: number;
}

export type HeuristicFunction = (a: Vec2, b: Vec2) => number;

export enum HeuristicType {
    MANHATTAN = 'Manhattan',
    EUCLIDEAN = 'Euclidean',
}

export class AStarPathfinder {
    // This grid will act as our graph that A* will traverse
    grid: AStarGrid;
    // create a min-heap by passing a min-comparator function to the PriorityQueue
    minHeap: PriorityQueue<number> = new PriorityQueue<number>((a, b) => a < b);
    // heuristic function we will use to compare two nodes
    heuristic: HeuristicFunction;

    constructor(grid: AStarGrid, heuristic: HeuristicType) {
        this.grid = grid;
        this.heuristic = this.getHeuristicFunc(heuristic);
    }

    findPath(start: Vec2, end: Vec2) {
        if (this.grid.getTile(start) === TileType.OBSTACLE || this.grid.getTile(end) === TileType.OBSTACLE) {
            throw new Error('ERROR findPath: start or end is an obstacle');
        }

        // A* https://en.wikipedia.org/wiki/A*_search_algorithm
        // this will probably replace the minHeap variable above
        const openSet = new PriorityQueue<number>((a, b) => a < b);
    }

    private getHeuristicFunc(heuristic: HeuristicType): HeuristicFunction {
        switch (heuristic) {
            case HeuristicType.MANHATTAN:
                return AStarPathfinder.manhattan;
            case HeuristicType.EUCLIDEAN:
                return AStarPathfinder.euclidean;
            default:
                throw new Error('ERROR getHeuristicFunc: invalid heuristic type');
        }
    }

    // Heuristic functions. This is how we will estimate the cost between two nodes.
    private static manhattan(a: Vec2, b: Vec2): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private static euclidean(a: Vec2, b: Vec2): number {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
}
