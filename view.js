const $board = document.querySelector('#board');
const generateTokenBank = tokens => {
  let $tokenBank = document.querySelector('#tokenBank');
  if (!$tokenBank) {
    $tokenBank = document.createElement('div');
    document.body.appendChild($tokenBank);
  }
  $tokenBank.innerHTML = '';
  $tokenBank.setAttribute('id', 'tokenBank');
  tokens.forEach(t => {
    const $token = document.createElement('div');
    $token.classList.add('cell');
    if (t.type === 'laser') $token.classList.add('token-laser');
    if (t.type === 'target') $token.classList.add('token-target');
    if (t.type === 'checkpoint') $token.classList.add('token-checkpoint');
    if (t.type === 'beam-splitter') $token.classList.add('token-beam-splitter');
    if (t.type === 'double-mirror') $token.classList.add('token-double-mirror');
    if (t.type === 'cell-blocker') $token.classList.add('token-cell-blocker');
    $tokenBank.appendChild($token);
  });
  if (!$tokenBank.children.length) $tokenBank.remove();
};

function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  console.log('ev', ev);
  ev.dataTransfer.setData('text/plain', ev.target.id);
}

const generateCellsInRow = (row, rowIndex) => {
  return row.map((c, j) => {
    const $cell = document.createElement('div');
    $cell.setAttribute('x', j);
    $cell.setAttribute('y', rowIndex);
    $cell.classList.add('cell');
    $cell.setAttribute('draggable', false);
    $cell.addEventListener('click', () => {
      if (!c.canRotate) return;
      $cell.classList.remove(`rotate-${c.rotation * 90}`);
      c.rotation = (c.rotation + 1) % 4;
      $cell.classList.add(`rotate-${c.rotation * 90}`);

      // Reset the board when a rotation occurs
      activeBoard.laser = null;
      render(activeBoard);
    });

    $cell.addEventListener('dragstart', dragstart_handler);

    $cell.addEventListener('dragend', e => {
      console.log('e', e);
    });

    if (c.type === 'laser') $cell.classList.add('token-laser');
    if (c.type === 'target') $cell.classList.add('token-target');
    if (c.type === 'checkpoint') $cell.classList.add('token-checkpoint');
    if (c.type === 'beam-splitter') $cell.classList.add('token-beam-splitter');
    if (c.type === 'double-mirror') $cell.classList.add('token-double-mirror');
    if (c.type === 'cell-blocker') $cell.classList.add('token-cell-blocker');
    if (c !== 0) $cell.classList.add(`rotate-${c.rotation * 90}`);
    if (c.type) $cell.setAttribute('draggable', true);

    return $cell;
  });
};

const generateRows = rows => {
  rows.forEach((r, i) => {
    const $row = document.createElement('div');
    $row.classList.add('row');

    const cells = generateCellsInRow(r, i);
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
  generateTokenBank(board.tokenBank);

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
