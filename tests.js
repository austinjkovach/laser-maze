////////////
// LEVELS //
////////////
const levels = [
  {
    grid: [
      [0, l(), 0],
      [0, 0, 0],
      [0, t(), 0],
    ],
    tokenBank: [],
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
    tokenBank: [m(), l(), b(), t(), x(), c()],
  },
  {
    grid: [
      [0, t(1, true), 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, m(0, true), 0, 0, l(3, true)],
      [0, 0, 0, 0, 0],
    ],
    tokenBank: [m(0, true)],
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
      m(0, true),
      l(0, true),
      b(0, true),
      t(0, true),
      x(0, true),
      c(0, true),
    ],
  },
];

let activeBoard = null;
const setLevelSelect = () => {
  levels.forEach((level, i) => {
    const $levelBtn = document.createElement('button');
    $levelBtn.textContent = i + 1;
    $levelBtn.addEventListener('click', () => {
      if (activeBoard) {
        activeBoard.reset();
      }

      const { grid, tokenBank } = level;
      const board = new Board(grid, tokenBank);
      activeBoard = board;
      setActiveButton($levelBtn);
      render(activeBoard);
    });

    document.querySelector('#levelSelect').appendChild($levelBtn);
  });
};

const setActiveButton = el => {
  document
    .querySelectorAll('#levelSelect button')
    .forEach($button => $button.classList.remove('active'));
  el.classList.add('active');
};

/////////////
// TESTING //
/////////////

const badTest = (label, test, expectation) => {
  if (test !== expectation) {
    console.error(`Test ${label} Failed: Expect ${test} to be ${expectation}`);
    return;
  }
  console.log(`Test ${label} - Expect ${test} to be ${expectation}`);
};

setLevelSelect();

document.querySelector('#initLaser').addEventListener('click', () => {
  if (activeBoard) {
    activeBoard.initLaser();
    badTest(
      null,
      activeBoard.points,
      activeBoard.tokens.filter(t => t.type === 'target').length
    );
    render(activeBoard);
  }
});
