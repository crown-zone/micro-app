import {
    BOOTSTRAPPING,
    LOADING_SOURCE_CODE, MOUNTED,
    NOT_BOOTSTRAPPED,
    NOT_LOADED, NOT_MOUNTED,
    shouldBeActive,
    SKIP_BECAUSE_BROKEN
} from "./app.helpers";
import {reroute} from "../navigation/reroute";

const apps = [];

export function registerApplication(name, loadApp, activeWhen, customProps) {
    apps.push({
        name,
        loadApp,
        activeWhen,
        customProps,
        // 默认应用为未加载
        status: NOT_LOADED
    });

    reroute();
}

export function getAppChanges() {
    const appsToLoad = [];
    const appsToMount = [];
    const appsToUnmount = [];

    apps.forEach(app => {
        // 没有出错，并且应该被加载 activeWhen和url匹配
        const appShouldBeActive = app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);

        switch (app.status) {
            case NOT_LOADED:
            case LOADING_SOURCE_CODE:
                if (appShouldBeActive) {
                    appsToLoad.push(app);
                }
                break;
            case NOT_BOOTSTRAPPED:
            case BOOTSTRAPPING:
            case NOT_MOUNTED:
                if (appShouldBeActive) {
                    appsToMount.push(app);
                }
                break;
            case MOUNTED:
                if (!appShouldBeActive) {
                    appsToUnmount.push(app);
                }
        }
    })

    return {appsToLoad, appsToMount, appsToUnmount};
}
