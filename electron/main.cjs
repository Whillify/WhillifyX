const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const { spawn } = require('child_process');
const extract = require('extract-zip');
const AuthClient = require('./services/auth.cjs');
const config = require('./config/config.cjs');
const { Client } = require('minecraft-launcher-core');

let authClient;
let mainWindow;
let storeModule;
let authCompleted = false;

// Динамический импорт ESM модуля
import('./services/store.mjs').then(module => {
  storeModule = module;
});

const MODPACK_DIR = path.join(app.getPath('appData'), '.whillify');
const SETTINGS_FILE = path.join(MODPACK_DIR, 'config.json');

function setAuthResult(result, profileData) {
  if (mainWindow && !authCompleted) {
    authCompleted = true;
    if (result === true && profileData.avatar) {
      downloadAvatar(profileData.id, profileData.avatar)
        .then(avatarPath => {
          profileData.localAvatarPath = avatarPath;
          mainWindow.webContents.send('auth-result', result, profileData);
        })
        .catch(error => {
          console.error('Failed to download avatar:', error);
          mainWindow.webContents.send('auth-result', result, profileData);
        });
    } else {
      mainWindow.webContents.send('auth-result', result, profileData);
    }
  }
}

function downloadAvatar(userId, avatarHash) {
  return new Promise((resolve, reject) => {
    const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`;
    const avatarDir = path.join(app.getPath('userData'), 'avatars');
    const avatarPath = path.join(avatarDir, `${userId}.png`);

    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir, { recursive: true });
    }

    https.get(avatarUrl, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(avatarPath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(avatarPath);
        });
      } else {
        reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (error) => {
      reject(error);
    });
  });
}


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs')
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
    authCompleted = false; // Сбрасываем флаг перед началом новой авторизации
    authClient.openBrowser();
  });

  // Новый обработчик для сброса флага authCompleted
  ipcMain.on('reset-auth-completed', () => {
    authCompleted = false;
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
  
  ipcMain.handle('is-modpack-installed', async (event, version) => {
    const modpackPath = path.join(MODPACK_DIR, version);
    return fs.existsSync(modpackPath);
  });

  // Обработчик для выхода пользователя
  ipcMain.on('logout', () => {
    if (storeModule) {
      storeModule.clearUser();
    }
    mainWindow.webContents.send('user-logged-out');
  });

  ipcMain.on('minimize-window', () => mainWindow.minimize());
  ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('close-window', () => mainWindow.close());

  ipcMain.handle('get-avatar-path', (event, userId) => {
    const avatarPath = path.join(app.getPath('userData'), 'avatars', `${userId}.png`);
    return fs.existsSync(avatarPath) ? avatarPath : null;
  });

  ipcMain.handle('download-modpack', async (event, version) => {
    try {
      const modpackUrl = `http://127.0.0.1:8000/api/v2/modpack/download/${version}`;
      const zipPath = path.join(app.getPath('temp'), `${version}.zip`);
      
      await downloadFile(modpackUrl, zipPath, (progress) => {
        mainWindow.webContents.send('download-progress', progress);
      });

      const extractPath = path.join(MODPACK_DIR, version);
      await extract(zipPath, { dir: extractPath });

      // Удаляем временный zip файл
      fs.unlinkSync(zipPath);

      return { success: true };
    } catch (error) {
      console.error('Failed to download and extract modpack:', error);
      return { success: false, error: error.message };
    }
  });

  // Добавляем новые обработчики для работы с настройками
  ipcMain.handle('get-minecraft-settings', async () => {
    try {
      if (fs.existsSync(SETTINGS_FILE)) {
        const settingsData = fs.readFileSync(SETTINGS_FILE, 'utf8');
        return JSON.parse(settingsData);
      }
      return null;
    } catch (error) {
      console.error('Error reading Minecraft settings:', error);
      return null;
    }
  });

  ipcMain.handle('save-minecraft-settings', async (event, settings) => {
    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return { success: true };
    } catch (error) {
      console.error('Error saving Minecraft settings:', error);
      return { success: false, error: error.message };
    }
  });

  // Обновляем обработчик для запуска Minecraft с учетом настроек
  ipcMain.handle('launch-minecraft', async (event, version, settings) => {
    try {
      const launcher = new Client();
      const minecraftPath = path.join(MODPACK_DIR, version);
  
      // Проверяем наличие настроек и устанавливаем значения по умолчанию
      const defaultSettings = {
        maxMemory: 2,
        fullscreen: false,
        renderDistance: 8,
        language: 'ru_RU'
      };
      const mergedSettings = { ...defaultSettings, ...settings };
  
      const user = storeModule.getUser();
  
      const opts = {
        clientPackage: null,
        authorization: {
          access_token: "0", // Это значение не важно в оффлайн-режиме
          client_token: "0", // Это значение не важно в оффлайн-режиме
          uuid: user.id || "00000000-0000-0000-0000-000000000000", // Используем ID пользователя из Discord или генерируем случайный UUID
          name: user.username || "Player", // Используем имя пользователя из Discord или дефолтное значение
          user_properties: "{}",
          meta: {
            type: "offline", // Указываем, что это оффлайн-режим
            demo: false
          }
        },
        root: minecraftPath,
        version: {
          number: version,
          type: "release"
        },
        memory: {
          max: `${mergedSettings.maxMemory}G`,
          min: "1G"
        },
        forge: null, // Укажите путь к Forge, если используете
        fabricVersion: "0.16.2", // Версия Fabric, если используете
        overrides: {
          minecraftJar: path.join(minecraftPath, 'versions', `Fabric ${version}`, `Fabric ${version}.jar`),
        },
        window: {
          width: mergedSettings.fullscreen ? 1920 : 1280,
          height: mergedSettings.fullscreen ? 1080 : 720,
          fullscreen: mergedSettings.fullscreen
        }
      }
  
      console.log('Launching Minecraft with options:', opts);
  
      launcher.on('debug', (e) => console.log(e));
      launcher.on('data', (e) => console.log(e));
  
      launcher.launch(opts);
  
      launcher.on('progress', (e) => {
        console.log(e);
        mainWindow.webContents.send('launch-progress', e.percent);
      });
  
      launcher.on('close', (code) => {
        console.log(`Minecraft process exited with code ${code}`);
        mainWindow.webContents.send('launch-progress', 100);
      });
  
      return { success: true };
    } catch (error) {
      console.error('Failed to launch Minecraft:', error);
      return { success: false, error: error.message };
    }
  });
}

function downloadFile(url, filePath, progressCallback) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    http.get(url, (response) => {
      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const progress = Math.round((downloadedSize / totalSize) * 100);
        progressCallback(progress);
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (error) => {
      fs.unlink(filePath, () => reject(error));
    });
  });
}


function createProtocol() {
  protocol.registerFileProtocol('avatar', (request, callback) => {
    const url = request.url.substr(9);
    callback({ path: path.normalize(`${app.getPath('userData')}/avatars/${url}`) });
  });
}

app.whenReady().then(() => {
  createProtocol();
  createWindow();
});

ipcMain.handle('get-avatar-url', (event, userId) => {
  const avatarPath = path.join(app.getPath('userData'), 'avatars', `${userId}.png`);
  return fs.existsSync(avatarPath) ? `avatar://${userId}.png` : null;
});


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