//Libs
import { contextBridge, ipcRenderer } from "electron"

//Main
contextBridge.exposeInMainWorld("api", {
  showOpenDialog: function() {
    return ipcRenderer.invoke("dialog:showOpenDialog")
  },
  showSaveDialog: function(defaultPath?: string) {
    return ipcRenderer.invoke("dialog:showSaveDialog", defaultPath)
  },
  readFile: function(filePath: string) {
    return ipcRenderer.invoke("file:read", filePath)
  },
  writeFile: function(filePath: string, content: string) {
    return ipcRenderer.invoke("file:write", filePath, content)
  },
  writeBinaryFile: function(filePath: string, base64Data: string) {
    return ipcRenderer.invoke("file:writeBinary", filePath, base64Data)
  },
  onMenuAction: function(callback: (action: string) => void) {
    const listener = function(_event: any, action: string) {
      callback(action)
    }
    ipcRenderer.on("menu-action", listener)
    return function() {
      ipcRenderer.removeListener("menu-action", listener)
    }
  }
})
