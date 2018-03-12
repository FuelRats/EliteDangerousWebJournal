/* globals document, edjdata */
const edjGui = {
  updateGui() {
    document.getElementById('cmdrname').innerText = `CMDR ${edjdata.player.cmdr.Commander}`;
    const playerPos = edjGui.get_cmdr_position();
    if (playerPos.length > 0) {
      document.getElementById('location').innerText = `in ${playerPos.join(', ')}`;
    } else {
      document.getElementById('location').innerText = 'at an unknown position';
    }
  },
  get_cmdr_position() {
    const items = [];
    if (edjdata.player.pos.starsystem !== null && edjdata.player.pos.starsystem !== '') {
      items.push(edjdata.player.pos.starsystem);
    }

    if (edjdata.player.pos.body !== null && edjdata.player.pos.body !== '') {
      items.push(edjdata.player.pos.body);
    }

    return items;
  },
};
