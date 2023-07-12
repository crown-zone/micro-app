import {BOOTSTRAPPING, NOT_BOOTSTRAPPED, NOT_MOUNTED} from "../applications/app.helpers";

export async function toBootstrapPromise(app) {
    if (app.status !== NOT_BOOTSTRAPPED) {
        // 应用状态不是待启动，直接返回
        return app;
    }

    app.status = BOOTSTRAPPING;
    // 调用bootstrap钩子
    await app.bootstrap(app.customProps);
    app.status = NOT_MOUNTED;

    return app;
}
