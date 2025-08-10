import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import page from 'page'

@customElement('tabs-view')
export class TabsView extends LitElement {
  static styles = css`
    .tabs {
      display: flex;
      gap: 1rem;
      padding: 0 1rem;
      border-bottom: 1px solid var(--vp-c-border);
      background: var(--vp-c-bg);
    }
    .tab {
      position: relative;
      padding: 0.75rem 0.25rem;
      cursor: pointer;
      color: var(--vp-c-text-2);
      transition: color 0.15s ease;
      user-select: none;
    }
    .tab:hover {
      color: var(--vp-c-text-1);
    }
    .tab.active {
      color: var(--vp-c-text-1);
    }
    .tab::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      height: 2px;
      background: transparent;
      transform: scaleX(0);
      transition: transform 0.15s ease, background-color 0.15s ease;
    }
    .tab:hover::after {
      background: var(--vp-c-border);
      transform: scaleX(1);
    }
    .tab.active::after {
      background: var(--vp-c-brand-1);
      transform: scaleX(1);
    }
    .panel { padding: 1rem; }
  `

  @property({ type: String }) declare activePath: string
  @state() private declare tabs: { key: string; title: string }[]

  constructor() {
    super()
    this.activePath = '/dashboard'
    this.tabs = [
      { key: '/dashboard', title: 'Dashboard' },
      { key: '/settings', title: 'Settings' },
      { key: '/about', title: 'About' }
    ]
  }

  private onTabClick(path: string) {
    if (path !== this.activePath) {
      page.show(path)
    }
  }

  renderPanel() {
    switch (this.activePath) {
      case '/dashboard':
        return html`<div class="panel">
          <h2 class="text-xl font-semibold text-[var(--vp-c-text-1)]">Dashboard</h2>
          <p class="text-[var(--vp-c-text-2)]">Welcome to forklift-wui</p>
        </div>`
      case '/settings':
        return html`<div class="panel">
          <h2 class="text-xl font-semibold">Settings</h2>
          <p class="text-[var(--vp-c-text-2)]">Adjust preferences.</p>
        </div>`
      case '/about':
        return html`<div class="panel">
          <h2 class="text-xl font-semibold">About</h2>
          <p class="text-[var(--vp-c-text-2)]">A minimal web UI using Lit + Tailwind.</p>
        </div>`
      default:
        return html`<div class="panel">Not found</div>`
    }
  }

  render() {
    return html`
      <div class="tabs">
        ${this.tabs.map(
          (t) => html`<div class="tab ${t.key === this.activePath ? 'active' : ''}" @click=${() => this.onTabClick(t.key)}>${t.title}</div>`
        )}
      </div>
      ${this.renderPanel()}
    `
  }
}
