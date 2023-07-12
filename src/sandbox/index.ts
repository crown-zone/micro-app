import { Sandbox } from "@/sandbox/iframe/sandbox";
import { saveSandboxById } from "@/sandbox/iframe/cache";

import './iframe/index'
import { ProxySandbox } from "@/sandbox/with";

const iframeBootstrap = (): Sandbox => {
    const id = 'iframeXX'
    const sandbox = new Sandbox(id)

    saveSandboxById(id, sandbox)

    return sandbox
}

const proxyBootstrap = (): ProxySandbox => {
    return new ProxySandbox()
}

export const bootstrap = (): void => {
    // const sandbox = iframeBootstrap()
    const sandbox = proxyBootstrap()

    fetch('/static/code.js')
        .then(response => response.text())
        .then((code) => {
            sandbox.active([code])
        })
}
