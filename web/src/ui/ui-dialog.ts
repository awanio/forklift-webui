import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('ui-dialog')
export class UIDialog extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      animation: fadeIn 0.2s ease-out;
    }
    
    .dialog {
      position: relative;
      background: var(--vp-c-bg);
      color: var(--vp-c-text-1);
      border-radius: var(--radius-md);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
      animation: slideUp 0.3s ease-out;
    }
    
    .header {
      padding: 1.25rem 1.5rem 0.75rem;
      border-bottom: 1px solid var(--vp-c-border);
    }
    
    .title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }
    
    .content {
      padding: 1.25rem 1.5rem;
    }
    
    .footer {
      padding: 0.75rem 1.5rem 1.25rem;
      border-top: 1px solid var(--vp-c-border);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    
    button {
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
    }
    
    .cancel-btn {
      background: var(--vp-c-bg-soft);
      color: var(--vp-c-text-2);
      border-color: var(--vp-c-border);
    }
    
    .cancel-btn:hover {
      background: var(--vp-c-bg-alt);
    }
    
    .confirm-btn {
      background: var(--vp-c-brand);
      color: var(--vp-c-bg);
    }
    
    .confirm-btn:hover {
      background: var(--vp-c-brand-dark);
    }
    
    .confirm-btn.danger {
      background: #dc2626;
    }
    
    .confirm-btn.danger:hover {
      background: #b91c1c;
    }
    
    .hidden {
      display: none;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `

  @property({ type: Boolean, reflect: true }) declare open: boolean
  @property({ type: String }) declare title: string
  @property({ type: String }) declare message: string
  @property({ type: String }) declare confirmText: string
  @property({ type: String }) declare cancelText: string
  @property({ type: String }) declare type: 'confirm' | 'danger'

  constructor() {
    super()
    this.open = false
    this.title = 'Confirm'
    this.message = 'Are you sure?'
    this.confirmText = 'Confirm'
    this.cancelText = 'Cancel'
    this.type = 'confirm'
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('keydown', this.handleKeyDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.open && e.key === 'Escape') {
      e.preventDefault()
      this.cancel()
    }
  }

  private confirm() {
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }))
    this.open = false
  }

  private cancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
    this.open = false
  }

  render() {
    return html`
      <div class="${this.open ? '' : 'hidden'}">
        <div class="backdrop" @click=${this.cancel}></div>
        <div class="dialog">
          <div class="header">
            <h3 class="title">${this.title}</h3>
          </div>
          <div class="content">
            <p>${this.message}</p>
          </div>
          <div class="footer">
            <button class="cancel-btn" @click=${this.cancel}>
              ${this.cancelText}
            </button>
            <button class="confirm-btn ${this.type === 'danger' ? 'danger' : ''}" @click=${this.confirm}>
              ${this.confirmText}
            </button>
          </div>
        </div>
      </div>
    `
  }
}
