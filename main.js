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

// if(hot){
// require('electron-reload')(__dirname, {
  // electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
// });
// }

var gethProcess = null;

// GC対象となるのでmainWindowはグローバル参照である必要がある、
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'renderer', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // ウィンドウが閉じられたとき
  mainWindow.on('closed', function () {
    if(gethProcess){
      // gethをkill
      gethProcess.stdin.end();
      gethProcess.kill();
      gethProcess = null;
    }

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


// 非同期
ipcMain.on('start', function(event, arg) {
  // console.log(arg);
  const {
    dir,
    networkId,
    noDiscover,
    port,
    dev,
    rpc
  } = arg;

  const gethOption = [];
  gethOption.push('--datadir', './');

  if(networkId){
    gethOption.push('--networkid', networkId);
  }

  if(port){
    gethOption.push('--port', port);
  }

  if(dev){
    gethOption.push('--dev');
  }

  if(rpc){
    gethOption.push('--rpc');
    // --rpcaddr
    // --rpcport
  }

  if(noDiscover) {
    gethOption.push('--nodiscover');
  }

  gethProcess = spawn("geth", gethOption.concat([
    'console'
    // '2>>',
    // '2017-03-07.log'
  ]), {
    cwd: dir
  });

  event.sender.send('success', 'aaaa');

  gethProcess.stdout.on('data', function (data) {
    // ログをrenderに送る
    event.sender.send('reply', data.toString());
  });

  gethProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  gethProcess.stdin.setEncoding('utf-8');
  gethProcess.stdout.pipe(process.stdout);

  gethProcess.stdin.write("eth.gasPrice\n");
});

ipcMain.on('disconnect', function(event, arg) {
  gethProcess.stdin.write("exit\n");
  gethProcess.stdin.end();
  gethProcess.kill();
  gethProcess = null;
  event.sender.send('disconnected');
});

// renderから送られてきたコマンドを実行
ipcMain.on('send', function(event, arg) {
  if(!gethProcess){
    return;
  }
  gethProcess.stdin.write(arg + "\n");
});

// マイニングスタート
ipcMain.on('minerStart', function(event, arg) {
  if(!gethProcess){
    return;
  }
  gethProcess.stdin.write("miner.start()\n");
});

// マイニングストップ
ipcMain.on('minerStop', function(event, arg) {
  if(!gethProcess){
    return;
  }
  gethProcess.stdin.write("miner.stop()\n");
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
