import { LitElement, css, html, svg } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import page from 'page'

type TreeNode = {
  label: string
  icon?: string
  path?: string
  children?: TreeNode[]
}

const icons = {
  providers: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2v7l3 3m-3-3l-3 3"/>
    <rect x="3" y="13" width="18" height="8" rx="2"/>
    <circle cx="7" cy="17" r="1"/>
    <circle cx="12" cy="17" r="1"/>
  </svg>`,
  plans: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="7" y1="8" x2="17" y2="8"/>
    <line x1="7" y1="12" x2="17" y2="12"/>
    <line x1="7" y1="16" x2="12" y2="16"/>
  </svg>`,
  mappings: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="5" cy="12" r="3"/>
    <circle cx="19" cy="12" r="3"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>`,
  chevronLeft: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>`,
  chevronRight: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>`,
  menu: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>`
}

const menu: TreeNode[] = [
  { label: 'Providers', icon: 'providers', path: '/providers' },
  { label: 'Plans', icon: 'plans', path: '/plans' },
  { label: 'Mappings', icon: 'mappings', path: '/mappings' }
]

@customElement('nav-side')
export class NavSide extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      position: relative;
      transition: width 0.3s ease;
    }
    .sidebar {
      height: 100%;
      overflow: auto;
      padding: 0.5rem;
      position: relative;
    }
    .sidebar.collapsed {
      padding: 0.5rem 0.25rem;
    }
    .toggle-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      border-radius: var(--radius-xs);
      background: var(--vp-c-bg-soft);
      color: var(--vp-c-text-1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.2s;
    }
    .toggle-btn:hover {
      background: var(--vp-c-bg-mute);
    }
    .toggle-btn svg {
      width: 18px;
      height: 18px;
    }
    .sidebar.collapsed .toggle-btn {
      right: 50%;
      transform: translateX(50%);
    }
    .menu-content {
      margin-top: 2.5rem;
    }
    .item {
      padding: 0.35rem 0.5rem;
      border-radius: var(--radius-xs);
      cursor: pointer;
      color: var(--vp-c-text-1);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      overflow: hidden;
    }
    .item:hover { 
      background: var(--vp-c-bg-mute); 
    }
    .icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      color: var(--vp-c-text-2);
    }
    .item:hover .icon {
      color: var(--vp-c-text-1);
    }
    .icon svg {
      width: 100%;
      height: 100%;
    }
    .label {
      flex: 1;
      opacity: 1;
      transition: opacity 0.3s ease;
    }
    .sidebar.collapsed .label {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }
    .sidebar.collapsed .item {
      padding: 0.35rem;
      justify-content: center;
    }
    .children { 
      margin-left: 0.75rem; 
      border-left: 1px dashed var(--vp-c-border); 
      padding-left: 0.5rem; 
    }
    .sidebar.collapsed .children {
      display: none;
    }
    details { 
      margin: 0.1rem 0; 
    }
    summary { 
      list-style: none; 
    }
    summary::-webkit-details-marker { 
      display: none;
    }
    
    /* Tooltip for collapsed state */
    .sidebar.collapsed .item {
      position: relative;
    }
    .sidebar.collapsed .item::after {
      content: attr(data-label);
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: var(--vp-c-bg-soft);
      border: 1px solid var(--vp-c-border);
      border-radius: var(--radius-xs);
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
      z-index: 100;
    }
    .sidebar.collapsed .item:hover::after {
      opacity: 1;
    }
  `

  @state() private declare openSet: Set<string>
  @state() private declare collapsed: boolean

  constructor() {
    super()
    this.openSet = new Set<string>()
    // Restore collapsed state from localStorage
    const saved = localStorage.getItem('sidebar-collapsed')
    this.collapsed = saved === 'true' || false
  }

  private onNavigate(path?: string) {
    if (!path) return
    page.show(path)
  }

  private toggleSidebar() {
    this.collapsed = !this.collapsed
    localStorage.setItem('sidebar-collapsed', String(this.collapsed))
    // Dispatch event to notify parent of width change
    this.dispatchEvent(new CustomEvent('sidebar-toggle', { 
      detail: { collapsed: this.collapsed },
      bubbles: true,
      composed: true
    }))
  }

  private getIcon(iconName?: string) {
    if (!iconName) return ''
    return (icons as any)[iconName] || ''
  }

  private renderNode(node: TreeNode) {
    if (node.children?.length && !this.collapsed) {
      const open = this.openSet.has(node.label)
      return html`
        <details ?open=${open} @toggle=${(e: Event) => {
          const el = e.currentTarget as HTMLDetailsElement
          if (el.open) this.openSet.add(node.label); else this.openSet.delete(node.label)
        }}>
          <summary class="item" data-label=${node.label}>
            ${node.icon ? html`<span class="icon">${this.getIcon(node.icon)}</span>` : ''}
            <span class="label">${node.label}</span>
          </summary>
          <div class="children">
            ${node.children.map((c) => this.renderNode(c))}
          </div>
        </details>
      `
    }
    return html`
      <div class="item" @click=${() => this.onNavigate(node.path)} data-label=${node.label}>
        ${node.icon ? html`<span class="icon">${this.getIcon(node.icon)}</span>` : ''}
        <span class="label">${node.label}</span>
      </div>
    `
  }

  render() {
    return html`
      <aside class="sidebar ${this.collapsed ? 'collapsed' : ''}">
        <button class="toggle-btn" @click=${this.toggleSidebar} title="Toggle Sidebar">
          ${this.collapsed ? icons.chevronRight : icons.chevronLeft}
        </button>
        <div class="menu-content">
          ${menu.map((n) => this.renderNode(n))}
        </div>
      </aside>
    `
  }
}
