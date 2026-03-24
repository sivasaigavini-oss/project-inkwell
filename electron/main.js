import { app, BrowserWindow, session } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hiddenInset', // Adds a native macOS window look
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const isDev = process.env.NODE_ENV === 'development';

  // HARD NAVIGATION LOCK — prevent Chromium from ever leaving index.html
  win.webContents.on('will-navigate', (event, url) => {
    // Allow only the initial load and localhost dev server
    const allowed = url.includes('localhost:') || url.endsWith('index.html') || url.startsWith('file://');
    if (!allowed) {
      event.preventDefault();
    }
  });

  // Block new windows (e.g., target="_blank" links)
  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // Intercept ANY request that tries to navigate the main frame to a non-HTML resource
  win.webContents.on('did-fail-load', () => {
    // If load fails, force reload from index.html
    if (isDev) {
      win.loadURL('http://localhost:5173');
    } else {
      win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(async () => {
  // Clear Chromium cache on every launch to prevent stale renders
  await session.defaultSession.clearCache();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
