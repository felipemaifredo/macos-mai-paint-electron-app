//Libs
import { create } from "zustand"

//Imports
import { CanvasElement, ToolType, ElementStyle } from "../Types/canvas.types"

//Types
type CanvasStore = {
  elements: CanvasElement[]
  tool: ToolType
  selectedIds: string[]
  
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  fontSize: number
  fontFamily: string
  align: "left" | "center" | "right"

  showGrid: boolean
  snapToGrid: boolean

  zoom: number
  pan: { x: number; y: number }

  history: CanvasElement[][]
  historyIndex: number

  filePath: string | null
  isDirty: boolean

  view: "dashboard" | "editor"
  currentProjectId: string | null
  currentProjectName: string

  setView: (view: "dashboard" | "editor") => void
  setCurrentProject: (id: string | null, name: string) => void
  renameCurrentProject: (name: string) => void
  openLocalProject: (id: string, name: string, elements: CanvasElement[]) => void

  setTool: (tool: ToolType) => void
  setSelectedIds: (ids: string[]) => void
  setElements: (elements: CanvasElement[]) => void
  addElement: (element: CanvasElement) => void
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  deleteElements: () => void
  duplicateElements: () => void
  groupElements: () => void
  ungroupElements: () => void
  setStyle: (style: Partial<ElementStyle>) => void
  
  setShowGrid: (showGrid: boolean) => void
  setSnapToGrid: (snapToGrid: boolean) => void
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void

  undo: () => void
  redo: () => void
  saveHistory: () => void

  newProject: () => void
  openProject: (filePath: string, elements: CanvasElement[]) => void
  saveProject: (filePath: string) => void
  setDirty: (isDirty: boolean) => void
}

