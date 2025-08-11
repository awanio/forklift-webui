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
    this.subKey = this.subTabs[0]?.key ?? 'vmware'
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
      this.subKey = this.subTabs[0]?.key ?? (this.activePath === '/providers' ? 'vmware' : this.activePath === '/plans' ? 'plans' : 'networks')
    }
  }

  private computeSubTabs(path: string): { key: string; title: string }[] {
    switch (path) {
      case '/providers':
        return [
          { key: 'vmware', title: 'VMware' },
          { key: 'openstack', title: 'OpenStack' },
          { key: 'kubevirt', title: 'KubeVirt' },
          { key: 'ovirt', title: 'oVirt' },
          { key: 'ova', title: 'OVA' }
        ]
      case '/plans':
        return [
          { key: 'plans', title: 'Plans' },
          { key: 'migrations', title: 'Migrations' }
        ]
      case '/mappings':
        return [
          { key: 'networks', title: 'Networks' },
          { key: 'storages', title: 'Storages' }
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
        if (this.subKey === 'vmware') {
          return this.table('Providers • VMware', [
            { Name: 'vCenter-prod', Status: 'Connected', Version: '7.0.3', Updated: '1m ago' },
            { Name: 'vCenter-dev', Status: 'Connected', Version: '7.0.2', Updated: '5m ago' },
            { Name: 'ESXi-01', Status: 'Active', Version: '7.0 U3', Updated: '2m ago' }
          ])
        }
        if (this.subKey === 'openstack') {
          return this.table('Providers • OpenStack', [
            { Name: 'openstack-prod', Status: 'Active', Version: 'Yoga', Updated: 'now' },
            { Name: 'openstack-dev', Status: 'Active', Version: 'Xena', Updated: '3m ago' },
            { Name: 'openstack-test', Status: 'Maintenance', Version: 'Wallaby', Updated: '10m ago' }
          ])
        }
        if (this.subKey === 'kubevirt') {
          return this.table('Providers • KubeVirt', [
            { Name: 'kubevirt-cluster-1', Status: 'Running', Version: 'v0.59.0', Updated: '30s ago' },
            { Name: 'kubevirt-cluster-2', Status: 'Running', Version: 'v0.58.0', Updated: '2m ago' },
            { Name: 'kubevirt-dev', Status: 'Paused', Version: 'v0.59.0', Updated: '15m ago' }
          ])
        }
        if (this.subKey === 'ovirt') {
          return this.table('Providers • oVirt', [
            { Name: 'ovirt-engine-01', Status: 'Up', Version: '4.5.3', Updated: '1m ago' },
            { Name: 'ovirt-node-01', Status: 'Up', Version: '4.5.3', Updated: '2m ago' },
            { Name: 'ovirt-node-02', Status: 'Maintenance', Version: '4.5.2', Updated: '5m ago' }
          ])
        }
        if (this.subKey === 'ova') {
          return this.table('Providers • OVA', [
            { Name: 'ubuntu-22.04.ova', Status: 'Available', Size: '2.5 GB', Updated: 'yesterday' },
            { Name: 'centos-8.ova', Status: 'Available', Size: '1.8 GB', Updated: '2d ago' },
            { Name: 'windows-2022.ova', Status: 'Importing', Size: '4.2 GB', Updated: '5m ago' }
          ])
        }
        return this.table('Providers', [
          { Name: 'VMware vCenter', Status: 'Active', Updated: '1m ago' },
          { Name: 'OpenStack', Status: 'Active', Updated: '5m ago' },
          { Name: 'KubeVirt', Status: 'Active', Updated: '10m ago' }
        ])
      case '/plans':
        if (this.subKey === 'migrations') {
          return this.table('Plans • Migrations', [
            { Name: 'vmware-to-openstack-01', Status: 'Running', Progress: '45%', VMs: '12/25', Updated: '5m ago' },
            { Name: 'esxi-to-kubevirt', Status: 'Completed', Progress: '100%', VMs: '8/8', Updated: '2h ago' },
            { Name: 'ovirt-migration-batch2', Status: 'Scheduled', Progress: '0%', VMs: '0/15', Updated: 'today' },
            { Name: 'datacenter-migration', Status: 'Failed', Progress: '72%', VMs: '18/25', Updated: '1h ago' },
            { Name: 'test-migration-03', Status: 'Paused', Progress: '60%', VMs: '6/10', Updated: '30m ago' }
          ])
        }
        return this.table('Plans • Plans', [
          { Name: 'Production-Migration-Q1', Status: 'Active', Source: 'VMware', Target: 'OpenStack', VMs: '45', Updated: 'now' },
          { Name: 'Dev-Environment-Move', Status: 'Ready', Source: 'ESXi', Target: 'KubeVirt', VMs: '12', Updated: '10m ago' },
          { Name: 'DR-Site-Migration', Status: 'Draft', Source: 'oVirt', Target: 'OpenStack', VMs: '28', Updated: '1h ago' },
          { Name: 'Legacy-App-Transfer', Status: 'Archived', Source: 'VMware', Target: 'KubeVirt', VMs: '8', Updated: '2d ago' }
        ])
      case '/mappings':
        if (this.subKey === 'storages') {
          return this.table('Mappings • Storages', [
            { Name: 'vmware-datastore-01', Source: 'VMFS-Datastore-1', Target: 'ceph-pool-01', Type: 'Block', Status: 'Mapped', Updated: '5m ago' },
            { Name: 'nfs-storage-map', Source: 'NFS-Volume', Target: 'openstack-cinder', Type: 'NFS', Status: 'Mapped', Updated: '10m ago' },
            { Name: 'san-migration-map', Source: 'iSCSI-LUN-02', Target: 'kubevirt-pvc', Type: 'iSCSI', Status: 'Pending', Updated: '1h ago' },
            { Name: 'local-storage-map', Source: 'Local-VMDK', Target: 'local-pv', Type: 'Local', Status: 'Mapped', Updated: '2h ago' }
          ])
        }
        return this.table('Mappings • Networks', [
          { Name: 'prod-network-map', Source: 'vlan-100', Target: 'ovn-network-prod', Type: 'VLAN', Status: 'Active', Updated: 'now' },
          { Name: 'dev-network-map', Source: 'vlan-200', Target: 'neutron-dev-net', Type: 'VLAN', Status: 'Active', Updated: '3m ago' },
          { Name: 'dmz-network-map', Source: 'port-group-dmz', Target: 'ovn-dmz-segment', Type: 'Distributed', Status: 'Active', Updated: '15m ago' },
          { Name: 'management-map', Source: 'mgmt-network', Target: 'ocp-mgmt-net', Type: 'Standard', Status: 'Inactive', Updated: '1h ago' },
          { Name: 'storage-network', Source: 'vsan-network', Target: 'ceph-public', Type: 'Storage', Status: 'Active', Updated: '30m ago' }
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
