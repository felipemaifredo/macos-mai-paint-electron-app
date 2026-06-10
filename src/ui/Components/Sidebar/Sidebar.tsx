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
  let activeTool = useCanvasStore(function(state) {
    return state.tool
  })
  let setTool = useCanvasStore(function(state) {
    return state.setTool
  })

  let [isHelpOpen, setIsHelpOpen] = useState(false)

  let tools: ToolItem[] = [
    { type: "select", icon: <MousePointer size={18} />, label: "Seleção", shortcut: "V" },
    { type: "rectangle", icon: <Square size={18} />, label: "Retângulo", shortcut: "R" },
    { type: "circle", icon: <CircleIcon size={18} />, label: "Círculo", shortcut: "O" },
    { type: "line", icon: <Minus size={18} />, label: "Linha", shortcut: "L" },
    { type: "arrow", icon: <ArrowRight size={18} />, label: "Seta", shortcut: "A" },
    { type: "text", icon: <Type size={18} />, label: "Texto", shortcut: "T" },
    { type: "pencil", icon: <Pencil size={18} />, label: "Caneta Livre", shortcut: "P" },
    { type: "eraser", icon: <Eraser size={18} />, label: "Borracha", shortcut: "E" }
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
        title="Atalhos e Ajuda"
      >
        <HelpCircle size={18} />
      </button>

      {isHelpOpen && (
        <div className={styles.modalBackdrop} onClick={function() { setIsHelpOpen(false) }}>
          <div className={styles.modalContent} onClick={function(e) { e.stopPropagation() }}>
            <div className={styles.modalHeader}>
              <h3>Atalhos de Teclado</h3>
              <button className={styles.closeButton} onClick={function() { setIsHelpOpen(false) }}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div>
                <div className={styles.categoryTitle}>Ferramentas</div>
                <div className={styles.shortcutList}>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Seleção</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>V</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Retângulo</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>R</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Círculo</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>O</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Linha</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>L</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Seta</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>A</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Texto</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>T</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Caneta Livre</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>P</kbd></span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Borracha</span>
                    <span className={styles.shortcutKeys}><kbd className={styles.keyCap}>E</kbd></span>
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.categoryTitle}>Edição & Tela</div>
                <div className={styles.shortcutList}>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Desfazer</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>Z</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Refazer</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>Shift</kbd>
                      <kbd className={styles.keyCap}>Z</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Copiar</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>C</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Colar</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>V</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Duplicar</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>D</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Selecionar Tudo</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>{cmdKey}</kbd>
                      <kbd className={styles.keyCap}>A</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Excluir Elemento</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>Del</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Mover Tela (Pan)</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>Espaço</kbd>
                      <span>+ Arrastar</span>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Alternar Grade</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>G</kbd>
                    </span>
                  </div>
                  <div className={styles.shortcutRow}>
                    <span className={styles.shortcutLabel}>Alinhamento Magnético</span>
                    <span className={styles.shortcutKeys}>
                      <kbd className={styles.keyCap}>S</kbd>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
