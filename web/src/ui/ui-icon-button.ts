import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('ui-icon-button')
export class UIIconButton extends LitElement {
  static styles = css`
    :host { display: inline-block; }
    button {
      display: inline-grid; place-items: center;
      width: 28px; height: 28px;
      border: 1px solid var(--vp-c-border);
      background: var(--vp-c-bg);
      color: var(--vp-c-text-1);
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    button:hover { background: var(--vp-c-bg-soft); }
  `
  render() {
    return html`<button part="button"><slot></slot></button>`
  }
}

