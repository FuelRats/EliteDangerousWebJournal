/* globals document, edjdata */
'use strict'

const edjGui = {
  updateGui () {
    edjGui.writeCmdrPosition()
    edjGui.canSynthesizeLifesupport()
    edjGui.updateFuelLevel()
    edjGui.ircFriendlyText()
  },
  writeCmdrPosition () {
    if (edjdata.player.cmdr !== null) {
      document.getElementById('cmdrname').innerText = `CMDR ${
        edjdata.player.cmdr.Commander
      }`
    }
    const playerPos = edjGui.getCmdrPosition()
    if (playerPos.length > 0) {
      document.getElementById(
        'location'
      ).innerText = `in ${playerPos.join(', ')}`
    } else {
      document.getElementById('location').innerText = 'at an unknown position'
    }
  },
  canSynthesizeLifesupport () {
    const strings = []
    strings.push(edjdata.cansynthesizelifesupport
      ? 'You can synthesize at least one full life-support refill'
      : 'You do not have enough iron or nickel to manufacture a full life-support refill')

    if (edjdata.canopyBreached) {
      strings.push('Canopy is breached!')
    } else {
      strings.push('Canopy is not breached!')
    }
    if (edjdata.oxygenRemaining !== null) {
      strings.push(
        `Oxygen remaining: ${
          edjdata.oxygenRemaining / 1000
        } seconds`
      )
    }

    document.getElementById('canSynthOxygen').innerHTML = strings.join(
      '<br />'
    )
  },
  updateFuelLevel () {
    let fuelWidth = (edjdata.player.fuel.current / edjdata.player.fuel.max) * 100
    if (fuelWidth > 100) {
      fuelWidth = 100
    }

    document.getElementById('fuelBar').style.width = `${fuelWidth}%`
  },
  getCmdrPosition () {
    const items = []
    if (
      edjdata.player.pos.StarSystem !== null
      && edjdata.player.pos.StarSystem !== ''
    ) {
      items.push(edjdata.player.pos.StarSystem)
    }

    if (
      edjdata.player.pos.Body !== null
      && edjdata.player.pos.Body !== ''
    ) {
      items.push(edjdata.player.pos.Body)
    }

    return items
  },
  ircFriendlyText () {
    const strings = []
    if (edjdata.cansynthesizelifesupport) {
      strings.push('Synth O²: Yes')
    }

    if (edjdata.canopyBreached) {
      strings.push('Canopy: Breached')
    }
    if (edjdata.oxygenRemaining !== null) {
      strings.push(
        `Oxygen remaining: ${
          edjdata.oxygenRemaining / 1000
        } seconds`
      )
    }

    document.querySelector('.irc-friendly').innerText = `CMDR ${edjdata.player.cmdr.Commander} [${edjdata.player.platform}] in ${this.getCmdrPosition().join(', ')}, ${strings.join(' ')}`
  },
}
