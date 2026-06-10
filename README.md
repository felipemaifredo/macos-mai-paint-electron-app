# Mai Paint 🎨

O **Mai Paint** é um editor visual leve, moderno e responsivo, inspirado na simplicidade do Microsoft Paint, mas projetado com uma interface premium inspirada nas diretrizes de design do **macOS** (com suporte nativo a temas escuros/claros, efeitos translúcidos e transições suaves). Ele é ideal para criar diagramas, fluxogramas, wireframes rápidos e desenhos livres.

Construído sobre **Electron**, **React**, **Konva** (para manipulação avançada de canvas 2D) e **Vite**, o projeto oferece alto desempenho e uma experiência integrada na área de trabalho.

---

## ✨ Recursos Principais

### 🗂️ Painel de Projetos (Dashboard)
* **Gerenciamento Local:** Todos os seus projetos são auto-salvos em tempo real no `localStorage` sob a chave `"mai_paint_local_projects"`.
* **Organização no estilo macOS:** Grid responsivo mostrando os cartões dos projetos com título, quantidade de elementos e data de última modificação.
* **Pesquisa Integrada:** Encontre projetos instantaneamente digitando parte do nome na barra de busca superior.
* **Ações Rápidas por Card:** Abra, exclua, renomeie inline ou exporte diretamente para PNG de forma imediata sem precisar abrir o editor.

### 🎨 Editor de Canvas Avançado
* **Ferramentas Vetoriais & Desenho Livre:**
  - **Seleção (V):** Mova, agrupe/desagrupe, redimensione e modifique as propriedades de múltiplos elementos de uma só vez.
  - **Retângulo (R) & Círculo (O):** Desenhe formas geométricas precisas.
  - **Linha (L) & Seta (A):** Conecte ideias com linhas e setas dinâmicas.
  - **Lápis (P):** Desenho livre suave com tensionamento de curvas.
  - **Texto (T):** Adicione blocos de texto dinâmicos clicando duas vezes no canvas.
  - **Borracha (E):** Remova elementos individuais com facilidade.
* **Sincronização de Zoom & Pan:** Arraste o canvas (segurando `Espaço` + clique-arrasto do mouse) e dê zoom livre (`Ctrl/Cmd + Scroll` ou botões da HUD inferior) sincronizados perfeitamente com a grade magnética de fundo.
* **Alinhamento Magnético (Snap to Grid):** Alinhe formas e linhas automaticamente em múltiplos de 20px para layouts limpos.
* **Configurações Individuais no Painel Lateral:** Altere cor de preenchimento (com opção transparente), cor de contorno, espessura da linha, opacidade e tipografia individualmente por elemento selecionado.
* **Exportação Premium:** Exportação inteligente de imagem (PNG de fundo transparente ou JPG de fundo sólido) e PDF, preservando a escala real 1:1 dos elementos e o fundo branco consistente.

---

## ⌨️ Atalhos de Teclado Úteis

Para aumentar a sua produtividade, o Mai Paint possui suporte nativo a atalhos rápidos:

| Categoria | Tecla de Atalho | Descrição |
| :--- | :--- | :--- |
| **Ferramentas** | `V` | Seleção (Mover e Configurar) |
| | `R` | Retângulo |
| | `O` | Círculo |
| | `L` | Linha |
| | `A` | Seta |
| | `T` | Texto |
| | `P` | Lápis (Desenho Livre) |
| | `E` | Borracha |
| **Edição & Ações** | `Cmd/Ctrl + Z` | Desfazer |
| | `Cmd/Ctrl + Shift + Z`| Refazer |
| | `Cmd/Ctrl + C` | Copiar elementos selecionados |
| | `Cmd/Ctrl + V` | Colar elementos copiados |
| | `Cmd/Ctrl + D` | Duplicar elementos selecionados |
| | `Cmd/Ctrl + A` | Selecionar tudo no canvas |
| | `Delete` / `Backspace`| Excluir elementos selecionados |
| **Visualização** | `Espaço` (Segurar) | Cursor de Mão para arrastar a tela (Pan) |
| | `G` | Alternar exibição da Grade |
| | `S` | Alternar Alinhamento Magnético (Snap) |

---

## 🏗️ Arquitetura de Pastas

O projeto adota uma estrutura modular e escalável, separando claramente as lógicas do Electron (processo principal/preload) do ecossistema do React (interface de usuário e lógica do canvas):

```
macos-mai-paint-electron-app/
├── assets/                    # Assets estáticos para build (logotipos da aplicação)
├── src/
│   ├── App/                   # Ponto de entrada React (App.tsx, index.css)
│   ├── Lib/                   # Lógica central e utilitários da aplicação
│   │   ├── Hooks/             # Zustand Store (useCanvasStore.ts)
│   │   └── Types/             # Tipagens TypeScript (canvas.types.ts)
│   ├── electron/              # Lógicas nativas do Electron (main.ts, preload.ts)
│   └── ui/                    # Componentes visuais organizados por tipo
│       ├── Components/        # Canvas, Sidebar, PropertiesPanel, TitleBar, Dashboard
│       └── Pages/             # MainPage.tsx (alterna entre Dashboard e Editor)
├── package.json               # Dependências e scripts de automação
├── tsconfig.json              # Configurações do compilador TypeScript
└── vite.config.ts             # Configuração de build do Vite + Plugins Electron
```

Consulte o arquivo [design_system.md](design_system.md) para detalhes do guia de estilos da aplicação.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na versão LTS recente (recomenda-se v18 ou superior) e o `npm` disponível.

1. **Clonar e instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o ambiente de desenvolvimento:**
   ```bash
   npm run dev
   ```
   *Este comando inicia o servidor de desenvolvimento do Vite e abre o aplicativo Electron automaticamente com suporte a recarregamento rápido (HMR).*

---

## 📦 Como Compilar e Empacotar

Os scripts de empacotamento compilam o código React/TypeScript e agrupam a aplicação nativa para cada plataforma em um instalador localizado na pasta `/release`.

* **Compilar para macOS (DMG/App):**
  ```bash
  npm run build:mac
  ```

* **Compilar para Windows (EXE/NSIS):**
  ```bash
  npm run build:win
  ```

* **Compilar para todas as plataformas padrão:**
  ```bash
  npm run dist
  ```
