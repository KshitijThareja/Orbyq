import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import Store from "electron-store";

const api = {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  saveTask: (task: any) => ipcRenderer.invoke("save-task", task),
  saveProject: (project: any) => ipcRenderer.invoke("save-project", project),
  saveNote: (note: any) => ipcRenderer.invoke("save-note", note),
  saveFile: (path: string, content: string) => ipcRenderer.invoke("save-file", path, content),
  readFile: (path: string) => ipcRenderer.invoke("read-file", path),
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
  callBackend: (endpoint: string, method: string = 'GET', data?: any, token?: string) =>
    ipcRenderer.invoke("call-backend", { endpoint, method, data, token }),
  getBackendStatus: () => ipcRenderer.invoke("get-backend-status")
};

const authStore = new Store({
  name: 'auth',
  encryptionKey: process.env.AUTH_ENCRYPTION_KEY
});

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld('electronStore', {
      set: (key: string, value: any) => authStore.set(key, value),
      get: (key: string) => authStore.get(key),
      delete: (key: string) => authStore.delete(key),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}