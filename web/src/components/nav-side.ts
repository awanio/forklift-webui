import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import page from 'page'

type TreeNode = {
  label: string
  path?: string
  children?: TreeNode[]
}

const menu: TreeNode[] = [
  { label: 'Dashboard', path: '/dashboard' },
  {
    label: 'Management',
    children: [
      { label: 'Settings', path: '/settings' },
      { label: 'About', path: '/about' }
    ]
  }
]

@customElement('nav-side')
export class NavSide extends LitElement {
  static styles = css`
    .sidebar {
      height: 100%;
      overflow: auto;
      padding: 0.5rem;
    }
    .item {
      padding: 0.35rem 0.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      color: var(--vp-c-text-1);
    }
    .item:hover { background: var(--vp-c-bg-mute); }
    .children { margin-left: 0.75rem; border-left: 1px dashed var(--vp-c-border); padding-left: 0.5rem; }
    details { margin: 0.1rem 0; }
    summary { list-style: none; }
    summary::-webkit-details-marker { display: none }
  `

  @state() private declare openSet: Set<string>

  constructor() {
    super()
    this.openSet = new Set<string>(['Management'])
  }

  private onNavigate(path?: string) {
    if (!path) return
    page.show(path)
  }

  private renderNode(node: TreeNode) {
    if (node.children?.length) {
      const open = this.openSet.has(node.label)
      return html`
        <details ?open=${open} @toggle=${(e: Event) => {
          const el = e.currentTarget as HTMLDetailsElement
          if (el.open) this.openSet.add(node.label); else this.openSet.delete(node.label)
        }}>
          <summary class="item">${node.label}</summary>
          <div class="children">
            ${node.children.map((c) => this.renderNode(c))}
          </div>
        </details>
      `
    }
    return html`<div class="item" @click=${() => this.onNavigate(node.path)}>${node.label}</div>`
  }

  render() {
    return html`<aside class="sidebar">${menu.map((n) => this.renderNode(n))}</aside>`
  }
}
