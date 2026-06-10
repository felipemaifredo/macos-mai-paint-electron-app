//Libs
import {
  Copy,
  Trash2,
  FolderPlus,
  FolderMinus
} from "lucide-react"

//Imports
import { useCanvasStore } from "../../../Lib/Hooks/useCanvasStore"
import styles from "./PropertiesPanel.module.css"

//Main
export const PropertiesPanel = () => {
  const selectedIds = useCanvasStore(function(state) {
    return state.selectedIds
  })
  const elements = useCanvasStore(function(state) {
    return state.elements
  })
  const activeTool = useCanvasStore(function(state) {
    return state.tool
  })

  // Style attributes
  const fill = useCanvasStore(function(state) {
    return state.fill
  })
  const stroke = useCanvasStore(function(state) {
    return state.stroke
  })
  const strokeWidth = useCanvasStore(function(state) {
    return state.strokeWidth
  })
  const opacity = useCanvasStore(function(state) {
    return state.opacity
  })
  const fontSize = useCanvasStore(function(state) {
    return state.fontSize
  })
  const fontFamily = useCanvasStore(function(state) {
    return state.fontFamily
  })

  // Actions
  const setStyle = useCanvasStore(function(state) {
    return state.setStyle
  })
  const deleteElements = useCanvasStore(function(state) {
    return state.deleteElements
  })
  const duplicateElements = useCanvasStore(function(state) {
    return state.duplicateElements
  })
  const groupElements = useCanvasStore(function(state) {
    return state.groupElements
  })
  const ungroupElements = useCanvasStore(function(state) {
    return state.ungroupElements
  })

  // If there are selected elements, display their properties
  let firstSelected = elements.find(function(el) {
    return selectedIds.includes(el.id)
  })

  let currentFill = firstSelected ? firstSelected.fill : fill
  let currentStroke = firstSelected ? firstSelected.stroke : stroke
  let currentStrokeWidth = firstSelected ? firstSelected.strokeWidth : strokeWidth
  let currentOpacity = firstSelected ? firstSelected.opacity : opacity
  let currentFontSize = firstSelected ? firstSelected.fontSize ?? fontSize : fontSize
  let currentFontFamily = firstSelected ? firstSelected.fontFamily ?? fontFamily : fontFamily

  let hasTextSelected = elements.some(function(el) {
    return selectedIds.includes(el.id) && el.type === "text"
  })
  let showTextProperties = hasTextSelected || activeTool === "text"

  let isGroupEnabled = selectedIds.length >= 2
  let isUngroupEnabled = elements.some(function(el) {
    return selectedIds.includes(el.id) && el.groupId !== undefined
  })

  let isFillTransparent = currentFill === "transparent"

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <span className={styles.sectionHeader}>Preenchimento</span>
        <div className={styles.row}>
          <span className={styles.label}>Cor</span>
          <div className={styles.colorPickerWrapper}>
            <div className={styles.colorPickerContainer}>
              <button
                className={styles.colorButton}
                style={{ backgroundColor: isFillTransparent ? "transparent" : currentFill }}
                title="Escolher Cor"
              />
              <input
                type="color"
                className={styles.colorInput}
                disabled={isFillTransparent}
                value={isFillTransparent ? "#ffffff" : currentFill.startsWith("rgba") ? "#007aff" : currentFill}
                onChange={function(e) {
                  setStyle({ fill: e.target.value })
                }}
              />
            </div>
            <button
              className={`${styles.checkboxButton} ${isFillTransparent ? styles.checkboxButtonActive : ""}`}
              onClick={function() {
                setStyle({ fill: isFillTransparent ? "rgba(0, 122, 255, 0.1)" : "transparent" })
              }}
              title="Preenchimento Transparente"
            >
              Nenhum
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionHeader}>Contorno</span>
        <div className={styles.row}>
          <span className={styles.label}>Cor</span>
          <div className={styles.colorPickerWrapper}>
            <div className={styles.colorPickerContainer}>
              <button
                className={styles.colorButton}
                style={{ backgroundColor: currentStroke }}
                title="Escolher Cor"
              />
              <input
                type="color"
                className={styles.colorInput}
                value={currentStroke}
                onChange={function(e) {
                  setStyle({ stroke: e.target.value })
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Espessura</span>
          <input
            type="range"
            min="1"
            max="15"
            className={styles.slider}
            value={currentStrokeWidth}
            onChange={function(e) {
              setStyle({ strokeWidth: parseInt(e.target.value, 10) })
            }}
          />
          <input
            type="number"
            min="1"
            max="15"
            className={styles.inputNumber}
            value={currentStrokeWidth}
            onChange={function(e) {
              setStyle({ strokeWidth: Math.max(1, parseInt(e.target.value, 10) || 1) })
            }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionHeader}>Opacidade</span>
        <div className={styles.row}>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            className={styles.slider}
            value={currentOpacity}
            onChange={function(e) {
              setStyle({ opacity: parseFloat(e.target.value) })
            }}
          />
          <span className={styles.label} style={{ width: "36px", textAlign: "right" }}>
            {Math.round(currentOpacity * 100)}%
          </span>
        </div>
      </div>

      {showTextProperties && (
        <div className={styles.section}>
          <span className={styles.sectionHeader}>Texto</span>
          <div className={styles.row}>
            <span className={styles.label}>Fonte</span>
            <select
              className={styles.select}
              value={currentFontFamily}
              onChange={function(e) {
                setStyle({ fontFamily: e.target.value })
              }}
            >
              <option value="-apple-system">Sistema macOS</option>
              <option value="Inter">Inter</option>
              <option value="monospace">Monoespaçada</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
              <option value="Impact">Impact</option>
            </select>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Tamanho</span>
            <input
              type="range"
              min="10"
              max="72"
              className={styles.slider}
              value={currentFontSize}
              onChange={function(e) {
                setStyle({ fontSize: parseInt(e.target.value, 10) })
              }}
            />
            <input
              type="number"
              min="10"
              max="72"
              className={styles.inputNumber}
              value={currentFontSize}
              onChange={function(e) {
                setStyle({ fontSize: Math.max(10, parseInt(e.target.value, 10) || 10) })
              }}
            />
          </div>
        </div>
      )}

      <div className={styles.section}>
        <span className={styles.sectionHeader}>Ações Rápidas</span>
        <div className={styles.buttonGrid}>
          <button
            className={styles.actionButton}
            onClick={duplicateElements}
            disabled={selectedIds.length === 0}
            title="Duplicar Elementos Selecionados"
          >
            <Copy size={14} />
            Duplicar
          </button>
          <button
            className={`${styles.actionButton} ${styles.dangerButton}`}
            onClick={deleteElements}
            disabled={selectedIds.length === 0}
            title="Excluir Elementos Selecionados"
          >
            <Trash2 size={14} />
            Excluir
          </button>
          <button
            className={styles.actionButton}
            onClick={groupElements}
            disabled={!isGroupEnabled}
            title="Agrupar Elementos"
          >
            <FolderPlus size={14} />
            Agrupar
          </button>
          <button
            className={styles.actionButton}
            onClick={ungroupElements}
            disabled={!isUngroupEnabled}
            title="Desagrupar Elementos"
          >
            <FolderMinus size={14} />
            Desagrupar
          </button>
        </div>
      </div>
    </div>
  )
}
