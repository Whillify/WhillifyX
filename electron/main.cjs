const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const AuthClient = require('./services/auth.cjs');
const config = require('./config/config.cjs');

let authClient;
let mainWindow;
let storeModule;

// Динамический импорт ESM модуля
import('./services/store.mjs').then(module => {
  storeModule = module;
});

function setAuthResult(result, profileData) {
  if (mainWindow) {
    mainWindow.webContents.send('auth-result', result, profileData);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    minWidth: 800,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  console.log('App Title:', process.env.VITE_APP_TITLE);

  // Инициализация AuthClient
  authClient = new AuthClient(config.oauth, setAuthResult);

  // Обработчик события для открытия окна авторизации
  ipcMain.on('open-auth-window', () => {
    authClient.openBrowser();
  });

  // Новый обработчик для сохранения данных пользователя
  ipcMain.on('save-user-data', (event, userData) => {
    if (storeModule) {
      storeModule.setUser(userData);
    }
  });

  // Обработчик для получения сохраненного пользователя
  ipcMain.handle('get-stored-user', async () => {
    if (storeModule) {
      return storeModule.getUser();
    }
    return null;
  });

  // Обработчик для выхода пользователя
  ipcMain.on('logout', () => {
    if (storeModule) {
      storeModule.clearUser();
    }
    mainWindow.webContents.send('user-logged-out');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (authClient) {
      authClient.stopListening();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});