import {NOT_LOADED, UNLOADING} from "../applications/app.helpers";

const appsToUnload = {};

export async function toUnloadPromise(app) {
    if (!appsToUnload[app.name]) {
        return app;
    }

    app.status = UNLOADING;

    delete app.bootstrap;
    delete app.mount;
    delete app.unmount;

    app.status = NOT_LOADED
}
