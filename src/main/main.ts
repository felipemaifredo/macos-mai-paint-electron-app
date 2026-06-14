//Libs
import { app, BrowserWindow, ipcMain, dialog, Menu } from "electron"
import * as path from "path"
import * as fs from "fs"

//Types
type MainTranslations = {
  about: string
  services: string
  hide: string
  hideOthers: string
  showAll: string
  quit: string
  file: string
  newProject: string
  open: string
  save: string
  saveAs: string
  exportPng: string
  exportJpg: string
  exportPdf: string
  edit: string
  undo: string
  redo: string
  copy: string
  paste: string
  duplicate: string
  delete: string
  selectAll: string
  view: string
  reload: string
  forceReload: string
  toggleDevTools: string
  fullScreen: string
  window: string
  minimize: string
  zoom: string
  front: string
  dialogProjects: string
  dialogPng: string
  dialogJpg: string
  dialogPdf: string
  defaultFilename: string
}

type TranslationsMap = {
  en: MainTranslations
  pt: MainTranslations
  es: MainTranslations
}

//Consts
let translations: TranslationsMap = {
  en: {
    about: "About Mai Paint",
    services: "Services",
    hide: "Hide Mai Paint",
    hideOthers: "Hide Others",
    showAll: "Show All",
    quit: "Quit Mai Paint",
    file: "File",
    newProject: "New Project",
    open: "Open...",
    save: "Save",
    saveAs: "Save As...",
    exportPng: "Export as PNG",
    exportJpg: "Export as JPG",
    exportPdf: "Export as PDF",
    edit: "Edit",
    undo: "Undo",
    redo: "Redo",
    copy: "Copy",
    paste: "Paste",
    duplicate: "Duplicate",
    delete: "Delete",
    selectAll: "Select All",
    view: "View",
    reload: "Reload",
    forceReload: "Force Reload",
    toggleDevTools: "Toggle Developer Tools",
    fullScreen: "Toggle Full Screen",
    window: "Window",
    minimize: "Minimize",
    zoom: "Zoom",
    front: "Bring All to Front",
    dialogProjects: "Mai Paint Projects",
    dialogPng: "PNG Images",
    dialogJpg: "JPEG Images",
    dialogPdf: "PDF Documents",
    defaultFilename: "untitled.maipaint"
  },
  pt: {
    about: "Sobre o Mai Paint",
    services: "Serviços",
    hide: "Ocultar Mai Paint",
    hideOthers: "Ocultar Outros",
    showAll: "Mostrar Todos",
    quit: "Encerrar Mai Paint",
    file: "Arquivo",
    newProject: "Novo Projeto",
    open: "Abrir...",
    save: "Salvar",
    saveAs: "Salvar Como...",
    exportPng: "Exportar como PNG",
    exportJpg: "Exportar como JPG",
    exportPdf: "Exportar como PDF",
    edit: "Editar",
    undo: "Desfazer",
    redo: "Refazer",
    copy: "Copiar",
    paste: "Colar",
    duplicate: "Duplicar",
    delete: "Excluir",
    selectAll: "Selecionar Tudo",
    view: "Visualizar",
    reload: "Recarregar",
    forceReload: "Forçar Recarregamento",
    toggleDevTools: "Alternar Ferramentas de Desenvolvedor",
    fullScreen: "Tela Cheia",
    window: "Janela",
    minimize: "Minimizar",
    zoom: "Zoom",
    front: "Trazer Tudo para a Frente",
    dialogProjects: "Projetos Mai Paint",
    dialogPng: "Imagens PNG",
    dialogJpg: "Imagens JPEG",
    dialogPdf: "Documentos PDF",
    defaultFilename: "sem-titulo.maipaint"
  },
  es: {
    about: "Acerca de Mai Paint",
    services: "Servicios",
    hide: "Ocultar Mai Paint",
    hideOthers: "Ocultar otros",
    showAll: "Mostrar todo",
    quit: "Salir de Mai Paint",
    file: "Archivo",
    newProject: "Nuevo Proyecto",
    open: "Abrir...",
    save: "Guardar",
    saveAs: "Guardar como...",
    exportPng: "Exportar como PNG",
    exportJpg: "Exportar como JPG",
    exportPdf: "Exportar como PDF",
    edit: "Editar",
    undo: "Deshacer",
    redo: "Rehacer",
    copy: "Copiar",
    paste: "Pegar",
    duplicate: "Duplicar",
    delete: "Eliminar",
    selectAll: "Seleccionar todo",
    view: "Ver",
    reload: "Recargar",
    forceReload: "Forzar recarga",
    toggleDevTools: "Alternar herramientas de desarrollador",
    fullScreen: "Pantalla completa",
    window: "Ventana",
    minimize: "Minimizar",
    zoom: "Zoom",
    front: "Traer todo al frente",
    dialogProjects: "Proyectos Mai Paint",
    dialogPng: "Imágenes PNG",
    dialogJpg: "Imágenes JPEG",
    dialogPdf: "Documentos PDF",
    defaultFilename: "sin-titulo.maipaint"
  }
}

let currentLocale: "en" | "pt" | "es" = "en"
let mainWindow: BrowserWindow | null = null

//Funcs
function initLocale() {
  let locale = app.getLocale().toLowerCase()
  if (locale.startsWith("pt")) {
    currentLocale = "pt"
  } else if (locale.startsWith("es")) {
    currentLocale = "es"
  } else {
    currentLocale = "en"
  }
}

