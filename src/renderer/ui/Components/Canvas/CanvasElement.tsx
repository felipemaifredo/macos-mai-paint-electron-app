//Libs
import { Rect, Ellipse, Line, Arrow, Text } from "react-konva"

//Imports
import { CanvasElement as CanvasElementType } from "../../../Lib/Types/canvas.types"

//Types
type CanvasElementProps = {
  element: CanvasElementType
  onSelect: (id: string, e: any) => void
  onDoubleClickText?: (id: string, textElement: CanvasElementType) => void
  draggable: boolean
  onDragStart: (e: any) => void
  onDragEnd: (e: any) => void
}

//Main
export const CanvasElement = (props: CanvasElementProps) => {
  let { element, onSelect, onDoubleClickText, draggable, onDragStart, onDragEnd } = props

  function handleSelect(e: any) {
    onSelect(element.id, e)
  }

  function handleTextDoubleClick() {
    if (element.type === "text" && onDoubleClickText) {
      onDoubleClickText(element.id, element)
    }
  }

  let commonProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    opacity: element.opacity,
    draggable: draggable,
    onClick: handleSelect,
    onTap: handleSelect,
    onDragStart: onDragStart,
    onDragEnd: onDragEnd
  }

  if (element.type === "rectangle") {
    return (
      <Rect
        {...commonProps}
        width={element.width ?? 0}
        height={element.height ?? 0}
        fill={element.fill}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
      />
    )
  }

  if (element.type === "circle") {
    let rx = (element.width ?? 0) / 2
    let ry = (element.height ?? 0) / 2
    return (
      <Ellipse
        {...commonProps}
        x={element.x + rx}
        y={element.y + ry}
        radiusX={rx}
        radiusY={ry}
        fill={element.fill}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
      />
    )
  }

  if (element.type === "line") {
    return (
      <Line
        {...commonProps}
        points={element.points ?? [0, 0, 0, 0]}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        hitStrokeWidth={Math.max(15, element.strokeWidth + 10)}
        lineCap="round"
        lineJoin="round"
      />
    )
  }

  if (element.type === "arrow") {
    return (
      <Arrow
        {...commonProps}
        points={element.points ?? [0, 0, 0, 0]}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        hitStrokeWidth={Math.max(15, element.strokeWidth + 10)}
        fill={element.stroke}
        pointerLength={10}
        pointerWidth={8}
      />
    )
  }

  if (element.type === "text") {
    return (
      <Text
        {...commonProps}
        width={element.width ?? 150}
        text={element.text ?? ""}
        fontSize={element.fontSize ?? 14}
        fontFamily={element.fontFamily ?? "-apple-system"}
        fill={element.stroke} // Texts in diagrams use the stroke color as the text color
        onDblClick={handleTextDoubleClick}
        onDblTap={handleTextDoubleClick}
      />
    )
  }

  if (element.type === "pencil") {
    return (
      <Line
        {...commonProps}
        points={element.points ?? []}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        hitStrokeWidth={Math.max(15, element.strokeWidth + 10)}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
      />
    )
  }

  return null
}
