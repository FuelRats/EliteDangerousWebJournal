/* global edjGui */
'use strict';

// eslint-disable-next-line no-var
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var windowIsActive = true;
window.addEventListener('blur', function setWindowAsBlurred() {
  windowIsActive = false;
});
window.addEventListener('focus', function setWindowAsFocused() {
  windowIsActive = true;
});
const isWindowActive = function isWindowActive() {
  const isHidden = document.visibilityState === 'hidden';
  return isHidden || windowIsActive;
};
const edjdata = {
  player: {
    cmdr: null,
    rank: {
      cqc: {
        rank: 0,
        progress: 0
      },
      combat: {
        rank: 0,
        progress: 0
      },
      empire: {
        rank: 0,
        progress: 0
      },
      explore: {
        rank: 0,
        progress: 0
      },
      federation: {
        rank: 0,
        progress: 0
      },
      trade: {
        rank: 0,
        progress: 0
      }
    },
    pos: {
      StarSystem: null,
      Docked: true,
      Body: null,
      BodyType: null,
      StarPos: null,
      Scoopable: null,
      Supercruise: null
    },
    fuel: {
      current: null,
      max: null
    },
    materials: {
      Raw: [],
      Manufactured: []
    }
  },
  gamemode: null,
  cansynthesizelifesupport: false,
  canopyBreached: null,
  oxygenRemaining: null
};
let positionInterval = null;
document.querySelector('.winpathButton').addEventListener('click', () => {
  edj.copyFilePath('#winpath');
});
const getPlatform = async function getPlatform() {
  const result = await fetch(`/getPlatform?_=${new Date().getTime()}`).then(resp => resp.json());
  return result;
};
const _CAPIUpdateData = function _CAPIUpdateData(result) {
  if (edjdata.player.cmdr === null) {
    edjdata.player.cmdr = _objectSpread({
      Commander: result.commander.name
    }, result.commander);
  }

  // We don't see cargo, so we can't make that prediction.
  // edjdata.cansynthesizelifesupport = null

  edjdata.player.pos.StarSystem = result.lastSystem.name;

  // Ignoring this for now, since it gives false positives if you travel in the same system after undocking
  // edjdata.player.pos.Body = result.lastStarport.name

  edjdata.canopyBreached = result.ship.cockpitBreached;
  edjdata.oxygenRemaining = result.ship.oxygenRemaining;
  edjGui.updateGui();
};
const getPlayerJournal = async function getPlayerJournal() {
  if (isWindowActive()) {
    const result = await fetch(`/fetchJournal?_=${new Date().getTime()}`).then(resp => resp.json());
    if (Boolean(result.error) && result.error) {
      return;
    }
    edj.fileOnLoad(result.journal.result);
  }
};
const getUpdatedPosition = async function getUpdatedPosition() {
  if (isWindowActive()) {
    const result = await fetch(`/fetchPosition?_=${new Date().getTime()}`).then(resp => resp.json());
    if (Boolean(result.error) && result.error) {
      clearInterval(positionInterval);
      return;
    }
    _CAPIUpdateData(result);
    await getPlayerJournal();
    console.log(new Date());
  }
};
const positionUpdateInterval = 30000;
const checkIsLoggedIn = async function checkIsLoggedIn() {
  if (isWindowActive()) {
    const result = await fetch(`/fetchPosition?_=${new Date().getTime()}`).then(resp => resp.json());
    if (Boolean(result.error) && result.error) {
      return;
    }
    edjdata.player.platform = await getPlatform();
    _CAPIUpdateData(result);
    await getPlayerJournal();
    positionInterval = setInterval(() => {
      getUpdatedPosition();
    }, positionUpdateInterval);
  }
};
checkIsLoggedIn();