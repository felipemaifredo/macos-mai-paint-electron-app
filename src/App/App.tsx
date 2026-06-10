//Libs
import { useEffect, useRef } from "react"
import { jsPDF } from "jspdf"
import Konva from "konva"

//Imports
import { useCanvasStore } from "../Lib/Hooks/useCanvasStore"
import { MainPage } from "../ui/Pages/MainPage"
import { CanvasElement } from "../Lib/Types/canvas.types"

//Types
type WindowApi = {
  showOpenDialog: () => Promise<any>
  showSaveDialog: (defaultPath?: string) => Promise<any>
  readFile: (filePath: string) => Promise<{ success: boolean; content: string; error?: string }>
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>
  writeBinaryFile: (filePath: string, base64Data: string) => Promise<{ success: boolean; error?: string }>
  onMenuAction: (callback: (action: string) => void) => () => void
}

//Funcs
function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

//Main
export const App = () => {
  const elements = useCanvasStore(function(state) {
    return state.elements
  })
  const selectedIds = useCanvasStore(function(state) {
    return state.selectedIds
  })
  const filePath = useCanvasStore(function(state) {
    return state.filePath
  })
  const isDirty = useCanvasStore(function(state) {
    return state.isDirty
  })

  // Store actions
  const newProject = useCanvasStore(function(state) {
    return state.newProject
  })
  const openProject = useCanvasStore(function(state) {
    return state.openProject
  })
  const saveProject = useCanvasStore(function(state) {
    return state.saveProject
  })
  const undo = useCanvasStore(function(state) {
    return state.undo
  })
  const redo = useCanvasStore(function(state) {
    return state.redo
  })
  const deleteElements = useCanvasStore(function(state) {
    return state.deleteElements
  })
  const duplicateElements = useCanvasStore(function(state) {
    return state.duplicateElements
  })
  const setElements = useCanvasStore(function(state) {
    return state.setElements
  })
  const setSelectedIds = useCanvasStore(function(state) {
    return state.setSelectedIds
  })
  const saveHistory = useCanvasStore(function(state) {
    return state.saveHistory
  })

  // Clipboard memory for copy/paste inside app
  const clipboardElementsRef = useRef<CanvasElement[] | null>(null)

  const api = (window as any).api as WindowApi

  // File IO helpers
  function handleNew() {
    if (isDirty) {
      const confirm = window.confirm("Deseja criar um novo projeto? As alterações não salvas serão perdidas.")
      if (!confirm) return
    }
    newProject()
  }

  async function handleOpen() {
    if (isDirty) {
      const confirm = window.confirm("Deseja abrir outro projeto? As alterações não salvas serão perdidas.")
      if (!confirm) return
    }

    if (!api) return
    const result = await api.showOpenDialog()
    if (result.canceled || result.filePaths.length === 0) return

    const selectedPath = result.filePaths[0]
    const fileResult = await api.readFile(selectedPath)
    
    if (fileResult.success) {
      try {
        const projectData = JSON.parse(fileResult.content)
        if (Array.isArray(projectData.elements)) {
          openProject(selectedPath, projectData.elements)
        } else {
          alert("Estrutura do arquivo de projeto inválida.")
        }
      } catch (err) {
        alert("Erro ao ler o arquivo de projeto.")
      }
    } else {
      alert(`Falha ao ler o arquivo: ${fileResult.error}`)
    }
  }

  async function handleSave() {
    if (!api) return
    if (!filePath) {
      handleSaveAs()
      return
    }

    const payload = {
      version: "1.0",
      elements
    }

    const saveResult = await api.writeFile(filePath, JSON.stringify(payload, null, 2))
    if (saveResult.success) {
      saveProject(filePath)
    } else {
      alert(`Falha ao salvar: ${saveResult.error}`)
    }
  }

  async function handleSaveAs() {
    if (!api) return
    const result = await api.showSaveDialog(filePath || undefined)
    if (result.canceled || !result.filePath) return

    const payload = {
      version: "1.0",
      elements
    }

    const saveResult = await api.writeFile(result.filePath, JSON.stringify(payload, null, 2))
    if (saveResult.success) {
      saveProject(result.filePath)
    } else {
      alert(`Falha ao salvar: ${saveResult.error}`)
    }
  }

  // Export helpers
  async function handleExportImage(format: "png" | "jpg") {
    if (!api) return
    let stage = document.querySelector(".konvajs-content")?.parentElement as any
    if (!stage) {
      alert("Canvas não encontrado para exportação.")
      return
    }

    let stageInstance = stage.__konvaStage
    if (!stageInstance) return

    // Save current zoom and pan to restore later
    let oldScale = stageInstance.scaleX()
    let oldPos = stageInstance.position()

    // Reset zoom and pan for export
    stageInstance.scale({ x: 1, y: 1 })
    stageInstance.position({ x: 0, y: 0 })

    // Create temporary background rectangle to ensure white background
    let bgRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: stageInstance.width(),
      height: stageInstance.height(),
      fill: "#ffffff",
      listening: false
    })

    let layers = stageInstance.getLayers()
    if (layers.length > 0) {
      let mainLayer = layers[0]
      mainLayer.add(bgRect)
      bgRect.moveToBottom()
      mainLayer.draw()

      let dataUrl = stageInstance.toDataURL({
        pixelRatio: 2,
        mimeType: format === "png" ? "image/png" : "image/jpeg"
      })

      bgRect.destroy()

      // Restore zoom and pan
      stageInstance.scale({ x: oldScale, y: oldScale })
      stageInstance.position(oldPos)
      mainLayer.draw()

      let saveResult = await api.showSaveDialog(`exportacao.${format}`)
      if (saveResult.canceled || !saveResult.filePath) return

      let exportResult = await api.writeBinaryFile(saveResult.filePath, dataUrl)
      if (!exportResult.success) {
        alert(`Falha ao exportar imagem: ${exportResult.error}`)
      }
    }
  }

  async function handleExportPDF() {
    if (!api) return
    let stageElement = document.querySelector(".konvajs-content")?.parentElement as any
    if (!stageElement) return

    let stageInstance = stageElement.__konvaStage
    if (!stageInstance) return

    // Save current zoom and pan
    let oldScale = stageInstance.scaleX()
    let oldPos = stageInstance.position()

    // Reset zoom and pan for export
    stageInstance.scale({ x: 1, y: 1 })
    stageInstance.position({ x: 0, y: 0 })

    let width = stageInstance.width()
    let height = stageInstance.height()

    // Create temporary background rectangle to ensure white background
    let bgRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: "#ffffff",
      listening: false
    })

    let layers = stageInstance.getLayers()
    if (layers.length > 0) {
      let mainLayer = layers[0]
      mainLayer.add(bgRect)
      bgRect.moveToBottom()
      mainLayer.draw()

      let dataUrl = stageInstance.toDataURL({
        pixelRatio: 2,
        mimeType: "image/png"
      })

      bgRect.destroy()

      // Restore zoom and pan
      stageInstance.scale({ x: oldScale, y: oldScale })
      stageInstance.position(oldPos)
      mainLayer.draw()

      let pdf = new jsPDF({
        orientation: width > height ? "landscape" : "portrait",
        unit: "px",
        format: [width, height]
      })

      pdf.addImage(dataUrl, "PNG", 0, 0, width, height)
      let dataUri = pdf.output("datauristring")

      let saveResult = await api.showSaveDialog("exportacao.pdf")
      if (saveResult.canceled || !saveResult.filePath) return

      let exportResult = await api.writeBinaryFile(saveResult.filePath, dataUri)
      if (!exportResult.success) {
        alert(`Falha ao exportar PDF: ${exportResult.error}`)
      }
    }
  }

  // Copy Paste helpers
  function handleCopy() {
    if (selectedIds.length === 0) return
    const selectedElements = elements.filter(function(el) {
      return selectedIds.includes(el.id)
    })
    clipboardElementsRef.current = JSON.parse(JSON.stringify(selectedElements))
  }

  function handlePaste() {
    if (!clipboardElementsRef.current || clipboardElementsRef.current.length === 0) return

    const groupMap = new Map<string, string>()
    clipboardElementsRef.current.forEach(function(el) {
      if (el.groupId && !groupMap.has(el.groupId)) {
        groupMap.set(el.groupId, generateId())
      }
    })

    const duplicates = clipboardElementsRef.current.map(function(el) {
      const newId = generateId()
      const newGroupId = el.groupId ? groupMap.get(el.groupId) : undefined
      const offset = 20

      if (el.type === "pencil" || el.type === "line" || el.type === "arrow") {
        const points = el.points ? el.points.map(function(pt, idx) {
          return idx % 2 === 0 ? pt + offset : pt + offset
        }) : undefined
        return {
          ...el,
          id: newId,
          groupId: newGroupId,
          x: el.x + offset,
          y: el.y + offset,
          points
        }
      }

      return {
        ...el,
        id: newId,
        groupId: newGroupId,
        x: el.x + offset,
        y: el.y + offset
      }
    })

    const newElements = [...elements, ...duplicates]
    const duplicateIds = duplicates.map(function(d) { return d.id })

    // Update clipboard buffer with shifting offset so pasting repeatedly shifts elements
    clipboardElementsRef.current = duplicates

    setElements(newElements)
    setSelectedIds(duplicateIds)
    saveHistory()
  }

  // Hook Menu Actions from Electron Main process
  useEffect(function() {
    if (api) {
      const unsubscribe = api.onMenuAction(function(action) {
        switch (action) {
          case "new":
            handleNew()
            break
          case "open":
            handleOpen()
            break
          case "save":
            handleSave()
            break
          case "save-as":
            handleSaveAs()
            break
          case "undo":
            undo()
            break
          case "redo":
            redo()
            break
          case "delete":
            deleteElements()
            break
          case "duplicate":
            duplicateElements()
            break
          case "copy":
            handleCopy()
            break
          case "paste":
            handlePaste()
            break
          case "select-all":
            setSelectedIds(elements.map(function(el) { return el.id }))
            break
          case "export-png":
            handleExportImage("png")
            break
          case "export-jpg":
            handleExportImage("jpg")
            break
          case "export-pdf":
            handleExportPDF()
            break
        }
      })
        return unsubscribe
      }
      return undefined
    }, [elements, selectedIds, filePath, isDirty])

  // Native keyboard listener for shortcuts inside window
  useEffect(function() {
    function handleKeyDown(e: KeyboardEvent) {
      const isCmd = e.metaKey || e.ctrlKey
      const isShift = e.shiftKey
      
      // Ignore shortcut if typing in textarea or input fields
      if (document.activeElement?.tagName === "TEXTAREA" || document.activeElement?.tagName === "INPUT") {
        if (e.key === "Escape") {
          e.preventDefault()
          ;(document.activeElement as HTMLElement).blur()
        }
        return
      }

      if (isCmd && !isShift && e.key === "z") {
        e.preventDefault()
        undo()
      } else if (isCmd && isShift && e.key === "z") {
        e.preventDefault()
        redo()
      } else if (isCmd && e.key === "c") {
        e.preventDefault()
        handleCopy()
      } else if (isCmd && e.key === "v") {
        e.preventDefault()
        handlePaste()
      } else if (isCmd && e.key === "d") {
        e.preventDefault()
        duplicateElements()
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault()
        deleteElements()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return function() {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [elements, selectedIds])

  return <MainPage />
}
