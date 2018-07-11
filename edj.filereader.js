/* globals document, window, FileReader, setTimeout, edjLogparser, edjGui */
edj = {
  profileDir: null,
  selDir: null,
  lastFile: null,
  lastLine: 0,
  currentTail: null,
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
    if (edj.selDir.toString() === '[object FileList]') {
      const _files = edj.selDir;
      const _fileCount = _files.length;
      let i = 0;
      while (i < _fileCount) {
        if (_files[i].name.match(/Journal\.\d+\.\d+\.log/gi)) {
          if (edj.lastFile === null || _files[i].lastModified > edj.lastFile.lastModified) {
            edj.lastFile = _files[i];
          }
        }
        i++;
      }
      const fr = new FileReader();
      fr.onload = (res) => {
        edj.fileOnLoad(res.target.result);
      };
      fr.readAsText(edj.lastFile, 'UTF-8');
      setTimeout(() => { edj.monitorChanges(); }, 1000);
    } else {
      const _files = edj.selDir;
      const _fileCount = _files.length;
      let i = 0;
      while (i < _fileCount) {
        if (_files[i].match(/Journal\.\d+\.\d+\.log/gi)) {
          if (edj.lastFile === null || _files[i] !== edj.lastFile) {
            edj.lastFile = _files[i];
          }
        }
        i++;
      }
      if (typeof process !== 'undefined' && edjApp.is_electron) {
        if(edj.lastFile !== null) {

          // Read the contents for an existing file, then tail it.
          const fs = require('fs');
          fs.readFile(`${edj.profileDir}${edj.lastFile}`, { encoding: 'UTF-8' }, (err, str) => {
            if (err !== null) {
            }
            if (typeof str !== 'undefined') {
              edj.fileOnLoad(str);
            }
          });

          edj.tailLogFile(`${edj.profileDir}${edj.lastFile}`);
        }
      } else {
        const fs = require('fs');
        fs.readFile(`${edj.profileDir}${edj.lastFile}`, { encoding: 'UTF-8' }, (err, str) => {
          if (err !== null) {
            console.log(err);
          }
          if (typeof str !== 'undefined') {
            edj.fileOnLoad(str);
          }
        });
      }
      setTimeout(() => { edj.loadLogFiles(); }, 1000);
      setTimeout(() => { edj.monitorChanges(); }, 1000);
    }
  },
  fileOnLoad(fileContent) {
    const lines = fileContent.split('\n');
    let l = edj.lastLine;
    while (l < lines.length) {
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
  loadLogFiles() {
    if (typeof process !== 'undefined' && edjApp.is_electron) {

      const fs = require('fs');
      if (edjApp.is_windows) {
        const userProfile = (typeof process.env.HOME !== 'undefined' ? process.env.HOME : process.env.USERPROFILE);
        const journalFolder = `${userProfile}\\Saved Games\\Frontier Developments\\Elite Dangerous\\`;
        edj.profileDir = journalFolder;
        fs.readdir(journalFolder, (err, files) => {
          edj.selDir = files;
        });
      }
    }
  },
  tailLogFile(fileName) {
    if(fileName === 'null')
      return;
    if(fileName == edj.currentTail) {
      return;
    }
    
    const Tail = require('tail').Tail;
    const logTail = new Tail(fileName);

    logTail.on('line', line => {
      edjLogparser.parseLogLine(line);
    });

    logTail.on('error', error => { console.error(error);});
    edj.currentTail = fileName;
  }
};

(function doneLoading() {
  document.getElementById('logDirectory').addEventListener('change', edj.checkFiles, false);
  if (typeof process !== 'undefined' && edjApp.is_electron) {
    edj.loadLogFiles();
    setTimeout(() => { edj.monitorChanges(); }, 500);
  }
}());
