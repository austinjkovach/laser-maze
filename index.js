const rotationMatrix = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

/*
  laser
  target

  {
    type: 'target' | 'laser' | 'checkpoint';
    rotation: 0 | 1 | 2 | 3;
    visited: true | false
  }
*/
const token = (type, rotation = 0) => {
  return {
    type,
    rotation,
    visited: type === 'cell-blocker', // cell-blockers do not need to be visited in order for a solution to be valid
  };
};

const l = rot => token('laser', rot);
const t = rot => token('target', rot);
const c = rot => token('checkpoint', rot);
const b = rot => token('beam-splitter', rot);
const m = rot => token('double-mirror', rot);
const x = () => token('cell-blocker');

class Board {
  constructor(grid) {
    this.grid = grid;
    this.laser = null;
    this.tokens = grid.flat().filter(n => n !== 0);
    this.points = 0;
  }

  initLaser() {
    let directionMask;
    this.grid.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (cell.type !== 'laser') return null;
        cell.visited = true;
        this.laser = new LinkedList([j, i]);
        directionMask = rotationMatrix[cell.rotation];
      })
    );
    const { coords } = this.laser.tail;
    const next = applyMask(coords, directionMask);

    if (isInBounds(next, this.grid)) {
      this.laser.append(next);
    } else {
      this.laser.append(null);
    }

    this.calculateAll();
  }

  printLaser(verbose = false) {
    // let curr = this.laser.head;
    let queue = [this.laser.head];

    while (queue.length > 0) {
      curr = queue.pop();
      if (verbose) {
        console.log(curr);
      } else {
        console.log(curr.coords);
      }
      queue.push(curr.next);
    }
  }

  calculateAll() {
    while (this.laser.tail.coords) {
      this.processNode(this.laser.tail);
    }
    // this.printLaser();
  }

  allTokensAreVisited = () => this.tokens.every(t => t.visited);

  getNextCoords = (coords, directionMask, token) => {
    if (!token) {
      return applyMask(coords, directionMask);
    }

    const { rotation, type } = token;

    switch (type) {
      case 'target':
        // TODO only give points if facing the correct direction
        this.points += 1;
        return null;
      case 'checkpoint':
        // Based on rotation // 0, 2 == N/S, 1, 3 == E/W
        if (!(rotation % 2)) {
          // N/S if (mask[0]) return null;
          return applyMask(coords, directionMask);
        } else {
          // E/W
          if (directionMask[1]) return null;
          return applyMask(coords, directionMask);
        }
      case 'beam-splitter':
      // /
      // R -> R U
      // U -> R U
      // L -> L D
      // D -> L D
      // \
      // R -> R D
      // D -> R D
      // L -> L U
      // U -> L U
      case 'double-mirror':
        let reflectionMask;
        if (!(rotation % 2)) {
          // N/S - Clockwise
          //  '\'
          if (directionMask[0]) {
            // [1, 0] -> [0, 1] / [-1, 0] -> [0, -1]
            // S -> E / N -> W
            reflectionMask = [0, directionMask[0]];
          } else {
            // [0, 1] -> [1, 0] / [0, -1] -> [-1, 0]
            // E -> S / W -> N
            reflectionMask = [directionMask[1], 0];
          }
        } else {
          // E/W - Counter-clockwise
          //  '/'
          if (directionMask[0]) {
            // [1, 0] -> [0, -1] / [-1, 0] -> [0, 1]
            // S -> W / N -> E
            reflectionMask = [0, -directionMask[0]];
          } else {
            // [0, 1] -> [-1, 0] / [0, -1] -> [1, 0]
            // E -> N / W -> S
            reflectionMask = [-directionMask[1], 0];
          }
        }
        return applyMask(coords, reflectionMask);
      case 'cell-blocker':
        return applyMask(coords, directionMask);
    }

    return;
  };

  // Switch on different token types in here
  processNode(node) {
    if (!this.laser) return false;
    const { coords, prev } = node;
    if (coords === null) return false;
    const [x, y] = coords;

    // 1) get laser direction
    const directionMask = getDirectionMask(prev.coords, coords);
    // 2) calculate next based on laser direction, token type, and token rotation
    const cellContents = this.grid[y][x];
    //-- if(!cellContents)
    const nextCoords = this.getNextCoords(coords, directionMask, cellContents);

    // 3) mark as visited
    cellContents && (cellContents.visited = true);

    if (isInBounds(nextCoords, this.grid)) {
      const next = this.laser.append(nextCoords);
      return true;
    } else {
      this.laser.append(null);
    }
  }
}

const getDirectionMask = (prev, curr) => {
  return [curr[0] - prev[0], curr[1] - prev[1]];
};

const applyMask = (coords, mask) => {
  return [mask[0] + coords[0], mask[1] + coords[1]];
};

const isInBounds = (coords, board) => {
  if (!coords) return false;
  const [x, y] = coords;
  const checkX = x > -1 && x <= board[0].length - 1;
  const checkY = y > -1 && y <= board.length - 1;

  return checkX && checkY;
};

class LinkedList {
  constructor(coords) {
    this.head = new LinkedListNode(coords);
    this.tail = this.head;
  }

  append = coords => {
    const node = new LinkedListNode(coords, this.tail);
    this.tail.next = node;
    this.tail = node;
  };
}

class LinkedListNode {
  constructor(coords, prev = null, next = null) {
    this.coords = coords;
    this.prev = prev;
    this.next = next;
  }
}

// DOM STUFF
const $board = document.querySelector('#board');
const generateCellsInRow = row => {
  return row.map(c => {
    const $cell = document.createElement('div');
    $cell.classList.add('cell');

    if (c.type === 'laser') {
      $cell.classList.add('token-laser');
    }

    if (c.type === 'target') {
      $cell.classList.add('token-target');
    }

    if (c.type === 'checkpoint') {
      $cell.classList.add('token-checkpoint');
    }

    if (c.type === 'beam-splitter') {
      $cell.classList.add('token-beam-splitter');
    }
    if (c.type === 'double-mirror') {
      $cell.classList.add('token-double-mirror');
    }
    if (c.type === 'cell-blocker') {
      $cell.classList.add('token-cell-blocker');
    }
    return $cell;
  });
};

const generateRows = rows => {
  rows.forEach(r => {
    const $row = document.createElement('div');
    $row.classList.add('row');

    const cells = generateCellsInRow(r);
    cells.forEach($cell => {
      $row.appendChild($cell);
    });

    $board.appendChild($row);
  });
};

const addBorderToCell = coords => {
  if (coords === null) return;
  const [x, y] = coords;
  const targetCell = document.querySelector(
    `.row:nth-of-type(${y + 1}) .cell:nth-of-type(${x + 1})`
  );
  targetCell && targetCell.classList.add('border');
};

const render = board => {
  $board.innerHTML = '';
  generateRows(board.grid);

  let curr = board.laser.head;
  while (curr) {
    addBorderToCell(curr.coords);
    curr = curr.next;
  }
};
