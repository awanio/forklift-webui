import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './ui-icon-button'
import './ui-menu'

@customElement('ui-table')
export class UITable extends LitElement {
  static styles = css`
    :host { display: block; }
    .wrap {
      overflow: auto;
      border: 1px solid var(--vp-c-border);
      border-radius: var(--radius-sm);
      background: var(--vp-c-bg);
    }
    table { width: 100%; border-collapse: collapse; min-width: 640px; }
    thead { background: var(--vp-c-bg-soft); }
    th, td { text-align: left; padding: 0.65rem 0.75rem; border-bottom: 1px solid var(--vp-c-border); color: var(--vp-c-text-1); }
    tbody tr:hover { background: var(--vp-c-bg-soft); }
    .badge { display: inline-block; padding: 0.15rem 0.4rem; border-radius: 9999px; background: var(--vp-c-brand-soft); color: var(--vp-c-text-1); font-size: 0.75rem; }
  `

  @property({ attribute: false }) declare rows: Array<Record<string, string>>

  private openIndex: number | null = null

  constructor() {
    super()
    this.rows = []
  }

  private headers(): string[] {
    if (this.rows.length === 0) return ['Name', 'Status', 'Updated']
    return Object.keys(this.rows[0])
  }

  private actionItems() { return [{ key: 'detail', label: 'Detail' }, { key: 'delete', label: 'Delete' }] }

  private onDotsClick(e: Event, idx: number) {
    e.stopPropagation()
    this.openIndex = this.openIndex === idx ? null : idx
    this.requestUpdate()
    const onDoc = (ev: Event) => {
      this.openIndex = null
      this.requestUpdate()
      document.removeEventListener('click', onDoc, true)
    }
    document.addEventListener('click', onDoc, true)
  }

  private onMenuSelect(idx: number, item: { key: string; label: string }) {
    const row = this.rows[idx]
    this.dispatchEvent(new CustomEvent('row-action', { detail: { action: item.key, row, index: idx }, bubbles: true, composed: true }))
    this.openIndex = null
    this.requestUpdate()
  }

  render() {
    const headers = this.headers()
    return html`
      <div class="wrap">
        <table>
          <thead>
            <tr>
              ${headers.map((h) => html`<th>${h}</th>`)}
              <th style="width:48px; text-align:right;"></th>
            </tr>
          </thead>
          <tbody>
            ${this.rows.map(
              (r, idx) => html`<tr>
                ${headers.map((h) => html`<td>${h === 'Status' ? html`<span class="badge">${r[h]}</span>` : r[h]}</td>`)}
                <td style="position:relative; text-align:right;">
<ui-icon-button @click=${(e: Event) => this.onDotsClick(e, idx)} aria-label="Row actions"><span style="line-height:0"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></span></ui-icon-button>
                  <ui-menu .open=${this.openIndex === idx} .items=${this.actionItems()} @select=${(ev: CustomEvent) => this.onMenuSelect(idx, ev.detail)} style="position:absolute; right:0; top: calc(100% + 4px);"></ui-menu>
                </td>
              </tr>`
            )}
          </tbody>
        </table>
      </div>
    `
  }
}

