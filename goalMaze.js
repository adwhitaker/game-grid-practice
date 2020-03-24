let cols, rows, current

const w = 40
const grid = []

let unexplored, finished
const start = []
const goal = []

const index = (i, j) => {
    if (i < 0 || j < 0 || i > (cols - 1) || j > (rows - 1)) {
        return -1
    }

    return i + j * cols
}

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

    const startingCell = grid[index(6, 9)]
    const goalCell = grid[index(floor(random(0, 9)), floor(random(0, 5)))]

    unexplored = grid.reduce((out, cell) => {
        if ((cell.i === startingCell.i && cell.j === startingCell.j)
            || (cell.i === goalCell.i && cell.j === goalCell.j)) {
            return out
        }

        out.push(cell)

        return out
    }, [])

    start.push(startingCell)
    goal.push(goalCell)
}

function draw() {
    background(50)
    grid.forEach(cell => cell.show())

    if (finished) return;

    if (!unexplored.length) {
        findEdges()
        return
    }

    moveStart()
    moveGoal()
}

function findEdges() {
    grid.forEach((cell, i) => {
        const edge = cell.getEdges();

        const show = floor(random(0, 2))
        console.log('show', show, edge)
        if (edge && show) {

            removeWalls(cell, edge)
            grid[i] = cell;
            grid[index(edge.i, edge.j)] = edge;
        }
    })

    finished = true;
}


function moveStart() {
    const startIndex = floor(random(0, start.length))

    const starting = start[startIndex]
    starting.visited = true

    starting.highlight()

    const neighbor = starting.checkNeighbor()
    if (neighbor) {
        neighbor.visited = true
        removeWalls(starting, neighbor)
        neighbor.group = "start"
        start.push(neighbor)
        start[startIndex] = starting

        unexplored = unexplored.reduce((out, cell) => {
            if (cell.i === neighbor.i && cell.j === neighbor.j) {
                return out
            }

            out.push(cell)
            return out
        }, [])
    }
}

function moveGoal() {
    const goalIndex = floor(random(0, goal.length))

    const goaling = goal[goalIndex]
    goaling.visited = true

    goaling.highlight()

    const neighbor = goaling.checkNeighbor()
    if (neighbor) {
        neighbor.visited = true
        removeWalls(goaling, neighbor)
        neighbor.group = "goal"
        goal.push(neighbor)
        goal[goalIndex] = goaling


        unexplored = unexplored.reduce((out, cell) => {
            if (cell.i === neighbor.i && cell.j === neighbor.j) {
                return out
            }

            out.push(cell)
            return out
        }, [])
    }
}


class Cell {
    constructor(i, j) {
        this.i = i
        this.j = j
        // top, right, bottom, left
        this.walls = [true, true, true, true]
        this.visited = false
        this.group = null
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
            if (this.group === 'start' && !finished) {

                fill(255, 0, 255, 100)
            } else if (this.group === 'goal' || finished) {
                fill(0, 0, 255, 100)
            }
            rect(x, y, w, w)
        }
    }

    checkNeighbor() {
        const neighbors = []

        // one dimensional array;
        // this.i + this.j * cols;

        const top = grid[index(this.i, this.j - 1)]
        const right = grid[index(this.i + 1, this.j)]
        const bottom = grid[index(this.i, this.j + 1)]
        const left = grid[index(this.i - 1, this.j)]

        if (top && !top.visited && !top.group !== this.group) {
            neighbors.push(top)
        }

        if (right && !right.visited && !right.group !== this.group) {
            neighbors.push(right)
        }

        if (bottom && !bottom.visited && !bottom.group !== this.group) {
            neighbors.push(bottom)
        }

        if (left && !left.visited && !left.group !== this.group) {
            neighbors.push(left)
        }

        if (neighbors.length > 0) {
            const r = floor(random(0, neighbors.length))
            return neighbors[r]
        }

        return null
    }

    getEdges() {
        const neighbors = []

        // one dimensional array;
        // this.i + this.j * cols;

        const top = grid[index(this.i, this.j - 1)]
        const right = grid[index(this.i + 1, this.j)]
        const bottom = grid[index(this.i, this.j + 1)]
        const left = grid[index(this.i - 1, this.j)]

        if (top && top.group !== this.group) {
        console.log("top", top, this)
            neighbors.push(top)
        }

        if (right && right.group !== this.group) {
            neighbors.push(right)
        }

        if (bottom && bottom.group !== this.group) {
            neighbors.push(bottom)
        }

        if (left && left.group !== this.group) {
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