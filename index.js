class Board {
  constructor(grid) {
    this.grid = grid;
    this.laser = null;
  }

  initLasers() {
    this.grid.forEach(row =>
      row.forEach(cell =>
        cell.type === 'generator'
          ? (this.laser = new LinkedList([cell.x, cell.y]))
          : null
      )
    );
  }

  calculateNext() {
    if (!this.laser) return;
    if (isInBounds(this.laser.tail, this.grid)) {
      const direction = getDirection(this.laser.tail.prev, this.laser.tail);
      const next = this.laser.createNode();
      return true;
    }
  }
}

const getDirection = (prev, curr) => {
  return [curr[0] - prev[0], curr[1] - prev[1]];
};

const isInBounds = (coords, board) => {
  const checkX = coords[1] > -1 && coords[1] <= board.length;
  const checkY = coords[0] > -1 && coords[0] <= board[0].length;

  return checkX && checkY;
};

class LinkedList {
  constructor(head) {
    this.head = head;
    this.tail = head;
    this.nodes = [head];
  }
  createNode = (x, y) => {
    const node = new LinkedListNode(x, y, this.tail);
    this.nodes.push(node);
  };
}

class LinkedListNode {
  constructor(x, y, prev = null) {
    this.x = x;
    this.y = y;
    this.next = this.getNext();
    this.prev = prev;
  }

  getNext() {
    const { x, y } = this;
    return [x + 1, y];
  }
}

/*


  laser generator
  target


  {
    type: 'target' | 'generator';
    x: 0;
    y: 0;
    rotation: 0 | 1 | 2 | 3;


  }


*/

const piece = (type, coords, rotation = 0) => {
  return {
    type,
    x: coords[0],
    y: coords[1],
    rotation,
  };
};

const generator = (coords, rotation) => piece('generator', coords, rotation);
const target = (coords, rotation) => piece('target', coords, rotation);

const g1 = generator([0, 0], 0);
const t1 = target([1, 0], 0);

const grid = [
  [g1, 0, 0],
  [0, 0, 0],
  [t1, 0, 0],
];

// DOM STUFF
const $board = document.querySelector('#board');
const generateCellsInRow = row => {
  return row.map(c => {
    const $cell = document.createElement('div');
    $cell.classList.add('cell');
    if (c.type === 'generator') {
      $cell.classList.add('blue');
    }
    if (c.type === 'target') {
      $cell.classList.add('green');
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

const board = new Board(grid);
generateRows(board.grid);

board.initLasers();
console.log('b', board.lasers);

//
