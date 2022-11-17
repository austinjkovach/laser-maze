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
