import { getCurrentSandboxById } from "@/sandbox/iframe/cache";

if (!customElements?.get('sandbox-container')) {
    customElements.define(
        'sandbox-container',
        class SandboxContainer extends HTMLElement {
            connectedCallback(): void {
                if (this.shadowRoot) {
                    return;
                }
                const shadowRoot = this.attachShadow({mode: 'open'});
                const sandbox = getCurrentSandboxById(this.getAttribute('data-id')!)
                sandbox?.connect(shadowRoot)
            }

            disconnectedCallback(): void {
                const sandbox = getCurrentSandboxById(this.getAttribute('data-id')!)
                sandbox?.destroy()
            }
        }
    )
}
