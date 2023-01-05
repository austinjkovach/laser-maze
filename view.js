const $board = document.querySelector('#board');
const $description = document.querySelector('#description');

const generateTokenBank = tokens => {
  let $tokenBank = document.querySelector('#tokenBank');
  if (!$tokenBank) {
    $tokenBank = document.createElement('div');
    document.body.appendChild($tokenBank);
  }
  $tokenBank.innerHTML = '';
  $tokenBank.setAttribute('id', 'tokenBank');
  [...tokens].forEach((t, idx) => {
    /// Set up cell
    const $cell = document.createElement('div');
    $cell.classList.add('cell');
    $cell.setAttribute('x', idx);
    $cell.setAttribute('y', 'tokenBank');
    $cell.addEventListener('dragenter', dragenter_handler);
    $cell.addEventListener('dragover', dragover_handler);
    $cell.addEventListener('drop', onDrop);

    /// If no token, append to DOM and return early
    if (t === 0) return $tokenBank.appendChild($cell);

    const [$token, $icons] = createToken(t);

    /// Append nodes to DOM
    $cell.appendChild($token);
    $cell.appendChild($icons);
    $tokenBank.appendChild($cell);
  });

  if (!$tokenBank.children.length) $tokenBank.remove();
};

function dragstart_handler(e) {
  const parent = e.target.parentElement;
  const parentCoords = [parent.getAttribute('x'), parent.getAttribute('y')];

  const dataObject = {
    fromCoords: parentCoords,
    tokenId: e.target.id,
  };

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('application/json', JSON.stringify(dataObject));

  const xOffset = 25;
  const yOffset = 25;
  e.dataTransfer.setDragImage(e.target, xOffset, yOffset);
}

function dragenter_handler(e) {
  e.preventDefault();
}

function dragover_handler(e) {
  e.preventDefault();
}

function dragend_handler(e) {
  e.preventDefault();
}

function onDrop(e) {
  activeBoard.recalculateBoard();
  e.preventDefault();

  const data = JSON.parse(e.dataTransfer.getData('application/json'));
  const [x1, y1] = data.fromCoords;
  const x2 = e.target.getAttribute('x');
  const y2 = e.target.getAttribute('y');

  /// TODO (14) don't hardcode this
  /// TODO (14) use targetToken somehow?
  const targetToken = token('double-mirror', 0, true);

  activeBoard.moveToken([x1, y1], [x2, y2], targetToken);
  render(activeBoard);
}

function handleClick(token, $el) {
  if (!token.canRotate) return;
  $el.classList.remove(`rotate-${token.rotation ? token.rotation * 90 : 0}`);
  token.rotation = (token.rotation + 1) % 4;
  $el.classList.add(`rotate-${token.rotation ? token.rotation * 90 : 0}`);

  activeBoard.recalculateBoard();
  render(activeBoard);
}

const createCell = (x, y) => {
  const $cell = document.createElement('div');

  $cell.setAttribute('x', x);
  $cell.setAttribute('y', y);
  $cell.classList.add('cell');

  $cell.addEventListener('dragenter', dragenter_handler);
  $cell.addEventListener('dragover', dragover_handler);
  $cell.addEventListener('drop', onDrop);
  return $cell;
};

const createToken = t => {
  const $token = document.createElement('div');
  $token.classList.add('token');
  $token.addEventListener('dragstart', dragstart_handler);

  // TODO??? Use CSS classes of rotate-[0-3] instead of rotate-[0-270]

  const tokenClickHandler = () => handleClick(t, $token);
  $token.addEventListener('click', tokenClickHandler);

  if (t.type) {
    $token.classList.add(`token-${t.type}`);
    $token.setAttribute('data-type', t.type);
    $token.setAttribute('draggable', t.canMove);
    $token.setAttribute('rotation', t.rotation);
  }

  const $icons = document.createElement('div');
  $icons.classList.add('icons');
  if (t.canMove) $icons.classList.add('can-move');
  if (t.canRotate) $icons.classList.add('can-rotate');

  if (t.active) $token.classList.add('token-active');
  if (t !== 0)
    $token.classList.add(`rotate-${t.rotation ? t.rotation * 90 : 0}`);

  return [$token, $icons];
};

const generateCellsInRow = (row, rowIndex) => {
  return row.map((c, j) => {
    const $cell = createCell(j, rowIndex);
    if (!c.type) return $cell;
    const [$token, $icons] = createToken(c);

    $cell.appendChild($token);
    $cell.appendChild($icons);

    if (c.canRotate) {
      $token.classList.add('can-rotate');
    }

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
  const total = board
    .calculateTokens()
    .filter(t => t.type !== 'cell-blocker').length;
  $visited.innerHTML = `${visited} / ${total}`;
};

const renderScore = board => {
  renderTargetScore(board);
  renderVisitedScore(board);
};

const render = async board => {
  /// TODO add level check into render method somewhere

  $board.innerHTML = '';
  $description.innerText = board.description || '';
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
