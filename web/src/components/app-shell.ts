import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import './nav-top'
import './nav-side'
import './tabs-view'

@customElement('app-shell')
export class AppShell extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      color: var(--vp-c-text-1);
      background: var(--vp-c-bg);
    }
    .layout {
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100%;
    }
    .main {
      display: grid;
      grid-template-columns: 180px 1fr;
      min-height: 0;
      transition: grid-template-columns 0.3s ease;
    }
    .main.sidebar-collapsed {
      grid-template-columns: 60px 1fr;
    }
    .sidebar {
      border-right: 1px solid var(--vp-c-border);
      background: var(--vp-c-bg-soft);
      min-height: 0;
    }
    .content {
      min-width: 0;
      min-height: 0;
    }
  `

  @state() private declare path: string
  @state() private declare sidebarCollapsed: boolean

  constructor() {
    super()
    this.path = '/providers'
    // Check localStorage for sidebar state
    const saved = localStorage.getItem('sidebar-collapsed')
    this.sidebarCollapsed = saved === 'true' || false
  }

  connectedCallback(): void {
    super.connectedCallback()
    // Theme will be handled by nav-top component
    this._onRoute = this._onRoute.bind(this)
    this._onSidebarToggle = this._onSidebarToggle.bind(this)
    window.addEventListener('route:change', this._onRoute)
    window.addEventListener('sidebar-toggle', this._onSidebarToggle)
  }

  disconnectedCallback(): void {
    window.removeEventListener('route:change', this._onRoute)
    window.removeEventListener('sidebar-toggle', this._onSidebarToggle)
    super.disconnectedCallback()
  }

  private _onRoute(e: Event) {
    const detail = (e as CustomEvent).detail as { path: string }
    this.path = detail.path
  }

  private _onSidebarToggle(e: Event) {
    const detail = (e as CustomEvent).detail as { collapsed: boolean }
    this.sidebarCollapsed = detail.collapsed
  }

  render() {
    return html`
      <div class="layout">
        <nav-top></nav-top>
        <div class="main ${this.sidebarCollapsed ? 'sidebar-collapsed' : ''}">
          <nav-side class="sidebar"></nav-side>
          <div class="content">
            <tabs-view .activePath=${this.path}></tabs-view>
          </div>
        </div>
      </div>
    `
  }
}
