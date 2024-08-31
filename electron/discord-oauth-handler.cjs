const { BrowserWindow } = require('electron');
const fetch = require('node-fetch');

const CLIENT_ID = "1279188193543192705";
const CLIENT_SECRET = "xgm_DqnspOS8xDlR0ZHOjBytjk61CCoh";
const REDIRECT_URI = 'http://localhost:5173/callback';

const DISCORD_API = 'https://discord.com/api/v10';

async function createAuthWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email'
  });

  const url = `https://discord.com/api/oauth2/authorize?${params}`;
  win.loadURL(url);

  return new Promise((resolve, reject) => {
    win.webContents.on('will-redirect', (event, url) => {
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');
      if (code) {
        resolve(code);
        win.close();
      }
    });

    win.on('closed', () => {
      reject(new Error('Auth window was closed'));
    });
  });
}

async function getAccessToken(code) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI
  });

  const response = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  return response.json();
}

async function getUserInfo(accessToken) {
  const response = await fetch(`${DISCORD_API}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
}

module.exports = {
  createAuthWindow,
  getAccessToken,
  getUserInfo
};