import {LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED, NOT_LOADED} from "../applications/app.helpers";

// 兼容用户输入的 bootstrap、mount、unmount数组形式，拍平
// 将函数通过then链连接起来，链式调用
function flattenFnArray(fns) {
    fns = Array.isArray(fns) ? fns : [fns];

    return function (props) {
        return fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve())
    }
}

export async function toLoadPromise(app) {
    // 缓存机制。start方法调用是同步执行的，但是加载流程是异步的，走到loadApps的时候，走了一次，performAppChanges又加载了一次。
    // 避免第二次再加载，正在加载中，没有加载完的应用不用再次加载
    if (app.loadPromise) {
        return app.loadPromise;
    }

    if (app.status !== NOT_LOADED) {
        return app;
    }

    app.status = LOADING_SOURCE_CODE;

    return (
        app.loadPromise = Promise.resolve().then(
            async () => {
                // 调用loadApp,传入属性
                const {bootstrap, mount, unmount} = await app.loadApp(app.customProps);

                // 还没有启动， 没有调用bootstrap
                app.status = NOT_BOOTSTRAPPED;
                // 生命周期放到app上
                app.bootstrap = flattenFnArray(bootstrap);
                app.mount = flattenFnArray(mount);
                app.unmount = flattenFnArray(unmount);

                delete app.loadPromise;

                return app;
            }
        )
    )
}
