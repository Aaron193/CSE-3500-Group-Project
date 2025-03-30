import { AStarGrid } from './AStarGrid';
import { AStarNode } from './AStarNode';
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
    // heuristic function we will use to compare two nodes
    heuristic: HeuristicFunction;

    constructor(grid: AStarGrid, heuristic: HeuristicType) {
        this.grid = grid;
        this.heuristic = this.getHeuristicFunc(heuristic);
    }

    // A* https://en.wikipedia.org/wiki/A*_search_algorithm
    findPath(start: Vec2, end: Vec2) {
        if (this.grid.getNode(start).isObstacle || this.grid.getNode(end).isObstacle) {
            throw new Error('ERROR findPath: start or end is an obstacle');
        }

        // nodes that have already been evaluated
        const closedSet = new Set<AStarNode>();

        const openSet = new PriorityQueue<AStarNode>((a: AStarNode, b: AStarNode) => a.f < b.f);

        // g = 0 because distance from the start is zero (this *is* the start)
        // h = heuristic(start, end) because this is the estimated cost to the end node
        // f = g + h, total cost for this node
        const startNode = new AStarNode(start, 0, this.heuristic(start, end), null);
        openSet.insert(startNode);

        while (openSet.getSize() > 0) {
            // get lowest f node from the openSet (this is why we're using a min-heap)
            const current = openSet.peek() as AStarNode;

            // If we found the end node, return the path
            if (current.position.x === end.x && current.position.y === end.y) {
                const path = this.reconstructPath(current);
                return path;
            }

            // remove the current node from the openSet
            // CHECK: !! Do we need to remove all instances of this node?? !!
            openSet.extract();
            // we are done evaluating this
            closedSet.add(current);

            // list of valid (NON-OBSTACLE) neighbors to the current node
            const neighbors = this.grid.getNeighbors(current);

            for (const neighbor of neighbors) {
                if (closedSet.has(neighbor) || neighbor.isObstacle) {
                    // skip this node, we've finished evaluating it
                    continue;
                }

                const tempG = current.g + this.heuristic(current.position, neighbor.position);
                // if we've already evaluated this node
                if (openSet.has(neighbor)) {
                    // if we have a better g value, update it
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                    }
                } else {
                    // first time we are evaluating this node
                    neighbor.g = tempG;
                    openSet.insert(neighbor);
                }

                // update h & f, set parent as the current node (bc: current -> neighbor)
                neighbor.h = this.heuristic(neighbor.position, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
            }
        }
    }

    private reconstructPath(node: AStarNode): Vec2[] {
        const path: Vec2[] = [];
        let current: AStarNode | null = node;

        // traverse through the parent nodes from our current node
        while (current) {
            path.push(current.position);
            current = current.parent;
        }

        // we just build the path from the end to the start
        // so we need to reverse it to go from start to end
        path.reverse();

        return path;
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
