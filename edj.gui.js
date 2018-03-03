var edj_gui = {
  updateGui: function () {
    document.getElementById('cmdrname').innerText = 'CMDR ' + edjdata.player.cmdr.Commander;
    var player_pos = edj_gui.get_cmdr_position();
    if (player_pos.length > 0) {
      document.getElementById('location').innerText = 'in ' + player_pos.join(', ');
    } else {
      document.getElementById('location').innerText = 'at an unknown position';
    }
  },
  get_cmdr_position: function () {
    var items = [];
    if (null !== edjdata.player.pos.starsystem && '' !== edjdata.player.pos.starsystem) {
      items.push(edjdata.player.pos.starsystem);
    }

    if (null !== edjdata.player.pos.body && '' !== edjdata.player.pos.body) {
      items.push(edjdata.player.pos.body);
    }

    return items;
  }
};