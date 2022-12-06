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
    const $cell = document.createElement('div');
    $cell.classList.add('cell');

    console.log('T', t);
    if (t === 0) return $tokenBank.appendChild($cell);

    const $token = document.createElement('div');
    $token.classList.add('token');

    if (t.type === 'laser') $token.classList.add('token-laser');
    if (t.type === 'target') $token.classList.add('token-target');
    if (t.type === 'checkpoint') $token.classList.add('token-checkpoint');
    if (t.type === 'beam-splitter') $token.classList.add('token-beam-splitter');
    if (t.type === 'double-mirror') $token.classList.add('token-double-mirror');
    if (t.type === 'cell-blocker') $token.classList.add('token-cell-blocker');
    if (t !== 0) $token.classList.add(`rotate-${c.rotation * 90}`);
    if (t.type) $token.setAttribute('draggable', true);
    $cell.appendChild($token);
    $tokenBank.appendChild($cell);
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

    if (!c.type) return $cell;

    const $token = document.createElement('div');
    $token.classList.add('token');

    $token.setAttribute('draggable', false);
    $token.addEventListener('click', () => {
      if (!c.canRotate) return;
      $token.classList.remove(`rotate-${c.rotation * 90}`);
      c.rotation = (c.rotation + 1) % 4;
      $token.classList.add(`rotate-${c.rotation * 90}`);

      // Reset the board when a rotation occurs
      activeBoard.reset();
      activeBoard.laser = null;
      render(activeBoard);
    });

    $token.addEventListener('dragstart', dragstart_handler);

    $token.addEventListener('dragend', e => {
      console.log('e', e);
    });

    if (c.type === 'laser') $token.classList.add('token-laser');
    if (c.type === 'target') $token.classList.add('token-target');
    if (c.type === 'checkpoint') $token.classList.add('token-checkpoint');
    if (c.type === 'beam-splitter') $token.classList.add('token-beam-splitter');
    if (c.type === 'double-mirror') $token.classList.add('token-double-mirror');
    if (c.type === 'cell-blocker') $token.classList.add('token-cell-blocker');
    if (c !== 0) $token.classList.add(`rotate-${c.rotation * 90}`);
    if (c.type) $token.setAttribute('draggable', true);

    $cell.appendChild($token);
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

const renderTargetScore = board => {
  const $score = document.querySelector('#score');
  $score.innerHTML = 'Score: ' + board.points;
};

const renderVisitedScore = board => {
  const $visited = document.querySelector('#visited');
  const visited = board.calculateVisited();
  const total = board.tokens.filter(t => t.type !== 'cell-blocker').length;
  $visited.innerHTML = `${visited} / ${total}`;
};

const renderScore = board => {
  renderTargetScore(board);
  renderVisitedScore(board);
};

const render = async board => {
  $board.innerHTML = '';
  generateRows(board.grid);
  generateTokenBank(board.tokenBank);

  renderScore(board);
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
