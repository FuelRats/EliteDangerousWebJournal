/* exported isJson, ed_scoopables */

function isJson(line) {
  try {
    JSON.parse(line);
  }
  catch (e) {
    return false;
  }

  return true;
}

const edScoopables = [
  'K', 'G', 'B', 'F', 'O', 'A', 'M',
];
