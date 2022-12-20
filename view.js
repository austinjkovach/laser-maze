const $board = document.querySelector('#board');
const generateTokenBank = tokens => {
  let $tokenBank = document.querySelector('#tokenBank');
  if (!$tokenBank) {
    $tokenBank = document.createElement('div');
    document.body.appendChild($tokenBank);
  }
  $tokenBank.innerHTML = '';
  $tokenBank.setAttribute('id', 'tokenBank');
  [...tokens, 0].forEach((t, idx) => {
    const $cell = document.createElement('div');
    $cell.classList.add('cell');

    $cell.addEventListener('dragenter', dragenter_handler);
    $cell.addEventListener('dragover', dragover_handler);
    $cell.addEventListener('drop', onDrop);

    if (t === 0) return $tokenBank.appendChild($cell);

    const $token = document.createElement('div');
    $token.classList.add('token');
    $token.addEventListener('dragstart', dragstart_handler);
    $token.addEventListener('drop', onDrop);

    $token.setAttribute('id', `token-${idx}`);
    if (t.type) $token.setAttribute('draggable', true);
    if (t.type === 'laser') $token.classList.add('token-laser');
    if (t.type === 'target') $token.classList.add('token-target');
    if (t.type === 'checkpoint') $token.classList.add('token-checkpoint');
    if (t.type === 'beam-splitter') $token.classList.add('token-beam-splitter');
    if (t.type === 'double-mirror') $token.classList.add('token-double-mirror');
    if (t.type === 'cell-blocker') $token.classList.add('token-cell-blocker');
    if (t !== 0)
      $token.classList.add(`rotate-${c.rotation ? c.rotation * 90 : 0}`);
    $cell.appendChild($token);
    $tokenBank.appendChild($cell);
  });
  if (!$tokenBank.children.length) $tokenBank.remove();
};

function dragstart_handler(e) {
  console.log('ajk dragSTART', e);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', e.target.id); // e.dataTransfer.setData('text/plain', e.target.id);

  console.log('ajk data ID', e.target.id);
  const xOffset = 25;
  const yOffset = 25;
  e.dataTransfer.setDragImage(e.target, xOffset, yOffset);
}

function dragenter_handler(e) {
  console.log('ajk dragENTER', e);
  e.preventDefault();
}

function dragover_handler(e) {
  console.log('ajk dragOVER', e);
  e.preventDefault();
}

function dragend_handler(e) {
  console.log('ajk dragEND', e);
  e.preventDefault();
}

function onDrop(e) {
  console.log('ajk DROP', e);
  const data = e.dataTransfer.getData('text/plain');

  e.target.appendChild(document.getElementById(data));
  e.preventDefault();
}

const generateCellsInRow = (row, rowIndex) => {
  return row.map((c, j) => {
    const $cell = document.createElement('div');
    $cell.setAttribute('x', j);
    $cell.setAttribute('y', rowIndex);
    $cell.classList.add('cell');

    $cell.setAttribute('id', 'myId');
    $cell.setAttribute('ondrop', onDrop);
    $cell.setAttribute('ondragover', dragover_handler);
    $cell.setAttribute('ondragenter', dragover_handler);

    if (!c.type) return $cell;

    const $token = document.createElement('div');
    $token.classList.add('token');

    $token.setAttribute('draggable', false);
    $token.addEventListener('click', () => {
      if (!c.canRotate) return;
      $token.classList.remove(`rotate-${c.rotation ? c.rotation * 90 : 0}`);
      c.rotation = (c.rotation + 1) % 4;
      $token.classList.add(`rotate-${c.rotation ? c.rotation * 90 : 0}`);

      // Reset the board when a rotation occurs
      activeBoard.reset();
      activeBoard.laser = null;
      render(activeBoard);
    });

    // $token.addEventListener('dragstart', dragstart_handler);
    // $token.addEventListener('dragenter', dragenter_handler);
    // $token.addEventListener('dragover', dragover_handler);
    // $token.addEventListener('dragend', dragend_handler);
    // $token.addEventListener('drop', onDrop);

    // $cell.addEventListener('dragenter', dragenter_handler);
    // $cell.addEventListener('dragover', dragover_handler);
    // $cell.addEventListener('dragend', dragend_handler);
    // $cell.addEventListener('drop', onDrop);

    if (c.type === 'laser') $token.classList.add('token-laser');
    if (c.type === 'target') $token.classList.add('token-target');
    if (c.type === 'checkpoint') $token.classList.add('token-checkpoint');
    if (c.type === 'beam-splitter') $token.classList.add('token-beam-splitter');
    if (c.type === 'double-mirror') $token.classList.add('token-double-mirror');
    if (c.type === 'cell-blocker') $token.classList.add('token-cell-blocker');
    if (c !== 0)
      $token.classList.add(`rotate-${c.rotation ? c.rotation * 90 : 0}`);
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
