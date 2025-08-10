import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import page from 'page'
import '../ui/ui-button'
import '../ui/ui-table'

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

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--vp-c-text-1);
    }
/* button/table styles moved to reusable UI components */
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-border);
      padding: 0.4rem 0.65rem;
      border-radius: 0.25rem;
      cursor: pointer;
    }
    .create-btn:hover {
      background: var(--vp-c-brand-2);
      color: #fff;
      border-color: var(--vp-c-brand-2);
    }

/* table presentation handled by ui-table */
      overflow: auto;
      border: 1px solid var(--vp-c-border);
      border-radius: 0.25rem;
      background: var(--vp-c-bg);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 640px;
    }
    thead {
      background: var(--vp-c-bg-soft);
    }
    th, td {
      text-align: left;
      padding: 0.65rem 0.75rem;
      border-bottom: 1px solid var(--vp-c-border);
      color: var(--vp-c-text-1);
    }
    tbody tr:hover {
      background: var(--vp-c-bg-soft);
    }
    .badge {
      display: inline-block;
      padding: 0.15rem 0.4rem;
      border-radius: 9999px;
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-text-1);
      font-size: 0.75rem;
    }
  `

  @property({ type: String }) declare activePath: string
  @state() private declare tabs: { key: string; title: string }[]

  constructor() {
    super()
    this.activePath = '/providers'
    this.tabs = [
      { key: '/providers', title: 'Providers' },
      { key: '/plans', title: 'Plans' },
      { key: '/mappings', title: 'Mappings' }
    ]
  }

  private onTabClick(path: string) {
    if (path !== this.activePath) {
      page.show(path)
    }
  }

  private onCreate() {
    const name = this.activePath.replace('/', '') || 'item'
    // Placeholder create action
    alert(`Create new ${name}`)
  }

  private table(title: string, rows: Array<Record<string, string>>) {
    return html`
      <div class="panel">
        <div class="panel-header">
          <div class="title">${title}</div>
          <ui-button @click=${() => this.onCreate()}>
            ＋ Create
          </ui-button>
        </div>
        <ui-table .rows=${rows}></ui-table>
      </div>
    `
  }

  renderPanel() {
    switch (this.activePath) {
      case '/providers':
        return this.table('Providers', [
          { Name: 'AWS', Status: 'Active', Updated: '1m ago' },
          { Name: 'GCP', Status: 'Active', Updated: '5m ago' },
          { Name: 'Azure', Status: 'Inactive', Updated: '10m ago' }
        ])
      case '/plans':
        return this.table('Plans', [
          { Name: 'Basic', Status: 'Enabled', Updated: 'now' },
          { Name: 'Pro', Status: 'Enabled', Updated: 'yesterday' },
          { Name: 'Enterprise', Status: 'Draft', Updated: '2d ago' }
        ])
      case '/mappings':
        return this.table('Mappings', [
          { Name: 'Plan->AWS', Status: 'OK', Updated: '2025-08-10' },
          { Name: 'Plan->GCP', Status: 'OK', Updated: '2025-08-10' }
        ])
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
