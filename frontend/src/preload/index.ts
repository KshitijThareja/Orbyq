import { contextBridge, ipcRenderer } from "electron"
import { electronAPI } from "@electron-toolkit/preload"

// Custom APIs for renderer
const api = {
  // App info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // Task operations
  saveTask: (task: any) => ipcRenderer.invoke("save-task", task),

  // Project operations
  saveProject: (project: any) => ipcRenderer.invoke("save-project", project),

  // Note operations
  saveNote: (note: any) => ipcRenderer.invoke("save-note", note),

  // File operations
  saveFile: (path: string, content: string) => ipcRenderer.invoke("save-file", path, content),
  readFile: (path: string) => ipcRenderer.invoke("read-file", path),

  // System operations
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("api", api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
