//Libs
import { app, BrowserWindow, ipcMain, dialog, Menu } from "electron"
import * as path from "path"
import * as fs from "fs"

//Funcs
function createWindow() {
  let iconPath = ""
  if (process.platform === "win32") {
    iconPath = path.join(__dirname, "../assets/win/logo.ico")
  } else if (process.platform === "linux") {
    iconPath = path.join(__dirname, "../assets/lin/logo.png")
  } else if (process.platform === "darwin") {
    iconPath = path.join(__dirname, "../assets/mac/logo-1024.icns")
  }

  if (iconPath && !fs.existsSync(iconPath)) {
    iconPath = ""
  }

  let win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hiddenInset", // macOS traffic lights style
    trafficLightPosition: { x: 12, y: 12 },
    icon: iconPath || undefined,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  createApplicationMenu(win)

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"))
  }
}

function createApplicationMenu(win: BrowserWindow) {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "Mai Paint",
      submenu: [
        { role: "about", label: "Sobre o Mai Paint" },
        { type: "separator" },
        { role: "services", label: "Serviços" },
        { type: "separator" },
        { role: "hide", label: "Ocultar Mai Paint" },
        { role: "hideOthers", label: "Ocultar Outros" },
        { role: "unhide", label: "Mostrar Todos" },
        { type: "separator" },
        { role: "quit", label: "Encerrar Mai Paint" }
      ]
    },
    {
      label: "Arquivo",
      submenu: [
        {
          label: "Novo Projeto",
          accelerator: "CmdOrCtrl+N",
          click: function() {
            win.webContents.send("menu-action", "new")
          }
        },
        {
          label: "Abrir...",
          accelerator: "CmdOrCtrl+O",
          click: function() {
            win.webContents.send("menu-action", "open")
          }
        },
        { type: "separator" },
        {
          label: "Salvar",
          accelerator: "CmdOrCtrl+S",
          click: function() {
            win.webContents.send("menu-action", "save")
          }
        },
        {
          label: "Salvar Como...",
          accelerator: "CmdOrCtrl+Shift+S",
          click: function() {
            win.webContents.send("menu-action", "save-as")
          }
        },
        { type: "separator" },
        {
          label: "Exportar como PNG",
          click: function() {
            win.webContents.send("menu-action", "export-png")
          }
        },
        {
          label: "Exportar como JPG",
          click: function() {
            win.webContents.send("menu-action", "export-jpg")
          }
        },
        {
          label: "Exportar como PDF",
          click: function() {
            win.webContents.send("menu-action", "export-pdf")
          }
        }
      ]
    },
    {
      label: "Editar",
      submenu: [
        {
          label: "Desfazer",
          accelerator: "CmdOrCtrl+Z",
          click: function() {
            win.webContents.send("menu-action", "undo")
          }
        },
        {
          label: "Refazer",
          accelerator: "CmdOrCtrl+Shift+Z",
          click: function() {
            win.webContents.send("menu-action", "redo")
          }
        },
        { type: "separator" },
        {
          label: "Copiar",
          accelerator: "CmdOrCtrl+C",
          click: function() {
            win.webContents.send("menu-action", "copy")
          }
        },
        {
          label: "Colar",
          accelerator: "CmdOrCtrl+V",
          click: function() {
            win.webContents.send("menu-action", "paste")
          }
        },
        {
          label: "Duplicar",
          accelerator: "CmdOrCtrl+D",
          click: function() {
            win.webContents.send("menu-action", "duplicate")
          }
        },
        {
          label: "Excluir",
          accelerator: "Delete",
          click: function() {
            win.webContents.send("menu-action", "delete")
          }
        },
        { type: "separator" },
        {
          label: "Selecionar Tudo",
          accelerator: "CmdOrCtrl+A",
          click: function() {
            win.webContents.send("menu-action", "select-all")
          }
        }
      ]
    },
    {
      label: "Visualizar",
      submenu: [
        { role: "reload", label: "Recarregar" },
        { role: "forceReload", label: "Forçar Recarregamento" },
        { role: "toggleDevTools", label: "Alternar Ferramentas de Desenvolvedor" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Tela Cheia" }
      ]
    },
    {
      label: "Janela",
      submenu: [
        { role: "minimize", label: "Minimizar" },
        { role: "zoom", label: "Zoom" },
        { type: "separator" },
        { role: "front", label: "Trazer Tudo para a Frente" }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function registerIpcHandlers() {
  ipcMain.handle("dialog:showOpenDialog", async function() {
    return dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [
        { name: "Projetos Mai Paint", extensions: ["maipaint"] }
      ]
    })
  })

  ipcMain.handle("dialog:showSaveDialog", async function(_event, defaultPath?: string) {
    let pathStr = defaultPath || "sem-titulo.maipaint"
    let ext = pathStr.split(".").pop()?.toLowerCase() || ""
    
    let filters = [{ name: "Projetos Mai Paint", extensions: ["maipaint"] }]
    if (ext === "png") {
      filters = [{ name: "Imagens PNG", extensions: ["png"] }]
    } else if (ext === "jpg" || ext === "jpeg") {
      filters = [{ name: "Imagens JPEG", extensions: ["jpg", "jpeg"] }]
    } else if (ext === "pdf") {
      filters = [{ name: "Documentos PDF", extensions: ["pdf"] }]
    }

    let result = await dialog.showSaveDialog({
      defaultPath: pathStr,
      filters
    })

    if (!result.canceled && result.filePath) {
      let returnedPath = result.filePath
      if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "pdf") {
        if (returnedPath.endsWith(".maipaint")) {
          if (returnedPath.endsWith("." + ext + ".maipaint")) {
            returnedPath = returnedPath.slice(0, -9)
          } else if (returnedPath.endsWith(".jpeg.maipaint") && ext === "jpg") {
            returnedPath = returnedPath.slice(0, -9)
          } else if (returnedPath.endsWith(".jpg.maipaint") && ext === "jpeg") {
            returnedPath = returnedPath.slice(0, -9)
          } else {
            returnedPath = returnedPath.replace(/\.maipaint$/, "." + ext)
          }
        }
      }
      result.filePath = returnedPath
    }

    return result
  })

  ipcMain.handle("file:read", async function(_event, filePath: string) {
    try {
      const content = fs.readFileSync(filePath, "utf-8")
      return { success: true, content }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle("file:write", async function(_event, filePath: string, content: string) {
    try {
      fs.writeFileSync(filePath, content, "utf-8")
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle("file:writeBinary", async function(_event, filePath: string, base64Data: string) {
    try {
      const cleanData = base64Data.replace(/^data:[^;]+;base64,/, "")
      const buffer = Buffer.from(cleanData, "base64")
      fs.writeFileSync(filePath, buffer)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })
}

//Main
app.whenReady().then(function() {
  registerIpcHandlers()
  createWindow()

  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
