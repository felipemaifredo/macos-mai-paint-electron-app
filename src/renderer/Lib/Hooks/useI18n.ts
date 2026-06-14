//Libs
import { useState } from "react"

//Imports
import texts from "../../Resourses/Texts/texts"

//Types
type Language = "en" | "pt" | "es"

//Funcs
function getSystemLanguage(): Language {
  let lang = navigator.language.toLowerCase()
  if (lang.startsWith("pt")) {
    return "pt"
  }
  if (lang.startsWith("es")) {
    return "es"
  }
  return "en"
}

function useI18n() {
  let [locale, setLocale] = useState<Language>(function () {
    let saved = localStorage.getItem("app-language") as Language
    if (saved === "en" || saved === "pt" || saved === "es") {
      return saved
    }
    return getSystemLanguage()
  })

  function changeLanguage(newLang: Language) {
    setLocale(newLang)
    localStorage.setItem("app-language", newLang)
    
    // We dispatch a custom window event so that non-react or outside stores can listen to language change if needed
    window.dispatchEvent(new CustomEvent("app-language-changed", { detail: newLang }))
  }

  let t = texts[locale] || texts.en

  return {
    locale,
    t,
    changeLanguage
  }
}

export default useI18n
export { useI18n }
