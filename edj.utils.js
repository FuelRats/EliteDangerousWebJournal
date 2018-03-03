function isJson(line) {
  try { JSON.parse(line); }
  catch (e) { return false; }
  return true;
}

function updateGui() {
  document.getElementById('cmdrname').innerText = 'CMDR ' + player.cmdr;
  document.getElementById('location').innerText = 'at ' + player.pos;
}