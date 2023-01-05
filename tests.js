////////////
// LEVELS //
////////////

const levels = [
  {
    grid: [
      [0, l(2), 0],
      [0, 0, 0],
      [0, t(), 0],
    ],
    targetPoints: 1,
  },
  {
    grid: [
      [0, t(2), 0],
      [0, l(2, true), 0],
      [0, 0, 0],
    ],
    tokenBank: [],
    targetPoints: 1,
  },
  {
    grid: [
      [0, t(2), 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    tokenBank: [l(0, true, true)],
    targetPoints: 0,
  },
  {
    grid: [
      [0, t(2), 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    tokenBank: [l(0, true, true)],
    targetPoints: 0,
  },
];

/// TODO add target points
const testLevels = [
  {
    grid: [
      [0, l(), 0],
      [0, 0, 0],
      [0, t(), 0],
    ],
    tokenBank: [],
    targetPoints: 0,
  },
  {
    grid: [
      [0, 0, 0],
      [0, l(1), 0],
      [t(0), 0, 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, l(2), 0],
      [0, 0, 0],
      [0, t(0), 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, l(2), 0],
      [0, 0, 0],
      [0, t(0), 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, l(2), 0],
      [0, 0, 0],
      [0, t(0), 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, l(2), 0],
      [0, c(0), 0],
      [0, t(0), 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, l(2), 0],
      [0, c(1), 0],
      [0, t(0), 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, 0, 0],
      [l(1), c(1), 0],
      [0, t(0), 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, l(2), 0],
      [0, 0, 0],
      [0, t(), 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [l(1), 0, m(0)],
      [0, 0, 0],
      [0, 0, t()],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [t(1), 0, m(0)],
      [0, 0, 0],
      [0, 0, l()],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [m(1), 0, t(3)],
      [0, 0, 0],
      [l(0), 0, 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [m(1), 0, l(3)],
      [0, 0, 0],
      [t(), 0, 0],
    ],
    tokenBank: [],
  },

  {
    grid: [
      [0, 0, 0, 0, 0],
      [0, m(1), 0, l(3), 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, t(), 0, 0, 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, m(1), 0, 0, m(0)],
      [0, 0, 0, 0, 0],
      [0, m(0), 0, l(3), 0],
      [0, m(1), 0, 0, m(1)],
      [0, t(), 0, 0, 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, m(1), 0, 0, m(0)],
      [0, x(), 0, 0, 0],
      [0, m(0), 0, l(3), 0],
      [0, m(1), 0, 0, m(1)],
      [0, t(), 0, 0, 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [m(0), 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, t(1), 0, l(3), 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [x(), 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, t(1), 0, l(3), 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, 0, t(2), 0, 0],
      [0, 0, 0, 0, 0],
      [0, t(1), b(), 0, l(3)],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, t(2), 0],
      [0, 0, 0, 0, 0],
      [t(1), 0, 0, b(), l(3)],
      [0, 0, 0, 0, 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [m(1), 0, c(1), 0, m(0)],
      [b(), 0, 0, m(), 0],
      [b(), b(), t(3), 0, x()],
      [0, t(), 0, t(), 0],
      [t(), 0, 0, 0, l(0)],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, 0, 0, t(2), 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [t(1), 0, 0, b(), l(3)],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [x(), 0, 0, 0, l(3, true)],
    ],
    tokenBank: [m(), l(), b(), t(), x(), c()],
  },
  {
    grid: [
      [0, t(2, true), 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, m(0, true), 0, 0, l(3, true)],
      [0, 0, 0, 0, 0],
    ],
    tokenBank: [
      m(0, true, true),
      l(0, true, true),
      b(0, true, true),
      t(0, true, true),
      x(0, true, true),
      c(0, true, true),
    ],
  },
  {
    grid: [
      [0, t(1, true), 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, m(0, true), 0, l(3, true)],
      [0, 0, 0, 0, 0],
    ],
    tokenBank: [m(0, true, true)],
  },
  {
    grid: [
      [0, 0, t(0)],
      [0, 0, 0],
      [0, 0, l(0)],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, 0, t(1)],
      [0, 0, 0],
      [0, 0, l(0)],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, 0, t(2)],
      [0, 0, 0],
      [0, 0, l(0)],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [t(3), 0, 0],
      [0, 0, 0],
      [l(0), 0, 0],
    ],
    tokenBank: [],
  },
  {
    grid: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [x(), 0, 0, 0, l(3, true)],
    ],
    tokenBank: [
      m(0, true, true),
      l(0, true, true),
      b(0, true, true),
      t(0, true, true),
      x(0, true, true),
      c(0, true, true),
    ],
  },
];

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

    // if (!localStorage.getItem(boardId - 1) && boardId !== 0) {
    //   $levelBtn.classList.add('disabled');
    //   $levelBtn.setAttribute('disabled', true);
    // }

    $levelBtn.textContent = i + 1;
    $levelBtn.addEventListener('click', () => {
      if (activeBoard) {
        activeBoard.reset();
      }

      const { grid, tokenBank } = level;

      /// TODO add target points to these boards
      const board = new Board(grid, tokenBank, boardId);
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
