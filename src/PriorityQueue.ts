type Comparator<T> = (a: T, b: T) => boolean;

export class PriorityQueue<T extends object> {
    private list: T[];
    private size: number;
    comparator: Comparator<T>;

    constructor(comparison: Comparator<T>) {
        this.list = [];
        this.size = 0;
        this.comparator = comparison;
    }

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

        // heapify up -- swap element with parent based on the comparator
        while (index > 0 && this.comparator(this.list[index], this.list[this.parent(index)])) {
            this.swap(index, this.parent(index));
            index = this.parent(index);
        }
    }

    public extract(): T | null {
        // we have no items to extract
        if (this.size === 0) return null;

        // the element we want to extract
        const element = this.list[0];
        this.size--;

        // swap first and last element, pop off last one
        this.list[0] = this.list[this.size];
        this.list.pop();

        // heapify (fix) our first element because we just swapped it with the last element
        this.heapify(0);

        return element;
    }

    /**
     *
     * @returns the next element to be extracted without actually extracting it
     */
    public peek(): T | null {
        return this.list[0] || null;
    }

    public heapify(index: number): void {
        const leftIndex = this.leftChildIndex(index);
        const rightIndex = this.rightChildIndex(index);

        let current = index;

        if (leftIndex < this.size && this.comparator(this.list[leftIndex], this.list[current])) {
            current = leftIndex;
        }

        if (rightIndex < this.size && this.comparator(this.list[rightIndex], this.list[current])) {
            current = rightIndex;
        }

        if (current !== index) {
            this.swap(index, current);
            this.heapify(current);
        }
    }

    // TODO: possible optimization is to also keep track of a set of items for O(1) loopup
    // This includes() is O(n) on the list
    public has(item: T): boolean {
        return this.list.includes(item);
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

    private swap(a: number, b: number) {
        [this.list[a], this.list[b]] = [this.list[b], this.list[a]];
    }
}
