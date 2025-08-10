import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('ui-button')
export class UIButton extends LitElement {
  static styles = css`
    :host { display: inline-block; }
    button {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-border);
      padding: 0.4rem 0.65rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font: inherit;
    }
    button:hover {
      background: var(--vp-c-brand-2);
      color: #fff;
      border-color: var(--vp-c-brand-2);
    }
  `

  @property({ type: String }) declare type: 'button' | 'submit'

  constructor() {
    super()
    this.type = 'button'
  }

  render() {
    return html`<button type="${this.type}"><slot></slot></button>`
  }
}

