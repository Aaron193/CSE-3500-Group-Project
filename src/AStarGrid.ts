import { Vec2 } from './AStarPathfinder';
import { AStarNode } from './AStarNode';
export class AStarGrid {
    width: number;
    height: number;
    grid: AStarNode[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        // Initialize the grid with AStarNode objects
        this.grid = new Array(width * height).fill(null).map((_, index) => {
            const pos = this.getPosition(index);
            return new AStarNode(pos, 0, 0, null);
        });
    }

    public getNode(position: Vec2): AStarNode {
        return this.grid[position.y * this.width + position.x];
    }

    private getPosition(index: number) {
        const x = index % this.width;
        const y = Math.floor(index / this.width);
        return { x, y };
    }

    public setObstacle(position: Vec2): void {
        const node = this.getNode(position);
        node.isObstacle = true;
    }

    public getNeighbors(node: AStarNode): AStarNode[] {
        const neighbors: AStarNode[] = [];
        const { x, y } = node.position;

        const positions = [
            { x, y: y - 1 }, // North
            { x, y: y + 1 }, // South
            { x: x + 1, y }, // East
            { x: x - 1, y }, // West
        ];

        for (const pos of positions) {
            if (this.isValidPosition(pos)) {
                neighbors.push(this.getNode(pos));
            }
        }

        return neighbors;
    }

    private isValidPosition(position: Vec2): boolean {
        return position.x >= 0 && position.x < this.width && position.y >= 0 && position.y < this.height;
    }
}
