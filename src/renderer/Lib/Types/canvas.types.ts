//Types
export type ToolType =
  | "select"
  | "rectangle"
  | "circle"
  | "line"
  | "arrow"
  | "text"
  | "pencil"
  | "eraser"

export type CanvasElement = {
  id: string
  type: "rectangle" | "circle" | "line" | "arrow" | "text" | "pencil"
  x: number
  y: number
  width?: number
  height?: number
  points?: number[]
  text?: string
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  fontSize?: number
  fontFamily?: string
  groupId?: string
}

export type ElementStyle = {
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  fontSize: number
  fontFamily: string
}

export type ProjectData = {
  version: string
  elements: CanvasElement[]
}
