declare global {
    interface Window {
        proxy: Object
    }
}

export class ProxySandbox {
    private proxy: Object

    constructor() {
        const fakeWindow = {}
        // @ts-ignore
        const proxy = new Proxy(fakeWindow, {
            get(target, propKey) {
                // history rawWindow['history']
                // 主应用 window.history.navigationId = 1
                // 子应用 window.history.navigationId = 5
                if (propKey === 'window') {
                    return proxy
                }

                if (propKey === 'document') {
                    return document
                }

                return fakeWindow[propKey]
            },

            set(target, propKey, value): boolean {
                fakeWindow[propKey] = value

                return true
            }
        })

        this.proxy = proxy
    }

    active(codes: string[]) {
        window.proxy = this.proxy

        codes.forEach(code => {
            (0, eval)(`
                    ;(function (window, self, globalThis) {
                        with (window) {
                            ${code}
                        }
                    }).bind(window.proxy)(window.proxy, window.proxy, window.proxy)
                `)
        })
    }

    inactive() {}

    destroy() {}
}

