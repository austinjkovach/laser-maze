const $board = document.querySelector('#board');
const generateCellsInRow = row => {
  return row.map(c => {
    const $cell = document.createElement('div');
    $cell.classList.add('cell');
    $cell.addEventListener('click', () => {
      if (!c.canRotate) return;
      $cell.classList.remove(`rotate-${c.rotation * 90}`);
      c.rotation = (c.rotation + 1) % 4;
      $cell.classList.add(`rotate-${c.rotation * 90}`);

      // Reset the board when a rotation occurs
      activeBoard.laser = null;
      render(activeBoard);
    });

    if (c.type === 'laser') $cell.classList.add('token-laser');
    if (c.type === 'target') $cell.classList.add('token-target');
    if (c.type === 'checkpoint') $cell.classList.add('token-checkpoint');
    if (c.type === 'beam-splitter') $cell.classList.add('token-beam-splitter');
    if (c.type === 'double-mirror') $cell.classList.add('token-double-mirror');
    if (c.type === 'cell-blocker') $cell.classList.add('token-cell-blocker');
    if (c !== 0) $cell.classList.add(`rotate-${c.rotation * 90}`);

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
  if (!coords) return;
  const [x, y] = coords;
  const targetCell = document.querySelector(
    `.row:nth-of-type(${y + 1}) .cell:nth-of-type(${x + 1})`
  );
  targetCell && targetCell.classList.add('border');
};

const render = async board => {
  $board.innerHTML = '';
  generateRows(board.grid);

  if (board.laser) {
    let curr;
    let queue = [board.laser.head];
    while (queue.length) {
      curr = queue[0];
      queue = queue.slice(1);
      if (curr && curr.coords) {
        addBorderToCell(curr.coords);
        queue.push(...curr.children);
      }
      // await new Promise(r => setTimeout(r, 100)); // [1]
    }
  }
};

// [1]
// sleep() in JavaScript:
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
