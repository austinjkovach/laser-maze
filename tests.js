////////////
// LEVELS //
////////////
const levels = [
  [
    [0, l(), 0],
    [0, 0, 0],
    [0, t(), 0],
  ],
  [
    [0, 0, 0],
    [0, l(1), 0],
    [t(0), 0, 0],
  ],
  [
    [0, l(2), 0],
    [0, 0, 0],
    [0, t(0), 0],
  ],
  [
    [0, l(2), 0],
    [0, c(0), 0],
    [0, t(0), 0],
  ],
  [
    [0, l(2), 0],
    [0, c(1), 0],
    [0, t(0), 0],
  ],
];

let activeBoard = null;
const setLevelSelect = () => {
  levels.forEach((level, i) => {
    const $levelBtn = document.createElement('button');
    $levelBtn.textContent = i;
    $levelBtn.addEventListener('click', () => {
      const board = new Board(levels[i]);
      activeBoard = board;
      render(activeBoard);
    });

    document.querySelector('#levelSelect').appendChild($levelBtn);
  });
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

const testBoard = grid => {
  const board = new Board(grid);
  board.initLaser();
  render(board);
  return board;
};

const grid = [
  [0, l(), 0],
  [0, 0, 0],
  [0, t(), 0],
];

// const t1 = testBoard(grid);
// badTest(1, t1.points, 0);

const grid2 = [
  [0, 0, 0],
  [0, l(1), 0],
  [t(0), 0, 0],
];

// const t2 = testBoard(grid2);
// badTest(2, t2.points, 0);

const grid3 = [
  [0, l(2), 0],
  [0, 0, 0],
  [0, t(0), 0],
];

// const t3 = testBoard(grid3);
// badTest(3, t3.points, 1);

const grid4 = [
  [0, l(2), 0],
  [0, c(0), 0],
  [0, t(0), 0],
];

// const t4 = testBoard(grid4);
// badTest(4, t4.points, 1);

const grid5 = [
  [0, l(2), 0],
  [0, c(1), 0],
  [0, t(0), 0],
];

// const t5 = testBoard(grid5);
// badTest(5, t5.points, 0);

const grid6 = [
  [0, 0, 0],
  [l(1), c(1), 0],
  [0, t(0), 0],
];

// const t6 = testBoard(grid6);
// badTest(6, t6.points, 0);

const grid7 = [
  [0, l(2), 0],
  [0, 0, 0],
  [0, t(), 0],
];

// const t7 = testBoard(grid7);
// badTest(7, t7.points, 1);

///////////////////
// double-mirror //
///////////////////

const grid8 = [
  [l(1), 0, m(0)],
  [0, 0, 0],
  [0, 0, t()],
];

// const t8 = testBoard(grid8);
// badTest(8, t8.points, 1);

const grid9 = [
  [t(), 0, m(0)],
  [0, 0, 0],
  [0, 0, l()],
];

// const t9 = testBoard(grid9);
// badTest(9, t9.points, 1);

const grid10 = [
  [m(1), 0, t()],
  [0, 0, 0],
  [l(0), 0, 0],
];

// const t10 = testBoard(grid10);
// badTest(10, t10.points, 1);

// const grid11 = [
//   [m(1), 0, l(3)],
//   [0, 0, 0],
//   [t(), 0, 0],
// ];

// const t11 = testBoard(grid11);
// badTest(11, t11.points, 1);

// const grid12 = [
//   [0, 0, 0, 0, 0],
//   [0, m(1), 0, l(3), 0],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, t(), 0, 0, 0],
// ];

// const t12 = testBoard(grid12);
// badTest(12, t12.points, 1);

// const grid13 = [
//   [0, m(1), 0, 0, m(0)],
//   [0, 0, 0, 0, 0],
//   [0, m(0), 0, l(3), 0],
//   [0, m(1), 0, 0, m(1)],
//   [0, t(), 0, 0, 0],
// ];
// const t13 = testBoard(grid13);

// //////////////////
// // cell-blocker //
// //////////////////
// const grid14 = [
//   [0, m(1), 0, 0, m(0)],
//   [0, x(), 0, 0, 0],
//   [0, m(0), 0, l(3), 0],
//   [0, m(1), 0, 0, m(1)],
//   [0, t(), 0, 0, 0],
// ];

// const t14 = testBoard(grid14);
// badTest(14, t14.points, 1);
// badTest(14, t14.tokens.length, 8);
// badTest(14, t14.allTokensAreVisited(), true);

// const grid15 = [
//   [m(0), 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, t(), 0, l(3), 0],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
// ];

// const t15 = testBoard(grid15);
// badTest(15, t15.allTokensAreVisited(), false);

// const grid16 = [
//   [x(), 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, t(), 0, l(3), 0],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
// ];

// const t16 = testBoard(grid16);
// badTest(16, t16.allTokensAreVisited(), true);

// ////////////////////
// // beam splitter  //
// ////////////////////
// const grid17 = [
//   [0, 0, t(), 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, t(), b(), 0, l(3)],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
// ];

// const t17 = testBoard(grid17);
// badTest(17, t17.allTokensAreVisited(), true);
// badTest(17, t17.points, 2);

// const grid18 = [
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, t(), 0],
//   [0, 0, 0, 0, 0],
//   [t(), 0, 0, b(), l(3)],
//   [0, 0, 0, 0, 0],
// ];

// const t18 = testBoard(grid18);
// badTest(18, t18.allTokensAreVisited(), true);
// badTest(18, t18.points, 2);

// const grid19 = [
//   [m(1), 0, c(1), 0, m(0)],
//   [b(), 0, 0, m(), 0],
//   [b(), b(), t(), 0, x()],
//   [0, t(), 0, t(), 0],
//   [t(), 0, 0, 0, l(0)],
// ];

// const t19 = testBoard(grid19);
// badTest(19, t19.allTokensAreVisited(), true);
// badTest(19, t19.points, 4);

setLevelSelect();

document.querySelector('#initLaser').addEventListener('click', () => {
  if (activeBoard) {
    activeBoard.initLaser();
    // TODO START HERE add testing into this
    // testBoard(activeBoard);
    // badTest(
    //   null,
    //   activeBoard.points,
    //   activeBoard.tokens.filter(t => t.type === 'target')
    // );
    render(activeBoard);
  }
});
