let cols, rows, current

const w = 40
const grid = []
const stack = []

function setup() {
    createCanvas(400, 400)
    cols = floor(width / w)
    rows = floor(height / w)

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            const cell = new Cell(i, j)
            grid.push(cell)
        }
    }

    current = grid[45]
}

function draw() {
    background(50)
    grid.forEach(cell => cell.show())

    current.visited = true

    current.highlight()

    const next = current.checkNeighbor()

    if (next) {
        next.visited = true
        stack.push(current)
        removeWalls(current, next)
        current = next
    } else if (stack.length) {
        const previous = stack.pop();
        current = previous;
    }
}

class Cell {
    constructor(i, j) {
        this.i = i
        this.j = j
        // top, right, bottom, left
        this.walls = [true, true, true, true]
        this.visited = false

    }

    show() {
        const x = this.i * w
        const y = this.j * w

        stroke(255)

        if (this.walls[0]) {
            line(x, y, x + w, y)
        }
        if (this.walls[1]) {
            line(x + w, y, x + w, y + w)
        }
        if (this.walls[2]) {
            line(x + w, y + w, x, y + w)
        }
        if (this.walls[3]) {
            line(x, y + w, x, y)
        }

        if (this.visited) {
            noStroke()
            fill(255, 0, 255, 100)
            rect(x, y, w, w)
        }
    }

    checkNeighbor() {
        const index = (i, j) => {
            if (i < 0 || j < 0 || i > (cols - 1) || j > (rows - 1)) {
                return -1
            }

            return i + j * cols
        }
        const neighbors = []

        // one dimensional array;
        // this.i + this.j * cols;

        const top = grid[index(this.i, this.j - 1)]
        const right = grid[index(this.i + 1, this.j)]
        const bottom = grid[index(this.i, this.j + 1)]
        const left = grid[index(this.i - 1, this.j)]

        if (top && !top.visited) {
            neighbors.push(top)
        }

        if (right && !right.visited) {
            neighbors.push(right)
        }

        if (bottom && !bottom.visited) {
            neighbors.push(bottom)
        }

        if (left && !left.visited) {
            neighbors.push(left)
        }

        if (neighbors.length > 0) {
            const r = floor(random(0, neighbors.length))
            return neighbors[r]
        }

        return null
    }

    highlight() {
        const x = this.i * w
        const y = this.j * w
        noStroke()
        fill(0, 0, 255, 100)
        rect(x, y, w, w)
    }
}


function removeWalls(a, b) {
    const x = a.i - b.i

    if (x === 1) {
        a.walls[3] = false
        b.walls[1] = false
    } else if (x === -1) {
        a.walls[1] = false
        b.walls[3] = false
    }

    const y = a.j - b.j
    if (y === 1) {
        a.walls[0] = false
        b.walls[2] = false
    } else if (y === -1) {
        a.walls[2] = false
        b.walls[0] = false
    }
}