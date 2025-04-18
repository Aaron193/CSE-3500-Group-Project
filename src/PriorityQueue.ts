type Comparator<T> = (a: T, b: T) => boolean;

export class PriorityQueue<T extends object> {
    private list: T[];
    private size: number;
    private indexMap: Map<T, number>; // Map to track index of each item
    comparator: Comparator<T>;

    constructor(comparison: Comparator<T>) {
        this.list = [];
        this.size = 0;
        this.indexMap = new Map<T, number>();
        this.comparator = comparison;
    }

    /**
     * Return the number of elements inside the PriorityQueue
     */
    public getSize() {
        return this.size;
    }

    /**
     * Add an item into the PriorityQueue
     * O(log n)
     */
    public insert(item: T): void {
        let index = this.size;
        this.size++;
        this.list[index] = item;
        this.indexMap.set(item, index);

        // bubble up -- swap element with parent based on the comparator
        this.bubbleUp(index);
    }

    /**
     * Update the queue after changing an item's priority
     * O(log n)
     */
    public updatePriority(item: T): boolean {
        const index = this.indexMap.get(item);

        // If item doesn't exist in queue
        if (index === undefined) return false;

        // Bubble up and down to restore heap property
        this.bubbleUp(index);
        this.bubbleDown(index);
        return true;
    }

    /**
     * Remove and return the highest priority item
     * O(log n)
     */
    public extract(): T | null {
        // we have no items to extract
        if (this.size === 0) return null;

        // the item we will extract
        const element = this.list[0];
        this.size--;

        // Remove from index map
        this.indexMap.delete(element);

        if (this.size > 0) {
            // Swap the first element with the last item
            const lastElement = this.list[this.size];
            this.list[0] = lastElement;
            this.indexMap.set(lastElement, 0);

            // Remove the last item
            this.list.pop();

            // Restore heap from root
            this.bubbleDown(0);
        } else {
            // The heap is now empty
            this.list.pop();
        }

        return element;
    }

    /**
     * Return the next item based on the comparator without removing it
     * O(1)
     */
    public peek(): T | null {
        return this.list[0] || null;
    }

    /**
     * Check if item is in the queue
     * O(1)
     */
    public has(item: T): boolean {
        return this.indexMap.has(item);
    }

    /**
     * Copy the items in the queue into a new array
     * O(n)
     */
    public items(): T[] {
        return this.list.slice();
    }

    /**
     * Restore heap property by moving the item up the tree
     * O(log n)
     */
    private bubbleUp(index: number): void {
        const item = this.list[index];

        while (index > 0) {
            const parentIdx = this.parent(index);
            const parent = this.list[parentIdx];

            // The item's priority is not lower than the parent's, we're done
            if (!this.comparator(item, parent)) break;

            // Move parent down and update index map
            this.list[index] = parent;
            this.indexMap.set(parent, index);

            // Move up the tree
            index = parentIdx;
        }

        // Place the item in its correct location
        this.list[index] = item;
        this.indexMap.set(item, index);
    }

    /**
     * Restore heap property by moving the item down the tree
     * O(log n)
     */
    private bubbleDown(index: number): void {
        const item = this.list[index];
        const half = Math.floor(this.size / 2);

        while (index < half) {
            let childIdx = this.leftChildIndex(index);
            let child = this.list[childIdx];

            // Find the child with higher priority
            const rightChildIndex = this.rightChildIndex(index);
            if (rightChildIndex < this.size && this.comparator(this.list[rightChildIndex], child)) {
                childIdx = rightChildIndex;
                child = this.list[rightChildIndex];
            }

            // If this item's priority is not lower than the child's, we can stop
            if (this.comparator(item, child) || !this.comparator(child, item)) break;

            // Move child up and update index map
            this.list[index] = child;
            this.indexMap.set(child, index);

            // Move down the tree
            index = childIdx;
        }

        // Place the item in its correct location
        this.list[index] = item;
        this.indexMap.set(item, index);
    }

    private parent(index: number) {
        return Math.floor((index - 1) / 2);
    }

    private leftChildIndex(index: number) {
        return 2 * index + 1;
    }

    private rightChildIndex(index: number) {
        return 2 * index + 2;
    }
}
