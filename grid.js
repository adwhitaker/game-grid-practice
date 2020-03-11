const calcUp = (x, y) => {
    if (y === 0) {
        return 'wall'
    }

    return 'door'
}

const calcDown = (x, y, height) => {
    if (y + 1 === height) {
        return 'wall'
    }

    return 'door'
}

const calcLeft = (x, y) => {
    if (x === 0) {
        return 'wall'
    }

    return 'door'
}

const calcRight = (x, y, width) => {
    if (x + 1 === width) {
        return 'wall'
    }

    return 'door'
}

const buildCell = (x, y, length) => {
    return {
        x,
        y,
        up: calcUp(x, y),
        down: calcDown(x, y, length),
        left: calcLeft(x, y),
        right: calcRight(x, y, length),
    }
}

const buildRow = (width, row) => {
    let out = []
    for (let i = 0; i < width; i++) {
        out.push(buildCell(i, row, width))
    }
    return out
}

const buildGrid = (height = 5) => {
    let out = []
    for (let i = 0; i < height; i++) {
        out.push(buildRow(height, i))
    }
    return out
}

const getCell = (grid, x, y) => {
    if (x < 0 || y < 0) {
        return null
    }

    if (x > grid[0].length || y > grid.length) {
        return null
    }

    return grid[y][x]
}

const getCenter = (grid) => {
    const centerX = Math.ceil(grid.length / 2)
    const centerY = Math.ceil(grid[0].length / 2)
    return getCell(grid, centerX, centerY)
}

const getCurrent = (state) => {
    const { grid, current } = state
    return getCell(grid, current.x, current.y)
}

const up = (state) => {
    const { y } = state.current

    if (y === 0) {
        return state
    }

    return {
        ...state,
        current: {
            ...state.current,
            y: y - 1,
        },
    }
}

const down = (state) => {
    const { grid, current } = state
    const { y } = current

    if (y + 1 > grid.length) {
        return state
    }

    return {
        ...state,
        current: {
            ...state.current,
            y: y + 1,
        },
    }
}

const left = (state) => {
    const { current } = state
    const { x } = current


    if (x - 1 < 0) {
        return state
    }

    return {
        ...state,
        current: {
            ...state.current,
            x: x - 1,
        },
    }
}

const right = (state) => {
    const { grid, current } = state
    const { x } = current

    if (x + 1 > grid[0].length) {
        return state
    }

    return {
        ...state,
        current: {
            ...state.current,
            x: x + 1,
        },
    }
}

const move = (state, direction) => {
    switch (direction) {
        case 'up':
            return up(state)
        case 'down':
            return down(state)
        case 'left':
            return left(state)
        case 'right':
            return right(state)

    }
}

const getNeighbors = (state, position) => {
    const { grid } = state

    return {
        up: getCell(grid, position.x, position.y - 1),
        down: getCell(grid, position.x, position.y + 1),
        left: getCell(grid, position.x - 1, position.y),
        right: getCell(grid, position.x + 1, position.y)
    }
}

const grid = buildGrid()

let state = {
    grid,
    current: {
        x: getCenter(grid).x,
        y: getCenter(grid).y,
    },
}

state = move(state, 'down')
console.log('current', getCurrent(state))
state = move(state, 'left')
console.log('current', getCurrent(state))
state = move(state, 'up')
console.log('current', getCurrent(state))
state = move(state, 'right')
console.log('current', getCurrent(state))

console.log("neighbors", getNeighbors(state, getCurrent(state)))