const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  discordAuth: () => ipcRenderer.invoke('discord-auth'),
  onAuthSuccess: (callback) => ipcRenderer.on('auth-success', (_, userInfo) => callback(userInfo)),
  onAuthError: (callback) => ipcRenderer.on('auth-error', (_, error) => callback(error))
});