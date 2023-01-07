//////////
// TODO //
//////////

/// ✅) Add indices to tokenbank cell
/// ✅) Differentiate between tokenBank->Board drags and Board-Board drags
/// ✅) All actions are through board state updates, then rerender based on new state
/// ✅) flesh out addTokenFromBank && returnTokenToBank
/// ✅) fix beam-splitter image rotation
/// ✅) fix bug with dropping tokenBank on tokenBank
/// ✅) fix state updates when adding special tokens (target, laser)
/// -✅- update visited count correctly
/// -✅- update score correctly (when laser is turned off, should go to 0)
/// -✅- display newly placed lasers correctly (rotation)
/// 8) (NICE TO HAVE) Clean up moveToken logic - keep DRY
/// ✅) Draggable
/// ✅) click to rotate newly placed pieces
/// ✅) hard reset
/// ✅) correct target facings
/// ✅) active vs inactive target icon
/// ✅) lock/rotate icons
/// 14) localstorage to keep track of solved puzzles
/// 15) (NICE TO HAVE) get token from drag info
/// ✅) fix token rotation persists across board resets
/// ✅) add description to levels
/// 18) level 7  - move away from edges, set mirror up in wrong direction, need to rotate to win

///////////
// NOTES //
///////////

/// https://stackoverflow.com/questions/23450588/isometric-camera-with-three-js

//////////
// CODE //
//////////

const rotationMatrix = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

/*
  {
    type: 'target' | 'laser' | 'checkpoint' | 'beam-splitter' | 'double-mirror' | 'cell-blocker';
    rotation: 0 | 1 | 2 | 3;
    visited: true | false
  }
*/

