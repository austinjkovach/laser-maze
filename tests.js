////////////
// LEVELS //
////////////

const checkLevelUnlocks = lvls => {
  lvls.forEach((level, i) => {
    const $levelBtn = document.querySelector(`[data-level="${i}"]`);
    $levelBtn.classList.remove('complete');
    $levelBtn.classList.remove('disabled');
    $levelBtn.removeAttribute('disabled');

    console.log('UNLOCK', i, localStorage.getItem(i - 1));

    if (localStorage.getItem(i)) $levelBtn.classList.add('complete');

    if (!localStorage.getItem(i - 1) && i !== 0) {
      console.log('YES');
      $levelBtn.classList.add('disabled');
      $levelBtn.setAttribute('disabled', true);
    }
  });
};

let activeBoard = null;
const setLevelSelect = lvls => {
  lvls.forEach((level, i) => {
    const $levelBtn = document.createElement('button');
    const boardId = i;
    $levelBtn.setAttribute('data-level', boardId);

    $levelBtn.textContent = i + 1;
    $levelBtn.addEventListener('click', () => {
      if (activeBoard) {
        activeBoard.reset();
      }

      const { grid, tokenBank, targetPoints, description } = level;

      /// TODO add target points to these boards
      const board = new Board(
        grid,
        tokenBank,
        targetPoints,
        description,
        boardId
      );
      activeBoard = board;
      setActiveButton($levelBtn);
      render(activeBoard);
    });

    document.querySelector('#levelSelect').appendChild($levelBtn);
  });
  console.log('1');
  checkLevelUnlocks(lvls);
};

const setActiveButton = el => {
  document
    .querySelectorAll('#levelSelect button')
    .forEach($button => $button.classList.remove('active'));
  el.classList.add('active');
};

//////////////////
// RESET BUTTON //
//////////////////
const $resetAllLevels = document.querySelector('#resetAllLevels');
$resetAllLevels.addEventListener('click', () => {
  localStorage.clear();
});

//////////////////
// DEBUG BUTTON //
//////////////////
const $debug = document.querySelector('#debug');
$debug.addEventListener('click', () => {
  for (let i = 0; i < 30; i++) {
    localStorage.setItem(i, true);
  }
});

/////////////
// TESTING //
/////////////
if (localStorage.getItem('debug')) {
  setLevelSelect(testLevels);
  const badTest = (label, test, expectation) => {
    if (test !== expectation) {
      console.error(
        `Test ${label} Failed: Expect ${test} to be ${expectation}`
      );
      return;
    }
    console.log(`Test ${label} - Expect ${test} to be ${expectation}`);
  };

  document.querySelector('#initLaser').addEventListener('click', () => {
    if (activeBoard) {
      activeBoard.initLaser();
      badTest(
        null,
        activeBoard.points,
        activeBoard.tokens.filter(t => t.type === 'target').length
      );
      render(activeBoard);
      console.log('2');
      checkLevelUnlocks(testLevels);
    }
  });
} else {
  setLevelSelect(levels);
  document.querySelector('#initLaser').addEventListener('click', () => {
    if (activeBoard) {
      activeBoard.initLaser();
      render(activeBoard);
      console.log('3');
      checkLevelUnlocks(levels);
      render(activeBoard);
    }
  });
}
