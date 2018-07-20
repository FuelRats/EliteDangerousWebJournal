const {
  app,
  autoUpdater,
  BrowserWindow,
} = require('electron');

const server = 'https://hazel-server-kgztewyahi.now.sh/';
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

autoUpdater.setFeedURL(feed)

const path = require('path');
const url = require('url');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    alwaysOnTop: true,
  });
  win.loadURL(url.format({
    nodeIntegration: false,
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  win.toggleDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('before-quit', () => {
  win.close();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});