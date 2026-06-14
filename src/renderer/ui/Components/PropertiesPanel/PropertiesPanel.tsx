//Libs
import {
  Copy,
  Trash2,
  FolderPlus,
  FolderMinus
} from "lucide-react"

//Imports
import { useCanvasStore } from "../../../Lib/Hooks/useCanvasStore"
import useI18n from "../../../Lib/Hooks/useI18n"
import styles from "./PropertiesPanel.module.css"

//Main
export const PropertiesPanel = () => {
  const { t } = useI18n()
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
        <span className={styles.sectionHeader}>{t.properties.fill}</span>
        <div className={styles.row}>
          <span className={styles.label}>{t.properties.color}</span>
          <div className={styles.colorPickerWrapper}>
            <div className={styles.colorPickerContainer}>
              <button
                className={styles.colorButton}
                style={{ backgroundColor: isFillTransparent ? "transparent" : currentFill }}
                title={t.properties.chooseColor}
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
              title={t.properties.transparentFill}
            >
              {t.properties.none}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionHeader}>{t.properties.stroke}</span>
        <div className={styles.row}>
          <span className={styles.label}>{t.properties.color}</span>
          <div className={styles.colorPickerWrapper}>
            <div className={styles.colorPickerContainer}>
              <button
                className={styles.colorButton}
                style={{ backgroundColor: currentStroke }}
                title={t.properties.chooseColor}
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
          <span className={styles.label}>{t.properties.strokeWidth}</span>
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
        <span className={styles.sectionHeader}>{t.properties.opacity}</span>
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
          <span className={styles.sectionHeader}>{t.properties.text}</span>
          <div className={styles.row}>
            <span className={styles.label}>{t.properties.font}</span>
            <select
              className={styles.select}
              value={currentFontFamily}
              onChange={function(e) {
                setStyle({ fontFamily: e.target.value })
              }}
            >
              <option value="-apple-system">{t.properties.systemFont}</option>
              <option value="Inter">Inter</option>
              <option value="monospace">{t.properties.monospaceFont}</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
              <option value="Impact">Impact</option>
            </select>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>{t.properties.fontSize}</span>
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
        <span className={styles.sectionHeader}>{t.properties.quickActions}</span>
        <div className={styles.buttonGrid}>
          <button
            className={styles.actionButton}
            onClick={duplicateElements}
            disabled={selectedIds.length === 0}
            title={t.properties.duplicateTooltip}
          >
            <Copy size={14} />
            {t.properties.duplicateBtn}
          </button>
          <button
            className={`${styles.actionButton} ${styles.dangerButton}`}
            onClick={deleteElements}
            disabled={selectedIds.length === 0}
            title={t.properties.deleteTooltip}
          >
            <Trash2 size={14} />
            {t.properties.deleteBtn}
          </button>
          <button
            className={styles.actionButton}
            onClick={groupElements}
            disabled={!isGroupEnabled}
            title={t.properties.groupTooltip}
          >
            <FolderPlus size={14} />
            {t.properties.groupBtn}
          </button>
          <button
            className={styles.actionButton}
            onClick={ungroupElements}
            disabled={!isUngroupEnabled}
            title={t.properties.ungroupTooltip}
          >
            <FolderMinus size={14} />
            {t.properties.ungroupBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
