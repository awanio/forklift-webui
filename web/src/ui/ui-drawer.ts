import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('ui-drawer')
export class UIDrawer extends LitElement {
  static styles = css`
    :host { position: fixed; inset: 0; pointer-events: none; }
    .backdrop {
      position: absolute; inset: 0; background: rgba(0,0,0,0.4);
      opacity: 0; transition: opacity .2s ease; pointer-events: none;
    }
    .panel {
      position: absolute; top: 0; right: 0; height: 100%; width: min(420px, 100%);
      background: var(--vp-c-bg); color: var(--vp-c-text-1);
      border-left: 1px solid var(--vp-c-border);
      transform: translateX(100%); transition: transform .2s ease;
      pointer-events: auto;
      display: flex; flex-direction: column;
    }
    :host([open]) .backdrop { opacity: 1; pointer-events: auto; }
    :host([open]) .panel { transform: translateX(0); }
  `

  @property({ type: Boolean, reflect: true }) declare open: boolean

  constructor() {
    super()
    this.open = false
  }

  private onBackdropClick() {
    this.dispatchEvent(new CustomEvent('close'))
  }

  render() {
    return html`
      <div class="backdrop" @click=${() => this.onBackdropClick()}></div>
      <div class="panel">
        <slot></slot>
      </div>
    `
  }
}

