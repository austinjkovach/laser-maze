/*

TUTORIAL LEVELS

  click the button
  hit the target
  click to rotate
  drag to place
  locked pieces
  no-rotate pieces

  checkpoint
  double-mirror
  beam-splitter
  cell-blocker
*/

const levels = [
  {
    grid: [
      [0, 0, 0],
      [0, 0, 0],
      [0, l(), 0],
    ],
    targetPoints: 0,
    description: 'Click the button to activate the laser',
  },
  {
    grid: [
      [0, l(2), 0],
      [0, 0, 0],
      [0, t(), 0],
    ],
    targetPoints: 1,
    description: 'Just click the fucking button',
  },
  {
    grid: [
      [0, t(2), 0],
      [0, l(2, true), 0],
      [0, 0, 0],
    ],
    tokenBank: [],
    targetPoints: 1,
    description: 'Look, now you have to rotate it',
  },
  {
    grid: [
      [0, t(2), 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    tokenBank: [l(0, true, true)],
    targetPoints: 1,
    description: 'Drag a token from the bank onto the board',
  },
  {
    grid: [
      [0, t(2), 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    tokenBank: [l(0, true, true)],
    targetPoints: 1,
    description: 'the same thing again, plz',
  },
];
