//Types
type TextResources = {
  app: {
    confirmNewProject: string
    confirmOpenProject: string
    invalidProjectFile: string
    errorReadingProject: string
    failRead: string
    failSave: string
    canvasNotFound: string
    failExportImage: string
    failExportPdf: string
  }
  store: {
    untitled: string
  }
  dashboard: {
    title: string
    searchPlaceholder: string
    createNew: string
    open: string
    rename: string
    exportPng: string
    delete: string
    element: string
    elements: string
    noProjects: string
    cannotExportEmpty: string
    failExportPng: string
    confirmDelete: string
    settings: string
    close: string
  }
  titleBar: {
    backTooltip: string
    projects: string
    clickToRename: string
    dashboard: string
    unsavedChanges: string
  }
  sidebar: {
    select: string
    rectangle: string
    circle: string
    line: string
    arrow: string
    text: string
    pencil: string
    eraser: string
    helpTooltip: string
    modalTitle: string
    modalCategoryTools: string
    modalCategoryEdit: string
    undo: string
    redo: string
    copy: string
    paste: string
    duplicate: string
    selectAll: string
    deleteElement: string
    pan: string
    drag: string
    toggleGrid: string
    snapToGrid: string
    space: string
  }
  properties: {
    fill: string
    color: string
    chooseColor: string
    transparentFill: string
    none: string
    stroke: string
    strokeWidth: string
    opacity: string
    text: string
    font: string
    systemFont: string
    monospaceFont: string
    align: string
    fontSize: string
    quickActions: string
    duplicateTooltip: string
    duplicateBtn: string
    deleteTooltip: string
    deleteBtn: string
    groupTooltip: string
    groupBtn: string
    ungroupTooltip: string
    ungroupBtn: string
    language: string
  }
}

type Languages = {
  en: TextResources
  pt: TextResources
  es: TextResources
}

