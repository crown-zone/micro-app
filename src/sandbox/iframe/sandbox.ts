const iframeGenerator = (id: string): HTMLIFrameElement => {
    const iframe = document.createElement('iframe')

    iframe.setAttribute('style', 'display: none')
    iframe.setAttribute('id', `sandbox-${id}`)

    return iframe
}

const patchElementEffect = (shadowRoot: ShadowRoot, fakeWindow: Window): void => {
    Object.defineProperty(fakeWindow.document, 'body', {
        get() {
            return shadowRoot.querySelector('body')
        }
    })
}

export class Sandbox {
    iframe: HTMLIFrameElement
    shadowRoot!: ShadowRoot

    constructor(
        public id: string
    ) {
        this.iframe = iframeGenerator(id)
        document.body.appendChild(this.iframe)
    }

    connect(shadowRoot: ShadowRoot): void {
        this.shadowRoot = shadowRoot

        const html = document.createElement('html')
        const head = document.createElement('head')
        const body = document.createElement('body')
        const elementRoot = document.createElement('element-root')
        body.appendChild(elementRoot)
        html.appendChild(head)
        html.appendChild(body)
        shadowRoot.appendChild(html)

        patchElementEffect(this.shadowRoot, this.iframe.contentWindow!)
    }

    active(codes: string[]): void {
        codes.forEach(code => {
            // @ts-ignore
            this.iframe.contentWindow?.eval(code)
        })
    }

    destroy(): void {}
}
