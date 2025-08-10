import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

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

  constructor() {
    super()
    this.rows = []
  }

  private headers(): string[] {
    if (this.rows.length === 0) return ['Name', 'Status', 'Updated']
    return Object.keys(this.rows[0])
  }

  render() {
    const headers = this.headers()
    return html`
      <div class="wrap">
        <table>
          <thead>
            <tr>
              ${headers.map((h) => html`<th>${h}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${this.rows.map(
              (r) => html`<tr>
                ${headers.map((h) => html`<td>${h === 'Status' ? html`<span class="badge">${r[h]}</span>` : r[h]}</td>`)}
              </tr>`
            )}
          </tbody>
        </table>
      </div>
    `
  }
}

