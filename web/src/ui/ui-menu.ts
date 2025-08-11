import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type MenuItem = { key: string; label: string }

@customElement('ui-menu')
export class UIMenu extends LitElement {
  static styles = css`
    :host { position: absolute; z-index: 1000; inset: auto auto auto auto; }
    .menu {
      min-width: 140px;
      background: var(--vp-c-bg);
      color: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-border);
      border-radius: var(--radius-sm);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 0.25rem;
    }
    .item {
      padding: 0.4rem 0.5rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      outline: none;
    }
    .item:hover, .item.focused { background: var(--vp-c-bg-soft); }
    .hidden { display: none; }
  `

  @property({ type: Boolean, reflect: true }) declare open: boolean
  @property({ type: Array }) declare items: MenuItem[]
  private focusedIndex = -1
  private boundKeyHandler: (e: KeyboardEvent) => void
  private boundClickOutside: (e: MouseEvent) => void

  constructor() {
    super()
    this.open = false
    this.items = []
    this.boundKeyHandler = this.handleKeyDown.bind(this)
    this.boundClickOutside = this.handleClickOutside.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('keydown', this.boundKeyHandler)
    document.addEventListener('click', this.boundClickOutside)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('keydown', this.boundKeyHandler)
    document.removeEventListener('click', this.boundClickOutside)
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.focusedIndex = 0
      } else {
        this.focusedIndex = -1
      }
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.open) return

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        this.close()
        break
      case 'ArrowDown':
        e.preventDefault()
        this.focusedIndex = (this.focusedIndex + 1) % this.items.length
        this.requestUpdate()
        break
      case 'ArrowUp':
        e.preventDefault()
        this.focusedIndex = this.focusedIndex <= 0 ? this.items.length - 1 : this.focusedIndex - 1
        this.requestUpdate()
        break
      case 'Enter':
        e.preventDefault()
        if (this.focusedIndex >= 0 && this.focusedIndex < this.items.length) {
          this.onItemClick(this.items[this.focusedIndex])
        }
        break
    }
  }

  private handleClickOutside(e: MouseEvent) {
    if (this.open && !this.contains(e.target as Node)) {
      this.close()
    }
  }

  private close() {
    this.open = false
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  private onClick(e: Event) {
    e.stopPropagation()
  }

  private onItemClick(item: MenuItem) {
    this.dispatchEvent(new CustomEvent('select', { detail: item, bubbles: true, composed: true }))
    this.close()
  }

  render() {
    return html`
      <div class="menu ${this.open ? '' : 'hidden'}" @click=${(e: Event) => this.onClick(e)}>
        ${this.items.map((item, index) => html`
          <div 
            class="item ${index === this.focusedIndex ? 'focused' : ''}" 
            @click=${() => this.onItemClick(item)}
            @mouseenter=${() => { this.focusedIndex = index; this.requestUpdate(); }}
          >
            ${item.label}
          </div>
        `)}
      </div>
    `
  }
}

