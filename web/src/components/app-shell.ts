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
      grid-template-columns: 260px 1fr;
      min-height: 0;
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

  @state() private path: string = '/dashboard'

  connectedCallback(): void {
    super.connectedCallback()
    // default dark
    document.documentElement.classList.add('dark')
    this._onRoute = this._onRoute.bind(this)
    window.addEventListener('route:change', this._onRoute)
  }

  disconnectedCallback(): void {
    window.removeEventListener('route:change', this._onRoute)
    super.disconnectedCallback()
  }

  private _onRoute(e: Event) {
    const detail = (e as CustomEvent).detail as { path: string }
    this.path = detail.path
  }

  private toggleTheme() {
    document.documentElement.classList.toggle('dark')
    this.requestUpdate()
  }

  render() {
    return html`
      <div class="layout">
        <nav-top @toggle-theme=${() => this.toggleTheme()}></nav-top>
        <div class="main">
          <nav-side class="sidebar"></nav-side>
          <div class="content">
            <tabs-view .activePath=${this.path}></tabs-view>
          </div>
        </div>
      </div>
    `
  }
}
