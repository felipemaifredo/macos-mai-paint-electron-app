//Imports
import { TitleBar } from "../Components/TitleBar/TitleBar"
import { Sidebar } from "../Components/Sidebar/Sidebar"
import { CanvasContainer } from "../Components/Canvas/CanvasContainer"
import { PropertiesPanel } from "../Components/PropertiesPanel/PropertiesPanel"
import { Dashboard } from "../Components/Dashboard/Dashboard"
import { useCanvasStore } from "../../Lib/Hooks/useCanvasStore"
import styles from "./MainPage.module.css"

//Main
export const MainPage = () => {
  let view = useCanvasStore(function(state) {
    return state.view
  })
  let selectedIds = useCanvasStore(function(state) {
    return state.selectedIds
  })

  let hasSelection = selectedIds.length > 0

  return (
    <div className={styles.mainPage}>
      <TitleBar />
      {view === "dashboard" ? (
        <Dashboard />
      ) : (
        <div className={styles.editorArea}>
          <Sidebar />
          <CanvasContainer />
          {hasSelection && <PropertiesPanel />}
        </div>
      )}
    </div>
  )
}
