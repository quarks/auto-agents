class QTree {
    constructor(size, depth, splitAt = 10) {
        this.size = size;
        this.depth = depth;
        this.splitAt = splitAt;
        // Create an empty 2D grid of the leaf nodes
        this.gridSize = 2 ** (depth - 1);
        this.minCellSize = this.size / this.gridSize;
        this.grid = new Array(this.gridSize);
        for (let col = 0; col < this.gridSize; col++) {
            this.grid[col] = new Array(this.gridSize);
            // for (let row = 0; row < this.gsize; row++)
            //     this.grid[col][row] = row * 10 + col;
        }
        this.root = new QPart(undefined, size / 2, size / 2, size, 0, depth, splitAt);
        // this.root._buildSubTree();
        // this.root.children[0]._buildSubTree();
        this.root.populateGrid(this.grid, this.gridSize, this.minCellSize);
        for (let row = 0; row < this.gridSize; row++) {
            console.log(`Row ${row}`);
            for (let col = 0; col < this.gridSize; col++) {
                console.log(`    col ${col}  ${this.grid[col][row]?.center()}`);
            }
        }
    }
}
//# sourceMappingURL=QTree.js.map