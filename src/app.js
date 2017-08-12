const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const glob = require('glob')
const crypto = require('crypto')
const ipcMain = require('electron').ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
	  width: 800,
	  height: 600,
	  autoHideMenuBar: true,
  })

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)


  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

const getDirectories = function (src, callback) {
  glob(src + '/**/*.*', callback);
}

// Register ipc events
ipcMain.on('run-directory-scan', function(event, arg) {
  // When we receive a request to start scanning the directory
  getDirectories(arg, (err, result) => { // Run glob and get all files
    let hashes = [] // Make an array for storing all SHA-1 hashes
    let delay = false
    let interval
    result.forEach( file => { // Iterate through all files
      const contents = fs.readFileSync(file, 'utf8') // Read the file
      const algorithm = 'sha1' // Set our crypto algorithm to SHA-1
      , shasum = crypto.createHash(algorithm) // Create a crypto instance with our algorithm
      shasum.update(contents) // Hash our file's contents
      hashes.push({ // Add the hash to the array
        path: file,
        hash: shasum.digest('hex')
      })
    })
    let progress = 0 // Make a variable for the progress to send to the client
    let incAmount = 100 / Math.pow(result.length, 2) // Find the amount to increment every time
    let conflicts = [] // Make an array for file matches
    hashes.forEach(item => { // Iterate through all our files' hashes
      // item = our first item to compare
      hashes.forEach(compare => { // Iterate through all hashes again, to try to match them to the first item.
        if(item.hash == compare.hash) { // See if the hashes match
          if(item.path == compare.path) {}else { // Make sure they aren't the same file
            conflicts.push({ // We found a conflict! Let's add it to the array
              item,
              compare
            })
          }
        }
        progress += incAmount; // Incremenet the progress bar
        win.send('progress-update', progress) // Update the client with the progress
      })
    })
    conflicts.forEach(item => { // Iterate through all conflicts
      conflicts.forEach((compare, i) => { // Iterate through all conflicts again
        if(item.item == compare.compare) // Check if they have opposite equal values
          conflicts.splice(i, 1) // Remove that item from the array
        else if(item.compare == compare.item) // Same as above, reversed
          conflicts.splice(i, 1) // Remove that item from the array
      })
    })
    event.sender.send('directory-scan', conflicts) // Send the finished array to the client
  })
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
