function isJson(line) {
  try { JSON.parse(line); }
  catch (e) { return false; }
  return true;
}