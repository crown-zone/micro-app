import {MOUNTED, MOUNTING, NOT_MOUNTED} from "../applications/app.helpers";

export async function toMountPromise(app) {
    // 应用不是待挂载状态，直接返回
    if (app.status !== NOT_MOUNTED) {
        return app;
    }

    app.status = MOUNTING;
    await app.mount(app.customProps);
    app.status = MOUNTED;

    return app;
}
