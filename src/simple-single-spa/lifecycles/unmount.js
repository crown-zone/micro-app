import {MOUNTED, NOT_MOUNTED, UNMOUNTING} from "../applications/app.helpers";

export async function toUnmountPromise(app) {
    if (app.status !== MOUNTED) {
        return app;
    }

    app.status = UNMOUNTING;
    // 调用unmount钩子
    await app.unmount(app.customProps);
    app.status = NOT_MOUNTED;

    return app;
}