function getTranslations(): MainTranslations {
  return translations[currentLocale] || translations.en
}

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
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow = win
  createApplicationMenu(win)

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"))
  }
}

function createApplicationMenu(win: BrowserWindow) {
  let t = getTranslations()
  let template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "Mai Paint",
      submenu: [
        { role: "about", label: t.about },
        { type: "separator" },
        { role: "services", label: t.services },
        { type: "separator" },
        { role: "hide", label: t.hide },
        { role: "hideOthers", label: t.hideOthers },
        { role: "unhide", label: t.showAll },
        { type: "separator" },
        { role: "quit", label: t.quit }
      ]
    },
    {
      label: t.file,
      submenu: [
        {
          label: t.newProject,
          accelerator: "CmdOrCtrl+N",
          click: function() {
            win.webContents.send("menu-action", "new")
          }
        },
        {
          label: t.open,
          accelerator: "CmdOrCtrl+O",
          click: function() {
            win.webContents.send("menu-action", "open")
          }
        },
        { type: "separator" },
        {
          label: t.save,
          accelerator: "CmdOrCtrl+S",
          click: function() {
            win.webContents.send("menu-action", "save")
          }
        },
        {
          label: t.saveAs,
          accelerator: "CmdOrCtrl+Shift+S",
          click: function() {
            win.webContents.send("menu-action", "save-as")
          }
        },
        { type: "separator" },
        {
          label: t.exportPng,
          click: function() {
            win.webContents.send("menu-action", "export-png")
          }
        },
        {
          label: t.exportJpg,
          click: function() {
            win.webContents.send("menu-action", "export-jpg")
          }
        },
        {
          label: t.exportPdf,
          click: function() {
            win.webContents.send("menu-action", "export-pdf")
          }
        }
      ]
    },
    {
      label: t.edit,
      submenu: [
        {
          label: t.undo,
          accelerator: "CmdOrCtrl+Z",
          click: function() {
            win.webContents.send("menu-action", "undo")
          }
        },
        {
          label: t.redo,
          accelerator: "CmdOrCtrl+Shift+Z",
          click: function() {
            win.webContents.send("menu-action", "redo")
          }
        },
        { type: "separator" },
        {
          label: t.copy,
          accelerator: "CmdOrCtrl+C",
          click: function() {
            win.webContents.send("menu-action", "copy")
          }
        },
        {
          label: t.paste,
          accelerator: "CmdOrCtrl+V",
          click: function() {
            win.webContents.send("menu-action", "paste")
          }
        },
        {
          label: t.duplicate,
          accelerator: "CmdOrCtrl+D",
          click: function() {
            win.webContents.send("menu-action", "duplicate")
          }
        },
        {
          label: t.delete,
          accelerator: "Delete",
          click: function() {
            win.webContents.send("menu-action", "delete")
          }
        },
        { type: "separator" },
        {
          label: t.selectAll,
          accelerator: "CmdOrCtrl+A",
          click: function() {
            win.webContents.send("menu-action", "select-all")
          }
        }
      ]
    },
    {
      label: t.view,
      submenu: [
        { role: "reload", label: t.reload },
        { role: "forceReload", label: t.forceReload },
        { role: "toggleDevTools", label: t.toggleDevTools },
        { type: "separator" },
        { role: "togglefullscreen", label: t.fullScreen }
      ]
    },
    {
      label: t.window,
      submenu: [
        { role: "minimize", label: t.minimize },
        { role: "zoom", label: t.zoom },
        { type: "separator" },
        { role: "front", label: t.front }
      ]
    }
  ]

  let menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function registerIpcHandlers() {
  ipcMain.on("language-changed", function(_event, locale: string) {
    let newLocale: "en" | "pt" | "es" = "en"
    if (locale === "pt" || locale === "es") {
      newLocale = locale
    }
    if (currentLocale !== newLocale) {
      currentLocale = newLocale
      if (mainWindow && !mainWindow.isDestroyed()) {
        createApplicationMenu(mainWindow)
      }
    }
  })

  ipcMain.handle("dialog:showOpenDialog", async function() {
    let t = getTranslations()
    return dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [
        { name: t.dialogProjects, extensions: ["maipaint"] }
      ]
    })
  })

  ipcMain.handle("dialog:showSaveDialog", async function(_event, defaultPath?: string) {
    let t = getTranslations()
    let pathStr = defaultPath || t.defaultFilename
    let ext = pathStr.split(".").pop()?.toLowerCase() || ""
    
    let filters = [{ name: t.dialogProjects, extensions: ["maipaint"] }]
    if (ext === "png") {
      filters = [{ name: t.dialogPng, extensions: ["png"] }]
    } else if (ext === "jpg" || ext === "jpeg") {
      filters = [{ name: t.dialogJpg, extensions: ["jpg", "jpeg"] }]
    } else if (ext === "pdf") {
      filters = [{ name: t.dialogPdf, extensions: ["pdf"] }]
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
      let content = fs.readFileSync(filePath, "utf-8")
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
      let cleanData = base64Data.replace(/^data:[^;]+;base64,/, "")
      let buffer = Buffer.from(cleanData, "base64")
      fs.writeFileSync(filePath, buffer)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })
}

//Main
app.whenReady().then(function() {
  initLocale()
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
