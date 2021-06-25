const { app, BrowserWindow } = require('electron')

function createWindow() {
  const window = new BrowserWindow({
    height: 675,
    width: 1250,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.loadFile("index.html");
  // window.webContents.openDevTools();
}

app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
  });
});

app.on("window-all-closed", () => {
  app.quit();
});