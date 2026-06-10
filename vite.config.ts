//Libs
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import electron from "vite-plugin-electron"
import renderer from "vite-plugin-electron-renderer"

//Main
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: "src/electron/main.ts"
      },
      {
        entry: "src/electron/preload.ts",
        onroute(options) {
          options.reload()
        }
      }
    ]),
    renderer()
  ]
})
