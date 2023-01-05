const levels = [
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
    description: '',
  },
  {
    grid: [
      [0, t(2), 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    tokenBank: [l(0, true, true)],
    targetPoints: 1,
    description: 'Use the token bank',
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
