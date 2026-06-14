//Libs
import React, { useState } from "react"
import {
  MousePointer,
  Square,
  Circle as CircleIcon,
  Minus,
  ArrowRight,
  Type,
  Pencil,
  Eraser,
  HelpCircle
} from "lucide-react"

//Imports
import { useCanvasStore } from "../../../Lib/Hooks/useCanvasStore"
import { ToolType } from "../../../Lib/Types/canvas.types"
import useI18n from "../../../Lib/Hooks/useI18n"
import styles from "./Sidebar.module.css"

//Types
type ToolItem = {
  type: ToolType
  icon: React.ReactNode
  label: string
  shortcut: string
}

//Main
export const Sidebar = () => {
  let { t, locale, changeLanguage } = useI18n()
  let activeTool = useCanvasStore(function(state) {
    return state.tool
  })
  let setTool = useCanvasStore(function(state) {
    return state.setTool
  })

  let [isHelpOpen, setIsHelpOpen] = useState(false)

  let tools: ToolItem[] = [
    { type: "select", icon: <MousePointer size={18} />, label: t.sidebar.select, shortcut: "V" },
    { type: "rectangle", icon: <Square size={18} />, label: t.sidebar.rectangle, shortcut: "R" },
    { type: "circle", icon: <CircleIcon size={18} />, label: t.sidebar.circle, shortcut: "O" },
    { type: "line", icon: <Minus size={18} />, label: t.sidebar.line, shortcut: "L" },
    { type: "arrow", icon: <ArrowRight size={18} />, label: t.sidebar.arrow, shortcut: "A" },
    { type: "text", icon: <Type size={18} />, label: t.sidebar.text, shortcut: "T" },
    { type: "pencil", icon: <Pencil size={18} />, label: t.sidebar.pencil, shortcut: "P" },
    { type: "eraser", icon: <Eraser size={18} />, label: t.sidebar.eraser, shortcut: "E" }
  ]

  let isMac = window.navigator.userAgent.indexOf("Mac") !== -1
  let cmdKey = isMac ? "⌘" : "Ctrl"

  return (
    <div className={styles.sidebar}>
      <div className={styles.toolsGroup}>
        {tools.map(function(tool) {
          let isActive = activeTool === tool.type
          
          return (
            <button
              key={tool.type}
              className={`${styles.toolButton} ${isActive ? styles.active : ""}`}
              onClick={function() {
                setTool(tool.type)
              }}
              title={`${tool.label} (${tool.shortcut})`}
            >
              {tool.icon}
            </button>
          )
        })}
      </div>

      <button
        className={styles.toolButton}
        onClick={function() {
          setIsHelpOpen(true)
        }}
        title={t.sidebar.helpTooltip}
      >
        <HelpCircle size={18} />
      </button>

      {isHelpOpen && (
        <div className={styles.modalBackdrop} onClick={function() { setIsHelpOpen(false) }}>
          <div className={styles.modalContent} onClick={function(e) { e.stopPropagation() }}>
            <div className={styles.modalHeader}>
              <h3>{t.sidebar.modalTitle}</h3>
              <button className={styles.closeButton} onClick={function() { setIsHelpOpen(false) }}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div>
                <div className={styles.categoryTitle}>{t.sidebar.modalCategoryTools}</div>
                <div className={styles.shortcutList}>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.select}</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>V</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.rectangle}</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>R</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.circle}</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>O</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.line}</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>L</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.arrow}</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>A</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.text}</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>T</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.pencil}</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>P</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.eraser}</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>E</kbd></span>
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.categoryTitle}>{t.sidebar.modalCategoryEdit}</div>
                <div className={styles.shortcutList}>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.undo}</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>Z</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.redo}</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>Shift</kbd>
                      <kbd className={styles.keyCap}>Z</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.copy}</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>C</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.paste}</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>V</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.duplicate}</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>D</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.selectAll}</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>A</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.deleteElement}</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>Del</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.pan}</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{t.sidebar.space}</kbd>
                      <span>+ {t.sidebar.drag}</span>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.toggleGrid}</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>G</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>{t.sidebar.snapToGrid}</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>S</kbd>
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div className={styles.categoryTitle}>{t.properties.language}</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <button
                    style={{
                      padding: "6px 12px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      background: locale === "en" ? "#007aff" : "rgba(255,255,255,0.05)",
                      color: "#ffffff",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "all 0.2s"
                    }}
                    onClick={function() { changeLanguage("en") }}
                  >
                    English
                  </button>
                  <button
                    style={{
                      padding: "6px 12px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      background: locale === "pt" ? "#007aff" : "rgba(255,255,255,0.05)",
                      color: "#ffffff",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "all 0.2s"
                    }}
                    onClick={function() { changeLanguage("pt") }}
                  >
                    Português
                  </button>
                  <button
                    style={{
                      padding: "6px 12px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      background: locale === "es" ? "#007aff" : "rgba(255,255,255,0.05)",
                      color: "#ffffff",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "all 0.2s"
                    }}
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