//Main
let texts: Languages = {
  en: {
    app: {
      confirmNewProject: "Do you want to create a new project? Unsaved changes will be lost.",
      confirmOpenProject: "Do you want to open another project? Unsaved changes will be lost.",
      invalidProjectFile: "Invalid project file structure.",
      errorReadingProject: "Error reading project file.",
      failRead: "Failed to read file: {error}",
      failSave: "Failed to save: {error}",
      canvasNotFound: "Canvas not found for export.",
      failExportImage: "Failed to export image: {error}",
      failExportPdf: "Failed to export PDF: {error}"
    },
    store: {
      untitled: "Untitled"
    },
    dashboard: {
      title: "My Drawings (Mai Paint)",
      searchPlaceholder: "Search projects...",
      createNew: "Create New Drawing",
      open: "Open",
      rename: "Rename",
      exportPng: "Export PNG",
      delete: "Delete",
      element: "element",
      elements: "elements",
      noProjects: 'No projects found for "{query}"',
      cannotExportEmpty: "Cannot export an empty project.",
      failExportPng: "Failed to export PNG: {error}",
      confirmDelete: "Do you really want to delete this project permanently?",
      settings: "Settings",
      close: "Close"
    },
    titleBar: {
      backTooltip: "Back to Projects",
      projects: "Projects",
      clickToRename: "Click to rename",
      dashboard: "Dashboard",
      unsavedChanges: "Unsaved changes"
    },
    sidebar: {
      select: "Select",
      rectangle: "Rectangle",
      circle: "Circle",
      line: "Line",
      arrow: "Arrow",
      text: "Text",
      pencil: "Free Draw",
      eraser: "Eraser",
      helpTooltip: "Shortcuts and Help",
      modalTitle: "Keyboard Shortcuts",
      modalCategoryTools: "Tools",
      modalCategoryEdit: "Edit & Canvas",
      undo: "Undo",
      redo: "Redo",
      copy: "Copy",
      paste: "Paste",
      duplicate: "Duplicate",
      selectAll: "Select All",
      deleteElement: "Delete Element",
      pan: "Move Screen (Pan)",
      drag: "Drag",
      toggleGrid: "Toggle Grid",
      snapToGrid: "Snap to Grid",
      space: "Space"
    },
    properties: {
      fill: "Fill",
      color: "Color",
      chooseColor: "Choose Color",
      transparentFill: "Transparent Fill",
      none: "None",
      stroke: "Stroke",
      strokeWidth: "Width",
      opacity: "Opacity",
      text: "Text",
      font: "Font",
      systemFont: "macOS System",
      monospaceFont: "Monospace",
      align: "Align",
      fontSize: "Size",
      quickActions: "Quick Actions",
      duplicateTooltip: "Duplicate Selected Elements",
      duplicateBtn: "Duplicate",
      deleteTooltip: "Delete Selected Elements",
      deleteBtn: "Delete",
      groupTooltip: "Group Elements",
      groupBtn: "Group",
      ungroupTooltip: "Ungroup Elements",
      ungroupBtn: "Ungroup",
      language: "Language"
    }
  },
  pt: {
    app: {
      confirmNewProject: "Deseja criar um novo projeto? As alterações não salvas serão perdidas.",
      confirmOpenProject: "Deseja abrir outro projeto? As alterações não salvas serão perdidas.",
      invalidProjectFile: "Estrutura do arquivo de projeto inválida.",
      errorReadingProject: "Erro ao ler o arquivo de projeto.",
      failRead: "Falha ao ler o arquivo: {error}",
      failSave: "Falha ao salvar: {error}",
      canvasNotFound: "Canvas não encontrado para exportação.",
      failExportImage: "Falha ao exportar imagem: {error}",
      failExportPdf: "Falha ao exportar PDF: {error}"
    },
    store: {
      untitled: "Sem título"
    },
    dashboard: {
      title: "Meus Desenhos (Mai Paint)",
      searchPlaceholder: "Buscar projetos...",
      createNew: "Criar Novo Desenho",
      open: "Abrir",
      rename: "Renomear",
      exportPng: "Exportar PNG",
      delete: "Excluir",
      element: "elemento",
      elements: "elementos",
      noProjects: 'Nenhum projeto encontrado para "{query}"',
      cannotExportEmpty: "Não é possível exportar um projeto vazio.",
      failExportPng: "Falha ao exportar PNG: {error}",
      confirmDelete: "Deseja realmente excluir este projeto permanentemente?",
      settings: "Configurações",
      close: "Fechar"
    },
    titleBar: {
      backTooltip: "Voltar para Projetos",
      projects: "Projetos",
      clickToRename: "Clique para renomear",
      dashboard: "Dashboard",
      unsavedChanges: "Alterações não salvas"
    },
    sidebar: {
      select: "Seleção",
      rectangle: "Retângulo",
      circle: "Círculo",
      line: "Linha",
      arrow: "Seta",
      text: "Texto",
      pencil: "Caneta Livre",
      eraser: "Borracha",
      helpTooltip: "Atalhos e Ajuda",
      modalTitle: "Atalhos de Teclado",
      modalCategoryTools: "Ferramentas",
      modalCategoryEdit: "Edição & Tela",
      undo: "Desfazer",
      redo: "Refazer",
      copy: "Copiar",
      paste: "Colar",
      duplicate: "Duplicar",
      selectAll: "Selecionar Tudo",
      deleteElement: "Excluir Elemento",
      pan: "Mover Tela (Pan)",
      drag: "Arrastar",
      toggleGrid: "Alternar Grade",
      snapToGrid: "Alinhamento Magnético",
      space: "Espaço"
    },
    properties: {
      fill: "Preenchimento",
      color: "Cor",
      chooseColor: "Escolher Cor",
      transparentFill: "Preenchimento Transparente",
      none: "Nenhum",
      stroke: "Contorno",
      strokeWidth: "Espessura",
      opacity: "Opacidade",
      text: "Texto",
      font: "Fonte",
      systemFont: "Sistema macOS",
      monospaceFont: "Monoespaçada",
      align: "Alinhamento",
      fontSize: "Tamanho",
      quickActions: "Ações Rápidas",
      duplicateTooltip: "Duplicar Elementos Selecionados",
      duplicateBtn: "Duplicar",
      deleteTooltip: "Excluir Elementos Selecionados",
      deleteBtn: "Excluir",
      groupTooltip: "Agrupar Elementos",
      groupBtn: "Agrupar",
      ungroupTooltip: "Desagrupar Elementos",
      ungroupBtn: "Desagrupar",
      language: "Idioma"
    }
  },
  es: {
    app: {
      confirmNewProject: "¿Desea crear un nuevo proyecto? Los cambios no guardados se perderán.",
      confirmOpenProject: "¿Desea abrir otro proyecto? Los cambios no guardados se perderán.",
      invalidProjectFile: "Estructura del archivo de proyecto no válida.",
      errorReadingProject: "Error al leer el archivo de proyecto.",
      failRead: "Error al leer el archivo: {error}",
      failSave: "Error al guardar: {error}",
      canvasNotFound: "Canvas no encontrado para exportación.",
      failExportImage: "Error al exportar imagen: {error}",
      failExportPdf: "Error al exportar PDF: {error}"
    },
    store: {
      untitled: "Sin título"
    },
    dashboard: {
      title: "Mis Dibujos (Mai Paint)",
      searchPlaceholder: "Buscar proyectos...",
      createNew: "Crear Nuevo Dibujo",
      open: "Abrir",
      rename: "Renombrar",
      exportPng: "Exportar PNG",
      delete: "Eliminar",
      element: "elemento",
      elements: "elementos",
      noProjects: 'No se encontraron proyectos para "{query}"',
      cannotExportEmpty: "No se puede exportar un proyecto vacío.",
      failExportPng: "Error al exportar PNG: {error}",
      confirmDelete: "¿Realmente desea eliminar este proyecto permanentemente?",
      settings: "Configuraciones",
      close: "Cerrar"
    },
    titleBar: {
      backTooltip: "Volver a Proyectos",
      projects: "Proyectos",
      clickToRename: "Clic para renombrar",
      dashboard: "Dashboard",
      unsavedChanges: "Cambios no guardados"
    },
    sidebar: {
      select: "Selección",
      rectangle: "Rectángulo",
      circle: "Círculo",
      line: "Línea",
      arrow: "Flecha",
      text: "Texto",
      pencil: "Lápiz Libre",
      eraser: "Borrador",
      helpTooltip: "Atajos y Ayuda",
      modalTitle: "Atajos de Teclado",
      modalCategoryTools: "Herramientas",
      modalCategoryEdit: "Edición y Lienzo",
      undo: "Deshacer",
      redo: "Rehacer",
      copy: "Copiar",
      paste: "Pegar",
      duplicate: "Duplicar",
      selectAll: "Seleccionar Todo",
      deleteElement: "Eliminar Elemento",
      pan: "Mover Lienzo (Pan)",
      drag: "Arrastrar",
      toggleGrid: "Alternar Cuadrícula",
      snapToGrid: "Alineación Magnética",
      space: "Espacio"
    },
    properties: {
      fill: "Relleno",
      color: "Color",
      chooseColor: "Elegir Color",
      transparentFill: "Relleno Transparente",
      none: "Ninguno",
      stroke: "Contorno",
      strokeWidth: "Grosor",
      opacity: "Opacidad",
      text: "Texto",
      font: "Fuente",
      systemFont: "Sistema macOS",
      monospaceFont: "Monoespacio",
      align: "Alineación",
      fontSize: "Tamaño",
      quickActions: "Acciones Rápidas",
      duplicateTooltip: "Duplicar Elementos Seleccionados",
      duplicateBtn: "Duplicar",
      deleteTooltip: "Eliminar Elementos Seleccionados",
      deleteBtn: "Eliminar",
      groupTooltip: "Agrupar Elementos",
      groupBtn: "Agrupar",
      ungroupTooltip: "Desagrupar Elementos",
      ungroupBtn: "Desagrupar",
      language: "Idioma"
    }
  }
}

export default texts
export { texts }
