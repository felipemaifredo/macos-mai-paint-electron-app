//Libs
import React from "react"
import { createRoot } from "react-dom/client"

//Imports
import { App } from "./App/App"
import "./App/index.css"

//Main
let container = document.getElementById("root")
if (container) {
  let root = createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
