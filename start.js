const {
  app,
  autoUpdater,
  BrowserWindow,
  dialog,
} = require('electron');

const server = 'https://hazel-server-kgztewyahi.now.sh/';
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

autoUpdater.setFeedURL(feed);

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

autoUpdater.checkForUpdates();

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  };

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall();
  });
});

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application');
  console.error(message);
});

app.on('ready', createWindow);

app.on('before-quit', () => {
  win.close();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});