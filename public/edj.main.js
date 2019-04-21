/* global edjGui */
'use strict'

const edjdata = {
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
      Manufactured: [],
    },
  },
  gamemode: null,
  cansynthesizelifesupport: false,
  canopyBreached: null,
  oxygenRemaining: null,
}

let positionInterval = null

/*
document.querySelector('.winpathButton').addEventListener('click', () => {
  edj.copyFilePath('#winpath')
})
*/

const getPlatform = async function getPlatform () {
  const result = await fetch(`/getPlatform?_=${new Date().getTime()}`).then((resp) => resp.json())
  return result
}

const _CAPIUpdateData = function _CAPIUpdateData (result) {
  if (edjdata.player.cmdr === null) {
    edjdata.player.cmdr = {
      Commander: result.commander.name,
      ...result.commander,
    }
  }

  // We don't see cargo, so we can't make that prediction.
  edjdata.cansynthesizelifesupport = null

  // edjdata.player.pos.StarSystem = result.lastSystem.name

  // Ignoring this for now, since it gives false positives if you travel in the same system after undocking
  // edjdata.player.pos.Body = result.lastStarport.name

  edjdata.canopyBreached = result.ship.cockpitBreached
  edjdata.oxygenRemaining = result.ship.oxygenRemaining

  edjGui.updateGui()
}

const getPlayerJournal = async function getPlayerJournal () {
  const result = await fetch(`/fetchJournal?_=${new Date().getTime()}`).then((resp) => resp.json())
  if (Boolean(result.error) && result.error) {
    return
  }

  edj.fileOnLoad(result.journal)
}

const getUpdatedPosition = async function getUpdatedPosition () {
  const result = await fetch(
    `/fetchPosition?_=${new Date().getTime()}`
  ).then((resp) => resp.json())
  if (Boolean(result.error) && result.error) {
    clearInterval(positionInterval)
    return
  }
  _CAPIUpdateData(result)
  await getPlayerJournal()
}

const positionUpdateInterval = 30000

const checkIsLoggedIn = async function checkIsLoggedIn () {
  const result = await fetch(
    `/fetchPosition?_=${new Date().getTime()}`
  ).then((resp) => resp.json())
  if (Boolean(result.error) && result.error) {
    return
  }
  edjdata.player.platform = await getPlatform()
  _CAPIUpdateData(result)

  await getPlayerJournal()

  positionInterval = setInterval(() => {
    getUpdatedPosition()
  }, positionUpdateInterval)
}

checkIsLoggedIn()
