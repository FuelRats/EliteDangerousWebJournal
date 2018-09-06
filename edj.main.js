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
      StarSystem: null,
      Docked: true,
      Body: null,
      BodyType: null,
      DistanceToArrival: 0,
      StarPos: null,
      Scoopable: null,
      Supercruise: null,
    },
    fuel: {
      current: null,
      max: null,
    },
    materials: {
      Raw: [],
      Manufactured: []
    }
  },
  gamemode: null,
  cansynthesizelifesupport: false
};

if (edjApp.is_electron) {
  document.querySelector('.platformHelp').style.display = 'none';
  document.querySelector('.directorySelection').style.display = 'none';
  document.querySelector('.htmlHeader').style.display = 'none';
} else {
  document.querySelector('.winpathButton').addEventListener('click', () => {
    edj.copyFilePath('#winpath');
  });
}
