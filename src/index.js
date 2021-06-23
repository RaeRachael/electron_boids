const { app, BrowserWindow } = require('electron')

function createWindow() {
  const window = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.loadFile("index.html");
  window.webContents.openDevTools();
}

app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});