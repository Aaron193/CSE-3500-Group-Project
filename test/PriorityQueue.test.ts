import { PriorityQueue } from '../src/PriorityQueue';

class NumberNode {
    value: number;
    constructor(value: number) {
        this.value = value;
    }
}

describe('PriorityQueue', () => {
    let priorityQueue: PriorityQueue<NumberNode>;

    beforeEach(() => {
        priorityQueue = new PriorityQueue<NumberNode>((a, b) => a.value < b.value); // Min-heap
    });

    test('Queue should start empty', () => {
        expect(priorityQueue.getSize()).toBe(0);
        expect(priorityQueue.peek()).toBeNull();
    });

    test('Queue should insert elements', () => {
        priorityQueue.insert(new NumberNode(5));
        expect(priorityQueue.getSize()).toBe(1);
        expect(priorityQueue.peek()?.value).toBe(5);

        priorityQueue.insert(new NumberNode(3));
        expect(priorityQueue.getSize()).toBe(2);
        expect(priorityQueue.peek()?.value).toBe(3);

        priorityQueue.insert(new NumberNode(8));
        expect(priorityQueue.getSize()).toBe(3);
        expect(priorityQueue.peek()?.value).toBe(3);

        priorityQueue.insert(new NumberNode(1));
        expect(priorityQueue.getSize()).toBe(4);
        expect(priorityQueue.peek()?.value).toBe(1);
    });

    test('Queue should extract elements in order of priority', () => {
        priorityQueue.insert(new NumberNode(5));
        priorityQueue.insert(new NumberNode(3));
        priorityQueue.insert(new NumberNode(1));
        priorityQueue.insert(new NumberNode(1));
        priorityQueue.insert(new NumberNode(10));
        priorityQueue.insert(new NumberNode(0));

        expect(priorityQueue.extract()?.value).toBe(0);
        expect(priorityQueue.extract()?.value).toBe(1);
        expect(priorityQueue.extract()?.value).toBe(1);
        expect(priorityQueue.extract()?.value).toBe(3);
        expect(priorityQueue.extract()?.value).toBe(5);
        expect(priorityQueue.extract()?.value).toBe(10);
        expect(priorityQueue.getSize()).toBe(0);
    });

    test('Queue should work with negative numbers', () => {
        for (let i = -10; i <= 10; i++) {
            priorityQueue.insert(new NumberNode(i));
        }

        for (let i = -10; i <= 10; i++) {
            expect(priorityQueue.extract()?.value).toBe(i);
        }

        expect(priorityQueue.getSize()).toBe(0);
    });

    test('Queue should return null when extracting from an empty queue', () => {
        expect(priorityQueue.extract()).toBeNull();
    });
});
