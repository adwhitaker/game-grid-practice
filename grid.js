const buildCell = (x, y) => {
    return {
        x,
        y,
        up: 'door',
        left: 'door',
        right: 'door',
        down: 'door',
    }
}

const buildRow = (width, row) => {
    let out = []
    for (let i = 0; i < width; i++) {
        out.push(buildCell(i, row))
    }
    return out
}

const buildGrid = (width = 5) => {
    let out = []
    for (let i = 0; i < width; i++) {
        out.push(buildRow(width, i))
    }
    return out
}

const getCell = (grid, x, y) => {
    return grid[y][x]
}

const getCenter = (state) => {
    const { grid } = state
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