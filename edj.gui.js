var edj_gui = {
  updateGui: function () {
    document.getElementById('cmdrname').innerText = 'CMDR ' + edjdata.player.cmdr;
    document.getElementById('location').innerText = 'at ' + edjdata.player.pos;
  }
};