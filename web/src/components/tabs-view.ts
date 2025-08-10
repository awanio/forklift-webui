import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('tabs-view')
export class TabsView extends LitElement {
  static styles = css`
    .tabs { display: flex; gap: 0.25rem; padding: 0.5rem; border-bottom: 1px solid var(--vp-c-border); }
    .tab { padding: 0.35rem 0.6rem; border: 1px solid var(--vp-c-border); border-bottom: none; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; background: var(--vp-c-bg-soft); cursor: pointer; }
    .tab.active { background: var(--vp-c-bg); color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }
    .panel { padding: 1rem; }
  `

  @property({ type: String }) activePath: string = '/dashboard'
  @state() private tabs: { key: string; title: string }[] = [
    { key: '/dashboard', title: 'Dashboard' },
    { key: '/settings', title: 'Settings' },
    { key: '/about', title: 'About' }
  ]

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
          (t) => html`<div class="tab ${t.key === this.activePath ? 'active' : ''}">${t.title}</div>`
        )}
      </div>
      ${this.renderPanel()}
    `
  }
}
