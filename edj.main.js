if (typeof process !== 'undefined') {
  console.log(process);
}

edjApp = {
  is_electron: typeof process !== 'undefined',
  is_windows: typeof process !== 'undefined' && process.platform === 'win32',
};

edjdata = {
  player: {
    cmdr: null,
    rank: {
      cqc: {
        rank: 0,
        progress: 0,
      },
      combat: {
        rank: 0,
        progress: 0,
      },
      empire: {
        rank: 0,
        progress: 0,
      },
      explore: {
        rank: 0,
        progress: 0,
      },
      federation: {
        rank: 0,
        progress: 0,
      },
      trade: {
        rank: 0,
        progress: 0,
      },
    },
    pos: {
      starsystem: null,
      docked: true,
      body: null,
      bodytype: null,
      starposition: null,
      scoopable: null,
      supercruise: null,
    },
    fuel: {
      current: null,
      max: null,
    },
  },
  gamemode: null,
};

if (edjApp.is_electron) {
  document.querySelector('.platformHelp').style.display = 'none';
  document.querySelector('.directorySelection').style.display = 'none';
}
