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
        this.laser = new Tree([j, i]);
        directionMask = rotationMatrix[cell.rotation];
      })
    );
    const { coords } = this.laser.tail;
    const nextCoords = applyMask(coords, directionMask);

    if (isInBounds(nextCoords, this.grid)) {
      this.laser.append(nextCoords);
    } else {
      this.laser.append(null);
    }

    this.calculateAll();
  }

  printLaser(verbose = false) {
    let curr;
    let queue = [this.laser.head];

    while (queue.length > 0) {
      curr = queue.pop();
      if (verbose) {
        console.log(curr);
      } else {
        console.log(curr.coords);
      }
      queue.push(curr.children);
    }
  }

  calculateAll() {
    let queue = [this.laser.tail];
    let curr;
    while (queue.length > 0) {
      curr = queue.pop();

      this.processNode(curr);
      if (curr.children) {
        queue.push(curr.children);
      }
    }
    // this.printLaser();
  }

  processNode(node) {
    if (!this.laser || !node) return false;
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
      return true;
    }
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

class Tree {
  constructor(coords) {
    this.head = new TreeNode(coords);
    this.tail = this.head;
  }

  append = coords => {
    const node = new TreeNode(coords, this.tail);
    this.tail.children = node;
    this.tail = node;
  };
}

class TreeNode {
  constructor(coords, prev = null, children = null) {
    this.coords = coords;
    this.prev = prev;
    this.children = children;
  }
}
