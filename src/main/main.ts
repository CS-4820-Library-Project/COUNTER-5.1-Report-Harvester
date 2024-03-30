import { app, BrowserWindow, globalShortcut, nativeImage } from "electron";
import * as path from "path";
import VendorRouter from "./routers/VendorRouter";
import SettingsRouter from "./routers/SettingsRouter";
import DatabaseRouter from "./routers/databaseRouter";
import tsvRouter from "./routers/tsvRouter";
import loggerRouter from "./routers/loggerRouter";
import { filterReloadMenu } from "./menu";
import FetchRouter from "./routers/FetchRouter";

process.env.DIST = path.join(__dirname, "../dist");

process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../../public");

const appPath = app.getAppPath();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    icon:
      process.platform === "darwin"
        ? path.join(process.env.VITE_PUBLIC || "", "app-logo.icns")
        : path.join(process.env.VITE_PUBLIC || "", "app-logo.ico"),
    minWidth: 1200,
    minHeight: 800,
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(appPath, "out/preload/preload.js"),
      webSecurity: false,
    },
  });

  // Routers
  VendorRouter();
  FetchRouter();
  SettingsRouter();
  tsvRouter();
  DatabaseRouter();
  loggerRouter();

  const productionPath = path.join(__dirname, "../renderer/index.html");

  // Load the index.html of the app
  if (app.isPackaged) mainWindow.loadFile(productionPath);
  // Vite dev server URL
  else {
    process.env.NODE_ENV === "development"
      ? mainWindow.loadURL("http://localhost:5173")
      : mainWindow.loadFile(productionPath);
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

if (process.platform === "darwin") {
  const iconPath = path.join(process.env.VITE_PUBLIC || "", "app-logo.png");
  const appLogo = nativeImage.createFromPath(iconPath);
  app.dock.setIcon(appLogo);
}

app.whenReady().then(() => {
  createWindow();

  // RELOAD IS NOT ALLOWED IN PRODUCTION, ONLY IN DEVELOPMENT thanks to Vite dev server
  process.env.NODE_ENV === "production" && filterReloadMenu();

  // Ignore Reload command
  globalShortcut.register("CommandOrControl+R", () => {});
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow == null) createWindow();
});
