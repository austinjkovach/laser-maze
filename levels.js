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
      [0, t(2, true, true), 0],
      [0, 0, 0],
      [0, l(0, true, true), 0],
    ],
    targetPoints: 1,
    description:
      "Click the button to fire the laser! Shoot the laser at the target's light to activate it",
  },
  {
    grid: [
      [0, 0, 0],
      [l(1, true, true), 0, t(2, true, true)],
      [0, 0, 0],
    ],
    tokenBank: [],
    targetPoints: 1,
    description:
      'If the target is not facing the correct direction, the laser will not activate it. You can click on a piece to rotate it',
  },
  {
    grid: [
      [0, 0, 0],
      [l(0, true, true), 0, t(3, false, true)],
      [0, 0, 0],
    ],
    tokenBank: [],
    targetPoints: 1,
    description: 'Some pieces cannot be rotated.',
  },
  {
    grid: [
      [0, t(2, true, true), 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    tokenBank: [l(0, true, true)],
    targetPoints: 1,
    description: 'Drag a token from the bank onto the board',
  },
  {
    grid: [
      [0, t(2, true, false), 0],
      [0, 0, 0],
      [l(0, true, true), 0, 0],
    ],
    tokenBank: [],
    targetPoints: 1,
    description: 'Some pieces cannot be moved',
  },
  {
    grid: [
      [0, t(2, false, false), 0, 0, 0],
      [0, c(1, true, false), 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, c(0, true, false), 0, 0, 0],
      [0, l(0), 0, 0, 0],
    ],
    tokenBank: [],
    targetPoints: 1,
    description:
      'The laser must touch every token in order to beat the level. Checkpoints allow the laser to pass through only from a specific angle',
  },
  {
    grid: [
      [0, 0, 0, 0, 0],
      [t(1), 0, m(1, true, false), 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, l(0, true, false), 0, 0],
    ],
    tokenBank: [],
    targetPoints: 1,
    description:
      'Mirrors reflect the laser at a 90-degree angle based on their rotation',
  },
  {
    grid: [
      [0, m(1), 0, 0, t(3)],
      [0, 0, 0, 0, 0],
      [0, b(0, true), 0, 0, t(3)],
      [0, 0, 0, 0, 0],
      [0, l(0), 0, 0, 0],
    ],
    tokenBank: [],
    targetPoints: 2,
    description:
      'Beam Splitters split the laser in two, allowing it to pass through as well as reflect at an angle',
  },
  {
    grid: [
      [0, 0, 0, 0, 0],
      [x(), 0, 0, 0, 0],
      [c(), 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [m(0), x(), t(3), 0, 0],
    ],
    tokenBank: [l(0, true, true)],
    targetPoints: 1,
    description:
      'Cell Blockers: lasers can pass through, but other tokens cannot. Cell Blockers do not need to be touched in order to beat a level',
  },
  {
    grid: [
      [0, 0, 0, 0, 0],
      [m(1), 0, 0, m(1, true), 0],
      [c(), 0, 0, m(1, true), 0],
      [0, 0, 0, 0, 0],
      [m(), x(), t(3), 0, 0],
    ],
    tokenBank: [l(0, true, true), t(0, true, true)],
    targetPoints: 1,
    description:
      'Targets can also be used as mirrors. You do not need to activate all targets.',
  },
];
