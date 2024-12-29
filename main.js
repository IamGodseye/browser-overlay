const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let serverProcess;

function startServer() {
    // Start the server as a separate process
    serverProcess = spawn('node', ['server.js'], {
        stdio: 'inherit'
    });

    serverProcess.on('error', (err) => {
        console.error('Failed to start server:', err);
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        title: 'Fanverz Overlay Controller'
    });

    // Wait a bit for the server to start
    setTimeout(() => {
        mainWindow.loadFile('public/gui.html');
    }, 1000);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    startServer();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('before-quit', () => {
    // Kill the server process when the app is closing
    if (serverProcess) {
        serverProcess.kill();
    }
});