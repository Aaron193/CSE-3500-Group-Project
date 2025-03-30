import { Vec2 } from './AStarPathfinder';

export class AStarNode {
    // x,y coordinates of the node
    position: Vec2;
    // is this node an obstacle?
    isObstacle: boolean = false;
    // cost from start to this node
    g: number;
    // heuristic cost from this node to end
    h: number;
    // total cost (g + h)
    f: number;
    // parent node
    parent: AStarNode | null;

    constructor(position: Vec2, g: number, h: number, parent: AStarNode | null) {
        this.position = position;
        this.g = g;
        this.h = h;
        this.f = g + h;
        this.parent = parent;
    }
}