//Funcs
function getInitialProjectName(): string {
  let saved = localStorage.getItem("app-language") || navigator.language.toLowerCase()
  if (saved.startsWith("pt")) {
    return "Sem título"
  }
  if (saved.startsWith("es")) {
    return "Sin título"
  }
  return "Untitled"
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function saveToLocalStorage(id: string | null, name: string, elements: CanvasElement[]) {
  if (!id) return
  let projectsRaw = localStorage.getItem("mai_paint_local_projects")
  let projects: any[] = projectsRaw ? JSON.parse(projectsRaw) : []
  let index = projects.findIndex(function(p) { return p.id === id })
  let updatedProject = {
    id,
    name,
    elements,
    updatedAt: new Date().toISOString()
  }
  if (index !== -1) {
    projects[index] = updatedProject
  } else {
    projects.push(updatedProject)
  }
  localStorage.setItem("mai_paint_local_projects", JSON.stringify(projects))
}

//Main
export const useCanvasStore = create<CanvasStore>((set, get) => ({
  elements: [],
  tool: "select",
  selectedIds: [],

  fill: "rgba(0, 122, 255, 0.1)", // macOS light blue fill
  stroke: "#007aff", // macOS accent blue
  strokeWidth: 2,
  opacity: 1,
  fontSize: 14,
  fontFamily: "-apple-system",
  align: "left",

  showGrid: true,
  snapToGrid: true,

  zoom: 1,
  pan: { x: 0, y: 0 },

  history: [[]],
  historyIndex: 0,

  filePath: null,
  isDirty: false,

  view: "dashboard",
  currentProjectId: null,
  currentProjectName: getInitialProjectName(),

  setView(view) {
    set({ view })
  },

  setCurrentProject(id, name) {
    set({ currentProjectId: id, currentProjectName: name })
  },

  renameCurrentProject(name) {
    let id = get().currentProjectId
    set({ currentProjectName: name })
    if (id) {
      saveToLocalStorage(id, name, get().elements)
    }
  },

  openLocalProject(id, name, elements) {
    set({
      view: "editor",
      currentProjectId: id,
      currentProjectName: name,
      elements,
      selectedIds: [],
      history: [elements],
      historyIndex: 0,
      filePath: null,
      isDirty: false,
      zoom: 1,
      pan: { x: 0, y: 0 }
    })
  },

  setTool(tool) {
    // When changing tools (except to selection/eraser), clear selection to avoid confusion
    let selectedIds = tool === "select" || tool === "eraser" ? get().selectedIds : []
    set({ tool, selectedIds })
  },

  setSelectedIds(selectedIds) {
    set({ selectedIds })
  },

  setElements(elements) {
    set({ elements })
  },

  addElement(element) {
    let newElements = [...get().elements, element]
    set({ elements: newElements })
    get().saveHistory()
    saveToLocalStorage(get().currentProjectId, get().currentProjectName, newElements)
  },

  updateElement(id, updates) {
    let newElements = get().elements.map(function(el) {
      if (el.id === id) {
        return { ...el, ...updates }
      }
      return el
    })
    set({ elements: newElements, isDirty: true })
    saveToLocalStorage(get().currentProjectId, get().currentProjectName, newElements)
  },

  deleteElements() {
    let { elements, selectedIds } = get()
    if (selectedIds.length === 0) return

    // Find all selected elements including members of groups if any selected element is a group
    let groupsToDelete = new Set<string>()
    elements.forEach(function(el) {
      if (selectedIds.includes(el.id) && el.groupId) {
        groupsToDelete.add(el.groupId)
      }
    })

    let newElements = elements.filter(function(el) {
      let isSelected = selectedIds.includes(el.id)
      let isInDeletedGroup = el.groupId && groupsToDelete.has(el.groupId)
      return !isSelected && !isInDeletedGroup
    })

    set({ elements: newElements, selectedIds: [] })
    get().saveHistory()
    saveToLocalStorage(get().currentProjectId, get().currentProjectName, newElements)
  },

  duplicateElements() {
    let { elements, selectedIds } = get()
    if (selectedIds.length === 0) return

    let selectedElements = elements.filter(function(el) {
      return selectedIds.includes(el.id)
    })

    // Map old groupId to a new groupId so duplicates remain grouped together but separate
    let groupMap = new Map<string, string>()
    selectedElements.forEach(function(el) {
      if (el.groupId && !groupMap.has(el.groupId)) {
        groupMap.set(el.groupId, generateId())
      }
    })

    let duplicates = selectedElements.map(function(el) {
      let newId = generateId()
      let newGroupId = el.groupId ? groupMap.get(el.groupId) : undefined
      
      // Shift duplicate elements slightly (offset 20px)
      let dx = 20
      let dy = 20

      if (el.type === "pencil" || el.type === "line" || el.type === "arrow") {
        let points = el.points ? el.points.map(function(pt, idx) {
          return idx % 2 === 0 ? pt + dx : pt + dy
        }) : undefined
        return {
          ...el,
          id: newId,
          groupId: newGroupId,
          x: 0,
          y: 0,
          points
        }
      }

      return {
        ...el,
        id: newId,
        groupId: newGroupId,
        x: el.x + dx,
        y: el.y + dy
      }
    })

    let newElements = [...elements, ...duplicates]
    let duplicateIds = duplicates.map(function(d) { return d.id })

    set({ elements: newElements, selectedIds: duplicateIds })
    get().saveHistory()
    saveToLocalStorage(get().currentProjectId, get().currentProjectName, newElements)
  },

  groupElements() {
    let { elements, selectedIds } = get()
    if (selectedIds.length < 2) return

    let newGroupId = generateId()
    let newElements = elements.map(function(el) {
      if (selectedIds.includes(el.id)) {
        return { ...el, groupId: newGroupId }
      }
      return el
    })

    set({ elements: newElements })
    get().saveHistory()
    saveToLocalStorage(get().currentProjectId, get().currentProjectName, newElements)
  },

  ungroupElements() {
    let { elements, selectedIds } = get()
    if (selectedIds.length === 0) return

    // Find all groupIds associated with the selected elements
    let groupsToUngroup = new Set<string>()
    elements.forEach(function(el) {
      if (selectedIds.includes(el.id) && el.groupId) {
        groupsToUngroup.add(el.groupId)
      }
    })

    if (groupsToUngroup.size === 0) return

    let newElements = elements.map(function(el) {
      if (el.groupId && groupsToUngroup.has(el.groupId)) {
        let { groupId: _, ...rest } = el
        return rest as CanvasElement
      }
      return el
    })

    set({ elements: newElements })
    get().saveHistory()
    saveToLocalStorage(get().currentProjectId, get().currentProjectName, newElements)
  },

  setStyle(style) {
    set(style)
    // If elements are selected, apply styles to them and save history
    let { selectedIds, elements } = get()
    if (selectedIds.length > 0) {
      let newElements = elements.map(function(el) {
        if (selectedIds.includes(el.id)) {
          return { ...el, ...style }
        }
        return el
      })
      set({ elements: newElements })
      get().saveHistory()
      saveToLocalStorage(get().currentProjectId, get().currentProjectName, newElements)
    }
  },

  setShowGrid(showGrid) {
    set({ showGrid })
  },

  setSnapToGrid(snapToGrid) {
    set({ snapToGrid })
  },

  setZoom(zoom) {
    set({ zoom: Math.max(0.1, Math.min(10, zoom)) })
  },

  setPan(pan) {
    set({ pan })
  },

  undo() {
    let { history, historyIndex } = get()
    if (historyIndex > 0) {
      let prevIndex = historyIndex - 1
      let prevElements = history[prevIndex]
      set({
        elements: prevElements,
        historyIndex: prevIndex,
        selectedIds: [],
        isDirty: true
      })
      saveToLocalStorage(get().currentProjectId, get().currentProjectName, prevElements)
    }
  },

  redo() {
    let { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      let nextIndex = historyIndex + 1
      let nextElements = history[nextIndex]
      set({
        elements: nextElements,
        historyIndex: nextIndex,
        selectedIds: [],
        isDirty: true
      })
      saveToLocalStorage(get().currentProjectId, get().currentProjectName, nextElements)
    }
  },

  saveHistory() {
    let { elements, history, historyIndex } = get()
    
    // Check if the state actually changed from the last history item to avoid duplicates
    let lastState = history[historyIndex]
    if (JSON.stringify(lastState) === JSON.stringify(elements)) {
      return
    }

    let newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(elements)))
    
    // Limit history stack size to 50
    if (newHistory.length > 50) {
      newHistory.shift()
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true
    })
  },

  newProject() {
    let id = generateId()
    let name = getInitialProjectName()
    set({
      view: "editor",
      currentProjectId: id,
      currentProjectName: name,
      elements: [],
      selectedIds: [],
      history: [[]],
      historyIndex: 0,
      filePath: null,
      isDirty: false,
      zoom: 1,
      pan: { x: 0, y: 0 }
    })
    saveToLocalStorage(id, name, [])
  },

  openProject(filePath, elements) {
    let parts = filePath.split(/[/\\]/)
    let filename = parts[parts.length - 1].replace(/\.maipaint$/, "")
    let id = generateId()
    set({
      view: "editor",
      currentProjectId: id,
      currentProjectName: filename,
      elements,
      selectedIds: [],
      history: [elements],
      historyIndex: 0,
      filePath,
      isDirty: false,
      zoom: 1,
      pan: { x: 0, y: 0 }
    })
    saveToLocalStorage(id, filename, elements)
  },

  saveProject(filePath) {
    set({
      filePath,
      isDirty: false
    })
  },

  setDirty(isDirty) {
    set({ isDirty })
  }
}))
