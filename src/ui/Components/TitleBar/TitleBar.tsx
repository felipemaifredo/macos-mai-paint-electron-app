//Libs
import { useState } from "react"
import { Home } from "lucide-react"

//Imports
import { useCanvasStore } from "../../../Lib/Hooks/useCanvasStore"
import styles from "./TitleBar.module.css"

//Main
export const TitleBar = () => {
  let view = useCanvasStore(function(state) {
    return state.view
  })
  let setView = useCanvasStore(function(state) {
    return state.setView
  })
  let currentProjectName = useCanvasStore(function(state) {
    return state.currentProjectName
  })
  let renameCurrentProject = useCanvasStore(function(state) {
    return state.renameCurrentProject
  })
  let isDirty = useCanvasStore(function(state) {
    return state.isDirty
  })

  let [isEditing, setIsEditing] = useState(false)
  let [editName, setEditName] = useState("")

  function handleStartEdit() {
    setEditName(currentProjectName)
    setIsEditing(true)
  }

  function handleFinishEdit() {
    let newName = editName.trim()
    if (newName) {
      renameCurrentProject(newName)
    }
    setIsEditing(false)
  }

  return (
    <div className={styles.titleBar}>
      {view === "editor" && (
        <button className={styles.backButton} onClick={function() { setView("dashboard") }} title="Voltar para Projetos">
          <Home size={12} />
          Projetos
        </button>
      )}

      <div className={styles.titleContainer}>
        {view === "editor" ? (
          isEditing ? (
            <input
              type="text"
              className={styles.titleInput}
              autoFocus
              value={editName}
              onChange={function(e) { setEditName(e.target.value) }}
              onBlur={handleFinishEdit}
              onKeyDown={function(e) {
                if (e.key === "Enter") {
                  handleFinishEdit()
                }
                if (e.key === "Escape") {
                  setIsEditing(false)
                }
              }}
            />
          ) : (
            <span className={styles.titleText} onClick={handleStartEdit} title="Clique para renomear">
              {currentProjectName}
            </span>
          )
        ) : (
          <span>Dashboard</span>
        )}
        {view === "editor" && isDirty && <div className={styles.dirtyDot} title="Alterações não salvas" />}
      </div>
    </div>
  )
}
