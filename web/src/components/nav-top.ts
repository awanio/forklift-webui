import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('nav-top')
export class NavTop extends LitElement {
  static styles = css`
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid var(--vp-c-border);
      background: var(--vp-c-bg);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .brand {
      font-weight: 600;
      color: var(--vp-c-brand-1);
    }
.actions button {
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-border);
      padding: 0.35rem 0.6rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .actions button:hover {
      background: var(--vp-c-brand-2);
      color: white;
      border-color: var(--vp-c-brand-2);
    }
  `

  render() {
    return html`
      <header>
        <div class="brand">forklift-wui</div>
        <div class="actions">
          <button @click=${() => this.dispatchEvent(new CustomEvent('toggle-theme'))}>Toggle theme</button>
        </div>
      </header>
    `
  }
}
