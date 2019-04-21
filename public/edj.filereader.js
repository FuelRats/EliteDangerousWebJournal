/* globals document, window, FileReader, setTimeout, edjLogparser, edjGui, require */
'use strict'

const edj = {
  profileDir: null,
  selDir: null,
  lastFile: null,
  lastLine: 0,
  currentTail: null,
  checkFiles (evt) {
    edj.selDir = evt.target.files
    edj.monitorChanges(edj.selDir)
  },
  copyFilePath (selector) {
    const target = document.querySelector(selector)
    target.contenteditable = true
    if (document.body.createTextRange) {
      const range = document.body.createTextRange()
      range.moveToElementText(target)
      range.select()
      range.execCommand('Copy')
      range.moveToElementText(null)
      range.select()
    } else if (window.getSelection && document.createRange) {
      const r2 = document.createRange()
      r2.selectNodeContents(target)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(r2)
      document.execCommand('copy')
    }
    target.contenteditable = false
  },
  monitorChanges (_selDir) {
    if (_selDir === null) {
      return
    }
    if (_selDir.toString() === '[object FileList]') {
      const _files = _selDir
      const _fileCount = _files.length
      let ix = 0
      while (ix < _fileCount) {
        if (_files[ix].name.match(/Journal\.\d+\.\d+\.log/gui)) {
          if (edj.lastFile === null || _files[ix].lastModified > edj.lastFile.lastModified) {
            edj.lastFile = _files[ix]
          }
        }
        ix += 1
      }
      const fr = new FileReader()
      fr.onload = (res) => {
        edj.fileOnLoad(res.target.result)
      }
      fr.readAsText(edj.lastFile, 'UTF-8')
      setTimeout(() => {
        edj.monitorChanges(_selDir)
      }, 1000)
    } else {
      const _files = _selDir
      const _fileCount = _files.length
      let ix = 0
      while (ix < _fileCount) {
        if (_files[ix].match(/Journal\.\d+\.\d+\.log/gui)) {
          if (edj.lastFile === null || _files[ix] !== edj.lastFile) {
            edj.lastFile = _files[ix]
          }
        }
        ix += 1
      }

      const fs = require('fs')
      fs.readFile(`${edj.profileDir}${edj.lastFile}`, {
        encoding: 'UTF-8',
      }, (err, str) => {
        if (err !== null) {
          console.log(err)
        }
        if (typeof str !== 'undefined') {
          edj.fileOnLoad(str)
        }
      })

      setTimeout(async () => {
        const tailFiles = await edj.loadLogFiles()
        edj.monitorChanges(tailFiles)
      }, 1000)
    }
  },
  fileOnLoad (fileContent) {
    const lines = fileContent.split('\n')
    let lineNumber = edj.lastLine
    while (lineNumber < lines.length) {
      if (edj.lastLine !== lines[lineNumber]) {
        edjLogparser.parseLogLine(lines[lineNumber])
      }
      lineNumber += 1
    }
    edj.lastLine = lineNumber
    edjGui.updateGui()
  },
  isJson (line) {
    try {
      JSON.parse(line)
    } catch (ex) {
      return false
    }

    return true
  },
  loadLogFiles () {
    return edj.selDir
  },
  tailLogFile (fileName) {
    if (fileName === 'null') {
      return
    }
    if (fileName === edj.currentTail) {
      return
    }

    const {
      Tail,
    } = require('tail')
    const logTail = new Tail(fileName)

    logTail.on('line', (line) => {
      edjLogparser.parseLogLine(line)
    })

    logTail.on('error', (error) => {
      console.error(error)
    })
    edj.currentTail = fileName
  },
}

/*
(async function doneLoading () {
  document.getElementById('logDirectory').addEventListener('change', edj.checkFiles, false)
  if (typeof process !== 'undefined' && edjApp.is_electron) {
    const files = await edj.loadLogFiles()
    edj.monitorChanges(files)
  }
})()
*/