const token = (type, rotation = 0, canRotate = false, canMove = false) => {
  const returnObj = {
    type,
    rotation,
    canRotate,
    canMove,
    visited: type === 'cell-blocker', // cell-blockers do not need to be visited in order for a solution to be valid
  };

  if (type === 'target') return { ...returnObj, active: false };
  return returnObj;
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

const l = (rot, canRotate, canMove) => token('laser', rot, canRotate, canMove);
const t = (rot, canRotate, canMove) => token('target', rot, canRotate, canMove);
const c = (rot, canRotate, canMove) =>
  token('checkpoint', rot, canRotate, canMove);
const b = (rot, canRotate, canMove) =>
  token('beam-splitter', rot, canRotate, canMove);
const m = (rot, canRotate, canMove) =>
  token('double-mirror', rot, canRotate, canMove);
const x = () => token('cell-blocker');

const deepClone = arr => [
  ...arr.map(el =>
    Array.isArray(el)
      ? [...el.map(el => (el === 0 ? el : { ...el }))]
      : el === 0
      ? el
      : { ...el }
  ),
];
const deepEqual = (arr1, arr2) => arr1[0] === arr2[0] && arr1[1] === arr2[1];

class Board {
  constructor(grid, tokenBank = [], targetPoints = 1, description, boardId) {
    this.grid = deepClone(grid);
    this.laser = null;
    this.tokens = grid.flat().filter(n => n !== 0);
    this.points = 0;
    this.targetPoints = targetPoints;
    this.initialBoard = deepClone(grid);
    this.initialTokenBank = deepClone(tokenBank);
    this.tokenBank = deepClone(tokenBank); // should this be an object of token types?
    this.boardId = boardId;
    this.description = description;
  }

  calculateScore() {
    const newPoints = this.tokens.filter(
      t => t.type === 'target' && t.active
    ).length;

    this.points = newPoints;
    return newPoints;
  }

  calculateTokens() {
    const newTokens = this.grid.flat().filter(n => n !== 0);
    this.tokens = newTokens;
    return newTokens;
  }

  calculateVisited() {
    return this.calculateTokens().reduce(
      (tot, curr) =>
        curr.type !== 'cell-blocker' && curr.visited ? tot + 1 : tot,
      0
    );
  }

  getInitialBoard = () => deepClone(this.initialBoard);

  recalculateBoard() {
    this.laser = null;
    this.tokens.forEach(t => (t.visited = false));
    this.tokens
      .filter(t => t.type === 'target')
      .forEach(t => (t.active = false));
    this.calculateVisited();
    this.calculateScore();
  }

  reset() {
    this.grid = this.getInitialBoard();
    this.tokenBank = [...this.initialTokenBank.map(el => ({ ...el }))];
    this.recalculateBoard();
  }

  initLaser() {
    this.recalculateBoard();
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

  isSolved = () =>
    this.allTokensAreVisited() && this.points == this.targetPoints;

  calculateAll(laser, print = false) {
    if (!laser) return;
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

    if (this.isSolved()) {
      localStorage.setItem(this.boardId, true);
    }

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

  // TODO clean this up / make more readable
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

  // addTokenFromBank (toCoords, token)
  // returnTokenToBank (fromCoords) ==> find token from board.grid

  // TODO clean this up, don't use extra functions
  moveToken = (fromCoords, toCoords, token) => {
    const [x1, y1] = fromCoords;
    const [x2, y2] = toCoords;

    if (y1 === 'tokenBank' && y2 === 'tokenBank') {
      this.moveTokenInBank(fromCoords, toCoords);
      return;
    }
    if (y1 === 'tokenBank') {
      if (toCoords.some(c => !c)) return;
      this.addTokenFromBank(fromCoords, toCoords);
      return;
    }
    if (y2 === 'tokenBank') {
      this.returnTokenToBank(fromCoords, toCoords);
      return;
    }
    if (y1 !== 'tokenBank' && y2 !== 'tokenBank') {
      if (toCoords.some(c => !c)) return;
      this.moveTokenOnBoard(fromCoords, toCoords);
      return;
    }
  };

  moveTokenOnBoard = (fromCoords, toCoords) => {
    const [x1, y1] = fromCoords;
    const token = this.grid[y1][x1];

    const [x2, y2] = toCoords;
    this.grid[y2][x2] = token;
    this.grid[y1][x1] = 0;
  };

  moveTokenInBank = (fromCoords, toCoords) => {
    const [fromIdx, _] = fromCoords;
    const [toIdx, __] = toCoords;

    const token = this.tokenBank[fromIdx];

    this.tokenBank[toIdx] = token;
    this.tokenBank[fromIdx] = 0;
  };

  addTokenFromBank = (fromCoords, toCoords) => {
    const [fromIdx, _] = fromCoords;
    const token = this.tokenBank[fromIdx];
    const [x, y] = toCoords;

    activeBoard.tokenBank[fromIdx] = 0;
    activeBoard.grid[y][x] = token;
  };

  returnTokenToBank = (fromCoords, toCoords) => {
    const [x1, y1] = fromCoords;
    const [toIdx, _] = toCoords;

    const token = this.grid[y1][x1];
    this.grid[y1][x1] = 0;
    this.tokenBank[toIdx] = token;
  };

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
        let targetReflectionMask;

        /*

          0 => down wins (y == 1)
            dM == [1, 0] #==> [0, 1]
            dM == [0, -1] #==> [-1, 0]
            [-1, +1]

          1 => right wins (x == -1)
            dM == [1, 0] #==> [0, -1]
            dM == [0, 1] #==> [-1, 0]
            [-1, -1]

          2 => up wins (y == -1)
            dM == [0, 1] #==> [1, 0]
            dM == [-1, 0] #==> [0, -1]
            [+1, -1]

          3 => left wins (x == 1)
            dM == [0, -1] #==> [1, 0]
            dM == [-1, 0] #==> [0, 1]
            [+1, +1]

        */
        const [x, y] = coords;

        if (rotation === 0) {
          if (deepEqual(directionMask, [0, 1])) {
            this.grid[y][x].active = true;
            return null;
          }
          if (deepEqual(directionMask, [1, 0])) {
            return [applyMask(coords, [0, 1])];
          }
          if (deepEqual(directionMask, [0, -1])) {
            return [applyMask(coords, [-1, 0])];
          }
          return null;
        }
        if (rotation === 1) {
          if (deepEqual(directionMask, [-1, 0])) {
            this.grid[y][x].active = true;
            return null;
          }
          if (deepEqual(directionMask, [1, 0])) {
            return [applyMask(coords, [0, -1])];
          }
          if (deepEqual(directionMask, [0, 1])) {
            return [applyMask(coords, [-1, 0])];
          }
          return null;
        }
        if (rotation === 2) {
          if (deepEqual(directionMask, [0, -1])) {
            this.grid[y][x].active = true;
            return null;
          }
          if (deepEqual(directionMask, [0, 1])) {
            return [applyMask(coords, [1, 0])];
          }
          if (deepEqual(directionMask, [-1, 0])) {
            return [applyMask(coords, [0, -1])];
          }
          return null;
        }
        if (rotation === 3) {
          if (deepEqual(directionMask, [1, 0])) {
            this.grid[y][x].active = true;
            return null;
          }
          if (deepEqual(directionMask, [0, -1])) {
            return [applyMask(coords, [1, 0])];
          }
          if (deepEqual(directionMask, [-1, 0])) {
            return [applyMask(coords, [0, 1])];
          }
          return null;
        }
        // TODO only give points if facing the correct direction
        // this.points += 1;
        return null;
      // [applyMask(coords, reflectionMask)];
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
        return null;
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
