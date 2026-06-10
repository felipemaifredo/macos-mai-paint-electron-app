//Libs
import React, { useState, useEffect } from "react"
import {
  FolderPlus,
  File,
  MoreVertical,
  Trash2,
  Edit2,
  Download,
  FolderOpen,
  Search,
  Settings
} from "lucide-react"

//Imports
import { useCanvasStore } from "../../../Lib/Hooks/useCanvasStore"
import { CanvasElement } from "../../../Lib/Types/canvas.types"
import useI18n from "../../../Lib/Hooks/useI18n"
import styles from "./Dashboard.module.css"

//Types
type LocalProject = {
  id: string
  name: string
  elements: CanvasElement[]
  updatedAt: string
}

//Funcs
function getElementsBoundingBox(elements: CanvasElement[]) {
  if (elements.length === 0) {
    return { minX: 0, minY: 0, maxX: 800, maxY: 600 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  elements.forEach(function(el) {
    if (el.type === "pencil" || el.type === "line" || el.type === "arrow") {
      if (el.points) {
        for (let i = 0; i < el.points.length; i += 2) {
          let px = el.points[i]
          let py = el.points[i + 1]
          if (px < minX) minX = px
          if (px > maxX) maxX = px
          if (py < minY) minY = py
          if (py > maxY) maxY = py
        }
      }
    } else {
      let w = el.width ?? 0
      let h = el.height ?? 0
      let x1 = Math.min(el.x, el.x + w)
      let x2 = Math.max(el.x, el.x + w)
      let y1 = Math.min(el.y, el.y + h)
      let y2 = Math.max(el.y, el.y + h)
      
      if (x1 < minX) minX = x1
      if (x2 > maxX) maxX = x2
      if (y1 < minY) minY = y1
      if (y2 > maxY) maxY = y2
    }
  })

  return { minX, minY, maxX, maxY }
}

function drawElementsToCanvas(elements: CanvasElement[], canvas: HTMLCanvasElement) {
  let ctx = canvas.getContext("2d")
  if (!ctx) return

  elements.forEach(function(el) {
    ctx!.save()
    ctx!.globalAlpha = el.opacity ?? 1

    if (el.type === "rectangle") {
      ctx!.beginPath()
      ctx!.rect(el.x, el.y, el.width ?? 0, el.height ?? 0)
      if (el.fill && el.fill !== "transparent") {
        ctx!.fillStyle = el.fill
        ctx!.fill()
      }
      if (el.stroke && el.strokeWidth) {
        ctx!.strokeStyle = el.stroke
        ctx!.lineWidth = el.strokeWidth
        ctx!.stroke()
      }
    } else if (el.type === "circle") {
      let rx = (el.width ?? 0) / 2
      let ry = (el.height ?? 0) / 2
      let cx = el.x + rx
      let cy = el.y + ry
      ctx!.beginPath()
      ctx!.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI)
      if (el.fill && el.fill !== "transparent") {
        ctx!.fillStyle = el.fill
        ctx!.fill()
      }
      if (el.stroke && el.strokeWidth) {
        ctx!.strokeStyle = el.stroke
        ctx!.lineWidth = el.strokeWidth
        ctx!.stroke()
      }
    } else if (el.type === "line" || el.type === "arrow" || el.type === "pencil") {
      if (el.points && el.points.length >= 4) {
        ctx!.beginPath()
        ctx!.moveTo(el.points[0], el.points[1])
        for (let i = 2; i < el.points.length; i += 2) {
          ctx!.lineTo(el.points[i], el.points[i + 1])
        }
        ctx!.lineCap = "round"
        ctx!.lineJoin = "round"
        if (el.stroke && el.strokeWidth) {
          ctx!.strokeStyle = el.stroke
          ctx!.lineWidth = el.strokeWidth
          ctx!.stroke()
        }

        if (el.type === "arrow") {
          let len = el.points.length
          let x1 = el.points[len - 4]
          let y1 = el.points[len - 3]
          let x2 = el.points[len - 2]
          let y2 = el.points[len - 1]
          let angle = Math.atan2(y2 - y1, x2 - x1)
          let arrowLength = 10
          ctx!.beginPath()
          ctx!.moveTo(x2, y2)
          ctx!.lineTo(x2 - arrowLength * Math.cos(angle - Math.PI / 6), y2 - arrowLength * Math.sin(angle - Math.PI / 6))
          ctx!.lineTo(x2 - arrowLength * Math.cos(angle + Math.PI / 6), y2 - arrowLength * Math.sin(angle + Math.PI / 6))
          ctx!.closePath()
          ctx!.fillStyle = el.stroke
          ctx!.fill()
        }
      }
    } else if (el.type === "text") {
      ctx!.fillStyle = el.stroke || "#000000"
      let fontSize = el.fontSize ?? 14
      let fontFamily = el.fontFamily ?? "-apple-system"
      ctx!.font = `${fontSize}px ${fontFamily}`
      ctx!.textBaseline = "top"
      
      let text = el.text ?? ""
      let x = el.x
      let y = el.y
      let lines = text.split("\n")
      lines.forEach(function(lineText, idx) {
        ctx!.fillText(lineText, x, y + idx * (fontSize + 4))
      })
    }

    ctx!.restore()
  })
}

async function exportProjectToPng(name: string, elements: CanvasElement[], t: any) {
  if (elements.length === 0) {
    alert(t.dashboard.cannotExportEmpty)
    return
  }

  let bounds = getElementsBoundingBox(elements)
  let padding = 20
  let width = (bounds.maxX - bounds.minX) + padding * 2
  let height = (bounds.maxY - bounds.minY) + padding * 2

  let canvas = document.createElement("canvas")
  canvas.width = Math.max(100, width)
  canvas.height = Math.max(100, height)

  let ctx = canvas.getContext("2d")
  if (!ctx) return

  // Fill white background on the entire canvas before applying translation
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.translate(padding - bounds.minX, padding - bounds.minY)
  drawElementsToCanvas(elements, canvas)

  let dataUrl = canvas.toDataURL("image/png")
  let cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "-") || "projeto"
  let filename = `${cleanName}.png`

  let api = (window as any).api
  if (api) {
    let saveResult = await api.showSaveDialog(filename)
    if (saveResult.canceled || !saveResult.filePath) return
    let exportResult = await api.writeBinaryFile(saveResult.filePath, dataUrl)
    if (!exportResult.success) {
      alert(t.dashboard.failExportPng.replace("{error}", exportResult.error || ""))
    }
  } else {
    let a = document.createElement("a")
    a.href = dataUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

//Main
export const Dashboard = () => {
  let { t, locale, changeLanguage } = useI18n()
  let newProject = useCanvasStore(function(state) {
    return state.newProject
  })
  let openLocalProject = useCanvasStore(function(state) {
    return state.openLocalProject
  })

  let [projects, setProjects] = useState<LocalProject[]>([])
  let [searchQuery, setSearchQuery] = useState("")
  let [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  let [renamingProjectId, setRenamingProjectId] = useState<string | null>(null)
  let [renamingName, setRenamingName] = useState("")
  let [isSettingsOpen, setIsSettingsOpen] = useState(false)

  function openSettings() {
    setIsSettingsOpen(true)
  }

  function closeSettings() {
    setIsSettingsOpen(false)
  }

  function loadProjects() {
    let projectsRaw = localStorage.getItem("mai_paint_local_projects")
    let loaded: LocalProject[] = projectsRaw ? JSON.parse(projectsRaw) : []
    // Sort by updated date descending
    loaded.sort(function(a, b) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
    setProjects(loaded)
  }

  useEffect(function() {
    loadProjects()
    
    // Close dropdown menu on click outside
    function handleClickOutside() {
      setActiveMenuId(null)
    }
    window.addEventListener("click", handleClickOutside)
    return function() {
      window.removeEventListener("click", handleClickOutside)
    }
  }, [])

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    let confirm = window.confirm(t.dashboard.confirmDelete)
    if (!confirm) return

    let projectsRaw = localStorage.getItem("mai_paint_local_projects")
    if (projectsRaw) {
      let list: LocalProject[] = JSON.parse(projectsRaw)
      let filtered = list.filter(function(p) { return p.id !== id })
      localStorage.setItem("mai_paint_local_projects", JSON.stringify(filtered))
      loadProjects()
    }
    setActiveMenuId(null)
  }

  function handleStartRename(project: LocalProject, e: React.MouseEvent) {
    e.stopPropagation()
    setRenamingProjectId(project.id)
    setRenamingName(project.name)
    setActiveMenuId(null)
  }

  function handleFinishRename(id: string) {
    let newName = renamingName.trim()
    if (newName && renamingProjectId) {
      let projectsRaw = localStorage.getItem("mai_paint_local_projects")
      if (projectsRaw) {
        let list: LocalProject[] = JSON.parse(projectsRaw)
        let index = list.findIndex(function(p) { return p.id === id })
        if (index !== -1) {
          list[index].name = newName
          list[index].updatedAt = new Date().toISOString()
          localStorage.setItem("mai_paint_local_projects", JSON.stringify(list))
          loadProjects()
        }
      }
    }
    setRenamingProjectId(null)
  }

  function handleExport(project: LocalProject, e: React.MouseEvent) {
    e.stopPropagation()
    exportProjectToPng(project.name, project.elements, t)
    setActiveMenuId(null)
  }

  function handleMenuToggle(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setActiveMenuId(activeMenuId === id ? null : id)
  }

  function formatDate(isoString: string) {
    let date = new Date(isoString)
    let dateLocale = locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US"
    return date.toLocaleDateString(dateLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  let filteredProjects = projects.filter(function(p) {
    return p.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>{t.dashboard.title}</span>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <Search size={13} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t.dashboard.searchPlaceholder}
              value={searchQuery}
              onChange={function(e) { setSearchQuery(e.target.value) }}
            />
          </div>
          <button
            className={styles.settingsButton}
            onClick={openSettings}
            title={t.dashboard.settings}
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          {/* New Project Card */}
          <div className={`${styles.card} ${styles.newProjectCard}`} onClick={newProject}>
            <FolderPlus size={36} className={styles.plusIcon} />
            <span className={styles.newProjectText}>{t.dashboard.createNew}</span>
          </div>

          {/* List of local storage projects */}
          {filteredProjects.map(function(project) {
            let isRenaming = renamingProjectId === project.id
            let isMenuOpen = activeMenuId === project.id

            return (
              <div
                key={project.id}
                className={styles.card}
                onClick={function() {
                  if (!isRenaming) {
                    openLocalProject(project.id, project.name, project.elements)
                  }
                }}
              >
                <button
                  className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonActive : ""}`}
                  onClick={function(e) { handleMenuToggle(project.id, e) }}
                >
                  <MoreVertical size={16} />
                </button>

                {isMenuOpen && (
                  <div className={styles.dropdown} onClick={function(e) { e.stopPropagation() }}>
                    <button
                      className={styles.dropdownItem}
                      onClick={function() { openLocalProject(project.id, project.name, project.elements) }}
                    >
                      <FolderOpen size={13} />
                      {t.dashboard.open}
                    </button>
                    <button
                      className={styles.dropdownItem}
                      onClick={function(e) { handleStartRename(project, e) }}
                    >
                      <Edit2 size={13} />
                      {t.dashboard.rename}
                    </button>
                    <button
                      className={styles.dropdownItem}
                      onClick={function(e) { handleExport(project, e) }}
                    >
                      <Download size={13} />
                      {t.dashboard.exportPng}
                    </button>
                    <button
                      className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                      onClick={function(e) { handleDelete(project.id, e) }}
                    >
                      <Trash2 size={13} />
                      {t.dashboard.delete}
                    </button>
                  </div>
                )}

                <div className={styles.fileIconWrapper}>
                  <File size={32} />
                </div>

                {isRenaming ? (
                  <input
                    type="text"
                    className={styles.renameInput}
                    autoFocus
                    value={renamingName}
                    onChange={function(e) { setRenamingName(e.target.value) }}
                    onBlur={function() { handleFinishRename(project.id) }}
                    onKeyDown={function(e) {
                      if (e.key === "Enter") {
                        handleFinishRename(project.id)
                      }
                      if (e.key === "Escape") {
                        setRenamingProjectId(null)
                      }
                    }}
                    onClick={function(e) { e.stopPropagation() }}
                  />
                ) : (
                  <span className={styles.projectName} title={project.name}>
                    {project.name}
                  </span>
                )}

                <span className={styles.projectInfo}>
                  {project.elements.length} {project.elements.length === 1 ? t.dashboard.element : t.dashboard.elements}
                </span>
                <span className={styles.projectInfo} style={{ fontSize: "9px", marginTop: "4px" }}>
                  {formatDate(project.updatedAt)}
                </span>
              </div>
            )
          })}
        </div>

        {filteredProjects.length === 0 && searchQuery !== "" && (
          <div className={styles.emptyState}>
            <span className={styles.emptyStateText}>{t.dashboard.noProjects.replace("{query}", searchQuery)}</span>
          </div>
        )}
      </div>

      {isSettingsOpen && (
        <div className={styles.modalBackdrop} onClick={closeSettings}>
          <div className={styles.modalContent} onClick={function(e) { e.stopPropagation() }}>
            <div className={styles.modalHeader}>
              <h3>{t.dashboard.settings}</h3>
              <button className={styles.closeButton} onClick={closeSettings}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.settingsSection}>
                <div className={styles.sectionTitle}>{t.properties.language}</div>
                <div className={styles.langButtonGroup}>
                  <button
                    className={`${styles.langButton} ${locale === "en" ? styles.langButtonActive : ""}`}
                    onClick={function() { changeLanguage("en") }}
                  >
                    English
                  </button>
                  <button
                    className={`${styles.langButton} ${locale === "pt" ? styles.langButtonActive : ""}`}
                    onClick={function() { changeLanguage("pt") }}
                  >
                    Português
                  </button>
                  <button
                    className={`${styles.langButton} ${locale === "es" ? styles.langButtonActive : ""}`}
                    onClick={function() { changeLanguage("es") }}
                  >
                    Español
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
