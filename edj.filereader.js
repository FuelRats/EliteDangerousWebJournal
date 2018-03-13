/* globals document, window, FileReader, setTimeout, edjLogparser, edjGui */
edj = {
  selDir: null,
  lastFile: null,
  lastLine: 0,
  checkFiles(evt) {
    edj.selDir = evt.target.files;
    edj.monitorChanges();
  },
  copyFilePath(selector) {
    const t = document.querySelector(selector);
    t.contenteditable = true;
    if (document.body.createTextRange) {
      const r = document.body.createTextRange();
      r.moveToElementText(t);
      r.select();
      r.execCommand('Copy');
      r.moveToElementText(null);
      r.select();
    } else if (window.getSelection && document.createRange) {
      const r2 = document.createRange();
      r2.selectNodeContents(t);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r2);
      document.execCommand('copy');
    }
    t.contenteditable = false;
  },
  monitorChanges() {
    const _files = document.querySelector('#logDirectory').files;
    const _fileCount = _files.length;

    let i = 0;
    while (i < _fileCount) {
      if (edj.lastFile === null || _files[i].lastModified > edj.lastFile.lastModified) {
        edj.lastFile = _files[i];
      }

      i++;
    }

    const fr = new FileReader();
    fr.onload = edj.fileOnLoad;

    fr.readAsText(edj.lastFile, 'UTF-8');
    setTimeout(() => { edj.monitorChanges(); }, 1000);
  },
  fileOnLoad() {
    const lines = this.result.split('\n');
    let l = edj.lastLine;
    while (l < lines.length) {
      /*if (lines[l] == '') {
        l--;
        break;
      }*/
      if (edj.lastLine !== lines[l]) {
        edjLogparser.parseLogLine(lines[l]);
      }
      l++;
    }
    edj.lastLine = l;
    edjGui.updateGui();
  },
  isJson(line) {
    try {
      JSON.parse(line);
    } catch (e) {
      return false;
    }

    return true;
  },
};

(function doneLoading() {
  document.getElementById('logDirectory').addEventListener('change', edj.checkFiles, false);
}());
