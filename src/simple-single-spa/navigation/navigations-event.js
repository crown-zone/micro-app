// 为了保证应用加载逻辑被最先执行，对路由的一系列方法进行重写劫持。确保加载应用的逻辑最先被调用，其次手动派发事件。
// 如果当前应用正在加载时，并且用户频繁切换路由，我们会将此时的reroute方法暂存起来，等待当前应用加载完毕后再次出发reroute渲染应用，从而节约性能。

import {reroute} from "./reroute";

export const routingEventsListeningTo = ['hashchange', 'popstate'];

const capturedEventListeners = {
    hashchange: [],
    popstate: []
}

function urlReroute() {
    reroute([], arguments);
}

// 劫持路由变化
window.addEventListener('hashchange', urlReroute);
window.addEventListener('popstate', urlReroute);

const rawAddEventListener = window.addEventListener;
const rawRemoveEventListener = window.removeEventListener;

window.addEventListener = function (eventName, fn) {
    if (
        routingEventsListeningTo.includes(eventName) &&
        !capturedEventListeners[eventName].some(listener => listener === fn)
    ) {
        capturedEventListeners[eventName].push(fn);
        return
    }

    return rawAddEventListener.apply(this, arguments);
}

window.removeEventListener = function (eventName, listenerFn) {
    if (
        routingEventsListeningTo.includes(eventName)
    ) {
        capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(fn => fn !== listenerFn)
        return
    }

    return rawRemoveEventListener.apply(this, arguments);
}

function patchedUpdateState(updateState, methodName) {
    return function () {
        const urlBefore = window.location.href;
        const result = updateState.apply(this, arguments);
        const urlAfter = window.location.href;

        if (urlBefore !== urlAfter) {
            const state = window.history.state;
            urlReroute(new PopStateEvent('popstate', {state}))
        }
        return result;
    }
}

window.history.pushState = patchedUpdateState(window.history.pushState, 'pushState');
window.history.replaceState = patchedUpdateState(window.history.replaceState, 'replaceState');

export function callCapturedEventListeners(eventArguments) {
    if (eventArguments) {
        const eventType = eventArguments[0].type;
        if (routingEventsListeningTo.includes(eventType)) {
            capturedEventListeners[eventType].forEach(listener => {
                listener.apply(this, eventArguments);
            });
        }
    }
}

