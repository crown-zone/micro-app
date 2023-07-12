import {getAppChanges} from "../applications/app";
import {started} from "../start";
import {toLoadPromise} from "../lifecycles/load";
import {toUnmountPromise} from "../lifecycles/unmount";
import {shouldBeActive} from "../applications/app.helpers";
import {toBootstrapPromise} from "../lifecycles/bootstrap";
import {toMountPromise} from "../lifecycles/mount";
import {callCapturedEventListeners} from "./navigations-event";

// app切换完成（旧app卸载完成，新app加载完成）
let appChangeUnderway = false;
// 排队队列中的任务
let peopleWaitingOnAppChange = [];

export function reroute(pendingPromises = [], eventArguments) {

    if (appChangeUnderway) {
        // app正在切换中
        return new Promise(((resolve, reject) => {
            peopleWaitingOnAppChange.push({
                resolve,
                reject,
                eventArguments
            })
        }));
    }

    const {appsToLoad, appsToMount, appsToUnmount} = getAppChanges();

    if (started) {
        appChangeUnderway = true;
        return performAppChanges();
    } else {
        return loadApps();
    }

    async function loadApps() {
        // toLoadPromise => 获取bootstrap, mount, unmount 方法放到app上
        await Promise.all(appsToLoad.map(toLoadPromise))
    }

    async function performAppChanges() {
        // 启动逻辑
        // 卸载不需要的应用，挂载需要的应用
        let unmountPromises = appsToUnmount.map(toUnmountPromise).map(unmountPromise => unmountPromise.then(toLoadPromise))

        // 匹配到没有加载过的应用 (加载 => 启动 => 挂载)
        const loadThenMountPromises = appsToLoad.map(async (app) => {
            app = await toLoadPromise(app);

            return tryToBootstrapAndMount(app);
        });

        // 已经加载过了的应用 (启动 => 挂载)
        const mountPromises = appsToMount.map(async (app) => {
            return tryToBootstrapAndMount(app)
        })

        // 等待先卸载完成后触发路由方法
        await Promise.all(unmountPromises);
        callAllEventListeners();

        // 加载后出发路由方法
        await Promise.all([...loadThenMountPromises, ...mountPromises]);
        callAllEventListeners();

        finishUpAndReturn();
    }

    function finishUpAndReturn() {
        appChangeUnderway = false;
        if (peopleWaitingOnAppChange.length > 0) {
            const nextPendingPromises = peopleWaitingOnAppChange;
            peopleWaitingOnAppChange = [];
            reroute(nextPendingPromises)
        }
    }

    function callAllEventListeners() {
        pendingPromises.forEach(pendingPromise => {
            callCapturedEventListeners(pendingPromise.eventArguments)
        });
        callCapturedEventListeners(eventArguments)
    }
}

async function tryToBootstrapAndMount(app) {
    if (shouldBeActive(app)) {
        app = await toBootstrapPromise(app);

        return toMountPromise(app);
    }

    return app;
}
