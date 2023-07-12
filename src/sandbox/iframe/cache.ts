import type { Sandbox } from "./sandbox";

const sandboxCacheMap = new Map<string, Sandbox>()

export const getCurrentSandboxById = (id: string): Sandbox | undefined => {
    return sandboxCacheMap.get(id)
}

export const saveSandboxById = (id: string, sandbox: Sandbox): void => {
    sandboxCacheMap.set(id, sandbox)
}

