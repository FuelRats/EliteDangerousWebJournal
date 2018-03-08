/* globals document, window, FileReader, setTimeout, edj_logparser, edj_gui */

var edj = {
  selDir: null,
  lastFile: null,
  lastLine: 0,
  checkFiles: function (evt) {
    edj.selDir = evt.target.files;
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
      var r2 = document.createRange();
      r2.selectNodeContents(t);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r2);
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

    var fr = new FileReader();
    fr.onload = function (file) {

      var lines = this.result.split('\n');
      var l = edj.lastLine;
      while (l < lines.length) {
        /*if (lines[l] == '') {
          l--;
          break;
        }*/
        if (edj.lastLine !== lines[l]) {
          edj_logparser.parseLogLine(lines[l]);
        }
        l++;
      }
      edj.lastLine = l;
      edj_gui.updateGui();
    };

    fr.readAsText(edj.lastFile, 'UTF-8');
    setTimeout(function () { edj.monitorChanges(); }, 1000);
  }
};

(function () {
  document.getElementById('logDirectory').addEventListener('change', edj.checkFiles, false);
})();