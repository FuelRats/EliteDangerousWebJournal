var edj = {
  selDir: null,
  lastFile: null,
  lastFileSize: 0,
  lastByte: 0,
  byteSize: 1024 * 1024,
  lastLine: 0,
  checkFiles: function (evt) {
    edj.selDir = evt.target.files;
    console.log(edj.selDir);
    edj.monitorChanges();
  },
  copyFilePath: function (selector) {
    var t = document.querySelector(selector);
    t.contenteditable = true;
    if (document.body.createTextRange) {
      var r = document.body.createTextRange();
      r.moveToElementText(t);
      r.select();
      r.execCommand("Copy");
      r.moveToElementText(null);
      r.select();
    } else if (window.getSelection && document.createRange) {
      var r = document.createRange();
      r.selectNodeContents(t);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
      document.execCommand('copy');
    }
    t.contenteditable = false;
  },
  monitorChanges: function () {
    var _files = document.querySelector('#logDirectory').files;
    var _fileCount = _files.length;

    var i = 0;
    while (i < _fileCount) {
      if (undefined == edj.lastFile || _files[i].lastModified > edj.lastFile.lastModified) {
        edj.lastFile = _files[i];
      }

      i++;
    }

    edj.lastFileSize = edj.lastFile.size;

    var fr = new FileReader();
    fr.onload = (function (file) {

      var lines = this.result.split('\n');
      var l = edj.lastLine;
      while (l < lines.length) {
        if (lines[l] == '') {
          l--;
          break;
        }
        edj.parseLogLine(lines[l]);
        l++;
      }
      edj.lastLine = l;
      edj_gui.updateGui();
      console.log(edj.lastLine);
    });

    fr.readAsText(edj.lastFile, 'UTF-8');
    setTimeout(function () { edj.monitorChanges(); }, 1000);
  },
  parseLogLine: function (line) {
    if (isJson(line)) {
      var logItem = JSON.parse(line);
      switch (logItem.event) {
        case 'LoadGame':
          edjdata.player.cmdr = logItem.Commander;
          break;
        case 'Location':
          edjdata.player.pos = logItem.StarSystem + (logItem.StationName != undefined ? ', ' + logItem.StationName : '');
          break;
        case 'FSDJump':
          edjdata.player.pos = logItem.StarSystem;
          break;
        case 'Docked':
          edjdata.player.pos = logItem.StarSystem + (logItem.StationName != undefined ? ', ' + logItem.StationName : '');
          break;
      }
    }
  }
};



(function () {
  document.getElementById('logDirectory').addEventListener('change', edj.checkFiles, false);
})();