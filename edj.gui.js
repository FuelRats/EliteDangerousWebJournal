/* globals document, edjdata */
const edjGui = {
  updateGui() {
    edjGui.write_cmdr_position();
    edjGui.can_synthesize_lifesupport();
    edjGui.update_fuel_level();
  },
  write_cmdr_position() {
    document.getElementById('cmdrname').innerText = `CMDR ${edjdata.player.cmdr.Commander}`;
    const playerPos = edjGui.get_cmdr_position();
    if (playerPos.length > 0) {
      document.getElementById('location').innerText = `in ${playerPos.join(', ')}`;
    } else {
      document.getElementById('location').innerText = 'at an unknown position';
    }
  },
  can_synthesize_lifesupport() {
    document.getElementById('canSynthOxygen').innerHTML = 
    (edjdata.cansynthesizelifesupport ? 
      'You can synthesize at least one full life-support refill' : 
      'You do not have enough iron or nickel to manufacture a full life-support refill'
    );
  },
  update_fuel_level() {
    document.getElementById('fuelBar').style.width = Math.round(edjdata.player.fuel.current / edjdata.player.fuel.max) * 100 + '%';
  },
  get_cmdr_position() {
    const items = [];
    if (edjdata.player.pos.StarSystem !== null && edjdata.player.pos.StarSystem !== '') {
      items.push(edjdata.player.pos.StarSystem);
    }

    if (edjdata.player.pos.Body !== null && edjdata.player.pos.Body !== '') {
      items.push(edjdata.player.pos.Body);
    }

    return items;
  },
};
