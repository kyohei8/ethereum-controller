const electron = require('electron')
const ipcMain = electron.ipcMain;
const exec=require("child_process").exec;
const spawn = require("child_process").spawn;
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'renderer', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

var child = null;

// 非同期
ipcMain.on('start', function(event, arg) {
  const {
    dir,
    networkId,
    noDiscover,
    port
  } = arg;

  const gethOption = [];
  gethOption.push('--datadir', './');

  if(networkId){
    gethOption.push('--networkid', networkId);
  }

  if(port){
    gethOption.push('--port', port);
  }

  if(noDiscover) {
    gethOption.push('--nodiscover');
  }

  child = spawn("geth", gethOption.concat([
    'console',  '2>>', '2017-03-07.log'
  ]), {
    cwd: dir
  });

  event.sender.send('success', 'aaaa');

  child.stdout.on('data', function (data) {
    event.sender.send('reply', data.toString());
  });

  child.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  child.stdin.setEncoding('utf-8');
  child.stdout.pipe(process.stdout);

  child.stdin.write("eth.gasPrice\n");

  // child.stdin.end();

  /*
  function(error, stdout, stderr){
    console.log('start!!');
    console.log(geth);
    event.sender.send('asynchronous-reply', 'geth start =>' + stdout);

    geth.on('message', (m) => {
      console.log('PARENT got message:', m);
    });
    geth.send('eth.gasPrice');
  });
  */
});

ipcMain.on('send', function(event, arg) {
  if(!child){
    return;
  }
  child.stdin.write(arg + "\n");

});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
