import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { spawn, ChildProcess } from 'child_process';
import axios from 'axios';
import ElectronStore from 'electron-store';

let backendProcess: ChildProcess | null = null;
let isBackendReady = false;
ElectronStore.initRenderer();

async function waitForBackend(maxAttempts = 20, interval = 1000): Promise<void> {
  if (isBackendReady) return;

  const baseUrl = 'http://localhost:8080/api';
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Checking backend availability (attempt ${attempt}/${maxAttempts})...`);
      await axios.get(`${baseUrl}/ping`, { timeout: 1000 });
      console.log('Backend is ready!');
      isBackendReady = true;
      return;
    } catch (error) {
      console.log(
        `Backend not ready yet: ${
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as any).message
            : String(error)
        }`
      );
      if (attempt === maxAttempts) {
        throw new Error('Backend failed to start after maximum attempts');
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function startBackend(): void {
  if (is.dev) {
    console.log('In development mode, backend should be started separately.');
    return;
  }

  const jarPath = join(__dirname, '../../resources/backend/backend-0.0.1-SNAPSHOT.jar');
  console.log(`Starting backend JAR: ${jarPath}`);
  backendProcess = spawn('java', ['-jar', jarPath], { stdio: 'inherit' });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
    isBackendReady = false;
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend exited with code ${code}`);
    backendProcess = null;
    isBackendReady = false;
  });
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  startBackend();
  try {
    await waitForBackend();
  } catch (error) {
    console.error('Failed to initialize backend:', error);
  }

  ipcMain.handle('call-backend', async (_, { endpoint, method, data, token }) => {
    console.log(`Calling backend: ${endpoint}, method: ${method}`);
    const baseUrl = 'http://localhost:8080/api';
    try {
      await waitForBackend();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios({
        method,
        url: `${baseUrl}/${endpoint}`,
        data,
        headers,
        timeout: 5000
      });
      console.log(`Backend response: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      console.error('Backend call error:', error);
      throw error;
    }
  });

  ipcMain.handle('get-backend-status', async () => {
    try {
      await waitForBackend(1, 500);
      return { ready: true };
    } catch (error) {
      return { ready: false, error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error) };
    }
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});