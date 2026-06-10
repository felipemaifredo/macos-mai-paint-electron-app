# Design System - Mai Paint (macOS Native Style)

Este documento define as diretrizes de design, cores, tipografia e espaçamentos do **Mai Paint**, simulando a aparência e o comportamento de um aplicativo nativo do macOS, com suporte completo a Temas Claro e Escuro.

---

## 1. Cores e Variáveis (CSS Variables)

As cores abaixo seguem a paleta oficial da Apple (macOS System Colors).

### Tema Claro (Light Mode)
```css
:root {
  --background-canvas: #ffffff;
  --background-panel: rgba(245, 245, 247, 0.85); /* Efeito Translúcido */
  --background-panel-opaque: #f5f5f7;
  --border-color: rgba(0, 0, 0, 0.1);
  --border-color-active: rgba(0, 0, 0, 0.2);
  
  --text-primary: #1d1d1f;
  --text-secondary: #86868b;
  --text-on-accent: #ffffff;
  
  --accent-color: #007aff; /* Blue macOS */
  --accent-hover: #0062cc;
  --accent-active: #0051a8;
  
  --button-hover: rgba(0, 0, 0, 0.05);
  --button-active: rgba(0, 0, 0, 0.1);
  --sidebar-active: rgba(0, 122, 255, 0.12);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  --glass-blur: blur(20px);
}
```

### Tema Escuro (Dark Mode)
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background-canvas: #1e1e1e;
    --background-panel: rgba(30, 30, 30, 0.85); /* Efeito Translúcido */
    --background-panel-opaque: #1e1e1e;
    --border-color: rgba(255, 255, 255, 0.12);
    --border-color-active: rgba(255, 255, 255, 0.22);
    
    --text-primary: #f5f5f7;
    --text-secondary: #86868b;
    --text-on-accent: #ffffff;
    
    --accent-color: #0a84ff; /* Blue macOS Dark */
    --accent-hover: #0070e3;
    --accent-active: #005cbd;
    
    --button-hover: rgba(255, 255, 255, 0.08);
    --button-active: rgba(255, 255, 255, 0.15);
    --sidebar-active: rgba(10, 132, 255, 0.18);
    
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
    
    --glass-blur: blur(20px);
  }
}
```

---

## 2. Tipografia

A tipografia deve utilizar a família de fontes padrão do sistema macOS:

- **Fonte**: `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `Helvetica`, `Arial`, `sans-serif`
- **Tamanhos e Pesos**:
  - Título Principal / Janela: `13px`, Médio (`500`), alinhado ao centro.
  - Títulos de Seção: `11px`, Negrito (`600`), texto em maiúsculas (`text-transform: uppercase`) com espaçamento sutil.
  - Texto Principal (Inputs, Labels, Tooltips): `12px`, Regular (`400`).
  - Textos de ajuda / Atalhos: `10px`, Regular (`400`), cor secundária.

---

## 3. Estruturas e Efeitos Visuais (macOS Look & Feel)

1. **Janela Vibrante (Vibrancy)**:
   A barra lateral e as barras de ferramentas devem ter o efeito de desfoque de fundo (`backdrop-filter: var(--glass-blur); background-color: var(--background-panel)`).
   
2. **Bordas**:
   - Espessura de `1px` sólida.
   - Cantos arredondados padrão:
     - Botões pequenos, campos de entrada: `5px` (`border-radius: 5px`).
     - Painéis e Modais: `8px` (`border-radius: 8px`).

3. **Margens e Espaçamentos (Gaps)**:
   - Layout compacto para maximizar a área de trabalho.
   - Espaçamento interno padrão de painéis: `8px` ou `12px`.
   - Grid do Canvas: Tamanho de célula configurável ou padrão de `20px` com linhas em cinza suave.

4. **Botões Semáforo (Traffic Lights)**:
   A barra de título nativa deve conter ou respeitar os três botões clássicos do macOS (Fechar, Minimizar, Maximizar) posicionados à esquerda.

---

## 4. Diretrizes de Desenvolvimento CSS

- Utilizar **CSS Modules** para evitar poluição de escopo global.
- Nomes das classes devem ser camelCase (ex: `sidebarContainer`, `actionButton`).
- Não usar Tailwind CSS. Estilos puramente baseados em vanilla CSS estruturado.
- Transições suaves para estados de `:hover` e `:active` (`transition: all 0.15s ease-out`).
