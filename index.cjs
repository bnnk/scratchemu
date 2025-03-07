var optparse = require("nomnom").option("srom", {
    abbr: "-r",
    help: "ROM to run.",
    metavar: "romfile",
    required: true
}).parse()
const {app, BrowserWindow, Menu, MenuItem} = require('electron')
const path = require('path')
const {loadAsync} = require("./core.cjs")
const extract = require('extract-zip')
const dialog = require("dialog-node")
const { existsSync } = require("fs")
// Set options as a parameter, environment variable, or rc file.

function createWindow () {
  // Create the browser window.
  // and load the index.html of the app.
  loadAsync(optparse.srom).then(([temp, meta]) => {
    extract(optparse.srom, {dir: temp}).then(() => {
        lines = [
            `Name: ${meta.name}`,
            `Author: ${meta.author}`,
            `Version: ${meta.version}`
        ].join("\n")
        console.log(lines)
        title = "ScratchEMU - '" + meta.name + "'"
        const mainWindow = new BrowserWindow({
            width: 1280,
            height: 800,
            webPreferences: {
                preload: path.join(__dirname, "preloaderscratch.cjs"),
                contextIsolation: false
            },
            title
        })
        var meno = new Menu()
        meno.append(new MenuItem({
          label: "Take Screenshot",
          click(){
            mainWindow.webContents.mainFrame.executeJavaScript("preload()")
          }
        }))
        mainWindow.setMenu(meno)
        dialog.info(lines, "About ROM", 0, 
            function(code, retVal, stderr){});
        mainWindow.loadURL(`file://${path.join(temp, 'index.html')}`)
        mainWindow.on('page-title-updated', function(e) {
            e.preventDefault()
        });
        if(existsSync(path.join(temp, 'icon.png'))){
            mainWindow.setIcon(path.join(temp, 'icon.png'))
        }
        
    })
  })

  // Open the DevTools.
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.