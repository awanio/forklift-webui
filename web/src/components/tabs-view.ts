import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import page from 'page'
import '../ui/ui-button'
import '../ui/ui-table'
import '../ui/ui-drawer'
import '../ui/ui-dialog'

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
    .search-input {
      flex: 1;
      max-width: 400px;
      padding: 0.4rem 0.75rem;
      border: 1px solid var(--vp-c-border);
      border-radius: var(--radius-xs);
      background: var(--vp-c-bg);
      color: var(--vp-c-text-1);
      font-size: 0.875rem;
    }
    .search-input:focus {
      outline: none;
      border-color: var(--vp-c-brand-1);
    }
    .search-input::placeholder {
      color: var(--vp-c-text-3);
    }
  `

  @property({ type: String }) declare activePath: string
  @state() private declare tabs: { key: string; title: string }[]
  @state() private declare subTabs: { key: string; title: string }[]
  @state() private declare subKey: string
  @state() private declare showDrawer: boolean
  @state() private declare drawerMode: 'create' | 'detail'
  @state() private declare drawerTitle: string
  @state() private declare drawerRow: Record<string, string> | null
  @state() private declare showDeleteDialog: boolean
  @state() private declare deleteRow: Record<string, string> | null

  constructor() {
    super()
    this.activePath = '/providers'
    this.tabs = [
      { key: '/providers', title: 'Providers' },
      { key: '/plans', title: 'Plans' },
      { key: '/mappings', title: 'Mappings' }
    ]
    this.subTabs = this.computeSubTabs(this.activePath)
    this.subKey = this.subTabs[0]?.key ?? 'overview'
    this.showDrawer = false
    this.drawerMode = 'create'
    this.drawerTitle = 'Create'
    this.drawerRow = null
    this.showDeleteDialog = false
    this.deleteRow = null
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('activePath')) {
      this.subTabs = this.computeSubTabs(this.activePath)
      this.subKey = this.subTabs[0]?.key ?? 'overview'
    }
  }

  private computeSubTabs(path: string): { key: string; title: string }[] {
    switch (path) {
      case '/providers':
        return [
          { key: 'overview', title: 'Overview' },
          { key: 'accounts', title: 'Accounts' },
          { key: 'regions', title: 'Regions' }
        ]
      case '/plans':
        return [
          { key: 'overview', title: 'Overview' },
          { key: 'versions', title: 'Versions' },
          { key: 'pricing', title: 'Pricing' }
        ]
      case '/mappings':
        return [
          { key: 'overview', title: 'Overview' },
          { key: 'rules', title: 'Rules' }
        ]
      default:
        return [{ key: 'overview', title: 'Overview' }]
    }
  }

  private onMainTabClick(path: string) {
    if (path !== this.activePath) {
      page.show(path)
    }
  }

  private onSubTabClick(key: string) {
    this.subKey = key
  }

  private onCreate() {
    this.drawerMode = 'create'
    this.drawerTitle = 'Create'
    this.drawerRow = null
    this.showDrawer = true
  }

  private onCloseDrawer() {
    this.showDrawer = false
  }

  private onRowAction(e: CustomEvent<{ action: string; row: Record<string, string>; index: number }>) {
    const { action, row } = e.detail
    if (action === 'detail') {
      this.drawerMode = 'detail'
      this.drawerTitle = 'Detail'
      this.drawerRow = row
      this.showDrawer = true
    } else if (action === 'delete') {
      this.deleteRow = row
      this.showDeleteDialog = true
    }
  }

  private onConfirmDelete() {
    if (this.deleteRow) {
      this.dispatchEvent(new CustomEvent('delete-row', { 
        detail: { row: this.deleteRow }, 
        bubbles: true, 
        composed: true 
      }))
    }
    this.showDeleteDialog = false
    this.deleteRow = null
  }

  private onCancelDelete() {
    this.showDeleteDialog = false
    this.deleteRow = null
  }

  private table(title: string, rows: Array<Record<string, string>>) {
    return html`
      <div class="panel">
        <div class="panel-header">
          <input type="search" placeholder="Search ${title}..." class="search-input" />
          <ui-button @click=${() => this.onCreate()}>
            ＋ Create
          </ui-button>
        </div>
        <ui-table .rows=${rows} @row-action=${(e: CustomEvent) => this.onRowAction(e)}></ui-table>
      </div>
    `
  }

  renderPanel() {
    switch (this.activePath) {
      case '/providers':
        if (this.subKey === 'accounts') {
          return this.table('Providers • Accounts', [
            { Name: 'aws-root', Status: 'Active', Updated: '1m ago' },
            { Name: 'aws-dev', Status: 'Active', Updated: '5m ago' }
          ])
        }
        if (this.subKey === 'regions') {
          return this.table('Providers • Regions', [
            { Name: 'us-east-1', Status: 'Available', Updated: 'now' },
            { Name: 'ap-southeast-1', Status: 'Available', Updated: '2m ago' }
          ])
        }
        return this.table('Providers • Overview', [
          { Name: 'AWS', Status: 'Active', Updated: '1m ago' },
          { Name: 'GCP', Status: 'Active', Updated: '5m ago' },
          { Name: 'Azure', Status: 'Inactive', Updated: '10m ago' }
        ])
      case '/plans':
        if (this.subKey === 'versions') {
          return this.table('Plans • Versions', [
            { Name: 'v1.0', Status: 'Active', Updated: 'today' },
            { Name: 'v1.1', Status: 'Draft', Updated: 'yesterday' }
          ])
        }
        if (this.subKey === 'pricing') {
          return this.table('Plans • Pricing', [
            { Name: 'Basic', Status: '$9', Updated: 'today' },
            { Name: 'Pro', Status: '$29', Updated: 'today' }
          ])
        }
        return this.table('Plans • Overview', [
          { Name: 'Basic', Status: 'Enabled', Updated: 'now' },
          { Name: 'Pro', Status: 'Enabled', Updated: 'yesterday' },
          { Name: 'Enterprise', Status: 'Draft', Updated: '2d ago' }
        ])
      case '/mappings':
        if (this.subKey === 'rules') {
          return this.table('Mappings • Rules', [
            { Name: 'Plan->AWS', Status: 'OK', Updated: '2025-08-10' },
            { Name: 'Plan->GCP', Status: 'OK', Updated: '2025-08-10' }
          ])
        }
        return this.table('Mappings • Overview', [
          { Name: 'Plan->AWS', Status: 'OK', Updated: '2025-08-10' },
          { Name: 'Plan->GCP', Status: 'OK', Updated: '2025-08-10' }
        ])
      default:
        return html`<div class="panel">Not found</div>`
    }
  }

  render() {
    return html`
      <div class="tabs" style="gap: 0.75rem; padding: 0 1rem;">
        ${this.subTabs.map(
          (t) => html`<div class="tab ${t.key === this.subKey ? 'active' : ''}" @click=${() => this.onSubTabClick(t.key)}>${t.title}</div>`
        )}
      </div>

      ${this.renderPanel()}

      
      <ui-drawer .open=${this.showDrawer} title=${this.drawerTitle} @close=${() => this.onCloseDrawer()}>
        ${this.drawerMode === 'detail' && this.drawerRow ? html`
          <div style="padding: 1rem; display: grid; gap: 0.5rem;">
            ${Object.entries(this.drawerRow).map(([k, v]) => html`<div><strong>${k}:</strong> ${v}</div>`)}
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
              <ui-button @click=${() => this.onCloseDrawer()}>Close</ui-button>
            </div>
          </div>
        ` : html`
          <div style="padding: 1rem; display: grid; gap: 0.75rem;">
            <label style="display:grid; gap:0.25rem;">
              <span style="color:var(--vp-c-text-2);">Name</span>
              <input style="padding:0.5rem; border:1px solid var(--vp-c-border); background:var(--vp-c-bg); color:var(--vp-c-text-1); border-radius: var(--radius-sm);" placeholder="Enter name" />
            </label>
            <div style="display:flex; gap:0.5rem; justify-content:flex-end; margin-top:0.5rem;">
              <ui-button @click=${() => this.onCloseDrawer()}>Cancel</ui-button>
              <ui-button>Save</ui-button>
            </div>
          </div>
        `}
      </ui-drawer>

      <ui-dialog
        .open=${this.showDeleteDialog}
        title="Delete Item"
        message=${`Are you sure you want to delete "${this.deleteRow?.Name || 'this item'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        @confirm=${this.onConfirmDelete}
        @cancel=${this.onCancelDelete}
      ></ui-dialog>
    `
  }
}
