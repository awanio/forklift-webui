import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './ui-icon-button'

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
    .header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.75rem 1rem; border-bottom: 1px solid var(--vp-c-border);
    }
    .title { font-weight: 600; color: var(--vp-c-text-1); }
    :host([open]) .backdrop { opacity: 1; pointer-events: auto; }
    :host([open]) .panel { transform: translateX(0); }
  `

  @property({ type: Boolean, reflect: true }) declare open: boolean
  @property({ type: String }) declare title: string

  constructor() {
    super()
    this.open = false
    this.title = ''
  }

  connectedCallback(): void {
    super.connectedCallback()
    this._onKey = this._onKey.bind(this)
    window.addEventListener('keydown', this._onKey)
  }

  disconnectedCallback(): void {
    window.removeEventListener('keydown', this._onKey)
    super.disconnectedCallback()
  }

  private _onKey(e: KeyboardEvent) {
    if (!this.open) return
    if (e.key === 'Escape') {
      e.stopPropagation()
      this.dispatchEvent(new CustomEvent('close'))
    }
  }

  private onBackdropClick() {
    this.dispatchEvent(new CustomEvent('close'))
  }

  private onCloseClick() {
    this.dispatchEvent(new CustomEvent('close'))
  }

  render() {
    return html`
      <div class="backdrop" @click=${() => this.onBackdropClick()}></div>
      <div class="panel">
        <div class="header">
          <div class="title">${this.title}</div>
          <ui-icon-button @click=${() => this.onCloseClick()} aria-label="Close drawer">×</ui-icon-button>
        </div>
        <slot></slot>
      </div>
    `
  }
}

