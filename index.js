class Board {
  constructor(grid) {
    this.grid = grid;
  }
}

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

const grid = [
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const board = new Board(grid);

// DOM STUFF
const $board = document.querySelector('#board');
const generateCellsInRow = row => {
  return row.map(c => {
    const $cell = document.createElement('div');
    $cell.classList.add('cell');
    if (c === 1) {
      $cell.classList.add('blue');
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

generateRows(grid);

//
