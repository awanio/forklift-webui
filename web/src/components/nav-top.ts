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
    .brand-title {
      color: var(--vp-c-text-1);
      font-weight: 600;
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
    .icon { display: inline-block; width: 18px; height: 18px; }
  `

  render() {
    return html`
      <header>
        <div class="brand-title">Forklift WebUI</div>
        <div class="actions">
          <button @click=${() => this.dispatchEvent(new CustomEvent('toggle-theme'))} aria-label="Toggle theme">
            <!-- simple sun/moon icon -->
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          </button>
        </div>
      </header>
    `
  }
}
