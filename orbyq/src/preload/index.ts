import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const api = {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  saveTask: (task: any) => ipcRenderer.invoke("save-task", task),
  saveProject: (project: any) => ipcRenderer.invoke("save-project", project),
  saveNote: (note: any) => ipcRenderer.invoke("save-note", note),
  saveFile: (path: string, content: string) => ipcRenderer.invoke("save-file", path, content),
  readFile: (path: string) => ipcRenderer.invoke("read-file", path),
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
  // New backend API
  callBackend: (endpoint: string, method: string = 'GET', data?: any) =>
    ipcRenderer.invoke("call-backend", { endpoint, method, data })
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}