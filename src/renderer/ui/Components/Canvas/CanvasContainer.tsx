//Libs
import React, { useState, useRef, useEffect } from "react"
import { Stage, Layer, Transformer, Rect } from "react-konva"
import {
  ZoomIn,
  ZoomOut,
  Grid,
  Magnet
} from "lucide-react"

//Imports
import { useCanvasStore } from "../../../Lib/Hooks/useCanvasStore"
import { CanvasElement } from "./CanvasElement"
import { CanvasElement as CanvasElementType } from "../../../Lib/Types/canvas.types"
import styles from "./CanvasContainer.module.css"

//Types
type TextEditorState = {
  id: string
  x: number
  y: number
  width: number
  height: number
  text: string
  fontSize: number
  fontFamily: string
  isNew: boolean
}

type SelectionRect = {
  x1: number
  y1: number
  x2: number
  y2: number
}

//Funcs
function snap(val: number, step: number = 20) {
  return Math.round(val / step) * step
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

//Main
export const CanvasContainer = () => {
  const elements = useCanvasStore(function(state) {
    return state.elements
  })
  const tool = useCanvasStore(function(state) {
    return state.tool
  })
  const selectedIds = useCanvasStore(function(state) {
    return state.selectedIds
  })
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

  // Viewport Settings
  const showGrid = useCanvasStore(function(state) {
    return state.showGrid
  })
  const snapToGrid = useCanvasStore(function(state) {
    return state.snapToGrid
  })
  const zoom = useCanvasStore(function(state) {
    return state.zoom
  })
  const pan = useCanvasStore(function(state) {
    return state.pan
  })

  // Store Actions
  const setSelectedIds = useCanvasStore(function(state) {
    return state.setSelectedIds
  })
  const setElements = useCanvasStore(function(state) {
    return state.setElements
  })
  const addElement = useCanvasStore(function(state) {
    return state.addElement
  })
  const updateElement = useCanvasStore(function(state) {
    return state.updateElement
  })
  const deleteElements = useCanvasStore(function(state) {
    return state.deleteElements
  })
  const saveHistory = useCanvasStore(function(state) {
    return state.saveHistory
  })
  const setShowGrid = useCanvasStore(function(state) {
    return state.setShowGrid
  })
  const setSnapToGrid = useCanvasStore(function(state) {
    return state.setSnapToGrid
  })
  const setZoom = useCanvasStore(function(state) {
    return state.setZoom
  })
  const setPan = useCanvasStore(function(state) {
    return state.setPan
  })

  // Local component states
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [drawingElement, setDrawingElement] = useState<CanvasElementType | null>(null)
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null)
  const [textEditor, setTextEditor] = useState<TextEditorState | null>(null)
  let [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Listen to container resizes using ResizeObserver to adjust Stage size dynamically
  useEffect(function() {
    if (!containerRef.current) return
    let container = containerRef.current
    let resizeObserver = new ResizeObserver(function(entries) {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        })
      }
    })
    resizeObserver.observe(container)
    return function() {
      resizeObserver.disconnect()
    }
  }, [])

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })

  // Listen to global Spacebar keydown for panning cursor
  useEffect(function() {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space" && document.activeElement?.tagName !== "TEXTAREA" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        setIsSpacePressed(true)
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.code === "Space") {
        setIsSpacePressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return function() {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Update Transformer nodes when selection changes
  useEffect(function() {
    if (transformerRef.current && stageRef.current) {
      let stage = stageRef.current
      let transformer = transformerRef.current
      
      let nodes = selectedIds.map(function(id) {
        return stage.findOne("#" + id)
      }).filter(Boolean)

      transformer.nodes(nodes)
      transformer.getLayer().batchDraw()
    }
  }, [selectedIds, elements])

  // Helper to obtain stage relative coordinates
  function getStagePointerPosition() {
    const stage = stageRef.current
    if (!stage) return { x: 0, y: 0 }
    const pos = stage.getPointerPosition()
    if (!pos) return { x: 0, y: 0 }
    
    // Convert to canvas coordinates by reversing zoom and pan
    return {
      x: (pos.x - pan.x) / zoom,
      y: (pos.y - pan.y) / zoom
    }
  }

  function handleMouseDown(e: any) {
    // Prevent actions if text editor is open
    if (textEditor) return

    // 1. Pan Action (Space pressed or middle mouse button)
    if (isSpacePressed || e.evt.button === 1) {
      setIsPanning(true)
      const stage = stageRef.current
      if (stage) {
        const pos = stage.getPointerPosition()
        if (pos) {
          dragStartRef.current = { x: pos.x - pan.x, y: pos.y - pan.y }
        }
      }
      return
    }

    const clickedOnEmpty = e.target === stageRef.current
    const clickPos = getStagePointerPosition()
    const finalX = snapToGrid ? snap(clickPos.x) : clickPos.x
    const finalY = snapToGrid ? snap(clickPos.y) : clickPos.y

    // 2. Select Tool
    if (tool === "select") {
      if (clickedOnEmpty) {
        // Start marquee select
        setSelectedIds([])
        setSelectionRect({
          x1: clickPos.x,
          y1: clickPos.y,
          x2: clickPos.x,
          y2: clickPos.y
        })
      }
      return
    }

    // 3. Eraser Tool
    if (tool === "eraser") {
      if (!clickedOnEmpty) {
        const id = e.target.id()
        if (id) {
          setSelectedIds([id])
          deleteElements()
        }
      }
      return
    }

    // 4. Drawing tools
    if (tool === "text") {
      // Text Creation
      const id = generateId()
      const newTextEl: CanvasElementType = {
        id,
        type: "text",
        x: finalX,
        y: finalY,
        width: 150,
        height: 30,
        text: "",
        fill: "transparent",
        stroke,
        strokeWidth: 1,
        opacity,
        fontSize,
        fontFamily
      }
      
      addElement(newTextEl)
      setTextEditor({
        id,
        x: finalX,
        y: finalY,
        width: 150,
        height: 30,
        text: "",
        fontSize,
        fontFamily,
        isNew: true
      })
      return
    }

    // Shapes drawing start
    let id = generateId()
    let initialPoints: number[] | undefined = undefined
    let isLineType = tool === "line" || tool === "arrow" || tool === "pencil"
    if (isLineType) {
      initialPoints = [finalX, finalY, finalX, finalY]
    }

    let newEl: CanvasElementType = {
      id,
      type: tool as any,
      x: isLineType ? 0 : finalX,
      y: isLineType ? 0 : finalY,
      width: 0,
      height: 0,
      points: initialPoints,
      fill: isLineType ? "transparent" : fill,
      stroke,
      strokeWidth,
      opacity
    }

    setDrawingElement(newEl)
  }

  function handleMouseMove() {
    if (isPanning) {
      const stage = stageRef.current
      if (stage) {
        const pos = stage.getPointerPosition()
        if (pos) {
          setPan({
            x: pos.x - dragStartRef.current.x,
            y: pos.y - dragStartRef.current.y
          })
        }
      }
      return
    }

    const currentPos = getStagePointerPosition()

    // Handle Selection Marquee
    if (selectionRect) {
      let nextRect = {
        ...selectionRect,
        x2: currentPos.x,
        y2: currentPos.y
      }
      setSelectionRect(nextRect)

      let x = Math.min(nextRect.x1, nextRect.x2)
      let y = Math.min(nextRect.y1, nextRect.y2)
      let w = Math.abs(nextRect.x1 - nextRect.x2)
      let h = Math.abs(nextRect.y1 - nextRect.y2)

      if (w > 2 && h > 2) {
        let ids = elements.filter(function(el) {
          let elW = el.width ?? 0
          let elH = el.height ?? 0
          if (el.type === "pencil" || el.type === "line" || el.type === "arrow") {
            if (!el.points) return false
            let xs = el.points.filter(function(_, idx) { return idx % 2 === 0 })
            let ys = el.points.filter(function(_, idx) { return idx % 2 !== 0 })
            let minX = Math.min(...xs)
            let maxX = Math.max(...xs)
            let minY = Math.min(...ys)
            let maxY = Math.max(...ys)
            return maxX >= x && minX <= x + w && maxY >= y && minY <= y + h
          }
          let minElX = Math.min(el.x, el.x + elW)
          let maxElX = Math.max(el.x, el.x + elW)
          let minElY = Math.min(el.y, el.y + elH)
          let maxElY = Math.max(el.y, el.y + elH)
          return maxElX >= x && minElX <= x + w && maxElY >= y && minElY <= y + h
        }).map(function(el) {
          return el.id
        })

        // Also select entire group if selected element belongs to a group
        let groupIds = new Set<string>()
        elements.forEach(function(el) {
          if (ids.includes(el.id) && el.groupId) {
            groupIds.add(el.groupId)
          }
        })

        let finalIds = elements.filter(function(el) {
          return ids.includes(el.id) || (el.groupId && groupIds.has(el.groupId))
        }).map(function(el) { return el.id })

        setSelectedIds(finalIds)
      } else {
        setSelectedIds([])
      }
      return
    }

    // Handle Drawing shapes
    if (drawingElement) {
      let isLineType = drawingElement.type === "line" || drawingElement.type === "arrow" || drawingElement.type === "pencil"
      let startX = isLineType ? (drawingElement.points ? drawingElement.points[0] : 0) : drawingElement.x
      let startY = isLineType ? (drawingElement.points ? drawingElement.points[1] : 0) : drawingElement.y
      
      let curX = snapToGrid ? snap(currentPos.x) : currentPos.x
      let curY = snapToGrid ? snap(currentPos.y) : currentPos.y

      if (drawingElement.type === "pencil") {
        let points = drawingElement.points ? [...drawingElement.points, currentPos.x, currentPos.y] : [currentPos.x, currentPos.y]
        setDrawingElement({ ...drawingElement, points })
      } else if (drawingElement.type === "line" || drawingElement.type === "arrow") {
        setDrawingElement({
          ...drawingElement,
          points: [startX, startY, curX, curY]
        })
      } else {
        // Rectangle or Circle (Ellipse)
        let w = curX - startX
        let h = curY - startY
        setDrawingElement({
          ...drawingElement,
          width: w,
          height: h
        })
      }
    }
  }

  function handleMouseUp() {
    if (isPanning) {
      setIsPanning(false)
      return
    }

    // Marquee selection end
    if (selectionRect) {
      setSelectionRect(null)
      return
    }

    // Drawing shape end
    if (drawingElement) {
      // Validate element size for shapes
      let isTooSmall = (drawingElement.type === "rectangle" || drawingElement.type === "circle") &&
        Math.abs(drawingElement.width ?? 0) < 5 && Math.abs(drawingElement.height ?? 0) < 5
      
      if (!isTooSmall) {
        addElement(drawingElement)
      }
      setDrawingElement(null)
    }
  }

  // Handle Zooming via mouse wheel
  function handleWheel(e: any) {
    e.evt.preventDefault()
    const stage = stageRef.current
    if (!stage) return

    const scaleBy = 1.05
    const oldScale = zoom
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const mousePointTo = {
      x: (pointer.x - pan.x) / oldScale,
      y: (pointer.y - pan.y) / oldScale
    }

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    
    setZoom(newScale)
    setPan({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale
    })
  }

  // Element Selection Click
  function handleElementSelect(id: string, e: any) {
    if (tool !== "select") return
    
    e.cancelBubble = true // Prevent stage click from clearing selection

    const shiftKey = e.evt.shiftKey
    let target = elements.find(function(item) { return item.id === id })
    if (!target) return

    // Find all elements sharing the group
    let siblingIds = target.groupId 
      ? elements.filter(function(el) { return el.groupId === target!.groupId }).map(function(el) { return el.id })
      : [id]

    let newSelection = [...selectedIds]

    if (shiftKey) {
      // Toggle selection
      const exists = selectedIds.includes(id)
      if (exists) {
        newSelection = newSelection.filter(function(selectedId) {
          return !siblingIds.includes(selectedId)
        })
      } else {
        newSelection = [...newSelection, ...siblingIds]
      }
    } else {
      // Direct select
      if (!selectedIds.includes(id)) {
        newSelection = siblingIds
      }
    }

    setSelectedIds(newSelection)
  }

  // Double Click Text to Edit
  function handleDoubleClickText(id: string, textEl: CanvasElementType) {
    setTextEditor({
      id,
      x: textEl.x,
      y: textEl.y,
      width: textEl.width ?? 150,
      height: textEl.height ?? 30,
      text: textEl.text ?? "",
      fontSize: textEl.fontSize ?? 14,
      fontFamily: textEl.fontFamily ?? "-apple-system",
      isNew: false
    })
  }

  // Double Click Stage to create Text
  function handleStageDoubleClick(e: any) {
    if (tool !== "select" || e.target !== stageRef.current) return
    
    const clickPos = getStagePointerPosition()
    const finalX = snapToGrid ? snap(clickPos.x) : clickPos.x
    const finalY = snapToGrid ? snap(clickPos.y) : clickPos.y
    const id = generateId()

    const newTextEl: CanvasElementType = {
      id,
      type: "text",
      x: finalX,
      y: finalY,
      width: 150,
      height: 30,
      text: "",
      fill: "transparent",
      stroke,
      strokeWidth: 1,
      opacity,
      fontSize,
      fontFamily
    }

    addElement(newTextEl)
    setTextEditor({
      id,
      x: finalX,
      y: finalY,
      width: 150,
      height: 30,
      text: "",
      fontSize,
      fontFamily,
      isNew: true
    })
  }

  // Blur text editor: save text content
  function handleTextEditorBlur() {
    if (!textEditor) return

    const trimmedText = textEditor.text.trim()
    if (trimmedText === "") {
      // Remove text element if empty
      const newElements = elements.filter(function(el) {
        return el.id !== textEditor.id
      })
      setElements(newElements)
    } else {
      updateElement(textEditor.id, {
        text: trimmedText
      })
      saveHistory()
    }
    setTextEditor(null)
  }

  // Element transform logic (Scale/Resize)
  function handleTransformEnd(e: any) {
    let node = e.target
    let id = node.id()
    let el = elements.find(function(item) { return item.id === id })
    if (!el) return

    let scaleX = node.scaleX()
    let scaleY = node.scaleY()

    // Reset scales
    node.scaleX(1)
    node.scaleY(1)

    if (el.type === "pencil" || el.type === "line" || el.type === "arrow") {
      let dx = node.x() - el.x
      let dy = node.y() - el.y
      
      let points = el.points ? el.points.map(function(pt, idx) {
        if (idx % 2 === 0) {
          return pt * scaleX + dx
        } else {
          return pt * scaleY + dy
        }
      }) : undefined

      node.x(0)
      node.y(0)

      updateElement(id, {
        x: 0,
        y: 0,
        points
      })
    } else {
      let finalWidth = Math.max(5, (el.width ?? 10) * scaleX)
      let finalHeight = Math.max(5, (el.height ?? 10) * scaleY)

      updateElement(id, {
        x: node.x(),
        y: node.y(),
        width: snapToGrid ? snap(finalWidth) : finalWidth,
        height: snapToGrid ? snap(finalHeight) : finalHeight
      })
    }
    saveHistory()
  }

  // Handle Drag start: select element if not selected yet
  function handleDragStart(e: any) {
    let id = e.target.id()
    if (!selectedIds.includes(id)) {
      handleElementSelect(id, e)
    }
  }

  // Element Drag end logic (Move elements)
  function handleDragEnd(e: any) {
    let id = e.target.id()
    if (!selectedIds.includes(id)) return

    let node = e.target
    let prevEl = elements.find(function(item) { return item.id === id })
    if (!prevEl) return

    let dx = node.x() - prevEl.x
    let dy = node.y() - prevEl.y

    let finalDx = dx
    let finalDy = dy

    if (snapToGrid) {
      let snappedX = snap(prevEl.x + dx)
      let snappedY = snap(prevEl.y + dy)
      finalDx = snappedX - prevEl.x
      finalDy = snappedY - prevEl.y
    }

    // Apply delta movement to all elements in selection
    elements.forEach(function(el) {
      if (selectedIds.includes(el.id)) {
        if (el.type === "pencil" || el.type === "line" || el.type === "arrow") {
          let points = el.points ? el.points.map(function(pt, idx) {
            return idx % 2 === 0 ? pt + finalDx : pt + finalDy
          }) : undefined
          updateElement(el.id, { x: 0, y: 0, points })
        } else {
          updateElement(el.id, { x: el.x + finalDx, y: el.y + finalDy })
        }
      }
    })
    saveHistory()
  }

  // Background Grid parameters
  let gridCellSize = 20 * zoom

  // Text editor coordinates mapping from canvas to screen
  let editorStyle: React.CSSProperties = {}
  if (textEditor) {
    const screenX = textEditor.x * zoom + pan.x
    const screenY = textEditor.y * zoom + pan.y
    editorStyle = {
      left: `${screenX}px`,
      top: `${screenY}px`,
      width: `${textEditor.width * zoom}px`,
      height: `${textEditor.height * zoom}px`,
      fontSize: `${textEditor.fontSize * zoom}px`,
      fontFamily: textEditor.fontFamily
    }
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.canvasWrapper} ${
        isSpacePressed ? (isPanning ? styles.cursorGrabbing : styles.cursorGrab) : ""
      }`}
    >
      {/* CSS repeating grid */}
      <div
        className={styles.gridBackground}
        style={{
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          backgroundSize: `${gridCellSize}px ${gridCellSize}px`,
          display: showGrid ? "block" : "none"
        }}
      />

      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={zoom}
        scaleY={zoom}
        x={pan.x}
        y={pan.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onDblClick={handleStageDoubleClick}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      >
        <Layer>
          {elements.map(function(el) {
            return (
              <CanvasElement
                key={el.id}
                element={el}
                draggable={tool === "select"}
                onSelect={handleElementSelect}
                onDoubleClickText={handleDoubleClickText}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            )
          })}

          {/* Render active dragging preview */}
          {drawingElement && (
            <CanvasElement
              element={drawingElement}
              draggable={false}
              onSelect={function() {}}
              onDragStart={function() {}}
              onDragEnd={function() {}}
            />
          )}

          {/* Dotted marquee selection box */}
          {selectionRect && (
            <React.Fragment>
              <Rect
                x={Math.min(selectionRect.x1, selectionRect.x2)}
                y={Math.min(selectionRect.y1, selectionRect.y2)}
                width={Math.abs(selectionRect.x1 - selectionRect.x2)}
                height={Math.abs(selectionRect.y1 - selectionRect.y2)}
                fill="rgba(0, 122, 255, 0.05)"
                stroke="#007aff"
                strokeWidth={1}
                dash={[4, 4]}
              />
            </React.Fragment>
          )}

          {/* Konva Transformer */}
          <Transformer
            ref={transformerRef}
            id="transformer"
            rotateEnabled={false}
            keepRatio={false}
            borderStroke="#007aff"
            anchorStroke="#007aff"
            anchorFill="#ffffff"
            anchorSize={6}
            borderDash={[2, 2]}
            draggable={tool === "select"}
            onDragEnd={handleDragEnd}
            onTransformEnd={handleTransformEnd}
          />
        </Layer>
      </Stage>

      {/* HTML absolute Text Editor */}
      {textEditor && (
        <textarea
          className={styles.textEditor}
          style={editorStyle}
          autoFocus
          value={textEditor.text}
          onChange={function(e) {
            setTextEditor({ ...textEditor, text: e.target.value })
          }}
          onBlur={handleTextEditorBlur}
          onKeyDown={function(e) {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.blur()
            }
            if (e.key === "Escape") {
              e.preventDefault()
              e.currentTarget.blur()
            }
          }}
        />
      )}

      {/* Floating Bottom Navigation Toolbar */}
      <div className={styles.canvasToolbar}>
        <button
          className={styles.toolbarButton}
          onClick={function() { setZoom(zoom - 0.1) }}
          title="Diminuir Zoom"
        >
          <ZoomOut size={14} />
        </button>
        <span className={styles.label} style={{ fontSize: "11px", minWidth: "36px", textAlign: "center" }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          className={styles.toolbarButton}
          onClick={function() { setZoom(zoom + 0.1) }}
          title="Aumentar Zoom"
        >
          <ZoomIn size={14} />
        </button>

        <div className={styles.toolbarDivider} />
        <button
          className={`${styles.toolbarButton} ${showGrid ? styles.toolbarButtonActive : ""}`}
          onClick={function() { setShowGrid(!showGrid) }}
          title="Mostrar Grade (G)"
        >
          <Grid size={14} />
          Grade
        </button>
        <button
          className={`${styles.toolbarButton} ${snapToGrid ? styles.toolbarButtonActive : ""}`}
          onClick={function() { setSnapToGrid(!snapToGrid) }}
          title="Alinhamento Magnético (S)"
        >
          <Magnet size={14} />
          Snap
        </button>
      </div>
    </div>
  )
}
