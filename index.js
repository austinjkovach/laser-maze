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
    type: 'target' | 'laser' | 'checkpoint' | 'beam-splitter' | 'double-mirror' | 'cell-blocker';
    rotation: 0 | 1 | 2 | 3;
    visited: true | false
  }
*/
const token = (type, rotation = 0, canRotate = false) => {
  return {
    type,
    rotation,
    canRotate,
    visited: type === 'cell-blocker', // cell-blockers do not need to be visited in order for a solution to be valid
  };
};

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

const l = (rot, canRot = false) => token('laser', rot, canRot);
const t = (rot, canRot = false) => token('target', rot, canRot);
const c = (rot, canRot = false) => token('checkpoint', rot, canRot);
const b = (rot, canRot = false) => token('beam-splitter', rot, canRot);
const m = (rot, canRot = false) => token('double-mirror', rot, canRot);
const x = () => token('cell-blocker');

class Board {
  // TODO should some of these be private to the class?
  // && Only expose actions through class methods
  constructor(grid, tokenBank = []) {
    this.grid = grid;
    this.laser = null;
    this.tokens = grid.flat().filter(n => n !== 0);
    this.points = 0;
    this.initialBoard = grid;
    this.tokenBank = tokenBank; // should this be an object of token types?
  }

  calculateScore() {
    this.points = this.tokens.filter(
      t => t.type === 'target' && t.visited
    ).length;
    console.log('points:', this.points);
  }

  calculateVisited() {
    const output = this.tokens.reduce(
      (tot, curr) =>
        curr.type !== 'cell-blocker' && curr.visited ? tot + 1 : tot,
      0
    );
    console.log('output', output);
    return output;
  }

  reset() {
    this.tokens.forEach(t => (t.visited = false));
    this.calculateScore();
    this.calculateVisited();
  }

  initLaser() {
    this.reset();
    let directionMask;
    this.grid.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (cell.type !== 'laser') return null;
        cell.visited = true;
        this.laser = new Tree([j, i], rotationMatrix[cell.rotation]);
        directionMask = rotationMatrix[cell.rotation];
      })
    );

    this.calculateAll(this.laser);
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
      queue.push(...curr.children);
    }
  }

  calculateAll(laser, print = false) {
    // BFS
    let queue = [laser.head];
    let curr;
    while (queue.length > 0) {
      curr = queue[0];
      queue = queue.slice(1);

      this.processNode(curr);
      queue.push(...curr.children);
    }
    this.calculateScore();
    this.calculateVisited();
    if (print) this.printLaser();
  }

  markAsVisited(coords) {
    const [x, y] = coords;
    const cellContents = this.grid[y][x];
    if (cellContents) {
      cellContents.visited = true;
      return true;
    }
    return false;
  }

  // TODO START HERE clean this up / make more readable
  processNode(node) {
    // 1) get laser direction
    // 2) calculate next based on laser direction, token type, and token rotation
    // 3) mark as visited
    if (!this.laser || !node || !node.coords) return false;
    const { coords, prev } = node;
    const [x, y] = coords;
    // If we aren't currently inbounds, return;
    if (!isInBounds(coords, this.grid)) return;

    // If we don't have a previous, calculate next based on the laser's rotation
    if (prev === null) {
      this.laser.append([applyMask(coords, this.laser.rotationMask)], node);
      this.markAsVisited(coords);
      return;
    }

    this.markAsVisited(coords);
    const directionMask = getDirectionMask(prev.coords, coords);
    const cellContents = this.grid[y][x];
    const nextCoords = this.getNextCoords(coords, directionMask, cellContents);

    if (!nextCoords) return;
    nextCoords.forEach(nC => {
      if (isInBounds(nC, this.grid)) {
        this.laser.append(nextCoords, node);
        return;
      }
      this.laser.append(null, node);
      return false;
    });
  }

  allTokensAreVisited = () => this.tokens.every(t => t.visited);

  getNextCoords = (coords, directionMask, token) => {
    if (!token) {
      return [applyMask(coords, directionMask)];
    }

    const { rotation, type } = token;

    let beamSplitter = [];
    switch (type) {
      case 'laser':
        return [applyMask(coords, directionMask)];
      case 'target':
        // TODO only give points if facing the correct direction
        // this.points += 1;
        return null;
      case 'checkpoint':
        // Based on rotation // 0, 2 == N/S, 1, 3 == E/W
        if (!(rotation % 2)) {
          // N/S if (mask[0]) return null;
          return [applyMask(coords, directionMask)];
        } else {
          // E/W
          if (directionMask[1]) return null;
          return [applyMask(coords, directionMask)];
        }
      case 'beam-splitter':
        beamSplitter = [applyMask(coords, directionMask)];
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
        const doubleMirror = [applyMask(coords, reflectionMask)];
        return beamSplitter ? doubleMirror.concat(beamSplitter) : doubleMirror;
      case 'cell-blocker':
        return [applyMask(coords, directionMask)];
      default:
        return [];
    }
  };
}

class Tree {
  constructor(coords, rotationMask) {
    this.head = new TreeNode(coords);
    this.rotationMask = rotationMask;
  }

  append = (coords, curr = null) => {
    let newChildren = [];
    if (coords === null) {
      const node = new TreeNode(null, curr);
      node.children = [node];

      return;
    }
    coords.forEach((c, i) => {
      const node = new TreeNode(c, curr);
      newChildren.push(node);
    });
    if (curr) curr.children = newChildren;
  };
}

class TreeNode {
  constructor(coords, prev = null, children = []) {
    this.coords = coords;
    this.prev = prev;
    this.children = children;
  }
}
